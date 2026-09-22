export const DUMMY_ORDERS = [
  {
    orderNo: "ORD-9821-456",
    customerName: "Ahmed Al-Farsi",
    mobileNo: "+971 50 123 4567",
    address: "Villa 14, Jumeirah 3, Dubai, UAE",
    totalAmount: 345.50,
    status: "delivered",
    paymentMethod: "Credit Card",
    orderDate: "2026-09-20T14:30:00Z",
    products: [
      {
        productName: "Fresh Organic Milk",
        variant: "2 Liters",
        price: 15.00,
        count: 2,
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150"
      },
      {
        productName: "Whole Wheat Bread",
        variant: "Sliced",
        price: 8.50,
        count: 3,
        imageUrl: null
      },
      {
        productName: "Premium Olive Oil",
        variant: "500ml Extra Virgin",
        price: 45.00,
        count: 1,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150"
      }
    ]
  },
  {
    orderNo: "ORD-9822-789",
    customerName: "Sarah Connor",
    mobileNo: "+971 55 987 6543",
    address: "Apartment 402, Marina Heights, Dubai Marina, UAE",
    totalAmount: 120.00,
    status: "pending",
    paymentMethod: "Cash on Delivery",
    orderDate: "2026-09-21T09:15:00Z",
    products: [
      {
        productName: "Avocado",
        variant: "Hass (Pack of 3)",
        price: 25.00,
        count: 2,
        imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=150"
      },
      {
        productName: "Almond Butter",
        variant: null,
        price: 35.00,
        count: 2,
        imageUrl: null
      }
    ]
  },
  {
    orderNo: "ORD-9823-112",
    customerName: "Mohammad Tariq",
    mobileNo: "+971 52 444 8888",
    address: "House 22, Al Barsha 1, Dubai, UAE",
    totalAmount: 85.75,
    status: "pending",
    paymentMethod: "Apple Pay",
    orderDate: "2026-09-22T08:45:00Z",
    products: [
      {
        productName: "Orange Juice",
        variant: "1 Liter Freshly Squeezed",
        price: 12.50,
        count: 3,
        imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150"
      },
      {
        productName: "Greek Yogurt",
        variant: "Plain 500g",
        price: 16.00,
        count: 3,
        imageUrl: null
      }
    ]
  },
  {
    orderNo: "ORD-9824-334",
    customerName: "Emma Watson",
    mobileNo: "+971 58 222 3333",
    address: "Villa 5, Springs 4, Dubai, UAE",
    totalAmount: 510.25,
    status: "cancelled",
    paymentMethod: "Credit Card",
    orderDate: "2026-09-18T18:20:00Z",
    products: [
      {
        productName: "Wagyu Beef Ribeye",
        variant: "300g",
        price: 180.00,
        count: 2,
        imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=150"
      },
      {
        productName: "Truffle Mushroom Sauce",
        variant: null,
        price: 75.00,
        count: 2,
        imageUrl: null
      }
    ]
  }
];
