import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CategoryNav from './CategoryNav';
import ItemGrid from './ItemGrid';
import SortButtons from './SortButtons';
import { api } from '../services/api';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorMessage = ({ message, onDismiss }) => (
  <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      {/* Simple X symbol for error icon */}
      <span className="text-red-500">✕</span>
      <p>{message}</p>
    </div>
    {onDismiss && (
      <button 
        onClick={onDismiss}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Dismiss
      </button>
    )}
  </div>
)

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentSort, setCurrentSort] = useState('artist');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          api.getCategories(),
          api.getItems()
        ]);
        setCategories(categoriesData);
        setItems(itemsData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    switch (currentSort) {
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'album':
        return a.title.localeCompare(b.title);
      case 'label':
        return a.label.localeCompare(b.label);
      default:
        return 0;
    }
  });

  // Function to handle category selection
  const handleCategorySelect = async (categoryId) => {
    try {
      setError(null); // Reset error state
      setSelectedCategory(categoryId);
      setIsLoading(true);
      
      const itemsData = categoryId
        ? await api.getItemsByCategory(categoryId)
        : await api.getItems();
        
      setItems(itemsData);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Failed to load items. Please try again.');
      // On error, reset items to empty array to prevent showing stale data
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemDeleted = async (itemId) => {
    try {
      // Update the UI after successful deletion
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Failed to delete item. Please try again.');
      // Reload items to ensure UI is in sync with server
      const itemsData = selectedCategory
        ? await api.getItemsByCategory(selectedCategory)
        : await api.getItems();
      setItems(itemsData);
    }
  };

  return (
    <div className="space-y-6">
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <SortButtons
        currentSort={currentSort}
        onSort={setCurrentSort}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage
          message={error}
          onDismiss={() => setError(null)}
        />
      ) : sortedItems.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No items found</p>
      ) : (
        <ItemGrid
          items={sortedItems}
          onItemDeleted={handleItemDeleted}
        />
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func
};

export default HomePage;
