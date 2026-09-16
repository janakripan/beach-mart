import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ title, children, titleColor = 'var(--color-text-main)' }) {
  return (
    <div className="flex flex-row justify-between items-center w-full gap-2 md:gap-0 relative px-2 md:px-0">
      <div className="flex items-center gap-[8px] md:gap-[24px] flex-wrap justify-start">
        <h2 
          className="font-marcellus font-normal text-[22px] sm:text-[24px] md:text-[32px] leading-[120%] m-0 whitespace-nowrap"
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

      <button className="flex items-center gap-1 md:gap-2 text-secondary hover:text-primary font-poppins font-medium text-[12px] sm:text-[14px] md:text-[16px] leading-[150%] transition-colors whitespace-nowrap shrink-0">
        View All <ArrowRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
