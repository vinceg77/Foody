import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { fetchProductInfo } from '../../../services/openFoodFacts';
import { ProductInfo } from '../../../types/product';
import { ProductHeader } from './ProductHeader';
import { ProductImage } from './ProductImage';
import { NutritionalInfo } from './NutritionalInfo';
import { ProductInfo as ProductInfoComponent } from './ProductInfo';
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
          <ProductImage imageUrl={product.imageUrl} name={product.name} />
          
          <div className="p-6 md:w-2/3">
            <ProductHeader
              name={product.name}
              brands={product.brands}
              code={product.code}
              nutriscore={product.nutriscore}
            />

            <NutritionalInfo nutriments={product.nutriments} />

            {product.ingredients && (
              <div className="mt-6 border-t pt-6">
                <h2 className="text-lg font-semibold mb-2">Ingrédients</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            <ProductInfoComponent
              quantity={product.quantity}
              categories={product.categories}
              labels={product.labels}
              origins={product.origins}
            />
          </div>
        </div>
      </div>
    </div>
  );
};