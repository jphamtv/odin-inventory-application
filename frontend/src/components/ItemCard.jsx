// ItemCard.jsx
import { Pencil, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ItemCard = ({ item }) => {
  const [showActions, setShowActions] = useState(false);
  const isLowStock = item.quantity < 5;

  return (
    <div
      className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Placeholder image or actual album cover */}
      <img
        src={item.imageUrl || "/api/placeholder/300/300"}
        alt={`${item.title} cover`}
        className="w-full aspect-square object-cover bg-gray-100"
      />
      
      <div className="p-4">
        <h3 className="font-medium">{item.artist}</h3>
        <p className="text-sm text-gray-600">{item.title}</p>
        <p className="text-sm text-gray-500 mt-1">{item.label}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="font-medium">${item.price}</span>
          <span className={`text-sm ${isLowStock ? 'text-red-500' : 'text-gray-500'}`}>
            {item.quantity} in stock
          </span>
        </div>
      </div>

      {/* Edit/Delete buttons - show on hover */}
      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2 bg-white/90 p-1 rounded-lg">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Pencil size={16} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ItemCard;
