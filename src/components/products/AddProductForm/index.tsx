import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductSearch } from '../ProductSearch';
import { ProductImage } from '../shared/ProductImage';
import { AddProductFormFields } from './AddProductFormFields';
import { addFoodItem } from '../../../services/database';
import { ProductInfo } from '../../../types/product';
import { ArrowLeft } from 'lucide-react';
import { fetchAllRooms, fetchStorageSpaces } from '../../../services/storageDatabase';

interface StorageOption {
  room: string;
  space: string;
}

const AddProductForm: React.FC = () => {
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
              <AddProductFormFields
                selectedProduct={selectedProduct}
                quantity={quantity}
                setQuantity={setQuantity}
                expirationDate={expirationDate}
                setExpirationDate={setExpirationDate}
                storageLocation={storageLocation}
                setStorageLocation={setStorageLocation}
                storageOptions={storageOptions}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export { AddProductForm };