import * as Yup from "yup";

export const PRODUCT_VALIDATION = (enableVariants) =>
  Yup.object().shape({
    name: Yup.string()
      .required("Product Name is required")
      .min(2, "Product name must be atleast 2 character")
      .max(100, "Product name must be less than 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .test(
        "rich-text-validation",
        "Description must be at least 10 characters",
        (value) => {
          if (!value) return false;

          // Strip HTML tags
          const plainText = value.replace(/<[^>]+>/g, "").trim();

          return plainText.length >= 10;
        }
      ),

    categoryName: Yup.string().required("Category is required"),

    ...(!enableVariants
      ? {
          price: Yup.number()
            .required("Price is required")
            .min(0, "Price must be greater than or equal to 0"),
        }
      : {}),
  });