// src/components/CategoryList.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, Pencil, Trash2, X, Check, Plus } from 'lucide-react';
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
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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
    cancelAdd(); // Cancel any ongoing add operation
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

  const startAdd = () => {
    cancelEdit(); // Cancel any ongoing edit operation
    setIsAddingNew(true);
    setNewCategoryName('');
  };

  const cancelAdd = () => {
    setIsAddingNew(false);
    setNewCategoryName('');
  };

  const handleAdd = async () => {
    try {
      if (!newCategoryName.trim()) {
        setError('Category name cannot be empty');
        return;
      }

      await api.createCategory({
        name: newCategoryName,
        description: ''  
      });
      cancelAdd();
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('Failed to create category');
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Manage Categories</h1>
        </div>
        
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {/* New Category Input */}
        {isAddingNew && (
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border-2 border-blue-200">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="flex-grow px-3 py-1 border rounded"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="p-1 text-green-600 hover:bg-gray-100 rounded"
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelAdd}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Existing Categories */}
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
