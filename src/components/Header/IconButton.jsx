export default function IconButton({ icon, onClick, className = '' }) {
  return (
    <button 
      onClick={onClick}
      className={`w-[42px] h-[42px] bg-[#F8FCF8] rounded-[12px] border border-[#E3F0E2] flex items-center justify-center hover:border-[#34C759] transition-colors shadow-sm shrink-0 ${className}`}
    >
      {icon}
    </button>
  );
}
