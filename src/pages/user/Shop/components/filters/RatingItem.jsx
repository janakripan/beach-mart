import { Star } from "lucide-react";

const RatingItem = ({ rating, count, checked, onChange }) => (
  <label className="flex justify-between items-center cursor-pointer p-1  rounded hover:bg-gray-50">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded accent-black border-gray-300"
      />
      <div className="ml-3 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'fill-[#D6AD67]' : 'fill-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        ))}
        {/* <span className="ml-2 text-sm">& Up</span> */}
      </div>
    </div>
   
  </label>
);

export default RatingItem;