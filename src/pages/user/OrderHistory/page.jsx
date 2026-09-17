import React from "react";
import OrderCard from "./components/OrderCard";
import SearchBar from "./components/Searchbar";
import TransitCart from "./components/TransitCard";

const OrderHistory = () => {
  return (
    <div className="font-arial  max-w-7xl mx-auto p-5 md:p-10 xl:p-20 ">
      <div
        
      >
        <div className=" flex flex-col gap-6">
          
          {/* Header + Search */}
          <div className="flex flex-col gap-3 font-arial">
            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)]    ">
              Order History
            </h1>
            {/* <SearchBar /> */}
            <p className="text-gray-600 uppercase">History of your curated purchases</p>
          </div>

          <div>
            <TransitCart/>
          </div>

          {/* Order Cards */}
          {/* <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <OrderCard key={index} />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
