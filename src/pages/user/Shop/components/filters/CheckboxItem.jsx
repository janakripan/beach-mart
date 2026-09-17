const CheckboxItem = ({ label, count, checked, onChange }) => (
  <label className="flex justify-between items-center cursor-pointer p-1 rounded hover:bg-gray-50">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 accent-black p-1 "
      />
      <span className="ml-3 text-sm text-gray-700">{label}</span>
    </div>
    {/* {count !== undefined && (
      <span className="text-xs text-gray-400">({count})</span>
    )} */}
  </label>
);
export default CheckboxItem