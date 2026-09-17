import React from 'react'
import product1 from '../../../../assets/products/productd1.png'

import dirham from '../../../../assets/dirham.svg'
import StepHeader from '../shared/StepHeader';
import { useCheckoutActions } from '../../store/useCheckoutActions';
import { useCartStore } from '../../../Cart/store/CartStore';
import { useCheckoutStore } from '../../store/CheckoutStore';


const StarRating = ({ rating, total = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(total)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'fill-[#F6C514] text-[#F6C514]' : 'fill-gray-200 text-gray-200'}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};


const ReviewStep = () => {
  const mode = useCheckoutStore((s) => s.mode);
  const checkoutItems = useCheckoutStore((s) => s.items);
  const cartItems = useCartStore((s) => s.items);

  const items = (mode === "buy_now" ? checkoutItems : cartItems).map(
    (item) => ({
      ...item,
      lineItemId:
        item.cartItemId ??
        `${item.productId}-${item.variantId ?? "default"}`,
    })
  );

  const { completeStep } = useCheckoutActions();

  const handleSubmitReview = () => {
    completeStep({ result: true });
  }
  return (
    <div className='max-w-xl mx-auto w-full '>
      <StepHeader name={"Order Summary"} />
      {items.map((item) => (
        <div  key={item.lineItemId} className="border-b border-gray-300  pb-4 mb-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-32 h-32 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p className="text-sm text-gray-500">Brand: {item.brand}</p>

              <div className="flex items-center gap-2">
                <img src={dirham} className="w-4 h-4" />
                <span className="font-semibold">
                  {(item.price * item.qty).toFixed(2)}
                </span>

                {item.originalPrice && (
                  <span className="line-through text-gray-400 text-sm">
                    {(item.originalPrice * item.qty).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
            </div>
          </div>
        </div>
      ))}

      <div onClick={handleSubmitReview} className='flex justify-center bg-black hover:bg-white border border-black  hover:text-black text-white transition-colors duration-150 ease-in-out cursor-pointer py-3 rounded-lg mt-3'>
        <button>Continue to Pay</button>
      </div>
    </div>
  )
}

export default ReviewStep