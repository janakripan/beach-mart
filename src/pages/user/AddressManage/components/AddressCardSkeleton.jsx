const AddressCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>

      {/* Lines */}
      <div className="space-y-3">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default AddressCardSkeleton;
