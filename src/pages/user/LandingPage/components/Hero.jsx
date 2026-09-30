import React, { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useAppLoading } from '../../../../context/AppLoadingContext';
import { useAppStore } from '../../../../store/appStore';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Hero() {
  const { isLoading: appLoading } = useAppLoading();
  const bannerData = useAppStore((state) => state.banner);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const banners = useMemo(() => {
    if (!bannerData) return [];
    
    // In case the API returns an array, take the first element
    const data = Array.isArray(bannerData) ? bannerData[0] : bannerData;
    const items = [];
    
    // Handle standard flat format from the direct API call in App.jsx
    if (data && data.DesktopImgurl_1 !== undefined) {
      for (let i = 1; i <= 6; i++) {
        const pc = data[`DesktopImgurl_${i}`];
        const tab = data[`TabImgurl_${i}`];
        const mobile = data[`MobileImgurl_${i}`];
        
        if (pc || mobile || tab) {
          items.push({
            id: i,
            pc: pc,
            tab: tab || pc,
            mobile: mobile || pc
          });
        }
      }
      return items;
    }

    // Handle legacy nested format just in case
    for (let i = 1; i <= 6; i++) {
      const pc = data?.desktop?.[0]?.[`imgurl_${i}`];
      const tab = data?.tab?.[0]?.[`imgurl_${i}`];
      const mobile = data?.mobile?.[0]?.[`imgurl_${i}`];
      
      if (pc || mobile || tab) {
        items.push({
          id: i,
          pc: pc,
          tab: tab || pc,
          mobile: mobile || pc
        });
      }
    }
    return items;
  }, [bannerData]);

  const isLoading = appLoading || bannerData === null;

  if (isLoading || banners.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-white">
        <div className="w-full aspect-[4/3] md:aspect-[21/9] shimmer" />
      </section>
    );
  }

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
            <div className="w-full h-auto flex items-center justify-center bg-gray-50 relative aspect-[4/3] md:aspect-[21/9]">
              {!loadedImages.has(banner.id) && (
                <div className="absolute inset-0 w-full h-full shimmer z-10" />
              )}
              <picture className={`w-full h-full block ${loadedImages.has(banner.id) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                <source media="(min-width: 1024px)" srcSet={banner.pc} />
                <source media="(min-width: 768px)" srcSet={banner.tab} />
                <img 
                  src={banner.mobile} 
                  alt={`Banner ${banner.id}`} 
                  className="w-full h-full object-cover"
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(banner.id))}
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

