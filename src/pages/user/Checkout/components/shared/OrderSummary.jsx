import React from 'react'
import Secure from '../../../../assets/Secure.svg'
import { useCartStore } from '../../../Cart/store/CartStore'
import dirham from '../../../../assets/dirham.svg'
import { useCheckoutStore } from '../../store/CheckoutStore'

const OrderSummary = () => {
    const mode = useCheckoutStore((s) => s.mode);
    const checkoutItems = useCheckoutStore((s) => s.items);
    const cartItems = useCartStore((s) => s.items);
    const cartSummary = useCartStore((s) => s.summary);
    const items = mode === "buy_now" ? checkoutItems : cartItems;
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    // MRP total = subtotal + discount
    const computedSummary = React.useMemo(() => {
        if (mode !== "buy_now") return cartSummary;

        const subtotal = items.reduce(
            (sum, i) => sum + i.price * i.qty,
            0
        );

        const originalSubtotal = items.reduce(
            (sum, i) =>
                sum + (i.originalPrice ?? i.price) * i.qty,
            0
        );

        const discount = originalSubtotal - subtotal;

        return {
            subtotal,
            discount,
            tax: 0,
            shipping: 0,
            total: subtotal,
        };
    }, [mode, items, cartSummary]);

    const mrpTotal =
        computedSummary.subtotal + computedSummary.discount;

    return (
        <div className='bg-white max-w-xl mx-auto  w-full rounded-2xl font-poppins'>
            <div className='px-5 flex flex-col gap-3'>
                <h1 className='py-2 text-[#5E666C] font-semibold'>ORDER SUMMERY</h1>
                <div className='border-b border-dotted flex flex-col gap-2 py-2'>
                    <div className="flex justify-between items-center">
                        <h1 className="text-[#5E666C]">
                            Price{" "}
                            <span className="text-[#303A42]">
                                ({itemCount} items)
                            </span>
                        </h1>
                        <span className="text-[#0D1217] flex items-center gap-1">
                            <img src={dirham} alt="dirham" className="w-3 h-4" />
                            {mrpTotal.toFixed(2)}
                        </span>
                    </div>

                    {computedSummary.discount > 0 && (
                        <div className="flex justify-between items-center">
                            <h1 className="text-[#5E666C]">Discount</h1>
                            <span className="text-green-600 flex items-center gap-1">
                                -<img src={dirham} alt="dirham" className="w-3 h-4" />
                                {computedSummary.discount.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center text-[#303A42]">
                    <h1 className="text-lg">Total Payable</h1>
                    <span className="font-bold text-lg flex items-center gap-1">
                        <img src={dirham} alt="dirham" className="w-4 h-5" />
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
                    <img src={Secure} alt="icon" className='w-5 h-5' />
                </div>
                <p className='text-[#333333] text-sm'>Payments are safe and secure! Plus, returns are a breeze, and all our products are 100% authentic.</p>
            </div>

        </div>
    )
}

export default OrderSummary