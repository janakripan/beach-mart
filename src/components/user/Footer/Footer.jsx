import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Mail, PhoneCall, Heart, ShoppingCart } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const WavyLine = () => (
  <svg width="40" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
    <path d="M0 2C2 2 3 0 5 0C7 0 8 2 10 2C12 2 13 4 15 4C17 4 18 2 20 2C22 2 23 0 25 0C27 0 28 2 30 2C32 2 33 4 35 4C37 4 38 2 40 2" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Footer() {
  const { setIsCartOpen, setIsWishlistOpen } = useShop();

  return (
    <footer 
      className="relative w-full bg-cover bg-center overflow-hidden min-h-[400px] lg:h-[400px] flex flex-col justify-between pt-16 lg:pt-14"
      style={{ backgroundImage: "url('/assets/footer/footer-bg.jpg')" }}
    >
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#002F0CB2' }}></div>

      {/* Decorative leaf */}
      <div className="absolute bottom-0 right-[5%] md:right-[15%] w-[120px] md:w-[160px] pointer-events-none z-[1]">
        <img src="/assets/footer/footer-leaf.png" alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[72px] xl:px-[160px] flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-6 max-w-[320px]">
            <img src="/Logo.png" alt="Beach Mart" className="w-[100px] md:w-[120px] object-contain" />
            <p className="font-poppins text-[15px] leading-[160%] text-gray-200 font-light">
              Fresh groceries, delivered right on time to keep you covered.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center text-primary hover:bg-gray-100 transition-colors shadow-lg">
                <FacebookIcon />
              </a>
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center text-primary hover:bg-gray-100 transition-colors shadow-lg">
                <TwitterIcon />
              </a>
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center text-primary hover:bg-gray-100 transition-colors shadow-lg">
                <InstagramIcon />
              </a>
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center text-primary hover:bg-gray-100 transition-colors shadow-lg">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-poppins font-medium text-[18px] text-white tracking-wide mb-1">
                Quick Link
              </h3>
              <WavyLine />
            </div>
            
            <nav className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 font-poppins text-[15px] text-gray-200 hover:text-white transition-colors group">
                <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" /> Home
              </Link>
              <Link to="/shop" className="flex items-center gap-2 font-poppins text-[15px] text-gray-200 hover:text-white transition-colors group">
                <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" /> Shop
              </Link>
              <Link to="/contact" className="flex items-center gap-2 font-poppins text-[15px] text-gray-200 hover:text-white transition-colors group">
                <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" /> Contacts
              </Link>
              {/* Mobile Only: Cart & Wishlist */}
              <button 
                onClick={() => setIsWishlistOpen(true)}
                className="md:hidden flex items-center text-left gap-2 font-poppins text-[15px] text-gray-200 hover:text-white transition-colors group"
              >
                <Heart size={16} className="text-primary group-hover:translate-x-1 transition-transform" /> Wishlist
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="md:hidden flex items-center text-left gap-2 font-poppins text-[15px] text-gray-200 hover:text-white transition-colors group"
              >
                <ShoppingCart size={16} className="text-primary group-hover:translate-x-1 transition-transform" /> Cart
              </button>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-poppins font-medium text-[18px] text-white tracking-wide mb-1">
                Contact
              </h3>
              <WavyLine />
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                <span className="font-poppins text-[15px] text-gray-200 leading-snug">UAE Ajman</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-primary shrink-0 mt-0.5" />
                <span className="font-poppins text-[15px] text-gray-200 leading-snug break-all">Beachmart@Gmail.Com</span>
              </div>
              <div className="flex items-start gap-3">
                <PhoneCall size={20} className="text-primary shrink-0 mt-0.5" />
                <span className="font-poppins text-[15px] text-gray-200 leading-snug">91+123456789</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 w-full pb-[20px] pt-[30px] lg:pt-[40px] text-center mt-auto">
        <p className="font-poppins text-[13px] md:text-[14px] text-gray-300 font-light tracking-wide">
          © 2026 All rights reserved
        </p>
      </div>
    </footer>
  );
}
