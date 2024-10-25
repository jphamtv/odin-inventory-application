// src/components/ItemGrid.jsx
import PropTypes from 'prop-types';
import ItemCard from './ItemCard';

const ItemGrid = ({ items, onItemDeleted }) => {
  console.log(items);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onItemDeleted={() => onItemDeleted(item.id)}
        />
      ))}
    </div>
  );
};

ItemGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      artist: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      imgUrl: PropTypes.string,
    })
  ).isRequired,
  onItemDeleted: PropTypes.func.isRequired,
};

export default ItemGrid;
