// Product Row Component
const ProductRow = ({ product }) => {
  const ImageCell = ({ imageUrl, productName }) => {
    return (
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-[#E3F0E2]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="flex items-start py-3 px-4 hover:bg-[#F0F8F1] border-t border-[#E3F0E2] transition-colors">
      <ImageCell
        imageUrl={product.imageUrl}
        productName={product.productName}
      />
      <div className="ml-4 flex-1">
        <div className="font-bold text-sm text-[#1A1A2E]">
          {product.productName}
        </div>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
          <div>
            Price:{" "}
            <span className="text-[#1A1A2E] font-bold">
              AED {(product.price || 0).toFixed(2)}
            </span>
          </div>
          <div>
            Count:{" "}
            <span className="text-[#1A1A2E] font-bold">
              {product.count}
            </span>
          </div>
          {product.variant && (
            <div>
              Variant:{" "}
              <span className="text-[#1A1A2E] font-bold">
                {product.variant}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 mb-1">Total</div>
        <div className="font-bold text-sm text-[#1A1A2E]">
          AED {((product.price || 0) * (product.count || 0)).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductRow;
