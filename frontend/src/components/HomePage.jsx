import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PropTypes from 'prop-types';
import CategoryNav from './components/CategoryNav';
import ItemGrid from './components/ItemGrid';
import SortButtons from './components/SortButtons';
import { api } from './services/api';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {message}
    </AlertDescription>
  </Alert>
);

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

  // Fetch category items when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchCategoryItems = async () => {
        try {
          setIsLoading(true);
          const categoryItems = await api.getItemsByCategory(selectedCategory);
          setItems(categoryItems);
        } catch (err) {
          console.error('Failed to load category items:', err);
          setError('Failed to load category items.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategoryItems();
    }
  }, [selectedCategory]);

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

  return (
    <div className="space-y-6">
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <SortButtons
        currentSort={currentSort}
        onSort={setCurrentSort}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : sortedItems.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No items found</p>
      ) : (
        <ItemGrid items={sortedItems} />
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
 message: PropTypes.string.isRequired
};

export default HomePage;
