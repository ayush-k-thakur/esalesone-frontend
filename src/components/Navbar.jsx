import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to={'/'}>
          <p className="bg-yellow-400 px-3 py-1 font-bold text-lg rounded font-cursive">Sneaky</p>
          </Link>
        </div>

        {/* Center: Title */}
        <div className="hidden sm:flex flex-1 justify-center">
          <h1 className="text-xl lg:font-bold font-semibold text-gray-800">Sneakers Collection</h1>
        </div>

        {/* Right: Cart */}
        <div className="flex-shrink-0">
          <Link to="/checkout" className="text-gray-700 hover:text-gray-900 relative cursor-pointer">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
