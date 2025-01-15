import React, { useState, useEffect } from 'react';
import { Dialog } from '../../ui/Dialog';
import { fetchAllRooms, fetchStorageSpaces } from '../../../services/storageDatabase';
import { FoodItem } from '../../../types';

interface EditFoodDialogProps {
  food: FoodItem;
  onClose: () => void;
  onSave: (updatedFood: FoodItem) => void;
}

interface StorageOption {
  room: string;
  space: string;
}

export const EditFoodDialog: React.FC<EditFoodDialogProps> = ({ food, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(food.quantity);
  const [expirationDate, setExpirationDate] = useState(food.expirationDate);
  const [storageLocation, setStorageLocation] = useState(food.storageLocation);
  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);

  useEffect(() => {
    const loadStorageLocations = async () => {
      try {
        const rooms = await fetchAllRooms();
        const options: StorageOption[] = [];
        
        for (const room of rooms) {
          const spaces = await fetchStorageSpaces(room);
          spaces.forEach(space => {
            options.push({
              room,
              space: space.name
            });
          });
        }
        
        setStorageOptions(options);
      } catch (error) {
        console.error('Erreur lors du chargement des emplacements:', error);
      }
    };

    loadStorageLocations();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...food,
      quantity,
      expirationDate,
      storageLocation
    });
  };

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const response = await fetchFoods();
        const foodsWithConsumed = response.map(food => ({
          ...food,
          consumed: food.consumed ?? false, // Définit à false si undefined
        }));
        setFoods(foodsWithConsumed);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title={`Modifier ${food.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'expiration
          </label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emplacement
          </label>
          <select
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner...</option>
            {storageOptions.map((option, index) => (
              <option key={index} value={`${option.room} - ${option.space}`}>
                {option.room} - {option.space}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Dialog>
  );
};