// src/components/SortButtons.jsx
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const SortButtons = ({ onSort, currentSort }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-medium mb-4">Sort By</h2>
        <div className="flex gap-2">
          {['Artist', 'Album', 'Label'].map((sortType) => (
            <button
              key={sortType}
              onClick={() => onSort(sortType.toLowerCase())}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentSort === sortType.toLowerCase()
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {sortType}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/items/new')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus size={20} />
        Add Item
      </button>
    </div>
  );
};

SortButtons.propTypes = {
  onSort: PropTypes.func.isRequired,
  currentSort: PropTypes.oneOf(['artist', 'album', 'label']).isRequired,
};

export default SortButtons;
