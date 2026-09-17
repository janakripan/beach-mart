import { Heart, Star } from 'lucide-react'
import dirham from '../../../assets/dirham.svg'
import { useCartStore } from '../../Cart/store/CartStore';
import { Link, useNavigate } from 'react-router-dom'
import { useAddToWishlist, useDeleteWishlist, useGetWishlist } from '../../../api/hooks/useWishList'
import { useAuthStore } from '../../Auth/store/AuthStore';
import { useMessage } from '../../../components/MessageBox/useMessage';
import { useEffect, useState } from 'react';

const ProductCard = ({ variantID = -1, productID, img, name, price, discountPrice, avgRating, totalReviews }) => {
  const safeRating = Number(avgRating) || 0;
  const roundedRating = Math.round(safeRating * 2) / 2;

  const message = useMessage();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [guestWishlist, setGuestWishlist] = useState([]);

  const getGuestWishlist = () => {
    const raw = localStorage.getItem("GUEST_WISHLIST");
    return raw ? JSON.parse(raw) : [];
  };


  useEffect(() => {
    if (!isAuthenticated) {
      setGuestWishlist(getGuestWishlist());
    }
  }, [isAuthenticated]);

  const { data: wishlist = [] } = useGetWishlist({
    enabled: isAuthenticated,
  });
  const { mutate: addToWishlist, isPending: adding } = useAddToWishlist({
    onSuccess: () => {
      message.success("Added to wishlist");
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Failed to add to wishlist");
    }
  });
  const { mutate: deletefromwishlist, isPending: deleting } = useDeleteWishlist({
    onSuccess: () => {
      message.info("Removed from wishlist");
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Failed to remove from wishlist");
    }
  });

  const isLiked = isAuthenticated
    ? wishlist.some(item => item.ProductId === productID)
    : guestWishlist.some(item => item.productID === productID);

  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discountPrice) || 0;

  const hasDiscount =
    numericDiscount > 0 && numericDiscount < numericPrice;

  const discountPercent = hasDiscount
    ? Math.round(((numericPrice - numericDiscount) / numericPrice) * 100)
    : 0;


  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (isLiked) {
        const updated = guestWishlist.filter(
          item => item.productID !== productID
        );
        localStorage.setItem("GUEST_WISHLIST", JSON.stringify(updated));
        setGuestWishlist(updated);
        message.info("Removed from wishlist");
      } else {
        const updated = [
          ...guestWishlist,
          {
            productID,
            variantId: variantID,
            name,
            image: img,
            price,
            discountPrice,
          },
        ];
        localStorage.setItem("GUEST_WISHLIST", JSON.stringify(updated));
        setGuestWishlist(updated);
        message.success("Added to wishlist");
      }
      return;
    }


    if (isLiked) {
      deletefromwishlist({ ProductId: productID });
    } else {
      addToWishlist({ ProductId: productID, VariantId: variantID });
    }
  };



  return (
    <div className='p-2 cursor-pointer  border border-[#B3B3B3] flex flex-col gap-1  rounded-2xl font-montserrat h-full'>
      {/* Image Section - Fixed Height */}
      <div className='h-40 md:h-60   w-full bg-gray-400 rounded-2xl overflow-hidden relative shrink-0'>
        <img src={img} alt="product" className='h-full w-full object-cover' />
        {hasDiscount && (<div className='absolute top-2 left-2 border border-[#D6AD67] text-[#D6AD67] rounded-md py-1 px-3 bg-white text-xs'>
          <span className='text-[clamp(0.8rem,1.5vw,1rem)]'>{discountPercent}% off</span>
        </div>)}
        <button
          onClick={handleWishlistToggle}
          disabled={adding || deleting}
          className='absolute top-2 right-2  rounded-full p-2 cursor-pointer bg-white  '
        >
          <Heart
            strokeWidth={1.5}
            className={`w-4 h-4 transition-all duration-300 ${isLiked
              ? 'fill-red-500 text-red-500 scale-125'
              : 'text-black'
              }`}
          />
        </button>
      </div>

      {/* Content Section - Flexible with justify-between */}
      <div className='flex flex-col justify-between flex-1 gap-1'>
        {/* Top Section: Rating + Name */}
        <div className='flex flex-col gap-2'>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => {
                const isFilled = safeRating > 0 && index + 1 <= roundedRating;

                return (
                  <Star
                    key={index}
                    size={16}
                    strokeWidth={1}
                    fill={isFilled ? "#FCCD56" : "transparent"}
                    color="#FCCD56"
                  />
                );
              })}
            </div>

            <span className="text-[#6B7280] text-[clamp(0.7rem,2vw,0.875rem)]">
              ({safeRating.toFixed(1)})
            </span>

            <span className="hidden md:flex text-[#0D0D0D] font-semibold text-[clamp(0.7rem,2vw,0.875rem)]">
              {Number(totalReviews) > 0 ? `${totalReviews} Reviews` : "No reviews"}
            </span>
          </div>
          <div>
            <h2 className='line-clamp-1 text-[clamp(0.8rem,2vw,1rem)] font-medium '>{name}</h2>
          </div>
        </div>

        {/* Bottom Section: Price + Cart Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1   items-center">
            {discountPrice > 0 ? (
              <>
                {/* Original price (strikethrough) */}
                <div className="flex items-center text-[#3F3F3F]">
                  {/* <img src={dirham} alt="dirham" /> */}
                  <span className="line-through text-[clamp(0.8rem,2vw,1rem)]">{price}</span>
                </div>

                {/* Discounted price (bold) */}
                <div className="flex items-center text-[#0D0D0D]">
                  <img src={dirham} alt="dirham" />
                  <span className="font-semibold text-[clamp(0.8rem,2vw,1rem)] font-montserrat">{discountPrice}</span>
                </div>
              </>
            ) : (
              /* Normal price */
              <div className="flex items-center text-[#0D0D0D]">
                <img src={dirham} alt="dirham" />
                <span className="font-semibold text-[clamp(0.8rem,2vw,1rem)] font-montserrat ">{price}</span>
              </div>
            )}
          </div>

          <Link to={`/product/${productID}`} className='p-1 md:p-2 rounded-full flex justify-center bg-black text-white hover:bg-white hover:text-black border  border-transparent hover:border-black transition-colors duration-150 ease-in-out text-[clamp(1rem,1vw,2rem)]'>View Product</Link>
        </div>

      </div>
    </div>
  )
}

export default ProductCard