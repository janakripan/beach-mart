import React, { useEffect, useState } from 'react';
import { Truck, Package, CheckCircle, Clock, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useGetUserOrders } from "../../../../api/user/hooks/useOrders";
import { normalizeOrders } from "../../../../utils/normalizeOrders";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderCardSkeleton from './OrderCardSkeleton';
import { useAuthStore } from "../../../Auth/store/AuthStore";
import { useNavigate } from 'react-router-dom';

const TransitCart = () => {
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const userId = useAuthStore((s) => s.user?.UserId);
  const filters = {
    isAdmin: false,
    pageNo,
    pageSize,
    userId
  };

  const { data, isLoading } = useGetUserOrders(filters)
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const rawOrders = data?.data || [];
  const orders = normalizeOrders(rawOrders);
  console.log(orders, " orderrrsss")
  const navigate = useNavigate();

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [pageNo]);

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case 'transit':
        return <Package className="w-4 h-4" />;
      case 'delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

if (isLoading) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

  {
    !isLoading && orders.length === 0 && (
      <div className="text-center py-20 text-gray-500">
        No orders found.
      </div>
    )
  }

  return (
    <div className="min-h-screen  ">
      <div className="max-w-6xl mx-auto space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Left Section - Order Info */}
                <div className="shrink-0  space-y-4 self-start ">
                  <div>
                    <div className="text-xs font-medium text-gray-400 tracking-wider mb-1">
                      ORDER REFERENCE
                    </div>
                    <div className="text-lg font-normal text-gray-900">
                      {order.orderReference}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-400 tracking-wider mb-1">
                      ORDER DATE
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderDate}
                    </div>
                  </div>
                </div>

                {/* Middle Section - Product Info */}
                <div className="grow self-start  md:pl-20">
                  <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">
                    {order.manifest}
                  </div>

                  <div className="flex items-start gap-8">
                    {/* Product Images */}
                    <div className="relative shrink-0">
                      {/* Main Image */}
                      <div className="relative z-30 w-16 h-20 rounded shadow-md overflow-hidden">
                        <img
                          src={order.mainProduct.image}
                          alt={order.mainProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Stacked Images */}
                      {order.additionalItems.slice(0, 1).map((img, idx) => (
                        <div
                          key={idx}
                          className="absolute top-0 w-16 h-20 rounded shadow-md overflow-hidden"
                          style={{
                            left: `${(idx + 1) * 10}px`,
                            zIndex: 20 - idx, // 👈 IMPORTANT
                          }}
                        >
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>


                    {/* Product Details */}
                    <div className="grow">
                      <h3 className="text-base font-normal text-gray-900 mb-1">
                        {order.mainProduct.name}
                      </h3>
                      {order.mainProduct.subtitle && (
                        <p className="text-xs text-gray-500 mb-2">
                          {order.mainProduct.subtitle}
                        </p>
                      )}
                      {order.additionalCount > 0 && (
                        <p className="text-xs text-gray-500 mb-2">
                          AND {order.additionalCount} MORE ITEMS
                        </p>
                      )}
                      <p className="text-base font-medium text-gray-900 mb-2">
                        {order.total} Total
                      </p>
                      
                    </div>
                  </div>
                </div>

                {/* Right Section - Status */}
                <div className="shrink-0 space-y-3 md:min-w-[200px] ">
                  <div className='flex justify-between items-start '>


                    <div className=''>
                      <div className="text-xs font-medium text-gray-400 tracking-wider mb-2">
                        CURRENT STATUS
                      </div>
                      <div className="flex items-center gap-2 ">
                        <span className="w-2 h-2 rounded-full bg-black"></span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex md:justify-end pt-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                        {getStatusIcon(order.statusType)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    {order.dispatchDate && (
                      <div className="text-xs text-gray-500 mb-1">
                        {order.dispatchDate}
                      </div>
                    )}
                    {order.arrivalLabel && (
                      <div className="text-xs text-gray-500 mb-1">
                        {order.arrivalLabel}
                      </div>
                    )}
                    {/* <div className="text-xs font-medium text-gray-900">
                      {order.estimatedDelivery || order.deliveredDate}
                    </div> */}
                    <button onClick={() => navigate(`/order/${order.orderReference}`)} className="text-xs text-gray-400 hover:text-gray-600 tracking-wider font-medium">
                        VIEW DETAILS →
                      </button>
                  </div>

                  {/* Status Icon */}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end  items-center gap-4 py-8">
          <button
            disabled={pageNo === 1}
            onClick={() => setPageNo((p) => p - 1)}
            className="px-4 py-2 text-sm border hover:bg-gray-100 cursor-pointer rounded disabled:opacity-40"
          >
            <ChevronLeft/>
          </button>

          <span className="text-sm text-gray-600">
            Page {pageNo} of {totalPages}
          </span>

          <button
            disabled={pageNo === totalPages}
            onClick={() => setPageNo((p) => p + 1)}
            className="px-4 py-2 text-sm border hover:bg-gray-100 cursor-pointer rounded disabled:opacity-40"
          >
            <ChevronRight/>
          </button>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default TransitCart;
