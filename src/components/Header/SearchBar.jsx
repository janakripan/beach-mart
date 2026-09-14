import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div 
      className="flex items-center w-full max-w-[400px] h-[46px] bg-[#F8FCF8] rounded-[12px] border border-[#0F1E361A]"
      style={{ boxShadow: 'inset 0px 2px 4px 1px #00000005' }}
    >
      <input 
        type="text" 
        placeholder="Search costumes & toys..." 
        className="flex-1 h-full pl-4 pr-2 bg-transparent outline-none text-[#1A1A2E] text-[16px] placeholder:text-[#757575] font-arial"
      />
      <button 
        className="h-[44px] w-[68px] bg-[#406547] flex items-center justify-center hover:bg-[#2D4535] transition-colors rounded-r-[12px] shrink-0"
      >
        <Search className="w-4 h-4 text-[#57E77B]" strokeWidth={2.5} />
      </button>
    </div>
  );
}
