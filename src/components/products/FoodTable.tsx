import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown, Trash2, AlertCircle, Plus, ExternalLink } from "lucide-react";
import { fetchAllFoodItems, deleteFoodItem, updateFoodItem } from "../../services/database";
import { FoodItem } from "../../types";
import toast from "react-hot-toast";

export const FoodTable: React.FC = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const items = await fetchAllFoodItems();
        setFoods(items || []);
      } catch (error) {
        toast.error("Erreur lors du chargement des aliments");
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedFoods = React.useMemo(() => {
    if (!sortConfig) return foods;

    return [...foods].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [foods, sortConfig]);

  const filteredFoods = sortedFoods.filter(
    (food) =>
      food.name?.toLowerCase().includes(search.toLowerCase()) ||
      food.brand?.toLowerCase().includes(search.toLowerCase()) ||
      food.storageLocation?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (barcode: string | undefined) => {
    if (!barcode) {
      toast.error("Code-barres non disponible pour ce produit");
      return;
    }
    navigate(`/foods/${barcode}`);
  };

  const handleRemoveItem = async (id: number, currentQuantity: number) => {
    try {
      if (currentQuantity > 1) {
        await updateFoodItem(id, { quantity: currentQuantity - 1 });
        setFoods(foods.map(food => 
          food.id === id ? { ...food, quantity: food.quantity - 1 } : food
        ));
        toast.success("Quantité mise à jour");
      } else {
        await deleteFoodItem(id);
        setFoods(foods.filter(food => food.id !== id));
        toast.success("Produit supprimé");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mes aliments</h1>
            <button
              onClick={() => navigate('/foods/add')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un aliment
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un aliment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Nom
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("brand")}>
                  <div className="flex items-center">
                    Marque
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("expirationDate")}>
                  <div className="flex items-center">
                    Date limite
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("storageLocation")}>
                  <div className="flex items-center">
                    Emplacement
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {food.imageUrl && (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="h-8 w-8 rounded-full mr-3 object-cover"
                          />
                        )}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleViewDetails(food.barcode)}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-center"
                          >
                            {food.name}
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {food.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {new Date(food.expirationDate) < new Date() ? (
                          <span className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Expiré
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {new Date(food.expirationDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {food.storageLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {food.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(food.id as number, food.quantity)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Retirer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucun aliment trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};