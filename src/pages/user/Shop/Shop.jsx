import React, { useEffect, useState } from 'react'
import TopSection from './components/TopSection'
import FiltersSection from './components/FiltersSection'
import ProductList from './components/ProductList'
import MobileFilter from './components/MobileFilter'
import { useSearchParams } from 'react-router-dom'
import { filtersToSearchParams } from '../../../utils/filtersToSearchParams'
import { searchParamsToFilters } from '../../../utils/searchParamsToFilters'
// import { useGetFilters } from '../../../api/user/hooks/useProduct'
import { useAppStore } from '../../../store/appStore';

const Shop = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  
  const rawCategories = useAppStore(state => state.categories);
  
  const filterData = {
    _category: (rawCategories || []).filter(c => c.IsActive).map(c => ({ CategoryId: c.CategoryID, CategoryName: c.CategoryName })),
    _brand: []
  };

  const [filters, setFilters] = useState(() =>
    searchParamsToFilters(searchParams)
  );

  // Sync filters state when URL parameters change (e.g. clicking categories in navbar)
  useEffect(() => {
    setFilters(searchParamsToFilters(searchParams));
  }, [searchParams]);


  const updateFilters = (updater) => {
  setFilters((prev) => {
    const next =
      typeof updater === "function" ? updater(prev) : updater;
      
    const params = filtersToSearchParams(next);
    setSearchParams(params);
    return next;
  });
};

  return (
    <div className='bg-white font-arial pb-24 lg:pb-0'>
       <div className='hidden lg:block sticky top-[118px] z-40 bg-white pb-3 shadow-sm'>
        <TopSection
          filters={filters}
          filterData={filterData}
          setFilters={updateFilters}
        />
        </div> 
       <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto pb-20 lg:pb-0'>
            <div className='hidden lg:flex lg:col-span-1 sticky top-[248px] h-[calc(100vh-248px)]'>
                <FiltersSection filters={filters} setFilters={updateFilters} />
            </div>
            <div className='flex lg:hidden w-full h-fit'>
                <MobileFilter filters={filters} setFilters={updateFilters} />
            </div>
            <div className='col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4'>
                <ProductList filters={filters} />
            </div>
       </div>
    </div>
  )
}

export default Shop