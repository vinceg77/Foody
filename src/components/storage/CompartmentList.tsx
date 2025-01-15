import React from 'react';
import { Grid, Plus, Edit2, Trash2 } from 'lucide-react';

interface CompartmentListProps {
  floorNumber: number;
  compartments: string[];
  newCompartmentName: string;
  setNewCompartmentName: (name: string) => void;
  onAddCompartment: (floorNumber: number) => void;
  onDeleteCompartment: (floorNumber: number, name: string) => void;
  onRenameClick: (name: string) => void;
}

export const CompartmentList: React.FC<CompartmentListProps> = ({
  floorNumber,
  compartments,
  newCompartmentName,
  setNewCompartmentName,
  onAddCompartment,
  onDeleteCompartment,
  onRenameClick,
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {compartments.map((compartment) => (
          <div
            key={compartment}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <div className="flex items-center">
              <Grid className="h-4 w-4 text-gray-400 mr-2" />
              <span>{compartment}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onRenameClick(compartment)}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteCompartment(floorNumber, compartment)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newCompartmentName}
          onChange={(e) => setNewCompartmentName(e.target.value)}
          placeholder="Nom du compartiment..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onAddCompartment(floorNumber);
            }
          }}
        />
        <button
          onClick={() => onAddCompartment(floorNumber)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};