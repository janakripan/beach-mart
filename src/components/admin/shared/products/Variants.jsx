import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Plus, AlertTriangle } from "lucide-react";
import CurrentVariants from "./CurrentVariants";
import AddNewVariant from "./AddNewVariant";

const Variants = forwardRef(
  ({ isOpen, setFormData, formData, sizes, colors }, ref) => {
    // Create a ref for the variants list section
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);
    const [addVarinatIndex, setAddVariantIndex] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const variantsListRef = useRef(null);
    const addNewVariantFormRef = useRef(null);
    const warningRef = useRef(null);
    const [currentVariant, setCurrentVariant] = useState({
      
      brandId: formData.brandID || 0,
      colorId: 0,
      sizeId: 0,
      sku: "",
      price: {
        price: 0,
        discountPercentage: 0,
        discountPrice: 0,
        currency: "AED",
      },
      stock: {
        onhand: 0,
      },
      images: [],
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      checkForUnsavedVariant: () => {
        // Check if the add form is visible and has data
        if (showAddForm && hasVariantData()) {
          setShowWarning(true);
          // Scroll to the warning message
          setTimeout(() => {
            if (warningRef.current) {
              warningRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100);
          return true;
        }
        return false;
      },
    }));

    // Check if current variant has any meaningful data
    const hasVariantData = () => {
      return (
        currentVariant.colorId !== 0 ||
        currentVariant.sizeId !== 0 ||
        currentVariant.sku !== "" ||
        currentVariant.price?.price !== 0 ||
        currentVariant.stock.onhand !== 0 ||
        currentVariant.price.discountPercentage !== 0 ||
        currentVariant.price?.discountPrice !== 0 ||
        (currentVariant.images && currentVariant.images.length > 0)
      );
    };

    // Reset form visibility when variants section is closed
    useEffect(() => {
      if (!isOpen) {
        setShowAddForm(false);
        setEditingVariantIndex(null);
        setAddVariantIndex(null);
        setShowWarning(false);
      }
    }, [isOpen]);

    // Hide warning when form is hidden
    useEffect(() => {
      if (!showAddForm) {
        setShowWarning(false);
      }
    }, [showAddForm]);

    // Used store the change directly to the formData instead of click the update varaint button
    useEffect(() => {
      const updatedVariants = [currentVariant];
      updatedVariants[editingVariantIndex] = currentVariant;

      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((item, index) =>
          index === editingVariantIndex ? updatedVariants[0] : item
        ),
      }));
    }, [currentVariant]);

    // Handle variant input change
    const handleVariantChange = (e) => {
      const { name, value } = e.target;

      if (name.includes(".")) {
        // Handle nested properties like price.price
        const [parent, child] = name.split(".");
        setCurrentVariant((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: name.includes("price") ? parseFloat(value) || 0 : value,
          },
        }));
      } else {
        // Handle regular properties
        setCurrentVariant((prev) => ({
          ...prev,
          [name]:
            name === "brandId" || name === "colorId" || name === "sizeId"
              ? parseInt(value) || 0
              : value,
        }));
      }
    };
    // Remove a variant from the list
    const removeVariant = (index) => {
      setEditingVariantIndex(index);
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    };

    const handleStockEmpty = () => {
      setEditingVariantIndex(index);
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((variant, i) =>
          i === index
            ? {
                ...variant,
                stock: { onhand: 0, stockId: variant.stock.stockId },
              }
            : variant
        ),
      }));
    };
    // Add a variant to the list
    const addVariant = () => {
      // Hide warning message when adding variant
      setShowWarning(false);

      // check is it editing or not
      if (editingVariantIndex !== null) {
        // update variants
        const updatedVariants = [currentVariant];
        updatedVariants[editingVariantIndex] = currentVariant;

        setFormData((prev) => ({
          ...prev,
          variants: prev.variants.map((item, index) =>
            index === editingVariantIndex ? updatedVariants[0] : item
          ),
        }));
        setCurrentVariant(updatedVariants);
        setEditingVariantIndex(null);
        setAddVariantIndex(null);
        setShowAddForm(false);
        // Reset current variant form
        setCurrentVariant({
          brandId: formData.brandID || 0,
          colorId: 0,
          sizeId: 0,
          sku: "",
          price: {
            price: 0,
            discountPercentage: 0,
            discountPrice: 0,
            currency: "USD",
          },
          stock: {
            onhand: 0,
          },
          images: [],
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          variants: [
            ...(prev.variants || []),
            {
              ...currentVariant,
              variantId: currentVariant.variantId ?? 0,
              productId: currentVariant.productId ?? 0,
            },
          ],
        }));

        setShowAddForm(false);
        // Reset current variant form
        setCurrentVariant({
          
          brandId: formData.brandID || 0,
          colorId: 0,
          sizeId: 0,
          sku: "",
          price: {
            price: 0,
            discountPercentage: 0,
            discountPrice: 0,
            currency: "USD",
          },
          stock: {
            onhand: 0,
          },
          images: [],
        });
      }
    };
    const editVariant = (index) => {
      setEditingVariantIndex(index);
      setAddVariantIndex(index);
      setCurrentVariant(formData.variants[index]);
      setShowAddForm(true);
      // scroll to the form
      if (addNewVariantFormRef && addNewVariantFormRef.current) {
        addNewVariantFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    // Handle variant image upload
    const handleVariantImageUploaded = (data) => {
      if (data && data.FileDetails) {
        const newImage = {
          imageUrl: data.FileDetails[0].FileUrl,
          isPrimary: currentVariant.images.length === 0, // Make first image primary
        };
        setCurrentVariant((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
      }
    };

    // Handle showing the add variant form
    const handleShowAddForm = () => {
      setShowAddForm(true);
      setEditingVariantIndex(null);
      setAddVariantIndex(null);
      // Reset current variant form
      setCurrentVariant({
        brandId: formData.brandID || 0,
        colorId: 0,
        sizeId: 0,
        sku: "",
        price: {
          price: 0,
          discountPercentage: 0,
          discountPrice: 0,
          currency: "AED",
        },
        stock: {
          onhand: 0,
        },
        images: [],
      });
      // Scroll to the form after a short delay
      setTimeout(() => {
        if (addNewVariantFormRef && addNewVariantFormRef.current) {
          addNewVariantFormRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    };

    // Handle canceling the add variant form
    const handleCancelAddForm = () => {
      setShowAddForm(false);
      setShowWarning(false);
      setEditingVariantIndex(null);
      setAddVariantIndex(null);
      // Reset current variant form
      setCurrentVariant({
        brandId: formData.brandID || 0,
        colorId: 0,
        sizeId: 0,
        sku: "",
        price: {
          price: 0,
          discountPercentage: 0,
          discountPrice: 0,
          currency: "AED",
        },
        stock: {
          onhand: 0,
        },
        images: [],
      });
    };

    if (!isOpen) return null;

    return (
      <section className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-800">Variants</h3>
          {!showAddForm && (
            <button
              type="button"
              onClick={handleShowAddForm}
              className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors"
            >
              <Plus size={16} />
              Add Variant
            </button>
          )}
        </div>

        {/* Current Variants List */}
        <CurrentVariants
          variantsListRef={variantsListRef}
          variants={formData.variants}
          removeVariant={removeVariant}
          handleStockEmpty={handleStockEmpty}
          editVariant={editVariant}
        />

        {/* Add New Variant Form - Only show when showAddForm is true */}
        {showAddForm && (
          <>
            <AddNewVariant
              addVarinatIndex={addVarinatIndex}
              variantsListRef={variantsListRef}
              addNewVariantFormRef={addNewVariantFormRef}
              sizes={sizes}
              colors={colors}
              editingVariantIndex={editingVariantIndex}
              addVariant={addVariant}
              currentVariant={currentVariant}
              handleVariantChange={handleVariantChange}
              setCurrentVariant={setCurrentVariant}
              onCancel={handleCancelAddForm}
            />

            {/* Warning Message - Only show when showWarning is true */}
            {showWarning && (
              <div
                ref={warningRef}
                className="mt-4 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md"
              >
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-yellow-500 mr-2" />
                  <span className="font-medium">
                    Please add this variant before saving the product!
                  </span>
                </div>
                <p className="mt-1 text-sm text-yellow-700">
                  You have filled out variant information but haven't added it
                  to the list yet. Click "Add Variant" to save this variant.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    );
  }
);

export default Variants;
