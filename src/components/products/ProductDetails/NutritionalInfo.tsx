import React from 'react';
import { Scale, Cookie, Droplet } from 'lucide-react';
import { NutrimentsInfo } from '../../../services/openFoodFacts';

interface NutritionalInfoProps {
  nutriments: NutrimentsInfo;
}

export const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ nutriments }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <Scale className="h-6 w-6 mx-auto mb-2 text-blue-500" />
        <div className="text-sm text-gray-600">Calories</div>
        <div className="font-semibold">
          {nutriments['energy-kcal_100g'] ? 
            `${Math.round(nutriments['energy-kcal_100g'])} kcal` : 
            'N/A'}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <Cookie className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
        <div className="text-sm text-gray-600">Glucides</div>
        <div className="font-semibold">
          {nutriments.carbohydrates_100g ? 
            `${nutriments.carbohydrates_100g.toFixed(1)} g` : 
            'N/A'}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <Droplet className="h-6 w-6 mx-auto mb-2 text-red-500" />
        <div className="text-sm text-gray-600">Protéines</div>
        <div className="font-semibold">
          {nutriments.proteins_100g ? 
            `${nutriments.proteins_100g.toFixed(1)} g` : 
            'N/A'}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <div className="h-6 w-6 mx-auto mb-2 text-purple-500">🫧</div>
        <div className="text-sm text-gray-600">Lipides</div>
        <div className="font-semibold">
          {nutriments.fat_100g ? 
            `${nutriments.fat_100g.toFixed(1)} g` : 
            'N/A'}
        </div>
      </div>
    </div>
  );
};