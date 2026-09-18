export const STEPS = [
    // "login", 
    "address", "review", "payment"]

export const CHECKOUT_STEPS = [
  // { id: 0, label: "Login" },
   { id: -1, key: "auth", label: "Logged In" },   // dummy step
  { id: 0, key: "address", label: "Address" },
  { id: 1, key: "review", label: "Review" },
  { id: 2, key: "payment", label: "Payment" },
];