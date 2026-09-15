import { motion } from 'framer-motion';
import Hero from './components/Hero';
import OfferSection from './components/OfferSection';
import Categories from './components/Categories';
import VegetablesSection from './components/VegetablesSection';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-118px)] bg-white">
      <Hero />
      <Categories />
      <OfferSection />
      <VegetablesSection />
    </div>
  );
}
