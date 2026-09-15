import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ title, children, titleColor = '#1A1A1A' }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-0 relative">
      <div className="flex items-center gap-[12px] md:gap-[24px] flex-wrap justify-center md:justify-start">
        <h2 
          className="font-marcellus font-normal text-[24px] md:text-[32px] leading-[120%] m-0 whitespace-nowrap"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
        {children}
      </div>
      
      {/* Dashed line connecting header to View All */}
      <div 
        className="hidden md:block flex-1 opacity-50 mx-[12px] lg:mx-[24px]"
        style={{ 
          maxWidth: '247.5px', 
          height: '0px', 
          borderTop: '1px dashed var(--color-primary)', 
          borderStyle: 'dashed' 
        }} 
      ></div>

      <button className="flex items-center gap-2 text-secondary hover:text-primary font-poppins font-medium text-[16px] leading-[150%] transition-colors whitespace-nowrap">
        View All <ArrowRight size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}
