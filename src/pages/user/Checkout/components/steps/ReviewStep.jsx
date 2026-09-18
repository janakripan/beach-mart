import React from 'react'
import StepHeader from '../shared/StepHeader';
import { useCheckoutActions } from '../../store/useCheckoutActions';
// import { useCheckoutStore } from '../../store/CheckoutStore';
import DirhamIcon from '../../../../../components/user/CustomIcons/DirhamIcon';


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
  // COMMENTED OUT FOR NOW - Switching to purely static data per user request
  // const mode = useCheckoutStore((s) => s.mode);
  // const checkoutItems = useCheckoutStore((s) => s.items);

  // const items = checkoutItems.map(
  //   (item) => ({
  //     ...item,
  //     lineItemId:
  //       item.cartItemId ??
  //       `${item.productId}-${item.variantId ?? "default"}`,
  //   })
  // );

  // Static fallback data so the UI layout is visible when cart is empty
  const items = [
      { 
        lineItemId: "static-1",
        name: "Signature Aqua Perfume", 
        sizeLabel: "50ml", 
        qty: 1, 
        price: 120.0, 
        originalPrice: 150.0, 
        image: "https://placehold.co/100?text=Aqua" 
      },
      { 
        lineItemId: "static-2",
        name: "Ocean Breeze Body Mist", 
        sizeLabel: "100ml", 
        qty: 2, 
        price: 45.0, 
        originalPrice: 50.0, 
        image: "https://placehold.co/100?text=Breeze" 
      }
  ];

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
                src={item.product?.image || item.image}
                alt={item.product?.name || item.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">{item.product?.name || item.name}</h2>
              <p className="text-sm text-gray-500">Brand: {item.product?.brand || item.brand}</p>

              <div className="flex items-center gap-2">
                <DirhamIcon className="w-4 h-4" />
                <span className="font-semibold">
                  {((item.product?.price || item.price) * (item.quantity || item.qty)).toFixed(2)}
                </span>

                {item.product?.originalPrice && (
                  <span className="line-through text-gray-400 text-sm">
                    {(item.product.originalPrice * (item.quantity || item.qty)).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600">Qty: {item.quantity || item.qty}</p>
            </div>
          </div>
        </div>
      ))}

      <div onClick={handleSubmitReview} className='flex justify-center bg-primary hover:bg-secondary text-white transition-colors duration-150 ease-in-out cursor-pointer py-3 rounded-xl mt-3'>
        <button className="font-medium">Continue to Pay</button>
      </div>
    </div>
  )
}

export default ReviewStep