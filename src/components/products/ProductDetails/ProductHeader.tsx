import React from 'react';
import { Leaf } from 'lucide-react';

interface ProductHeaderProps {
  name: string;
  brands: string;
  code: string;
  nutriscore: string | null;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ name, brands, code, nutriscore }) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>
      <p className="text-gray-600 mb-4">{brands}</p>
      <p className="text-sm text-gray-500 mb-4">Code-barres: {code}</p>

      {nutriscore && (
        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-4">
          <Leaf className="h-4 w-4 mr-2" />
          Nutriscore {nutriscore.toUpperCase()}
        </div>
      )}
    </>
  );
};