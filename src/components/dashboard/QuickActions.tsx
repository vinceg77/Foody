import React from 'react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          onClick={() => navigate('/foods/add')}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors duration-200"
        >
          <p className="font-medium text-gray-800">Ajouter un aliment</p>
          <p className="text-sm text-gray-500">Scanner ou ajouter manuellement</p>
        </button>
        <button 
          onClick={() => navigate('/foods/search')} 
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
        >
          <p className="font-medium text-gray-800">Rechercher un aliment</p>
          <p className="text-sm text-gray-500">Basé sur Open Food Facts</p>
        </button>
        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
          <p className="font-medium text-gray-800">Voir les recettes</p>
          <p className="text-sm text-gray-500">Basées sur vos ingrédients</p>
        </button>
      </div>
    </div>
  );
};