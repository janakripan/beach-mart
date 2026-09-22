export const categories = [
  { id: 'cat-1', title: 'Fresh Fruit', image: '/assets/landing/category/fruits.png', description: 'Freshly picked seasonal fruits', isActive: true, isMain: true },
  { id: 'cat-2', title: 'Fresh Vegetables', image: '/assets/landing/category/vegetables.png', description: 'Farm fresh organic vegetables', isActive: true, isMain: true },
  { id: 'cat-3', title: 'Meat & Fish', image: '/assets/landing/category/meat&fish.png', description: 'Premium quality meats and fresh seafood', isActive: true, isMain: true },
  { id: 'cat-4', title: 'Snacks', image: '/assets/landing/category/snacks.png', description: 'Tasty snacks and munchies', isActive: true, isMain: false },
  { id: 'cat-5', title: 'Beverages', image: '/assets/landing/category/fresh-fruit.png', description: 'Refreshing drinks and beverages', isActive: true, isMain: false },
  { id: 'cat-6', title: 'Beauty & Health', image: '/assets/landing/category/beauty and health.png', description: 'Personal care and wellness products', isActive: true, isMain: false },
  { id: 'cat-7', title: 'Diabetic Food', image: '/assets/landing/category/diabetic food.png', description: 'Healthy choices for diabetic diets', isActive: true, isMain: false },
  { id: 'cat-8', title: 'Bread & Bakery', image: '/assets/landing/category/bakery.png', description: 'Freshly baked breads and pastries', isActive: true, isMain: false },
  { id: 'cat-9', title: 'Baking Needs', image: '/assets/landing/category/baking-needs.png', description: 'Ingredients and supplies for baking', isActive: true, isMain: false },
  { id: 'cat-10', title: 'Cooking', image: '/assets/landing/category/cooking.png', description: 'Spices, sauces, and cooking essentials', isActive: true, isMain: false },
  { id: 'cat-11', title: 'Dish Detergents', image: '/assets/landing/category/cleaning.png', description: 'Cleaning supplies and detergents', isActive: true, isMain: false },
  { id: 'cat-12', title: 'Cooking Oil', image: '/assets/landing/category/oil.png', description: 'Various cooking oils and ghee', isActive: true, isMain: false }
];

export const offerProducts = [
  { id: 'off-1', name: 'Green Apple', price: '8.00', image: '/assets/landing/daily offer/offer products/green-apple.png' },
  { id: 'off-2', name: 'Orange', price: '8.00', image: '/assets/landing/daily offer/offer products/orange.png' },
  { id: 'off-3', name: 'Banana', price: '7.00', image: '/assets/landing/daily offer/offer products/banana.png' },
  { id: 'off-4', name: 'Watermelon', price: '7.00', image: '/assets/landing/daily offer/offer products/watermelon.png' },
  { id: 'off-5', name: 'Strawberry', price: '7.00', image: '/assets/landing/daily offer/offer products/strawberry.png' },
  { id: 'off-6', name: 'Anar', price: '7.00', image: '/assets/landing/daily offer/offer products/pom0granete.png' },
  { id: 'off-7', name: 'Pear', price: '8.00', image: '/assets/landing/daily offer/offer products/shamam.png' },
  { id: 'off-8', name: 'Avocado', price: '8.00', image: '/assets/landing/daily offer/offer products/apricot.png' },
  { id: 'off-9', name: 'Pappaya', price: '7.00', image: '/assets/landing/daily offer/offer products/pappaya.png' },
  { id: 'off-10', name: 'Pineapple', price: '7.00', image: '/assets/landing/daily offer/offer products/pineapple.png' },
];

export const vegetableProducts = [
  { id: 'veg-1', name: 'Carrot', price: '6.99', image: '/assets/landing/products/carrot.jpg' },
  { id: 'veg-2', name: 'Orange', price: '7.99', image: '/assets/landing/products/onion.jpg' },
  { id: 'veg-3', name: 'Chinese cabbage', price: '7.00', image: '/assets/landing/products/chinese cabbage.jpg' },
  { id: 'veg-4', name: 'Eggplant', price: '14.99', image: '/assets/landing/products/eggplant.jpg' },
  { id: 'veg-5', name: 'Green Lettuce', price: '3.00', image: '/assets/landing/products/green lettuce.jpg' },
  { id: 'veg-6', name: 'Big Potatoes', price: '17.99', image: '/assets/landing/products/potatoes.jpg' },
  { id: 'veg-7', name: 'Corn', price: '4.99', image: '/assets/landing/products/corn.jpg' },
  { id: 'veg-8', name: 'Fresh Cauliflower', price: '4.99', image: '/assets/landing/products/cauliflower.jpg' },
  { id: 'veg-9', name: 'Green Capsicum', price: '4.99', image: '/assets/landing/products/green capsicum.jpg' },
  { id: 'veg-10', name: 'Green Chili', price: '28.99', image: '/assets/landing/products/green chilli.jpg' },
];

export const allProducts = [...offerProducts, ...vegetableProducts];
