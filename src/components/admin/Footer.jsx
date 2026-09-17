import React from 'react'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import footerBg from '../assets/FooterBg.jpg';
const Logo = "/Logo.png";
import { footerLinks, footerSocials, paymentMethods } from '../constants';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative hidden md:flex  text-white font-manrope" style={{backgroundImage: `url(${footerBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className='absolute inset-0 bg-[#0D0D0D]/84'></div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6  z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 py-12 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className=" h-20  flex items-center justify-center">
               <img src={Logo} alt="Beach Mart logo" />
              </div>
            </div>
            <p className=" text-sm leading-relaxed">
              Discover a world of exquisite fragrances and luxury essentials. Curated for the discerning individual.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className=" font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {footerLinks.map((item)=>(<li key={item.id}>
                <Link to={item.href}  className="relative inline-block text-sm transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                  {item.label}
                </Link>
              </li>))}
              
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className=" font-bold text-2xl mb-2">Newsletter</h3>
            <p className="text-sm mb-4">
              Stay updated with our latest arrivals and offers.
            </p>
            <div className="flex flex-col xl:flex-row  gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded bg-[#1B1B1B] border border-[#0D0D0D] text-sm focus:outline-none "
              />
              <button className="px-6 py-2 cursor-pointer bg-white text-[#1B1B1B] rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {footerSocials.map(({ id, icon: Icon, href, external }) => (
                <a
                  key={id}
                  href={href}
                  aria-label={id}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 hover:text-black  transition-colors"
                >
                  <Icon  className="w-5 h-5 stroke-2 " />
                </a>
              ))}
            </div>

          </div>
        </div>
        {/* Bottom Bar */}
      <div className="border-t border-gray-300 ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className=" text-sm">
            © 2025 Beach Mart. All rights reserved.
          </p>
          
          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className=" text-sm">Payment Methods:</span>
            <div className="flex items-center gap-2">
              {paymentMethods.map((item)=>(<div key={item.id} className="h-10 w-20 bg-white ">
                <img src={item.img} alt={item.alt} className='h-full w-full object-contain'/>
              </div>))}
              
            </div>
          </div>
        </div>
      </div>
      </div>

      
    </footer>
  )
}

export default Footer
