import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuthStore } from "../../Auth/store/AuthStore";
import { useGetUserOrders } from "../../../api/user/hooks/useOrders";
import DotWaveLoader from "../../../components/admin/DotWaveLoader";
import dirham from "../../../assets/dirham.svg";
import { usePostReview } from "../../../api/user/hooks/useReview";
import { useMessage } from "../../../components/admin/MessageBox/useMessage";

const OrderDetails = () => {
  const { id } = useParams();
  const userId = useAuthStore((s) => s.user?.UserId);
  const navigate = useNavigate(); 
  const [ratings, setRatings] = useState({});
  const { mutate, isPending, isError } = usePostReview();

  const filters = {
    isAdmin: false,
    pageNo: 1,
    pageSize: 100,
    userId,
    orderID: id,
  };

  const { data, isLoading } = useGetUserOrders(filters);

  const order = data?.data?.find(
    (o) => String(o.orderId) === String(id)
  );
  const orderDate = new Date(order?.orderDate);

// Add 7 days
    const eligibleDate = new Date(orderDate);
    eligibleDate.setDate(orderDate.getDate() + 7);

    // Today
    const today = new Date();

    // Compare only date (remove time issues)
    today.setHours(0, 0, 0, 0);
    eligibleDate.setHours(0, 0, 0, 0);

    const isEligible = today <= eligibleDate;

    const formattedEligibleDate = eligibleDate
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");


  const message = useMessage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DotWaveLoader/> 
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Order not found.
      </div>
    );
  }

  // Parse shipping address safely
  let parsedAddress = null;
  try {
    parsedAddress = JSON.parse(order.shippingAddress);
  } catch {
    parsedAddress = null;
  }

  const handleSubmitRating = (productId) => {
    const ratingValue = ratings[productId];

    if (!ratingValue) {
      message.error("Please select a rating before submitting.");
      return;
    } 

    mutate(
      {
        productId,
        rating: ratingValue,

      },
      {
        onSuccess: () => {
          setRatings(prev => ({ ...prev, [productId]: 0 }));
        },
      }
    );

  // call API here
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 font-montserrat">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.orderDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-4">

            {order.orderDetails.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#8E8E93] "
              >
                <div className="flex gap-6">

                  <img
                    src={item.primaryImageUrl}
                    alt={item.productName}
                    className="w-28 h-full  object-contain  rounded-md"
                  />

                  <div className="flex-1 flex flex-col gap-2  ">
                    <div className="flex justify-between">
                      <div >
                        <h2 className="text-lg font-medium text-gray-900">
                          {item.productName}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Order ID: {order.orderId}
                        </p>
                      </div>

                      <p className="text-lg font-semibold text-gray-900">
                        <img src={dirham} alt="Dirham" className="w-4 h-4 inline mr-1" />
                        {item.totalAmount}
                      </p>
                    </div>
                    <div className="flex justify-end  w-full ">

                    
                    {/* <div>
                        {item.sizeLabel && (
                      <p className="text-sm text-gray-500 mt-2">
                        Size: {item.sizeLabel}
                      </p>
                        )}

                        <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                        </p>
                    </div> */}
                     
                    </div>
                    <div className="bg-[#0000000A] rounded-full  w-fit py-1 px-3  text-sm  ">
                        <p className="text-[#939393] ">Eligible for return until <span className="font-medium text-black ">{formattedEligibleDate}</span></p>
                    </div>
                   <div className="grid grid-cols-2 mt-1  gap-3 ">
                      <button onClick={()=> {navigate('/returns')}} className="px-6 py-2 bg-primary text-white cursor-pointer  rounded-full text-sm font-medium hover:opacity-90 transition">
                        Return
                      </button>

                      <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                        Rate Product
                      </button>
                    </div>

                     <div className="mt-2  flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                               onClick={() =>
                                  setRatings((prev) => ({
                                    ...prev,
                                    [item.productId]: star,
                                  }))
                                }
                            >
                               <svg
                                  className={`w-6 h-6 ${
                                    star <= (ratings[item.productId] || 0)
                                      ? "fill-yellow-400"
                                      : "fill-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-4">

            {/* Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#8E8E93]  ">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Summary
              </h3>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Total Items</span>
                <span>{order.orderDetails.length}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Order Status</span>
                <span>{order.orderStatus}</span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>Grand Total</span>
                <span><img src={dirham} alt="Dirham" className="w-4 h-4 inline mr-1" /> {order.orderAmount}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#8E8E93]">
              <h3 className=" font-semibold text-gray-900 mb-3">
                Delivery Details
              </h3>

              {parsedAddress ? (
                <div className="text-sm flex gap-1  text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">
                    {parsedAddress.UserName}
                  </p>
                  <p>
                    {parsedAddress.Address}, {parsedAddress.District}
                  </p>
                  <p>
                    {parsedAddress.City} - {parsedAddress.PinCode}
                  </p>
                  <p>Phone: {parsedAddress.PhoneNumber}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Address not available
                </p>
              )}

              <div className="mt-4">
                <p className="text-sm  text-gray-900 font-semibold">Payment Method</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.paymentMode}
                </p>
              </div>
            </div>

            {/* Assistance */}
            <div className="bg-orange-50 rounded-xl p-4 border border-[#8E8E93]">
              <h3 className="text-sm font-semibold text-orange-800">
                Need Assistance
              </h3>
              <p className="text-xs text-orange-700 mt-1">
                Our Concierge is Available 24/7 to Assist You with Your Order
              </p>
              <button className="text-sm font-medium text-orange-900 underline mt-2">
                Contact us
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
