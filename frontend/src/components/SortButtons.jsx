// src/componenents/SortButtons.jsx
import PropTypes from 'prop-types';

const SortButtons = ({ onSort, currentSort }) => {
  return (
    <div className="mb-8">
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
  );
};

SortButtons.propTypes = {
  onSort: PropTypes.func.isRequired,
  currentSort: PropTypes.oneOf(['artist', 'album', 'label']).isRequired,
};

export default SortButtons;
