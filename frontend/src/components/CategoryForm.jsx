// src/components/CategoryForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL if it exists
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // If id exists, fetch category data
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const category = await api.getCategory(id);
          setFormData({
            name: category.name,
            description: category.description
          });
        } catch (err) {
          console.error('Failed to fetch category:', err);
          setError('Failed to load category');
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.updateCategory(id, formData);
      } else {
        await api.createCategory(formData);
      }
      navigate('/');
    } catch (err) {
      console.error(`Category ${id ? 'update' : 'creation'} failed:`, err);
      setError(`Failed to ${id ? 'update' : 'create'} category`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Category' : 'Create New Category'}
      </h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {id ? 'Update Category' : 'Save Category'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
