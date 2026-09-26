import { useAppLoading } from '../../../../context/AppLoadingContext';

export default function CategoryCard({ title, image, isLoading: propIsLoading, onClick }) {
  const { isLoading: appLoading } = useAppLoading();
  const isLoading = appLoading || propIsLoading;

  if (isLoading) {
    return (
      <div className="group flex flex-col items-center w-full aspect-170/220 bg-white border border-gray-200 md:border-border-light rounded-[5px] overflow-hidden pt-[16px] pb-[10px] cursor-pointer">
        <div className="flex-1 w-full min-h-0 flex items-center justify-center px-2">
          <div className="w-[80%] h-[80%] rounded-md shimmer" />
        </div>
        <div className="h-[44px] mt-1 w-full px-4 flex flex-col items-center justify-end shrink-0">
          <div className="h-4 w-3/4 rounded shimmer mb-2" />
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col items-center w-full aspect-170/220 bg-white border border-gray-200 md:border-border-light rounded-[5px] overflow-hidden pt-[16px] pb-[10px] lg:pb-[16] cursor-pointer lg:hover:border-primary lg:hover:shadow-[0px_0px_12px_0px_#20B52652] transition-all duration-300"
    >
      
      {/* Image Container */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center px-2 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 " 
        />
      </div>

      {/* Text Container */}
      <div className="h-[44px] mt-1 w-full px-2 flex flex-col items-center justify-end shrink-0">
        <h3 className="font-arial text-text-main lg:group-hover:text-primary text-[15px] md:text-[18px] font-normal leading-[150%] transition-colors duration-300 text-center m-0 line-clamp-1">
          {title}
        </h3>
        
        {/* Product Count (Hidden by default, visible on hover) */}
        <div className="overflow-hidden h-[12px] mt-1 flex justify-center w-full">
          <span className="block font-arial text-text-muted text-[10px] leading-[100%] opacity-0 lg:group-hover:opacity-100 transform translate-y-full lg:group-hover:translate-y-0 transition-all duration-300 text-center">
            50+ Products
          </span>
        </div>
      </div>

    </div>
  );
}
