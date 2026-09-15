import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { allProducts } from '../../constants/data';
import { useShop } from '../../context/ShopContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { addToCart } = useShop();

  // Filter products based on query
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = allProducts.filter((product) => 
      product.name.toLowerCase().includes(lowercaseQuery)
    );
    setResults(filtered);
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[400px]" ref={dropdownRef}>
      <div 
        className="flex items-center w-full h-[46px] bg-[#F8FCF8] rounded-[12px] border border-[#0F1E361A] focus-within:border-primary transition-colors"
        style={{ boxShadow: 'inset 0px 2px 4px 1px #00000005' }}
      >
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for groceries..." 
          className="flex-1 h-full pl-4 pr-2 bg-transparent outline-none text-[#1A1A2E] text-[16px] placeholder:text-[#757575] font-arial"
        />
        <button 
          className="h-[44px] w-[68px] bg-[#406547] flex items-center justify-center hover:bg-[#2D4535] transition-colors rounded-r-[12px] shrink-0"
        >
          <Search className="w-4 h-4 text-[#57E77B]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Search Dropdown Results */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute top-[52px] left-0 w-full bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border-light max-h-[300px] overflow-y-auto z-[100]">
          {results.length > 0 ? (
            <div className="flex flex-col p-2">
              {results.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-3 p-2 hover:bg-bg-light rounded-[8px] cursor-pointer transition-colors"
                >
                  <div className="w-[40px] h-[40px] bg-bg-light rounded-[6px] p-1 flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-[14px] text-text-main font-medium truncate">{product.name}</p>
                    <p className="font-poppins text-[13px] text-primary font-semibold">₾{product.price}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-primary hover:text-white transition-colors flex-shrink-0"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="font-poppins text-text-muted text-[14px]">No products found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
