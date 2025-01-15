import React, { useState, useEffect } from 'react';
import { Clock, Apple, Package } from 'lucide-react';
import { getExpirySettings, updateExpirySettings, type ExpirySettingsConfig } from '../../services/settings';
import toast from 'react-hot-toast';

export const ExpirySettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<ExpirySettingsConfig>({
    freshProducts: { warningDays: 2, enabled: true },
    otherProducts: { warningDays: 7, enabled: true }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getExpirySettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await updateExpirySettings(settings);
      toast.success('Paramètres enregistrés');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleChange = (category: 'freshProducts' | 'otherProducts', field: 'warningDays' | 'enabled', value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-gray-600" />
        Alertes de péremption
      </h2>

      <div className="space-y-8">
        {/* Produits frais */}
        <div className="border-b pb-6">
          <div className="flex items-center mb-4">
            <Apple className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-md font-medium">Produits frais</h3>
          </div>

          <div className="space-y-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.freshProducts.enabled}
                onChange={(e) => handleChange('freshProducts', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Activer les alertes</span>
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="7"
                value={settings.freshProducts.warningDays}
                onChange={(e) => handleChange('freshProducts', 'warningDays', Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                disabled={!settings.freshProducts.enabled}
              />
              <span className="text-gray-600">jours avant péremption</span>
            </div>
          </div>
        </div>

        {/* Autres produits */}
        <div>
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-md font-medium">Autres produits</h3>
          </div>

          <div className="space-y-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.otherProducts.enabled}
                onChange={(e) => handleChange('otherProducts', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Activer les alertes</span>
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="90"
                value={settings.otherProducts.warningDays}
                onChange={(e) => handleChange('otherProducts', 'warningDays', Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                disabled={!settings.otherProducts.enabled}
              />
              <span className="text-gray-600">jours avant péremption</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
};