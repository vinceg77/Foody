import React, { useState } from "react";
import { fetchProductInfo } from "../../services/openFoodFacts";
import { ProductInfo } from "../../types/product";
import { ProductImage } from "./shared/ProductImage";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

interface ProductSearchProps {
  onProductSelect?: (product: ProductInfo) => void;
  standalone?: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onProductSelect, standalone = false }) => {
  const [barcode, setBarcode] = useState<string>("");
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!barcode) {
      toast.error("Veuillez entrer un code-barres");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchProductInfo(barcode);
      if (result) {
        setProduct(result);
        if (onProductSelect) {
          onProductSelect(result);
        }
      } else {
        toast.error("Produit non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      toast.error("Erreur lors de la recherche du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Entrez un code-barres"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      {standalone && product && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start space-x-6">
            {product.imageUrl && (
              <ProductImage 
                imageUrl={product.imageUrl} 
                name={product.name}
                size="sm"
              />
            )}
            <div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-gray-500">{product.brands}</p>
              {product.nutriscore && (
                <p className="text-sm mt-2">
                  Nutriscore: <span className="font-semibold">{product.nutriscore.toUpperCase()}</span>
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-medium">
                    {product.nutriments["energy-kcal_100g"] || "N/A"} kcal/100g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Protéines</p>
                  <p className="font-medium">
                    {product.nutriments.proteins_100g || "N/A"} g/100g
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};