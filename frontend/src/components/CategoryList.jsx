// src/components/CategoryList.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, Pencil, Trash2, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import DeleteConfirmation from './DeleteConfirmation';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [deleteCategory, setDeleteCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleUpdate = async (category) => {
    try {
      await api.updateCategory(category.id, {
        name: editValue,
        description: category.description
      });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Failed to update category');
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteCategory(category);
  };

  const handleDeleteComplete = () => {
    setDeleteCategory(null);
    fetchCategories();
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Manage Categories</h1>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map(category => (
          <div 
            key={category.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            {editingId === category.id ? (
              // Edit Mode
              <div className="flex items-center gap-4 flex-grow">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-grow px-3 py-1 border rounded"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(category)}
                    className="p-1 text-green-600 hover:bg-gray-100 rounded"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <span className="flex-grow">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="p-1 text-red-500 hover:bg-gray-100 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCategory && (
        <DeleteConfirmation
          type="category"
          id={deleteCategory.id}
          name={deleteCategory.name}
          onClose={() => setDeleteCategory(null)}
          onDelete={handleDeleteComplete}
        />
      )}
    </div>
  );
};

export default CategoryList;
