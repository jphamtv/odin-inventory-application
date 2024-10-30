// src/components/ItemForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { spotifyApi } from '../services/spotifyApi';
import { Search } from 'lucide-react';

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewItem = !id;

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

  // Spotify search states
  const [artistSearch, setArtistSearch] = useState('');
  const [albumResults, setAlbumResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch categories for dropdown and item data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, itemData] = await Promise.all([
          api.getCategories(),
          id ? api.getItem(id) : null
        ]);
        
        setCategories(categoryData);

        if (itemData) {
          setFormData({
            artist: itemData.artist,
            title: itemData.title,
            label: itemData.label,
            year: itemData.year,
            quantity: itemData.quantity,
            price: itemData.price,
            categoryId: itemData.categoryId,
            imgUrl: itemData.imgUrl
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load required data');
      }
    };
    fetchData();
  }, [id]);

  const handleSpotifySearch = async (e) => {
    e.preventDefault();
    if (!artistSearch.trim()) return;

    setIsSearching(true);
    setError('');
    setAlbumResults([]);
    setHasSearched(true);
    try {
      const artist = await spotifyApi.searchArtist(artistSearch);
      if (!artist) {
        setError('Artist not found');
        return;
      }

      const albums = await spotifyApi.getArtistAlbums(artist.id);
      setAlbumResults(albums);
    } catch (err) {
      setError('Error searching Spotify');
      console.error('Spotify search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAlbumSelect = async (album) => {
    try {
      const details = await spotifyApi.getAlbumDetails(album.id);
      setFormData(prev => ({
        ...prev,
        artist: details.artist,
        title: details.title,
        label: details.label || '',
        year: details.year,
        imgUrl: details.imgUrl || ''
      }));
      setAlbumResults([]); // Clear search results after selection
    } catch (err) {
      setError('Error fetching album details');
      console.error('Album details error:', err);
    }
  };

  const handleSearchInput = (e) => {
    setArtistSearch(e.target.value);
    setHasSearched(false);
  };

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
    setError(''); // Clear any existing errors
    
    try {
      const submitData = {
        artist: formData.artist,
        title: formData.title,
        label: formData.label,
        year: Number(formData.year),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        imgUrl: formData.imgUrl
      };

      if (id) {
        await api.updateItem(id, submitData);
      } else {
        await api.createItem(submitData);
      }
      navigate('/');
    } catch (err) {
      console.error(`Item ${id ? 'update' : 'creation'} failed:`, err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Item' : 'Create New Item'}
      </h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Spotify Search Section - Only shown if creating new item */}
      {isNewItem && (
        <div className="mb-8 py-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Search Spotify</h2>
          <form onSubmit={handleSpotifySearch} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={artistSearch}
                onChange={handleSearchInput}
                placeholder="Enter artist name"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
              >
                <Search size={18} />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Album Results */}
            {albumResults.length > 0 && (
              <div className="mt-4 border rounded-lg divide-y max-h-96 overflow-y-auto bg-white">
                {albumResults.map(album => (
                  <button
                    key={album.id}
                    onClick={() => handleAlbumSelect(album)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 text-left"
                  >
                    {album.imageUrl && (
                      <img 
                        src={album.imageUrl} 
                        alt={album.title}
                        className="w-16 h-16 object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{album.title}</div>
                      <div className="text-sm text-gray-600">
                        {album.artist} • {album.year}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {!isSearching && hasSearched && albumResults.length === 0 && (
              <p className="text-sm text-gray-600">
                No albums found for &quot;{artistSearch}&quot;
              </p>
            )}
          </form>
        </div>
      )}

      {/* Main Form */}
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

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {id ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
