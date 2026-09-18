import React, { useEffect, useState } from "react";
// import { useGetWishlist } from "../../../../api/user/hooks/useWishList";
import WishlistCard from "./components/WishlistCard";
import { useAuthStore } from "../../Auth/store/AuthStore";
import { Link, useNavigate } from "react-router-dom";
import DotWaveLoader from "../../../components/admin/DotWaveLoader";

import { useShop } from "../../../context/ShopContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems: contextWishlist } = useShop();

  const getGuestWishlist = () => {
    const raw = localStorage.getItem("GUEST_WISHLIST");
    return raw ? JSON.parse(raw) : [];
  };

  const [guestWishlist, setGuestWishlist] = useState(() => {
    // ALWAYS initialize guest wishlist for static data
    return getGuestWishlist();
  });

  useEffect(() => {
    // Update local state when localStorage changes (ALWAYS run for static data)
    const interval = setInterval(() => {
        const newWL = getGuestWishlist();
        setGuestWishlist(prev => {
            if(JSON.stringify(newWL) !== JSON.stringify(prev)) {
                return newWL;
            }
            return prev;
        });
    }, 1000);

    return () => {
       clearInterval(interval);
    };
  }, []);

  // --- COMMENTED OUT DILKA DYNAMIC FETCHING ---
  // const {
  //   data: wishlist = [],
  //   isLoading,
  //   isError,
  // } = useGetWishlist({
  //   enabled: isAuthenticated,
  // });
  
  // For static data use guestWishlist for now
  const wishlist = [];
  const isLoading = false;

  const activeWishlist = guestWishlist;

  // Combine wishlist from ShopContext (Home page) and localStorage (Shop page)
  const combinedWishlistMap = new Map();
  
  activeWishlist.forEach(item => {
    combinedWishlistMap.set(item.productID, {
       productID: item.productID,
       variantId: item.variantId || -1,
       image: item.image,
       name: item.name,
       price: item.price,
       discountPrice: item.discountPrice,
       avgRating: item.avgRating || 0,
       totalReviews: item.totalReviews || 0
    });
  });

  contextWishlist.forEach(product => {
    combinedWishlistMap.set(product.id, {
       productID: product.id,
       variantId: -1,
       image: product.image,
       name: product.name,
       price: product.price,
       discountPrice: product.discountPrice || 0,
       avgRating: product.avgRating || 0,
       totalReviews: product.totalReviews || 0
    });
  });

  const displayWishlist = Array.from(combinedWishlistMap.values());

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <DotWaveLoader /> 
      </div>
    );
  }

  if (displayWishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        {/* Dilka uses NoProduct gif, but we keep text exact */}
        <p className="text-gray-500 text-lg font-poppins">
          Your wishlist is empty
        </p>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 font-poppins text-black">My Wishlist</h1>

      <div className="flex flex-col gap-4">
        {displayWishlist.map((item) => (
          <WishlistCard
            key={item.productID}
            item={item}
            onRemove={(productID) => {
              setGuestWishlist(prev => prev.filter(i => i.productID !== productID));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
