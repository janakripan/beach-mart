import { NavLink } from "react-router-dom";
import { bottomNavItems } from "../constants";
import { useCartStore } from "../pages/Cart/store/CartStore";



const MobileBottomNav = () => {
  const cartCount = useCartStore(
    (s) => s.items.reduce((sum, i) => sum + i.qty, 0)
  );


  return (
     <nav 
      className={`
        fixed bottom-0 left-0 right-0  z-50 md:hidden 
        transition-transform duration-300 
        
      `}
    >
      <div className="bg-white   safe-bottom">
        <ul className="flex justify-around items-center h-16">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center text-xs
                   ${isActive ? "text-black" : "text-gray-400"}`
                }
              >
                <div className="relative">
                  <Icon size={22} />
                  {item.badge === "cart" && cartCount > 0 && (
                    <span
                      className="
                        absolute -top-2 -right-2
                        bg-red-600 text-white
                        text-[10px]
                        w-5 h-5
                        flex items-center justify-center
                        rounded-full
                      "
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
                <span className="mt-1">{item.label}</span>
              </NavLink>
            );
          })}
        </ul>
      </div>   
    </nav>
  );
};

export default MobileBottomNav;
