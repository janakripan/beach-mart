import React, { useState } from "react";
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import NoProduct from '../../assets/NoProducts.gif'
import dirham from "../../assets/dirham.svg";
import { useCartStore } from "./store/CartStore";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUpdateCartQty, useRemoveItem, useClearCart } from "../../api/hooks/useCart";
import { useAuthStore } from "../Auth/store/AuthStore";
import { useCheckoutStore } from "../Checkout/store/CheckoutStore";
import { useGuestLogin } from "../../api/hooks/useAuth";
import { useMessage } from "../../components/MessageBox/useMessage";
import GuestCheckoutModal from "../../components/GuestCheckoutModal";
import { useSyncCart } from "../../api/hooks/useCart";


const CartPage = () => {

  const [loadingQtyItemId, setLoadingQtyItemId] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const message = useMessage();
  const { mutateAsync: postCart } = useSyncCart() 
  const items = useCartStore((s) => s.items);
  const setFromCart = useCheckoutStore((s) => s.setFromCart);
  const navigate = useNavigate();
  const summary = useCartStore((s) => s.summary);
  const { mutate: updateQtyMutation, isPending: updateQtyLoading } = useUpdateCartQty();
  const { mutate: removeItemMutation, isPending: clearCartLoading } = useRemoveItem();
  const { mutate: clearCartMutation, isPaused: clearingCart } = useClearCart();
  const token = useAuthStore((s) => s.accessToken);
  const isAuthenticated = Boolean(token);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeItemLocal = useCartStore((s) => s.removeItemLocal);
  const clearCart = useCartStore((s) => s.clearCart);
  const { mutateAsync: guestLogin } = useGuestLogin();
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsGuestModalOpen(true);
      return;
    }

    setFromCart(items);
    navigate("/checkout");
  };

const handleContinueAsGuest = async () => {
  try {
    const res = await guestLogin();
    loginSuccess(res.token, null, null, res.userInfo);
    await Promise.resolve();
    await postCart(items);

    setFromCart(items);
    navigate("/checkout");
  } catch (e) {
    message.error("Guest login failed");
  }
};

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-3 items-center justify-center     ">
        <img src={NoProduct} alt="empty products" className='h-28 w-28 ' />
        <p className="text-gray-500 text-lg font-poppins ">Your cart is empty</p>
        <div className="flex items-center bg-black text-white px-6 py-2 rounded-xl  cursor-pointer  ">
          <Link
            to="/shop"
            className="  font-poppins "
          >
            Go Shopping
          </Link>
          <ChevronRight />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins ">
      {/* ================= LEFT: CART ITEMS ================= */}
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => {
          const itemKey = `${item.productId}-${item.variantId}`;
          return (
            <div
              key={itemKey}
              className="flex gap-4 border border-gray-400  rounded-xl p-4"
            >
              {/* Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-5 ">
                    <h3 className="font-medium line-clamp-2">
                      {item.name}
                    </h3>
                    {item.sizeLabel && (<h3 className="text-sm line-clamp-2">
                      ({item.sizeLabel})
                    </h3>)}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <img src={dirham} alt="dirham" />

                    <span className="font-medium">
                      {item.price.toFixed(2)}
                    </span>

                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-gray-400 line-through text-xs">
                        {item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Qty + Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 border rounded-full px-3 py-1">
                    <button
                      disabled={loadingQtyItemId === itemKey}
                      onClick={() => {

                        setLoadingQtyItemId(itemKey);

                        if (!isAuthenticated) {

                          decreaseQty(item.productId, item.variantId);
                          setLoadingQtyItemId(null);
                          return;
                        }
                        if (item.qty === 1) {
                          const ok = window.confirm("This will remove the item from your cart. Continue?");
                          if (!ok) return;

                          removeItemMutation(
                            { cartId: item.cartItemId },
                            {
                              onSuccess: () => {
                                message.info("Item removed from cart");
                              },
                              onError: (error) => {
                                message.error(error?.response?.data?.message || "Failed to remove item");
                              },
                              onSettled: () => setLoadingQtyItemId(null),
                            }
                          );
                          return;
                        }

                        updateQtyMutation(
                          {
                            cartItemId: item.cartItemId,
                            quantity: item.qty - 1,
                          },
                          {
                            onSettled: () => setLoadingQtyItemId(null),
                          }
                        );
                      }}
                    >
                      <Minus size={16} />
                    </button>

                    <span className="font-medium w-5 text-center">
                      {loadingQtyItemId === `${itemKey}` ? (
                        <span className="inline-block w-4 h-4 border-2 border-black  border-t-transparent rounded-full animate-spin " />
                      ) : (
                        item.qty
                      )}
                    </span>

                    <button
                      disabled={
                        loadingQtyItemId === itemKey ||
                        item.qty >= item.stockQty
                      }
                      className={`${item.qty >= item.stockQty
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                        }`}

                      onClick={() => {
                        setLoadingQtyItemId(itemKey);

                        if (item.qty >= item.stockQty) return;

                        if (!isAuthenticated) {
                          increaseQty(item.productId, item.variantId);
                          setLoadingQtyItemId(null);
                          return;
                        }

                        updateQtyMutation(
                          {
                            cartItemId: item.cartItemId,
                            quantity: item.qty + 1,
                          },
                          {
                            onSettled: () => setLoadingQtyItemId(null),
                          }
                        );
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    disabled={clearCartLoading}
                    onClick={() => {
                      const ok = window.confirm("Remove this item from your cart?");
                      if (!ok) return;

                      if (!isAuthenticated) {
                        removeItemLocal(item.productId, item.variantId);
                        message.info("Item removed from cart");
                        return;
                      }

                      removeItemMutation({ cartId: item.cartItemId }, {
                        onSuccess: () => {
                          message.info("Item removed from cart");
                        },
                        onError: (error) => {
                          message.error(error?.response?.data?.message || "Failed to remove item");
                        }
                      });

                    }}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        <button
          disabled={clearingCart}
          onClick={() => {
            if (!isAuthenticated) {
              clearCart();
              message.info("Cart cleared");
              return;
            }

            clearCartMutation(null, {
              onSuccess: () => {
                message.info("Cart cleared");
              },
              onError: (error) => {
                message.error(error?.response?.data?.message || "Failed to clear cart");
              }
            });
          }}
          className="text-sm text-red-600 underline"
        >
          Clear Cart
        </button>
      </div>

      {/* ================= RIGHT: SUMMARY ================= */}
      <div className="border rounded-xl p-5 h-fit sticky top-4">
        <h2 className="text-lg font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{summary.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{summary.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {summary.shipping === 0 ? "Free" : summary.shipping}
            </span>
          </div>

          {summary.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{summary.discount.toFixed(2)}</span>
            </div>
          )}

          <hr />

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{summary.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5 w-full bg-black text-white rounded-full py-3">
          <button
            onClick={handleCheckout}
            className="w-full text-center font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      <GuestCheckoutModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </div>
  );
};

export default CartPage;
