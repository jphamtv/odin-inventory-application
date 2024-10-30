// src/components/CategoryNav.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import PasswordModal from './PasswordModal';

const CategoryNav = ({ categories, selectedCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Sort categories alphabetically
  const sortedCategories = [...categories].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Categories</h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Manage Categories"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {sortedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          setShowPasswordModal(false);
          navigate('/categories');
        }}
        action="access category management"
      />
    </div>
  );
};

CategoryNav.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCategory: PropTypes.number,
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoryNav;
