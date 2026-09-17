const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:justify-between gap-6">

        {/* Left section */}
        <div className="space-y-3 w-40">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </div>

        {/* Middle section */}
        <div className="flex gap-6 flex-1 md:pl-20">
          {/* Image */}
          <div className="w-16 h-20 bg-gray-200 rounded-md shrink-0" />

          {/* Text */}
          <div className="space-y-3 flex-1">
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Right section */}
        <div className="w-40 space-y-3">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
