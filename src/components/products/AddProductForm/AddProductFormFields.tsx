import React from 'react';
import { ProductInfo } from '../../../types/product';

interface AddProductFormFieldsProps {
  selectedProduct: ProductInfo;
  quantity: number;
  setQuantity: (quantity: number) => void;
  expirationDate: string;
  setExpirationDate: (date: string) => void;
  storageLocation: string;
  setStorageLocation: (location: string) => void;
  storageOptions: Array<{ room: string; space: string }>;
}

export const AddProductFormFields: React.FC<AddProductFormFieldsProps> = ({
  selectedProduct,
  quantity,
  setQuantity,
  expirationDate,
  setExpirationDate,
  storageLocation,
  setStorageLocation,
  storageOptions
}) => {
  return (
    <div className="flex-1 space-y-4">
      <div>
        <h3 className="font-medium">{selectedProduct.name}</h3>
        <p className="text-sm text-gray-500">{selectedProduct.brands}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      <button
        type="submit"
        className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Ajouter le produit
      </button>
    </div>
  );
};