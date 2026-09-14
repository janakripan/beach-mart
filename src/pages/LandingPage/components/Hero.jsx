import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full bg-[#5BA844] overflow-hidden flex justify-center items-center min-h-[850px] md:min-h-[662px]">
      
      {/* Background image & gradient blend */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/assets/landing/hero/hero-bg.png')"
        }}
      />
      <div 
        className="absolute inset-0 w-full h-full z-0 mix-blend-overlay opacity-60"
        style={{
          background: 'radial-gradient(65.69% 286.13% at 64.72% 70.36%, #83DF60 0%, #477934 100%)',
        }}
      />

      {/* Bottom Mask Curve (Full Width) */}
      <img 
        src="/assets/landing/hero/Mask group.png" 
        alt="Curved bottom mask" 
        className="absolute bottom-[-2px] left-0 w-full h-auto  object-cover object-top z-10 pointer-events-none"
      />

      {/* Content Container - Uses dynamic padding instead of fixed coordinates */}
      <div className="relative w-full max-w-[1440px] mx-auto px-4 lg:px-[72px] z-30 h-full pt-[80px] md:pt-[100px] lg:pt-[124px] pb-[400px] md:pb-20 lg:pb-0 lg:h-[662px] flex flex-col justify-start items-center md:items-start text-center md:text-left">
        
        {/* Left Side Content Container */}
        <div className="flex flex-col gap-[20px] md:gap-[28px] max-w-[596px] relative z-40 items-center md:items-start">
          {/* Main Heading */}
          <h1 
            className="font-marcellus text-white m-0 text-[38px] sm:text-[44px] md:text-[56px] leading-[120%] font-normal"
          >
            Fresh & Healthy<br />Organic Food
          </h1>

          {/* Description & Offer Text */}
          <div className="flex items-center justify-center md:justify-start gap-[12px] h-[67px]">
            {/* Left green bar */}
            <div className="hidden md:block w-[2px] h-[65px] bg-[#84D187] shrink-0" />
            
            {/* Text column */}
            <div className="flex flex-col gap-1 justify-center items-center md:items-start">
              {/* First Line */}
              <div className="flex items-center gap-[8px] flex-wrap">
                <span className="font-arial text-[#E5E5EA] text-[18px] md:text-[20px] font-normal leading-[150%]">
                  Sale up to
                </span>
                {/* Discount Tag */}
                <div className="bg-[#FF383C] rounded-[5px] flex items-center justify-center shrink-0 px-[12px] py-[4px]">
                  <span className="font-arial text-white whitespace-nowrap text-[18px] md:text-[20px] font-bold leading-[150%]">
                    30% OFF
                  </span>
                </div>
              </div>
              
              {/* Second Line */}
              <span className="font-arial text-[#E5E5EA] text-[14px] font-normal leading-[150%]">
                Free Delivery on all your order.
              </span>
            </div>
          </div>

          {/* Shop Now Button */}
          <button 
            className="bg-white rounded-[12px] flex items-center justify-between transition-transform hover:scale-105 active:scale-95 mt-4"
            style={{
              width: '200px',
              height: '56px',
              padding: '16px 40px',
              boxShadow: `
                10px 10px 21.21px -3.75px #0000000E, 
                5.9px 5.9px 8.35px -3px #00000031, 
                2.66px 2.66px 3.76px -2.25px #0000003B, 
                1.21px 1.21px 1.71px -1.5px #0000003F, 
                0.44px 0.44px 0.63px -0.75px #00000042, 
                inset -1px -1px 0px 0px #0000001A, 
                inset 1px 1px 1px 0px #FFFFFF
              `
            }}
          >
            <span className="font-marcellus text-[#34C759] uppercase whitespace-nowrap flex-1 text-left text-[16px] font-normal leading-[120%]">
              Shop Now
            </span>
            <ArrowRight className="text-[#34C759] shrink-0 w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Carousel Navigation Buttons - Positioned relatively to container now */}
        <button className="hidden lg:flex absolute z-40 bg-white rounded-full items-center justify-center hover:bg-gray-50 transition-colors shadow-lg w-[48px] h-[48px] top-1/2 -translate-y-1/2 left-[12px]">
          <ChevronLeft className="w-6 h-6 text-[#1A1A2E]" />
        </button>
        
        <button className="hidden lg:flex absolute z-40 bg-white rounded-full items-center justify-center hover:bg-gray-50 transition-colors shadow-lg w-[48px] h-[48px] top-1/2 -translate-y-1/2 right-[12px]">
          <ChevronRight className="w-6 h-6 text-[#1A1A2E]" />
        </button>

      </div>

      {/* Absolute positioned Cart and Leaves - Uses right-alignment to ensure they don't get crushed */}
      {/* Absolute positioned Cart and Leaves Container */}
      <div className="absolute z-20 pointer-events-none transition-all duration-300
                      bottom-0 
                      right-auto left-1/2 -translate-x-1/2 w-[340px]
                      md:left-auto md:translate-x-0 md:right-[20px] md:w-[450px]
                      lg:right-[80px] lg:w-[500px]
                      xl:right-[170px] xl:w-[583px]">
        
        {/* Cart Image */}
        <img 
          src="/assets/landing/hero/kart-image.png" 
          alt="Shopping Cart" 
          className="relative w-full h-auto drop-shadow-2xl z-20"
          style={{ transform: 'rotate(0.51deg)' }}
        />

        {/* Leaf 2 (Behind Cart) */}
        <img 
          src="/assets/common/leaf.png" 
          alt="Leaf Background" 
          className="absolute z-10"
          style={{ width: '24%', left: '23%', top: '2%', transform: 'rotate(-180deg)' }}
        />


        {/* Leaf 1 (Right blurred) - Responsive left percentage keeps it attached to cart but visible on screen */}
        <img 
          src="/assets/common/leaf.png" 
          alt="Leaf Right" 
          className="absolute z-30 transition-all duration-300
                     left-[70%] md:left-[90%] lg:left-[100%] xl:left-[112%]"
          style={{ width: '39%', top: '1%', transform: 'rotate(-98.65deg)', opacity: 0.68, filter: 'blur(10px)' }}
        />

        {/* Leaf 3 (Center blurred) */}
        <img 
          src="/assets/common/leaf.png" 
          alt="Leaf Center" 
          className="absolute z-30"
          style={{ width: '19%', left: '-1%', top: '46%', transform: 'rotate(-127.44deg)', opacity: 0.61, filter: 'blur(5px)' }}
        />

        {/* Leaf 4 (Last) */}
        <img 
          src="/assets/common/leaf.png" 
          alt="Leaf Bottom" 
          className="absolute z-10"
          style={{ width: '15%', left: '73%', top: '52%', transform: 'rotate(-180deg)' }}
        />
      </div>

    </section>
  );
}
