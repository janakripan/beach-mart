import React from 'react'

const OrderCard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl p-5 shadow-lg gap-4">
        
        {/* Left Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-sm md:text-base font-medium">
            Order ID : SWA4R46RF46R356F45
          </h1>
          <h2 className="text-sm md:text-base text-gray-600">
            Delivered on 28th Dec 2025
          </h2>
          <h2 className="text-sm md:text-base text-[#939393] font-semibold">
            SHIPPED
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-2 items-start md:items-center">
          <h1 className="text-sm md:text-lg font-semibold">
            TOTAL AED 120
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Free Shipping Applied
          </p>
          <button className="bg-primary border border-primary hover:bg-[#126442]/90 text-white hover:text-white  cursor-pointer  py-2 px-4 flex justify-center rounded-xl w-full transition-colors duration-150 ease-in-out ">
              View Order Details
          </button>
        </div>

      </div>
    </div>
  )
}

export default OrderCard
