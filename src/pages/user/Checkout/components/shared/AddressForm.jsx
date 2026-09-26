import React, { useRef, useState, useCallback, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../../../../Auth/store/AuthStore";
import { useMessage } from "../../../../../components/admin/MessageBox/useMessage";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Search, MapPin, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../../store/CheckoutStore";
import { useShop } from "../../../../../context/ShopContext";
import { OrderService } from "../../../../../api/user/services/orderService";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "200px" };
const defaultCenter = { lat: 25.1447541, lng: 55.1988443 }; // Beach Circle Mini Mart LLC

/* ===================== VALIDATION ===================== */
const validationSchema = Yup.object({
  userName: Yup.string().required("Full name is required").min(2, "Full name must be at least 2 characters"),
  phoneNumber: Yup.string().required("Phone number is required").matches(/^[0-9]+$/, "Invalid phone number"),
  address: Yup.string().required("Address is required"),
  district: Yup.string().required("Delivery Area is required"),
  addressLabel: Yup.string().required("Selection is required"),
});

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
        .catch(() => {});
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
      // Removed filling "address" (Flat/Building field)
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

/* ===================== COMPONENT ===================== */
const AddressForm = () => {
  const user = useAuthStore((s) => s.user);
  const isGuest = true; // Force all users to be guest as per requirement
  const message = useMessage();

  const navigate = useNavigate();
  const markCompleted = useCheckoutStore((s) => s.markCompleted);

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const [showSearch, setShowSearch] = useState(false);
  const mapRef = useRef(null);
  
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [deliveryModes, setDeliveryModes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locs, dModes, pModes] = await Promise.all([
          OrderService.getDeliveryLocations(),
          OrderService.getDeliveryModes(),
          OrderService.getPaymentModes()
        ]);
        if (locs) setDeliveryLocations(Array.isArray(locs) ? locs : []);
        if (dModes) setDeliveryModes(Array.isArray(dModes) ? dModes : []);
        if (pModes) setPaymentModes(Array.isArray(pModes) ? pModes : []);
      } catch (err) {
        console.error("Failed to load dropdowns", err);
      }
    };
    fetchData();
  }, []);
  
  const { cartItems, cartTotal } = useShop();

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
        // Removed filling "address" (Flat/Building field)
        setFieldValue("locationPlace", results[0].formatted_address);
      } else {
        console.error("Reverse geocoding failed with status:", status);
        // Removed filling "address" (Flat/Building field)
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

  const initialValues = {
    userName: "",
    phoneNumber: "",
    pinCode: "00000",
    address: "",
    district: "",
    city: "Dubai",
    addressLabel: "",
    paymentMode: "Cash on Deliver",
    landMark: "",
    locationPlace: "",
    rememberAddress: false,
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (cartItems.length === 0) {
        message.error("Cart is empty");
        setSubmitting(false);
        return;
      }

      const orderDetails = cartItems.map((item, idx) => ({
        SI_No: idx + 1,
        ProductID: item.product.id || item.product.ProductID || 0,
        ProductName: item.product.name,
        Qty: item.quantity,
        Price: parseFloat(item.product.price) || 0,
        Discount: parseFloat(item.product.discount) || 0,
      }));

      let formattedMobile = String(values.phoneNumber);
      if (!formattedMobile.startsWith("+")) {
        formattedMobile = "+971" + formattedMobile;
      }

      const locMatch = deliveryLocations.find(loc => (loc.LocationName || loc.Name || loc.name || loc.id) === values.district);
      const locationId = locMatch ? (locMatch.LocationID || locMatch.id || 1) : 1;

      const payload = {
        CustomerAddress: `${values.address}\n${values.district}\n${values.city}`,
        CustomerName: values.userName,
        Latitude: markerPos.lat,
        LocationID: locationId,
        Longitude: markerPos.lng,
        MapUrl: `https://www.google.com/maps?q=${markerPos.lat},${markerPos.lng}`,
        MobileNo: formattedMobile,
        OnlinePaymentRef: null,
        OrderDetails: orderDetails,
        PaymentMode: values.paymentMode || "Cash on Deliver",
        ServiceType: values.addressLabel || "CARD",
        TotalAmount: parseFloat(cartTotal) || 0,
        placeName: values.locationPlace || values.address,
      };

      await OrderService.postOrder(payload);
      
      message.success("Order placed successfully!");
      
      markCompleted();
      navigate("/purchase-success", {
        replace: true,
        state: {
          orderId: "DUMMY-ORDER-" + Math.floor(Math.random() * 1000000),
        },
      });

    } catch (err) {
      console.error("Order submission failed", err);
      message.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMobileBlur = async (e, handleChange, setFieldValue) => {
    handleChange(e); // Let formik update its state
    const mobileNo = e.target.value;
    if (mobileNo && mobileNo.length >= 7) {
      try {
        const formattedMobile = mobileNo.startsWith("+") ? mobileNo : `+971${mobileNo}`;
        const res = await OrderService.getCustomerDetailsByMobileNo(formattedMobile);
        if (res && res.length > 0) {
          const cust = res[0]; // Assuming array response
          if (cust.CustomerName) setFieldValue("userName", cust.CustomerName);
          if (cust.CustomerAddress) setFieldValue("address", cust.CustomerAddress);
          if (cust.Latitude && cust.Longitude) {
             const lat = parseFloat(cust.Latitude);
             const lng = parseFloat(cust.Longitude);
             setMapCenter({ lat, lng });
             setMarkerPos({ lat, lng });
             if (mapRef.current) {
               mapRef.current.panTo({ lat, lng });
               mapRef.current.setZoom(16);
             }
             performReverseGeocode(lat, lng, setFieldValue);
          }
        }
      } catch (err) {
        console.error("Customer fetch failed", err);
      }
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <div className="space-y-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-300 focus-within:border-primary transition-colors">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Delivery details</h2>
              <p className="text-sm text-gray-500 mb-6">We will delivery your order to the below address</p>

              <Form className="space-y-4">
                <PincodeWatcher />

                {/* Mobile */}
                <div>
                  <div className="text-gray-600 text-sm mb-1 font-medium">Mobile</div>
                  <div className="flex bg-white rounded-xl border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                    <div className="bg-white px-3 py-2 border-r border-gray-300 flex items-center gap-2">
                      <span className="text-lg">🇦🇪</span>
                      <span className="text-gray-700 text-sm">(+971)</span>
                    </div>
                    <Field name="phoneNumber">
                      {({ field, form }) => (
                        <input
                          {...field}
                          type="number"
                          placeholder="Enter WhatsApp number"
                          className="w-full px-4 py-2 bg-transparent focus:outline-none"
                          onBlur={(e) => handleMobileBlur(e, field.onBlur, form.setFieldValue)}
                        />
                      )}
                    </Field>
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

                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
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
                      <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center text-gray-500">
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

                {/* District & Label */}
                <div>
                  <div className="text-gray-600 text-sm mb-1 font-medium">Delivery Area</div>
                  <Field
                    as="select"
                    name="district"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value="" disabled>Select Delivery Area</option>
                    {deliveryLocations.map((item, idx) => {
                      const val = item.LocationName || item.Name || item.name || item.id || "";
                      return <option key={idx} value={val}>{val}</option>;
                    })}
                  </Field>
                  <ErrorMessage name="district" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <div className="text-gray-600 text-sm mb-1 font-medium">Delivery/Pickup/Dine-in</div>
                  <Field
                    as="select"
                    name="addressLabel"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value="" disabled>Select Mode</option>
                    {deliveryModes.map((item, idx) => {
                      const val = item.DeliveryModeName || item.ModeName || item.Name || item.name || item.Mode || item.id || "";
                      return <option key={idx} value={val}>{val}</option>;
                    })}
                  </Field>
                  <ErrorMessage name="addressLabel" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                
                <div>
                  <div className="text-gray-600 text-sm mb-1 font-medium">Payment Mode</div>
                  <Field
                    as="select"
                    name="paymentMode"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
                  >
                    <option value="" disabled>Select Payment Mode</option>
                    {paymentModes.map((item, idx) => {
                      const val = item.PaymentModeName || item.PaymentMode || item.Name || item.name || item.Mode || item.id || "";
                      return <option key={idx} value={val}>{val}</option>;
                    })}
                  </Field>
                  <ErrorMessage name="paymentMode" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Hidden Fields */}
                <Field type="hidden" name="pinCode" />
                <Field type="hidden" name="city" />
                <Field type="hidden" name="landMark" />
                <Field type="hidden" name="email" />

                {/* Remember Address Checkbox (Only if needed, keeping it as requested in original) */}
                {!isGuest && (
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Field
                        type="checkbox"
                        name="rememberAddress"
                        className="w-4 h-4 text-black accent-black border-gray-300 rounded focus:outline-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Remember this address for next time!</span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    onClick={() => {}} // Formik handles it
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Order Now'}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default AddressForm;
