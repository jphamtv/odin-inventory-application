// src/components/DeleteConfirmation.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import { X } from 'lucide-react';

const DeleteConfirmation = ({ type, id, name, onClose, onDelete }) => {
  const [error, setError] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkItems = async () => {
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
      } else {
        setIsLoading(false);
      }
    };
    checkItems();
  }, [id, type]);

  const handleDelete = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      // Verify password
      const TEMP_PASSWORD = import.meta.env.VITE_TEMP_PASSWORD;
      if (password !== TEMP_PASSWORD) {
        setError('Incorrect password');
        return;
      }

      // Proceed with deletion
      if (type === 'category') {
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
      } else {
        await api.deleteItem(id);
      }
      onDelete();
    } catch (err) {
      console.error('Delete failed:', err);
      setError(`Failed to delete ${type}. ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

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

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Enter admin password to confirm:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter password"
          />
        </div>

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
            disabled={isLoading || isVerifying}
          >
            {isVerifying ? 'Deleting...' : 'Delete'}
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
