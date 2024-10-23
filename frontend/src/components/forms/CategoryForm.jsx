// src/components/forms/CategoryForm.jsx
import { useState } from "react";
import PropTypes from 'prop-types';

const CategoryForm = ({ initialData, onSubmit, isLoading }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData.description || ''
  });

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must be less than 200 characters';
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, numbers, and spaces';
    }

    // Description validation (optional field)
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must not exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        // Handle submission error
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Show general submission error if exists */}
      {errors.submit && (
        <div className="text-red-500 text-sm">{errors.submit}</div>
      )}
      
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 
            ${errors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows="3"
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-1 
            ${errors.description 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded-lg transition-colors
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLoading ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

CategoryForm.defaultProps = {
  initialData: null,
  isLoading: false
};

export default CategoryForm;
