import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ExpirySettingsPanel } from './ExpirySettings';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <SettingsIcon className="h-6 w-6 mr-2 text-gray-600" />
          Paramètres
        </h1>
      </div>

      <div className="space-y-8">
        <ExpirySettingsPanel />
        {/* Autres sections de paramètres à venir */}
      </div>
    </div>
  );
};