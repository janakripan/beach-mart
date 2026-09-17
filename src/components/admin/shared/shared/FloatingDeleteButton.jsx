import { Trash2 } from "lucide-react";

const FloatingDeleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-red-600 
      cursor-pointer text-white rounded-full p-3 shadow-lg hover:bg-red-700 transition-colors"
    style={{ zIndex: 30 }}
  >
    <Trash2 size={20} />
  </button>
);

export default FloatingDeleteButton;
