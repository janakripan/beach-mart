import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Categories from './components/Categories';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-118px)] bg-white">
      <Hero />
      <Categories />
    </div>
  );
}
