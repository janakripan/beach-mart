import React, { useState, useEffect, useRef } from "react";
import FormModal from "../shared/FormModal";
import Variants from "./Variants";
import ProductInformation from "./ProductInformation";
import { useFormik } from "formik";
import { PRODUCT_VALIDATION } from "../../../../schema";

/**
 * Modal component for adding or editing product information
 * @param {boolean} isLoading - Whether the form submission is in progress
 * @param {boolean} isModalOpen - Whether the modal is visible
 * @param {Function} handleCloseModal - Function to close the modal
 * @param {boolean} isEditing - Whether we're editing an existing product
 * @param {Function} handleSubmit - Form submission handler
 * @param {Object} formData - Current product form data
 * @param {Function} setFormData - Function to update form data
 * @param {Array} categories - List of available categories
 * @param {Array} brands - List of available brands
 * @param {Array} colors - List of available colors
 * @param {Array} sizes - List of available sizes
 */

const ProductModal = ({
  isLoading,
  isModalOpen,
  handleCloseModal,
  isEditing,
  handleSubmit,
  formData,
  setFormData,
  categories,
  brands,
  colors,
  sizes,
  variantsList,
}) => {
  const [enableVariants, setEnableVariants] = useState(false);
  const variantsRef = useRef(null);

  // Set variants flag based on existing product data
  useEffect(() => {
    if (formData.variants.length > 0) {
      setEnableVariants(true);
    } else {
      setEnableVariants(false);
    }
  }, [isModalOpen]);

  // Custom form submission handler with variant validation
  const handleFormSubmit = (values) => {
    // Check if variants are enabled and if there's unsaved variant data
    if (enableVariants && variantsRef.current) {
      const hasUnsavedVariant = variantsRef.current.checkForUnsavedVariant();
      if (hasUnsavedVariant) {
        // Don't proceed with form submission
        return;
      }
    }

    // Proceed with normal form submission
    handleSubmit(values);
  };

  const formik = useFormik({
    initialValues: formData,
    validationSchema: PRODUCT_VALIDATION(enableVariants),
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isModalOpen) {
      formik.resetForm();
    }
  }, [isModalOpen]);
  return (
    <FormModal
      isLoading={isLoading}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={isEditing ? "Edit Product" : "Add New Product"}
      handleSubmit={formik.handleSubmit}
    >
      {/* Basic Product Information */}
      <ProductInformation
        categories={categories}
        brands={brands}
        formik={formik}
        formData={formData}
        enableVariants={enableVariants}
        setEnableVariants={setEnableVariants}
        setFormData={setFormData}
      />

      {/* Variants Section */}
      <Variants
        ref={variantsRef}
        isOpen={enableVariants}
        setFormData={setFormData}
        formData={formData}
        colors={colors}
        sizes={sizes}
        variantsList={variantsList}
      />
    </FormModal>
  );
};

export default ProductModal;
