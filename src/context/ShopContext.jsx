import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => {
  return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Cart Functions
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.product.price) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Wishlist Functions
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (!prev.find((item) => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const moveToCart = (product) => {
    removeFromWishlist(product.id);
    addToCart(product);
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isWishlistOpen,
    setIsWishlistOpen,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
