import React from 'react';
import { Tag } from 'lucide-react';

interface ProductInfoProps {
  quantity: string;
  categories: string;
  labels: string;
  origins: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  quantity,
  categories,
  labels,
  origins
}) => {
  return (
    <div className="mt-6 space-y-4 border-t pt-6">
      <h2 className="text-lg font-semibold mb-4">Informations complémentaires</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quantity && (
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Quantité</p>
              <p className="text-gray-800">{quantity}</p>
            </div>
          </div>
        )}
        
        {categories && (
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Catégories</p>
              <p className="text-gray-800">{categories}</p>
            </div>
          </div>
        )}
        
        {labels && (
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Labels</p>
              <p className="text-gray-800">{labels}</p>
            </div>
          </div>
        )}
        
        {origins && (
          <div className="flex items-start">
            <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-600">Origine</p>
              <p className="text-gray-800">{origins}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};