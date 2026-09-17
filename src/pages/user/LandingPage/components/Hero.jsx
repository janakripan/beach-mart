import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const banners = [
  {
    id: 1,
    pc: '/assets/landing/hero/Bannar-pc-1.png',
    mobile: '/assets/landing/hero/Bannar mobile-1.png'
  },
  {
    id: 2,
    pc: '/assets/landing/hero/Bannar-pc-2.png',
    mobile: '/assets/landing/hero/banner mobile-2.png'
  }
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
        }}
        className="w-full hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="w-full h-auto flex items-center justify-center bg-gray-50">
              <picture className="w-full h-auto block">
                <source media="(min-width: 768px)" srcSet={banner.pc} />
                <img 
                  src={banner.mobile} 
                  alt={`Banner ${banner.id}`} 
                  className="w-full h-auto object-contain"
                />
              </picture>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #D9D9D9;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #34C759;
          width: 24px;
          border-radius: 4px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 12px !important;
        }
        @media (min-width: 768px) {
          .hero-swiper .swiper-pagination {
            bottom: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
