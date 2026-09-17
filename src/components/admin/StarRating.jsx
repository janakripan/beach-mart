  const StarRating = ({ rating, total = 5 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(total)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-[#D6AD67] text-[#D6AD67]' : 'fill-gray-200 text-gray-200'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };
  export default StarRating
