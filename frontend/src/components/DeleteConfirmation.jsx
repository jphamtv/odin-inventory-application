// src/components/DeleteConfirmation.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

const DeleteConfirmation = ({ type, id, name, onClose, onDelete }) => {
  const [error, setError] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkItems = async () => {
      // Only check for items if it's a category
      if (type === 'category') {
        try {
          setIsLoading(true);
          const items = await api.getItemsByCategory(id);
          setItemCount(items.length);
        } catch (err) {
          console.error('Failed to check category items:', err);
          if (err.status !== 404) {
            setError('Failed to check category items');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkItems();
  }, [id, type]);

  const handleDelete = async () => {
    try {
      if (type === 'category') {
        // Keep category-specific logic
        if (itemCount > 0) {
          let uncategorized = await api.getCategories()
            .then(cats => cats.find(c => c.name.toLowerCase() === 'uncategorized'));
          
          if (!uncategorized) {
            const response = await api.createCategory({ 
              name: 'Uncategorized', 
              description: 'Default category for uncategorized items' 
            });
            uncategorized = response.category;
          }
          await api.updateItemsCategory(id, uncategorized.id);
        }
        await api.deleteCategory(id);
      }
      onDelete();
    } catch (err) {
      console.error('Delete failed:', err);
      setError(`Failed to delete ${type}. ${err.message}`);
    }
  };

 return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Delete {type}?</h2>
        
        {type === 'category' && isLoading ? (
          <p className="mb-4">Checking category contents...</p>
        ) : (
          <>
            <p className="mb-4">
              Are you sure you want to delete &quot;{name}&quot;?
            </p>

            {type === 'category' && itemCount > 0 && (
              <p className="mb-4 text-yellow-600">
                Warning: This category contains {itemCount} items. 
                They will be moved to &quot;Uncategorized&quot;.
              </p>
            )}
          </>
        )}

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
 type: PropTypes.oneOf(['category', 'item']).isRequired,
 id: PropTypes.number.isRequired,
 name: PropTypes.string.isRequired,
 onClose: PropTypes.func.isRequired,
 onDelete: PropTypes.func.isRequired
};

export default DeleteConfirmation;
