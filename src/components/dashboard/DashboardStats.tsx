import React, { useState, useEffect } from 'react';
import { Leaf, AlertTriangle, Apple } from 'lucide-react';
import { fetchAllFoodItems } from '../../services/database';
import { getExpirySettings } from '../../services/settings';
import { FoodItem } from '../../types';

export function DashboardStats() {
  const [stats, setStats] = useState({
    freshItems: 0,
    expiringItems: 0,
    totalItems: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const items = await fetchAllFoodItems();
        const settings = await getExpirySettings();
        const now = new Date();

        const statsData = items.reduce((acc, item) => {
          const expiryDate = new Date(item.expirationDate);
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Compte le nombre total d'items
          acc.totalItems += item.quantity;

          // Vérifie si le produit est frais (basé sur la catégorie ou le type)
          const isFreshProduct = item.category === 'fresh' || item.storageLocation.toLowerCase().includes('frigo');
          const relevantSettings = isFreshProduct ? settings.freshProducts : settings.otherProducts;

          if (!relevantSettings.enabled) {
            acc.freshItems += item.quantity;
          } else if (daysUntilExpiry > relevantSettings.warningDays) {
            acc.freshItems += item.quantity;
          } else if (daysUntilExpiry > 0) {
            acc.expiringItems += item.quantity;
          }

          return acc;
        }, {
          freshItems: 0,
          expiringItems: 0,
          totalItems: 0
        });

        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
    
    // Rafraîchir les stats toutes les 5 minutes
    const interval = setInterval(loadStats, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Aliments frais</p>
            <p className="text-2xl font-semibold">{stats.freshItems}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Bientôt périmés</p>
            <p className="text-2xl font-semibold">{stats.expiringItems}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Apple className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total produits</p>
            <p className="text-2xl font-semibold">{stats.totalItems}</p>
          </div>
        </div>
      </div>
    </div>
  );
}