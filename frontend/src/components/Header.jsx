// src/components/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b pb-4 mb-8">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold hover:text-gray-700 transition-colors"
        >
          Music Inventory App
        </Link>
        
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors">
            Sign up
          </button>
          <button className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
