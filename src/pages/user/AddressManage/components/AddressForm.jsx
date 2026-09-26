import React, { useRef, useState, useCallback, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { useAddAddress, useUpdateAddress } from "../../../../api/user/hooks/useAddress";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Search, MapPin, Target } from "lucide-react";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "200px" };
const defaultCenter = { lat: 25.1447541, lng: 55.1988443 }; // Beach Circle Mini Mart LLC

/* ================= VALIDATION ================= */
const validationSchema = Yup.object({
  userName: Yup.string().required("Full name is required").min(2, "Full name must be at least 2 characters"),
  phoneNumber: Yup.string().required("Phone number is required").matches(/^[0-9]+$/, "Invalid phone number"),
  address: Yup.string().required("Address is required"),
  district: Yup.string().required("Delivery Area is required"),
  addressLabel: Yup.string().required("Selection is required"),
  // pinCode, city, landMark are intentionally omitted from strictly required UI validation
});

// A component to watch Pincode changes in background (if we somehow get it)
const PincodeWatcher = () => {
  const { values, setFieldValue } = useFormikContext();
  const prevPin = useRef(values.pinCode);

  useEffect(() => {
    if (values.pinCode !== prevPin.current && values.pinCode?.length >= 5) {
      prevPin.current = values.pinCode;
      getGeocode({ address: values.pinCode })
        .then((results) => {
          let city = "";
          let district = "";
          results[0].address_components.forEach((c) => {
            if (c.types.includes("locality")) city = c.long_name;
            if (c.types.includes("sublocality") || c.types.includes("route")) district = c.long_name;
          });
          if (city) setFieldValue("city", city);
          if (district && !values.district) setFieldValue("district", district);
        })
        .catch(() => {}); // ignore geocode errors for pincode
    }
  }, [values.pinCode, setFieldValue, values.district]);

  return null;
};

// Autocomplete Input Component
const PlacesAutocomplete = ({ setFieldValue, onLocationSelect, onSelectComplete }) => {
  const { values } = useFormikContext();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'AE' } },
    debounce: 300,
  });

  const handleSelect = async ({ description }) => {
    setValue(description, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onLocationSelect({ lat, lng });

      let pincode = "";
      let city = "";
      let district = "";
      let street = "";
      
      results[0].address_components.forEach((c) => {
        if (c.types.includes("postal_code")) pincode = c.long_name;
        if (c.types.includes("locality") || c.types.includes("administrative_area_level_1")) city = c.long_name;
        if (c.types.includes("sublocality") || c.types.includes("neighborhood")) district = c.long_name;
        if (c.types.includes("route")) street = c.long_name;
      });

      const areaStr = [district, street].filter(Boolean).join(", ");

      setFieldValue("pinCode", pincode || "00000"); // default fallback if maps doesn't have it
      setFieldValue("city", city || "Dubai");
      setFieldValue("district", areaStr);
      setFieldValue("address", description);
      setFieldValue("locationPlace", description);
      
      if (onSelectComplete) onSelectComplete();
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="relative mb-2">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Search a place..."
        autoFocus
        className="w-full px-4 py-2 rounded border border-gray-300 bg-white focus:outline-none"
      />
      {status === "OK" && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AddressForm = ({ closeForm, editingAddress }) => {
  const { mutateAsync: addAddress, isPending } = useAddAddress();
  const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress();
  
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const [showSearch, setShowSearch] = useState(false);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const performReverseGeocode = (lat, lng, setFieldValue) => {
    if (!window.google || !window.google.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        let pincode = "";
        let city = "";
        let district = "";
        let street = "";
        
        results[0].address_components.forEach((c) => {
          if (c.types.includes("postal_code")) pincode = c.long_name;
          if (c.types.includes("locality") || c.types.includes("administrative_area_level_1")) city = c.long_name;
          if (c.types.includes("sublocality") || c.types.includes("neighborhood") || c.types.includes("sublocality_level_1")) district = c.long_name;
          if (c.types.includes("route")) street = c.long_name;
        });
        
        let areaStr = [district, street].filter(Boolean).join(", ");
        if (!areaStr) {
          const fallback = results[0].address_components.find(c => c.types.includes("political") && !c.types.includes("country"));
          areaStr = fallback ? fallback.long_name : city;
        }
        
        setFieldValue("pinCode", pincode || "00000");
        setFieldValue("city", city || "Dubai");
        setFieldValue("district", areaStr || "Dubai");
        setFieldValue("address", results[0].formatted_address);
        setFieldValue("locationPlace", results[0].formatted_address);
      } else {
        console.error("Reverse geocoding failed with status:", status);
        setFieldValue("address", "Selected on map");
        setFieldValue("locationPlace", "Selected on map");
        setFieldValue("district", "Dubai");
        
        alert("Reverse Geocoding failed with status: " + status + ". Please check your Google Cloud Console if API is enabled.");
      }
    });
  };

  const handleUseMyLocation = (setFieldValue) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setMarkerPos({ lat, lng });
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(16);
          }
          performReverseGeocode(lat, lng, setFieldValue);
        },
        () => alert("Location access denied or failed.")
      );
    }
  };

  /* ================= INITIAL VALUES ================= */
  const initialValues = editingAddress
    ? {
        userName: editingAddress.rawDetails.UserName || editingAddress.rawDetails.userName || editingAddress.name || "",
        phoneNumber: editingAddress.rawDetails.PhoneNumber || editingAddress.rawDetails.phoneNumber || editingAddress.phone || "",
        pinCode: editingAddress.rawDetails.PinCode || editingAddress.rawDetails.pinCode || editingAddress.rawDetails.pincode || "00000",
        address: editingAddress.rawDetails.Address || editingAddress.rawDetails.address || "",
        district: editingAddress.rawDetails.District || editingAddress.rawDetails.district || "",
        city: editingAddress.rawDetails.City || editingAddress.rawDetails.city || "Dubai",
        addressLabel: editingAddress.rawDetails.AddressLabel || editingAddress.rawDetails.addressLabel || "CARD",
        landMark: editingAddress.rawDetails.LandMark || editingAddress.rawDetails.landMark || editingAddress.rawDetails.landmark || "",
        locationPlace: editingAddress.rawDetails.Address || editingAddress.rawDetails.address || "",
      }
    : {
        userName: "",
        phoneNumber: "",
        pinCode: "00000",
        address: "",
        district: "",
        city: "Dubai",
        addressLabel: "CARD",
        landMark: "",
        locationPlace: "",
      };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingAddress) {
        await updateAddress({ addressId: editingAddress.id, data: values });
      } else {
        await addAddress(values);
      }
      closeForm();
    } catch (err) {
      console.error("Address save failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#eaf7ed] p-6 md:p-8 rounded-lg font-arial w-full max-w-4xl mx-auto shadow-md">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-arial font-semibold text-gray-900 uppercase tracking-wide">
          PLEASE FILL FOLLOWING DETAILS
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-300 focus-within:border-primary transition-colors">
            <PincodeWatcher />

            {/* Mobile */}
            <div>
              <div className="text-gray-600 text-sm mb-1 font-medium">Mobile</div>
              <div className="flex bg-white rounded border border-gray-300 overflow-hidden">
                <div className="bg-white px-3 py-2 border-r border-gray-300 flex items-center gap-2">
                  <span className="text-lg">🇦🇪</span>
                  <span className="text-gray-700 text-sm">(+971)</span>
                </div>
                <Field
                  name="phoneNumber"
                  placeholder="Enter WhatsApp number"
                  className="w-full px-4 py-2 focus:outline-none"
                />
              </div>
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* First Name */}
            <div>
              <div className="text-gray-600 text-sm mb-1 font-medium">First Name</div>
              <Field
                name="userName"
                placeholder="Enter First Name"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <ErrorMessage name="userName" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Address Textarea */}
            <div>
              <div className="text-gray-600 text-sm mb-1 font-medium">Flat/Building/Address</div>
              <Field
                as="textarea"
                name="address"
                placeholder="Enter Address"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Map Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                  <MapPin className="w-4 h-4" /> Select location on map
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button 
                    type="button" 
                    onClick={() => setShowSearch(!showSearch)}
                    className="bg-[#cc2b2b] text-white w-full sm:w-auto justify-center text-xs px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-red-700 transition">
                    <Search className="w-4 h-4" /> Search location
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleUseMyLocation(setFieldValue)}
                    className="bg-primary text-white w-full sm:w-auto justify-center text-xs px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-secondary transition">
                    <Target className="w-4 h-4" /> Use my location
                  </button>
                </div>
              </div>

              {/* Toggleable Search Autocomplete */}
              {showSearch && isLoaded && (
                <PlacesAutocomplete 
                  setFieldValue={setFieldValue} 
                  onSelectComplete={() => setShowSearch(false)}
                  onLocationSelect={({ lat, lng }) => {
                    setMapCenter({ lat, lng });
                    setMarkerPos({ lat, lng });
                    if (mapRef.current) {
                      mapRef.current.panTo({ lat, lng });
                      mapRef.current.setZoom(16);
                    }
                  }}
                />
              )}

              <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm relative z-0">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={mapCenter}
                    onLoad={onMapLoad}
                    onClick={(e) => {
                      const lat = e.latLng.lat();
                      const lng = e.latLng.lng();
                      setMarkerPos({ lat, lng });
                      performReverseGeocode(lat, lng, setFieldValue);
                    }}
                  >
                    <Marker position={markerPos} />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-500">
                    Loading Map...
                  </div>
                )}
              </div>
              
              {/* Place / Location Standard Input */}
              <div className="mt-4">
                <div className="text-gray-600 text-sm mb-1 font-medium">Place / Location</div>
                <Field
                  name="locationPlace"
                  placeholder="Select on map or type place name"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* District & Label (No Pincode, City, or Landmark in UI) */}
            <div>
              <div className="text-gray-600 text-sm mb-1 font-medium">Delivery Area</div>
              <Field
                name="district"
                placeholder="Delivery Area"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <ErrorMessage name="district" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <div className="text-gray-600 text-sm mb-1 font-medium">Delivery/Pickup/Dine-in</div>
              <Field
                name="addressLabel"
                placeholder="CARD"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <ErrorMessage name="addressLabel" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {/* Hidden Required Fields for Backend */}
            <Field type="hidden" name="pinCode" />
            <Field type="hidden" name="city" />
            <Field type="hidden" name="landMark" />

            {/* Buttons */}
            <div className="flex gap-2 pt-6">
              <button
                type="submit"
                onClick={() => {}}
                disabled={isPending || isSubmitting}
                className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isPending ? 'Saving...' : 'Save Address'}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="w-1/2 bg-[#6b7280] text-white py-3 rounded font-medium hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddressForm;
