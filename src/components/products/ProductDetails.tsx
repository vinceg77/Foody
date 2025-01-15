import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Scale, Leaf, Droplet, Cookie } from 'lucide-react';
import { fetchProductInfo, ProductInfo } from '../../services/openFoodFacts';
import toast from 'react-hot-toast';

export const ProductDetails: React.FC = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!barcode) {
        setError("Code-barres manquant");
        setLoading(false);
        return;
      }

      try {
        const productData = await fetchProductInfo(barcode);
        if (productData) {
          setProduct(productData);
        } else {
          setError("Produit non trouvé");
        }
      } catch (error) {
        setError("Erreur lors du chargement du produit");
        toast.error("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [barcode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">
            {error || "Produit non trouvé"}
          </h2>
          <p className="text-gray-600 mb-6">
            Nous n'avons pas pu trouver les informations pour ce produit dans la base Open Food Facts.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour à la liste
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {product.imageUrl && (
            <div className="md:w-1/3 bg-gray-50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
          )}
          
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.brands}</p>
            <p className="text-sm text-gray-500 mb-4">Code-barres: {product.code}</p>

            {product.nutriscore && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-4">
                <Leaf className="h-4 w-4 mr-2" />
                Nutriscore {product.nutriscore.toUpperCase()}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Scale className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-sm text-gray-600">Calories</div>
                <div className="font-semibold">
                  {product.nutriments['energy-kcal_100g'] ? 
                    `${Math.round(product.nutriments['energy-kcal_100g'])} kcal` : 
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Cookie className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-sm text-gray-600">Glucides</div>
                <div className="font-semibold">
                  {product.nutriments.carbohydrates_100g ? 
                    `${product.nutriments.carbohydrates_100g.toFixed(1)} g` : 
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Droplet className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <div className="text-sm text-gray-600">Protéines</div>
                <div className="font-semibold">
                  {product.nutriments.proteins_100g ? 
                    `${product.nutriments.proteins_100g.toFixed(1)} g` : 
                    'N/A'}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="h-6 w-6 mx-auto mb-2 text-purple-500">🫧</div>
                <div className="text-sm text-gray-600">Lipides</div>
                <div className="font-semibold">
                  {product.nutriments.fat_100g ? 
                    `${product.nutriments.fat_100g.toFixed(1)} g` : 
                    'N/A'}
                </div>
              </div>
            </div>

            {product.ingredients && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Ingrédients</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};