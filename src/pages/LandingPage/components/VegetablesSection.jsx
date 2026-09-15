import React from 'react';
import SectionHeader from './SectionHeader';
import ProductCard from './ProductCard';
import { vegetableProducts } from '../../../constants/data';

export default function VegetablesSection() {
  return (
    <section className="w-full flex justify-center bg-white py-6 lg:py-12">
      <div className="w-full max-w-[1440px] flex flex-col gap-[24px] px-4 md:px-8 lg:px-[72px]">
        
        {/* Header Container */}
        <SectionHeader title="VEGETABLES" titleColor="#1A1A1A" />

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-[16px] mt-4">
          {vegetableProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
