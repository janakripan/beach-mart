// Product Row Component
const ProductRow = ({ product }) => {
  const ImageCell = ({ imageUrl, productName }) => {
    return (
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
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
    <div className="flex items-start py-2 px-4 hover:bg-gray-50 border-t border-gray-100">
      <ImageCell
        imageUrl={product.primaryImageUrl}
        productName={product.productName}
      />
      <div className="ml-4 flex-1">
        <div className="font-medium text-sm text-gray-800">
          {product.productName}
        </div>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
          <div>
            Price:{" "}
            <span className="text-gray-700 font-medium">
              AED {product.price.toFixed(2)}
            </span>
          </div>
          <div>
            Quantity:{" "}
            <span className="text-gray-700 font-medium">
              {product.quantity}
            </span>
          </div>
          <div>
            Product ID:{" "}
            <span className="text-gray-700 font-medium">
              {product.productId}
            </span>
          </div>
          {product.varientID !== -1 && (
            <div>
              Variant ID:{" "}
              <span className="text-gray-700 font-medium">
                {product.varientID}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-sm">
          AED {(product.price * product.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductRow;
