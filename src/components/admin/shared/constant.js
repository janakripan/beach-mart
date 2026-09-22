export const SIDE_MENU = {
  "Main Menu": [
    {
      title: "order management ",
      path: "orders",
      icon: "flowbite:cart-outline",
    },
    {
      title: "Banner",
      path: "banner",
      icon: "lucide:circle-fading-plus",
    },
    {
      title: "categories",
      path: "categories",
      icon: "tabler:circle-square",
    },
  ],
  Products: [
    {
      title: "product list",
      path: "productlist",
      icon: "lucide:box",
    },
    {
      title: "variant list",
      path: "variants",
      icon: "lucide:layers",
    },
  ],
  Delivery: [
    {
      title: "delivery location",
      path: "delivery-location",
      icon: "lucide:map-pin",
    },
    {
      title: "delivery mode",
      path: "delivery-mode",
      icon: "lucide:truck",
    },
  ],
  Admin: [
    {
      title: "admin",
      path: "admin",
      icon: "material-symbols-light:account-circle-outline",
    },
  ],
};

export const HEADER_TITLE = [
  {
    title: "order management ",
  },
  {
    title: "Adveritsment",
  },
  {
    title: "Banner",
  },
  {
    title: "categories ",
  },
  {
    title: "Colors details",
  },
  {
    title: "variants",
  },
  {
    title: "delivery location",
  },
  {
    title: "delivery mode",
  },
  {
    title: "add product",
  },
  {
    title: "product list",
  },
  {
    title: "admin",
  },
  {
    title: "settings",
  },
];

export const BANNER_INITIAL_VALUE = {
  desktop: [
    {
      imgurl_1: "",
      imgurl_2: "",
      imgurl_3: "",
      imgurl_4: "",
      imgurl_5: "",
      imgurl_6: "",
    },
  ],
  mobile: [
    {
      imgurl_1: "",
      imgurl_2: "",
      imgurl_3: "",
      imgurl_4: "",
      imgurl_5: "",
      imgurl_6: "",
    },
  ],
  tab: [
    {
      imgurl_1: "",
      imgurl_2: "",
      imgurl_3: "",
      imgurl_4: "",
      imgurl_5: "",
      imgurl_6: "",
    },
  ],
  settings: "",
};
export const BANNER_DEV_CONFIG = {
  desktop: {
    title: "Desktop Banners",
    description: "Display ONLY on desktop and large screens",
    aspectRatio: "aspect-[16/5]", // Widescreen aspect ratio for desktop
    maxWidth: "max-w-4xl",
    recommendedWidth: 1920,
    recommendedHeight: 800,
    previewWidth: "1200px",
    displayName: "Desktop",
  },
  mobile: {
    title: "Mobile Banners",
    description: "Display ONLY on mobile devices",
    aspectRatio: "aspect-[4/5]", // Portrait aspect ratio for mobile
    maxWidth: "max-w-md",
    recommendedWidth: 800,
    recommendedHeight: 1000,
    previewWidth: "375px",
    displayName: "Mobile",
  },
  tab: {
    title: "Tablet Banners",
    description: "Display ONLY on tablet devices",
    aspectRatio: "aspect-[4/3]", // Standard tablet aspect ratio
    maxWidth: "max-w-2xl",
    recommendedWidth: 1024,
    recommendedHeight: 768,
    previewWidth: "768px",
    displayName: "Tablet",
  },
};

export const INITIAL_PRODUCT_DETAILS = {
  productName: undefined,
  description: undefined,
  categoryId: undefined,
  taxCode: "",
  images: [],
  brandID: undefined,
  price: undefined,
  stockQty: undefined,
  discountPrice: undefined,
  variants: [],
  isTrending: false,
};

export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
// Date preset options
export const DATE_PRESET = [
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom Range" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisQuarter", label: "This Quarter" },
  { value: "lastQuarter", label: "Last Quarter" },
  { value: "twoQuartersAgo", label: "2 Quarters Ago" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
];

export const DATE_OPTIONS = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "This Year",
  "Last Year",
];
