import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import IconButton from './IconButton';
import MenuButton from './MenuButton';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import CartDrawer from '../Drawers/CartDrawer';
import WishlistDrawer from '../Drawers/WishlistDrawer';
import { UserMenu } from './UserMenu';

export default function Header() {
  const { cartItems, wishlistItems, setIsCartOpen, setIsWishlistOpen } = useShop();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header if scrolling down past its height
      if (currentScrollY > lastScrollY.current && currentScrollY > 118) {
        setIsHidden(true);
      } 
      // Show header if scrolling up
      else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [isDrawerOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header 
        className={`w-full h-[118px] bg-cover bg-center flex items-center justify-center z-50 sticky top-0 border-b border-[#E3F0E2]/50 shadow-sm transition-transform duration-300 ease-in-out ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ backgroundImage: "url('/assets/header/header-bg.png')" }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-16 py-[16px] flex items-center gap-[16px]">
          
          {/* Logo */}
          <Link to="/" className="shrink-0 mr-4">
            <img src="/Logo.png" alt="Beach Mart Logo" className="h-[60px] md:h-[86px] w-auto object-contain transition-all" />
          </Link>

          {/* Right Section Container: Nav, Search, Buttons */}
          <div className="flex-1 flex items-center justify-end lg:justify-between">
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-[16px] px-[16px]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-[16px] font-bold uppercase tracking-[0.7px] transition-colors font-arial ${
                      isActive ? 'text-primary' : 'text-text-main hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar (Middle) */}
            <div className="hidden lg:block max-w-[400px] w-full px-4">
              <SearchBar />
            </div>
            
            {/* Action Buttons (Right) */}
            <div className="flex items-center gap-3 xl:gap-4 relative">
              <div className="relative hidden lg:flex">
                <UserMenu />
              </div>
              <div className="relative hidden sm:flex">
                <IconButton onClick={() => setIsWishlistOpen(true)} icon={<Heart className="w-[20px] h-[20px] text-primary" strokeWidth={1.25} />} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-[1.5px] border-white"></span>
                )}
              </div>
              <div className="relative">
                <IconButton onClick={() => setIsCartOpen(true)} icon={<ShoppingCart className="w-[20px] h-[20px] text-primary" strokeWidth={1.25} />} />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-[1.5px] border-white"></span>
                )}
              </div>
              <div className="lg:hidden">
                <MenuButton onClick={() => setIsDrawerOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-white z-50 shadow-2xl flex flex-col bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/header/header-bg.png')" }}
            >
              <div className="p-4 flex items-center justify-between border-b border-[#E3F0E2]/50 bg-white/70 backdrop-blur-md">
                <img src="/Logo.png" alt="Beach Mart Logo" className="h-[40px] w-auto object-contain" />
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-[12px] bg-[#F8FCF8] flex items-center justify-center shadow-sm border border-[#E3F0E2] text-[#1A1A2E] hover:border-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8 bg-white/80 backdrop-blur-sm">
                
                {/* Search Bar for Mobile/Tablet */}
                <div className="lg:hidden">
                  <SearchBar />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`text-[18px] font-bold uppercase tracking-[0.7px] transition-colors font-arial py-3 border-b border-[#E3F0E2]/50 ${
                          isActive ? 'text-primary' : 'text-[#1A1A2E] hover:text-primary'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
                
                {/* Drawer Additional Actions */}
                <div className="flex flex-col gap-6 mt-auto">
                   <div className="lg:hidden">
                     <UserMenu drawerMode={true} />
                   </div>
                   <div 
                     className="flex items-center gap-3 text-text-main font-bold font-arial uppercase tracking-[0.5px] lg:hidden cursor-pointer hover:text-primary transition-colors"
                     onClick={() => { setIsDrawerOpen(false); setIsWishlistOpen(true); }}
                   >
                      <IconButton icon={<Heart className="w-[20px] h-[20px] text-primary" strokeWidth={1.25} />} />
                      <span>Wishlist</span>
                   </div>
                   <div 
                     className="flex items-center gap-3 text-text-main font-bold font-arial uppercase tracking-[0.5px] lg:hidden cursor-pointer hover:text-primary transition-colors"
                     onClick={() => { setIsDrawerOpen(false); setIsCartOpen(true); }}
                   >
                      <IconButton icon={<ShoppingCart className="w-[20px] h-[20px] text-primary" strokeWidth={1.25} />} />
                      <span>Cart</span>
                   </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Global Drawers */}
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
}
