import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export const footerSocials = [
  {
    id: "facebook",
    icon: Facebook,
    href: "https://facebook.com",
    external: true,
  },
  {
    id: "instagram",
    icon: Instagram,
    href: "https://instagram.com",
    external: true,
  },
  {
    id: "twitter",
    icon: Twitter,
    href: "https://twitter.com",
    external: true,
  },
  {
    id: "linkedin",
    icon: Linkedin,
    href: "https://linkedin.com",
    external: true,
  },
];


export const footerLinks = [
  { id:1, label: "About", href: "/about" },
  { id:2, label: "Contact", href: "/contact-us" },
  { id:3, label: "Terms and Conditions", href: "/terms-and-conditions" },
  { id:4, label: "Privacy Policy", href: "/privacy-policy" },
  { id:5, label: "Return Policy", href: "/return-policy" },
  { id:6, label: "Refund Policy", href: "#" },
];

import tabby from './assets/paymentmethods/tabby.png';
import tamara from './assets/paymentmethods/tamara.jpg';
import cod from './assets/paymentmethods/cod.jpg';

export const paymentMethods = [
  { id: 'tabby', img: tabby, alt: 'Tabby' },
  { id: 'tamara', img: tamara, alt: 'Tamara' },
  { id: 'cod', img: cod, alt: 'Cash on Delivery' },
]

export const CHECKOUT_STEPS = [
  // { id: 0, label: "Login" },
   { id: -1, key: "auth", label: "Logged In" },   // dummy step
  { id: 0, key: "address", label: "Address" },
  { id: 1, key: "review", label: "Review" },
  { id: 2, key: "payment", label: "Payment" },
];

import {
  Home,
  Store,
  ShoppingCart,
  Heart,
  User
} from "lucide-react";

export const bottomNavItems = [
  {
    label: "Home",
    icon: Home,
    path: "/"
  },
  {
    label: "Shop",
    icon: Store,
    path: "/shop"
  },
  {
    label: "Cart",
    icon: ShoppingCart,
    path: "/cart",
    badge: "cart"
  },
  {
    label: "Wishlist",
    icon: Heart,
    path: "/wishlist"
  },
  {
    label: "Account",
    icon: User,
    path: "/account"
  }
];
// thid id dummy records