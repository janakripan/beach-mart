export default function CategoryCard({ title, image }) {
  return (
    <div className="group flex flex-col items-center justify-between w-full aspect-[170/220] bg-white border border-[#F1F5F9] rounded-[5px] pt-[16px] pb-[24px] cursor-pointer hover:border-[#34C759] hover:shadow-[0px_0px_12px_0px_#20B52652] transition-all duration-300">
      
      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <img 
          src={image} 
          alt={title} 
          className="w-auto h-auto max-h-[100px] md:max-h-[120px] object-contain transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* Text Container */}
      <div className="flex flex-col items-center justify-end h-[48px] mt-2">
        <h3 className="font-arial text-[#1A1A1A] group-hover:text-[#34C759] text-[15px] md:text-[18px] font-normal leading-[150%] transition-colors duration-300 text-center m-0">
          {title}
        </h3>
        
        {/* Product Count (Hidden by default, visible on hover) */}
        <div className="overflow-hidden h-[12px] mt-1">
          <span className="block font-arial text-[#8E8E93] text-[10px] leading-[100%] opacity-0 group-hover:opacity-100 transform translate-y-[100%] group-hover:translate-y-0 transition-all duration-300 text-center">
            50+ Products
          </span>
        </div>
      </div>

    </div>
  );
}
