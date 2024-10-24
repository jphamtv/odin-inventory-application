// src/components/ItemForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

const ItemForm = () => {
 const navigate = useNavigate();
 const { id } = useParams();
 const [error, setError] = useState('');
 const [categories, setCategories] = useState([]);
 const [formData, setFormData] = useState({
   artist: '',
   title: '',
   label: '',
   year: new Date().getFullYear(),
   quantity: 0,
   price: 0,
   categoryId: '',
   imgUrl: ''
 });

 // Fetch categories for dropdown and item data if editing
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch categories
      const categoryData = await api.getCategories();
      setCategories(categoryData);

      // If editing, fetch item data
      if (id) {
        const item = await api.getItem(id);
        setFormData({
          artist: item.artist,
          title: item.title,
          label: item.label,
          year: item.year,
          quantity: item.quantity,
          price: item.price,
          categoryId: item.categoryId || item.category_id, // Handle both camelCase and snake_case
          imgUrl: item.imgUrl || item.img_url // Handle both camelCase and snake_case
        });
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load required data');
    }
  };
  fetchData();
}, [id]);

 const handleChange = (e) => {
   const { name, value } = e.target;
   const numericFields = ['year', 'quantity', 'price'];
   const finalValue = numericFields.includes(name) ? Number(value) : value;

   setFormData(prev => ({
     ...prev,
     [name]: finalValue
   }));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Transform the data to match the API expectations
    const submitData = {
      artist: formData.artist,
      title: formData.title,
      label: formData.label,
      year: formData.year,
      quantity: formData.quantity,
      price: formData.price,
      category_id: Number(formData.categoryId), // Ensure it's a number and using snake_case
      img_url: formData.imgUrl
    };

    if (id) {
      await api.updateItem(id, submitData);
    } else {
      await api.createItem(submitData);
    }
    navigate('/');
  } catch (err) {
    console.error(`Item ${id ? 'update' : 'creation'} failed:`, err);
    setError(`Failed to ${id ? 'update' : 'create'} item`);
  }
};

 return (
   <div className="max-w-2xl mx-auto py-8">
     <h1 className="text-2xl font-bold mb-6">
       {id ? 'Edit Item' : 'Create New Item'}
     </h1>
     
     {error && <p className="text-red-500 mb-4">{error}</p>}

     <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label htmlFor="artist" className="block mb-1">Artist</label>
         <input
           type="text"
           id="artist"
           name="artist"
           value={formData.artist}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <div>
         <label htmlFor="title" className="block mb-1">Title</label>
         <input
           type="text"
           id="title"
           name="title"
           value={formData.title}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <div>
         <label htmlFor="label" className="block mb-1">Label</label>
         <input
           type="text"
           id="label"
           name="label"
           value={formData.label}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <div>
         <label htmlFor="year" className="block mb-1">Year</label>
         <input
           type="number"
           id="year"
           name="year"
           min="1900"
           max={new Date().getFullYear()}
           value={formData.year}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <div>
         <label htmlFor="quantity" className="block mb-1">Quantity</label>
         <input
           type="number"
           id="quantity"
           name="quantity"
           min="0"
           value={formData.quantity}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <div>
         <label htmlFor="price" className="block mb-1">Price</label>
         <input
           type="number"
           id="price"
           name="price"
           min="0"
           step="0.01"
           value={formData.price}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <div>
         <label htmlFor="categoryId" className="block mb-1">Category</label>
         <select
           id="categoryId"
           name="categoryId"
           value={formData.categoryId}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         >
           <option value="">Select a category</option>
           {categories.map(category => (
             <option key={category.id} value={category.id}>
               {category.name}
             </option>
           ))}
         </select>
       </div>

       <div>
         <label htmlFor="imgUrl" className="block mb-1">Image URL</label>
         <input
           type="text"
           id="imgUrl"
           name="imgUrl"
           value={formData.imgUrl}
           onChange={handleChange}
           className="w-full px-3 py-2 border rounded"
         />
       </div>

       <button 
         type="submit"
         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
       >
         {id ? 'Update Item' : 'Save Item'}
       </button>
     </form>
   </div>
 );
};

export default ItemForm;
