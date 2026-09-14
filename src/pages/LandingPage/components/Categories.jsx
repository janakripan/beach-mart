import CategoryCard from './CategoryCard';
import { ArrowUpRight } from 'lucide-react';

export default function Categories() {
  const categories = [
    { title: 'Fresh Fruit', image: '/assets/landing/category/fruits.png' },
    { title: 'Fresh Vegetables', image: '/assets/landing/category/vegetables.png' },
    { title: 'Meat & Fish', image: '/assets/landing/category/meat&fish.png' },
    { title: 'Snacks', image: '/assets/landing/category/snacks.png' },
    { title: 'Beverages', image: '/assets/landing/category/fresh-fruit.png' }, 
    { title: 'Beauty & Health', image: '/assets/landing/category/beauty and health.png' },
    { title: 'Diabetic Food', image: '/assets/landing/category/diabetic food.png' },
    { title: 'Bread & Bakery', image: '/assets/landing/category/bakery.png' },
    { title: 'Baking Needs', image: '/assets/landing/category/baking-needs.png' },
    { title: 'Cooking', image: '/assets/landing/category/cooking.png' },
    { title: 'Dish Detergents', image: '/assets/landing/category/cleaning.png' },
    { title: 'Cooking Oil', image: '/assets/landing/category/oil.png' }
  ];

  return (
    <section className="relative w-full bg-white border-b border-[#F1F5F9] py-[40px] md:py-[60px] xl:py-[80px] overflow-hidden">
      
      {/* Decorative Background Leaves */}
      <div className="absolute inset-0 w-full max-w-[1440px] mx-auto pointer-events-none z-0">
        {/* Left Leaf (Blurred) */}
        <img 
          src="/assets/common/leaf.png" 
          alt="" 
          className="absolute z-0 pointer-events-none"
          style={{ 
            width: '113.5px', 
            top: '150px', 
            left: '-40px', 
            transform: 'rotate(-127.44deg)', 
            opacity: 0.61, 
            filter: 'blur(4px)' 
          }}
        />

        {/* Right Leaf (Sharp) */}
        <img 
          src="/assets/common/leaf.png" 
          alt="" 
          className="absolute z-0 pointer-events-none"
          style={{ 
            width: '160px', 
            top: '350px', 
            right: '-80px', 
            transform: 'rotate(180deg)'
          }}
        />

        {/* Bottom Leaf (Blurred) */}
        <img 
          src="/assets/common/leaf.png" 
          alt="" 
          className="absolute z-0 pointer-events-none"
          style={{ 
            width: '120px', 
            bottom: '0px', 
            right: '350px', 
            transform: 'rotate(25deg)', 
            opacity: 0.61, 
            filter: 'blur(5px)' 
          }}
        />

      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[72px] xl:px-[160px] z-10">
        
        {/* Header Title with Dashes */}
        <div className="flex items-center justify-center gap-[12px] md:gap-[24px] mb-[40px]">
          <div className="flex-1 max-w-[247.5px] h-[1px] border-t border-dashed border-[#34C759]" style={{ borderDasharray: '4,4' }} />
          <h2 className="font-marcellus text-[#1A1A1A] text-[24px] md:text-[32px] font-normal leading-[120%] m-0 whitespace-nowrap uppercase">
            Popular Categories
          </h2>
          <div className="flex-1 max-w-[247.5px] h-[1px] border-t border-dashed border-[#34C759]" style={{ borderDasharray: '4,4' }} />
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-[24px] max-w-[1120px] mx-auto">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              title={category.title} 
              image={category.image} 
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-end w-full max-w-[1120px] mx-auto mt-8">
          <button className="flex items-center gap-1 text-[#34C759] hover:text-[#28a745] font-arial font-bold text-[16px] transition-colors group">
            View All 
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
