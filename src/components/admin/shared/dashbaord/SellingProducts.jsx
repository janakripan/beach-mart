import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useGetSellingProducts } from "../../../../api/admin/hooks";

const SellingProducts = ({ dateRange }) => {
  const { data: sellingProductsData, isLoading } =
    useGetSellingProducts(dateRange);

  if (isLoading) {
    return (
      <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Most Selling Products</h3>
          <MoreHorizontal size={20} className="text-gray-400" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="md:col-span-2 max-h-[380px] 
      flex flex-col h-full overflow-hidden bg-white rounded-lg p-4 border
     border-gray-100"
    >
      <h3 className=" font-semibold">Most Selling Products</h3>

      <div className="space-y-6 mt-4 flex flex-col h-full overflow-y-auto pr-2">
        {sellingProductsData?.data?.map((product) => (
          <div
            key={product.ProductId}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="bg-gray-100 w-16 h-16 
              rounded-lg flex items-center justify-center"
              >
                <div className="w-10 h-6 bg-gray-700 rounded"></div>
              </div>
              <div>
                <p className="font-medium text-gray-600 whitespace-nowrap  text-sm w-[80%]">
                  {product.ProductName}
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  ID: {product.ProductId}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium whitespace-nowrap">
                {product.TotalQuantity} Units
              </p>
              <p className="text-xs whitespace-nowrap text-gray-500 mt-2">
                AED {product.TotalRevenue}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellingProducts;
