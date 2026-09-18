import React from 'react'
import { Lock } from 'lucide-react'
// import { useCartStore } from '../../../../user/Cart/store/CartStore'
import DirhamIcon from '../../../../../components/user/CustomIcons/DirhamIcon'
// import { useCheckoutStore } from '../../store/CheckoutStore'

const OrderSummary = () => {
    // COMMENTED OUT FOR NOW - Switching to purely static data per user request
    // const mode = useCheckoutStore((s) => s.mode);
    // const checkoutItems = useCheckoutStore((s) => s.items);
    // const cartItems = useCartStore((s) => s.items);
    // const cartSummary = useCartStore((s) => s.summary);
    // const items = mode === "buy_now" ? checkoutItems : cartItems;
    
    // Static fallback data so the UI layout is visible when cart is empty
    const fallbackItems = [
        { name: "Signature Aqua Perfume", sizeLabel: "50ml", qty: 1, price: 120.0, originalPrice: 150.0, image: "https://placehold.co/100?text=Aqua" },
        { name: "Ocean Breeze Body Mist", sizeLabel: "100ml", qty: 2, price: 45.0, originalPrice: 50.0, image: "https://placehold.co/100?text=Breeze" }
    ];
    
    const displayItems = fallbackItems; // Force static data
    const itemCount = displayItems.reduce((sum, i) => sum + i.qty, 0);

    const computedSummary = React.useMemo(() => {
        // ALWAYS use static data calculation for now
        const subtotal = fallbackItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        const originalSubtotal = fallbackItems.reduce((sum, i) => sum + (i.originalPrice ?? i.price) * i.qty, 0);
        const discount = originalSubtotal - subtotal;
        return { subtotal, discount, tax: 0, shipping: 0, total: subtotal };
    }, []);
    const mrpTotal = computedSummary.subtotal + computedSummary.discount;

    return (
        <div className='bg-white max-w-xl mx-auto  w-full rounded-2xl font-poppins'>
            <div className='px-5 flex flex-col gap-3'>
                <h1 className='py-2 text-[#5E666C] font-semibold'>ORDER SUMMERY</h1>
                
                {/* Product List */}
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {displayItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <img 
                                src={item.product?.image || item.image || item.product?.images?.[0]} 
                                alt={item.product?.name || item.name} 
                                className="w-16 h-16 object-cover rounded-lg bg-white border border-gray-100" 
                            />
                            <div className="flex-1 text-sm">
                                <h3 className="font-medium text-gray-800 line-clamp-1">{item.product?.name || item.name}</h3>
                                {(item.product?.sizeLabel || item.sizeLabel) && (
                                    <p className="text-gray-500 text-xs mt-1">Size: {item.product?.sizeLabel || item.sizeLabel}</p>
                                )}
                                <p className="text-gray-500 text-xs">Qty: {item.quantity || item.qty}</p>
                            </div>
                            <div className="font-medium flex items-center text-sm text-gray-900">
                                <DirhamIcon className="w-3 h-3 mr-1" />
                                {((item.product?.price || item.price) * (item.quantity || item.qty)).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='border-b border-dotted flex flex-col gap-2 py-2 mt-2'>
                    <div className="flex justify-between items-center">
                        <h1 className="text-[#5E666C]">
                            Price{" "}
                            <span className="text-[#303A42]">
                                ({itemCount} items)
                            </span>
                        </h1>
                        <span className="text-[#0D1217] flex items-center gap-1">
                            <DirhamIcon className="w-3 h-4" />
                            {mrpTotal.toFixed(2)}
                        </span>
                    </div>

                    {computedSummary.discount > 0 && (
                        <div className="flex justify-between items-center">
                            <h1 className="text-[#5E666C]">Discount</h1>
                            <span className="text-green-600 flex items-center gap-1">
                                -<DirhamIcon className="w-3 h-4" />
                                {computedSummary.discount.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center text-[#303A42]">
                    <h1 className="text-lg">Total Payable</h1>
                    <span className="font-bold text-lg flex items-center gap-1">
                        <DirhamIcon className="w-4 h-5" />
                        {computedSummary.total.toFixed(2)}
                    </span>
                </div>
                {computedSummary.discount > 0 && (
                    <p className="text-[#30933A] text-sm">
                        You saved {computedSummary.discount.toFixed(2)} AED 🎉
                    </p>
                )}
                {/* <p className='text-[#8E8E8E]'>Include  AED 11.08 Tax</p> */}
            </div>
            {/* <h1 className='text-black pt-5'>Use a Coupon!</h1>
            <div className='py-3 w-full flex gap-2'>
                <input
                    type="text"
                    className='border py-2 rounded-xl flex-1  px-4 w-3/4'
                    placeholder='Enter a coupon number'
                />
                <button type='submit' className='border px-4 hover:bg-black hover:text-white py-2 transition-colors duration-100 ease-in-out rounded-xl w-1/4 cursor-pointer'>
                    Apply
                </button>
            </div> */}
            <div className='flex items-start gap-2 py-3'>
                <div>
                    <Lock className='w-5 h-5 text-gray-600' />
                </div>
                <p className='text-[#333333] text-sm'>Payments are safe and secure! Plus, returns are a breeze, and all our products are 100% authentic.</p>
            </div>

        </div>
    )
}

export default OrderSummary