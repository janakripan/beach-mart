import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

// Mock variants list
const VARIANT_OPTIONS = ["Small", "Medium", "Large", "500g", "1KG", "2KG", "1L"];

const Variants = forwardRef(({ isOpen, setFormData, formData }, ref) => {
  const [showWarning, setShowWarning] = useState(false);
  
  // Temporary state for the variant currently being added
  const [currentVariant, setCurrentVariant] = useState({
    name: "",
    price: "",
    inStock: true
  });

  useImperativeHandle(ref, () => ({
    checkForUnsavedVariant: () => {
      if (currentVariant.name !== "" || currentVariant.price !== "") {
        setShowWarning(true);
        return true;
      }
      return false;
    }
  }));

  if (!isOpen) return null;

  const handleAddVariant = () => {
    if (!currentVariant.name || !currentVariant.price) {
      alert("Please select a variant and enter a price.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { ...currentVariant, id: Date.now() }]
    }));

    setCurrentVariant({ name: "", price: "", inStock: true });
    setShowWarning(false);
  };

  const handleRemoveVariant = (id) => {
    setFormData(prev => ({
      ...prev,
      variants: (prev.variants || []).filter(v => v.id !== id)
    }));
  };

  return (
    <div className="pt-6 border-t border-[#E3F0E2]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1A1A2E]">Product Variants</h3>
      </div>

      <div className="bg-[#F8FCF8] border border-[#E3F0E2] rounded-md p-4 mb-4">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Variant Option</label>
            <select
              value={currentVariant.name}
              onChange={(e) => setCurrentVariant(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select Option</option>
              {VARIANT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Price (AED)</label>
            <input
              type="number"
              value={currentVariant.price}
              onChange={(e) => setCurrentVariant(prev => ({ ...prev, price: e.target.value }))}
              className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center h-[42px]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-[#1A1A2E]">In Stock</span>
              <div className="relative" onClick={() => setCurrentVariant(prev => ({ ...prev, inStock: !prev.inStock }))}>
                <input type="checkbox" className="sr-only" checked={currentVariant.inStock} readOnly />
                <div className={`block w-10 h-5 rounded-full transition-colors ${currentVariant.inStock ? "bg-primary" : "bg-gray-300"}`} />
                <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${currentVariant.inStock ? "transform translate-x-5" : ""}`} />
              </div>
            </label>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            className="h-[42px] px-4 bg-primary text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
        
        {showWarning && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            You have unsaved variant data. Click Add to save it.
          </div>
        )}
      </div>

      {/* Saved Variants List */}
      {formData.variants && formData.variants.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[#1A1A2E] mb-2">Saved Variants</h4>
          {formData.variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between p-3 border border-[#E3F0E2] rounded-md bg-white">
              <div className="flex items-center space-x-6">
                <span className="font-medium text-[#1A1A2E] min-w-[100px]">{variant.name}</span>
                <span className="text-gray-500">AED {variant.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${variant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {variant.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveVariant(variant.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Variants;
