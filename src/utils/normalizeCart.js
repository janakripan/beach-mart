export const normalizeCart = (rows = []) => {
  return {
    items: rows.map((row) => {
      const hasDiscount =
        row.DiscountPrice > 0 &&
        row.DiscountPrice < row.Price;

      return {
        cartItemId: row.CartId,
        productId: row.ProductId,
        variantId: row.VariantId,
        qty: row.Quantity,
        sizeLabel: row.SizeLabel || null,
        name: row.ProductName,
        brand: row.BrandName,
        image: row.PrimaryImageUrl,

        // pricing (IMPORTANT)
        price: hasDiscount ? row.DiscountPrice : row.Price,
        originalPrice: hasDiscount ? row.Price : null,

        stockQty: row.StockQty,
      };
    }),
  };
};
