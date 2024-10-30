import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmation from './DeleteConfirmation';
import PasswordModal from './PasswordModal';

const ItemCard = ({ item, onItemDeleted }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const isLowStock = item.quantity < 5;

  const handleEditClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    navigate(`/items/${item.id}/edit`);
  };

  const handleDeleteComplete = async () => {
    try {
      await onItemDeleted(item.id);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Delete failed:', err);
      // Error will be shown in the DeleteConfirmation modal
    }
  };

  return (
    <>
      <div
        className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <img
          src={item.imgUrl || "/api/placeholder/300/300"}
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

        {showActions && (
          <div className="absolute top-2 right-2 flex gap-2 bg-white/90 p-1 rounded-lg">
            <button 
              onClick={handleEditClick}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 hover:bg-gray-100 rounded text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        action="edit this item"
      />

      {showDeleteConfirm && (
        <DeleteConfirmation
          type="item"
          id={item.id}
          name={`${item.artist} - ${item.title}`}
          onClose={() => setShowDeleteConfirm(false)}
          onDelete={handleDeleteComplete}
        />
      )}
    </>
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
    imgUrl: PropTypes.string,
  }).isRequired,
  onItemDeleted: PropTypes.func.isRequired,
};

export default ItemCard;
