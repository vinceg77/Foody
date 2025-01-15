import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductSearch } from './ProductSearch';
import { ProductImage } from './shared/ProductImage';
import { addFoodItem } from '../../services/database';
import { ProductInfo } from '../../types/product';
import { ArrowLeft } from 'lucide-react';
import { fetchAllRooms, fetchStorageSpaces } from '../../services/storageDatabase';

interface StorageOption {
  room: string;
  space: string;
}

export const AddProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
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
        toast.error('Erreur lors du chargement des emplacements');
      }
    };

    loadStorageLocations();
  }, []);

  const handleProductSelect = (product: ProductInfo) => {
    setSelectedProduct(product);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !storageLocation) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      await addFoodItem({
        name: selectedProduct.name,
        brand: selectedProduct.brands,
        barcode: selectedProduct.code,
        quantity,
        expirationDate,
        storageLocation,
        imageUrl: selectedProduct.imageUrl,
        nutritionalInfo: {
          calories: selectedProduct.nutriments['energy-kcal_100g'] || 0,
          protein: selectedProduct.nutriments.proteins_100g || 0,
          carbs: selectedProduct.nutriments.carbohydrates_100g || 0,
          fat: selectedProduct.nutriments.fat_100g || 0
        }
      });

      toast.success('Produit ajouté avec succès !');
      navigate('/foods');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Ajouter un produit</h2>
        
        <ProductSearch onProductSelect={handleProductSelect} />

        {selectedProduct && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex items-start space-x-6">
              {selectedProduct.imageUrl && (
                <ProductImage 
                  imageUrl={selectedProduct.imageUrl} 
                  name={selectedProduct.name}
                  size="sm"
                />
              )}
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
            </div>
          </form>
        )}
      </div>
    </div>
  );
};