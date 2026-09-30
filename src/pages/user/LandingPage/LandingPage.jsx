import { motion } from 'framer-motion';
import Hero from './components/Hero';
import OfferSection from './components/OfferSection';
import Categories from './components/Categories';
import DynamicCategorySection from './components/DynamicCategorySection';
import { useAppStore } from '../../../store/appStore';

export default function LandingPage() {
  const homeCategories = useAppStore(state => state.homeCategories) || [];

  return (
    <div className="min-h-[calc(100vh-118px)] bg-white">
      <Hero />
      <Categories />
      <OfferSection />
      {homeCategories.map(category => (
        <DynamicCategorySection key={category.CategoryID || category.categoryId} category={category} />
      ))}
    </div>
  );
}
