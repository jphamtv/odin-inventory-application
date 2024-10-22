// src/components/categories/CategoryList.jsx
import { useCategories } from '../../hooks/useCategories';

function CategoryList() {
  const { categories, loading, error } = useCategories();

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-4 p-4">
      {categories.map(category => (
        <div key={category.id} className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">{category.name}</h2>
          <p className="text-gray-600">{category.description}</p>
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
