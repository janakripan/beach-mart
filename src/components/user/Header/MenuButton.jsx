import { Menu } from 'lucide-react';

export default function MenuButton({ onClick, className = '' }) {
  return (
    <button 
      onClick={onClick}
      className={`w-22 h-[42px] px-[14px] py-[8px] gap-[8px] bg-[#F8FCF8] rounded-[12px] border border-[#E3F0E2] flex items-center justify-center hover:border-primary transition-colors shadow-sm shrink-0 ${className}`}
    >
      <Menu className="w-[24px] h-[24px] text-primary" strokeWidth={1.5} />
      <span className="font-marcellus text-text-main text-[14px] font-normal leading-none text-center">
        Menu
      </span>
    </button>
  );
}
