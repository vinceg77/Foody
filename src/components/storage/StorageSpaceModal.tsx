import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Grid, Save } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { RenameDialog } from '../ui/RenameDialog';
import { CompartmentList } from './CompartmentList';
import toast from 'react-hot-toast';
import { 
  addCompartment, 
  deleteCompartment, 
  renameCompartment,
  updateStorageSpace,
  deleteFloor
} from '../../services/storageDatabase';

interface StorageSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageSpace: {
    name: string;
    hasFloors: boolean;
    hasCompartments: boolean;
    floors: { [key: number]: string[] };
  };
  roomName: string;
}

export const StorageSpaceModal: React.FC<StorageSpaceModalProps> = ({
  isOpen,
  onClose,
  storageSpace,
  roomName
}) => {
  const [floors, setFloors] = useState<number[]>([]);
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);
  const [newCompartmentName, setNewCompartmentName] = useState('');
  const [compartments, setCompartments] = useState<{ [key: number]: string[] }>(storageSpace.floors || {});
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedCompartment, setSelectedCompartment] = useState<{ floor: number; name: string } | null>(null);

  useEffect(() => {
    if (storageSpace.hasFloors) {
      const floorNumbers = Object.keys(storageSpace.floors || {}).map(Number);
      setFloors(floorNumbers.length > 0 ? floorNumbers : [1]);
      setCompartments(storageSpace.floors || { 1: [] });
    } else if (storageSpace.hasCompartments) {
      // Pour les espaces sans étages, utiliser un "étage" virtuel 0
      setFloors([0]);
      setCompartments({ 0: storageSpace.floors[0] || [] });
      setExpandedFloor(0); // Toujours développé pour les espaces sans étages
    }
  }, [storageSpace]);

  const handleAddFloor = async () => {
    if (!storageSpace.hasFloors) return;
    
    const newFloorNumber = Math.max(...floors, 0) + 1;
    const updatedFloors = [...floors, newFloorNumber];
    setFloors(updatedFloors);
    
    const updatedCompartments = { ...compartments, [newFloorNumber]: [] };
    setCompartments(updatedCompartments);
    
    try {
      await updateStorageSpace(roomName, storageSpace.name, {
        ...storageSpace,
        floors: updatedCompartments
      });
      toast.success(`Étage ${newFloorNumber} ajouté`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'étage:', error);
      toast.error('Erreur lors de l\'ajout de l\'étage');
    }
  };

  const handleDeleteFloor = async (floorNumber: number) => {
    if (!storageSpace.hasFloors || floorNumber === 0) return;
    
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'étage ${floorNumber} ?`)) {
      return;
    }

    try {
      await deleteFloor(roomName, storageSpace.name, floorNumber);
      const { [floorNumber]: removed, ...remainingCompartments } = compartments;
      setCompartments(remainingCompartments);
      setFloors(floors.filter(f => f !== floorNumber));
      toast.success(`Étage ${floorNumber} supprimé`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étage:', error);
      toast.error('Erreur lors de la suppression de l\'étage');
    }
  };

  const handleAddCompartment = async (floorNumber: number) => {
    if (!newCompartmentName.trim()) return;

    try {
      await addCompartment(roomName, storageSpace.name, floorNumber, newCompartmentName);
      const updatedCompartments = {
        ...compartments,
        [floorNumber]: [...(compartments[floorNumber] || []), newCompartmentName]
      };
      setCompartments(updatedCompartments);
      setNewCompartmentName('');
      toast.success('Compartiment ajouté');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du compartiment:', error);
      toast.error('Erreur lors de l\'ajout du compartiment');
    }
  };

  const handleDeleteCompartment = async (floorNumber: number, compartmentName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le compartiment "${compartmentName}" ?`)) {
      return;
    }

    try {
      await deleteCompartment(roomName, storageSpace.name, floorNumber, compartmentName);
      setCompartments({
        ...compartments,
        [floorNumber]: compartments[floorNumber].filter(name => name !== compartmentName)
      });
      toast.success('Compartiment supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du compartiment:', error);
      toast.error('Erreur lors de la suppression du compartiment');
    }
  };

  const handleRenameCompartment = async (newName: string) => {
    if (!selectedCompartment || !newName.trim()) return;

    try {
      await renameCompartment(
        roomName,
        storageSpace.name,
        selectedCompartment.floor,
        selectedCompartment.name,
        newName
      );
      setCompartments({
        ...compartments,
        [selectedCompartment.floor]: compartments[selectedCompartment.floor].map(name =>
          name === selectedCompartment.name ? newName : name
        )
      });
      setIsRenameDialogOpen(false);
      setSelectedCompartment(null);
      toast.success('Compartiment renommé');
    } catch (error) {
      console.error('Erreur lors du renommage du compartiment:', error);
      toast.error('Erreur lors du renommage du compartiment');
    }
  };

  const handleSave = async () => {
    try {
      await updateStorageSpace(roomName, storageSpace.name, {
        ...storageSpace,
        floors: compartments
      });
      toast.success('Modifications enregistrées');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title={`Gestion de ${storageSpace.name}`}
        size="lg"
      >
        <div className="space-y-6">
          {storageSpace.hasFloors ? (
            // Affichage avec étages
            <div className="space-y-4">
              {floors.map((floorNumber) => (
                <div key={floorNumber} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setExpandedFloor(expandedFloor === floorNumber ? null : floorNumber)}
                    >
                      <h3 className="text-lg font-medium">Étage {floorNumber}</h3>
                      {expandedFloor === floorNumber ? (
                        <ChevronUp className="h-5 w-5 ml-2" />
                      ) : (
                        <ChevronDown className="h-5 w-5 ml-2" />
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteFloor(floorNumber)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {expandedFloor === floorNumber && storageSpace.hasCompartments && (
                    <CompartmentList
                      floorNumber={floorNumber}
                      compartments={compartments[floorNumber] || []}
                      newCompartmentName={newCompartmentName}
                      setNewCompartmentName={setNewCompartmentName}
                      onAddCompartment={handleAddCompartment}
                      onDeleteCompartment={handleDeleteCompartment}
                      onRenameClick={(name) => {
                        setSelectedCompartment({ floor: floorNumber, name });
                        setIsRenameDialogOpen(true);
                      }}
                    />
                  )}
                </div>
              ))}

              <div className="flex space-x-4">
                <button
                  onClick={handleAddFloor}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter un étage
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          ) : storageSpace.hasCompartments && (
            // Affichage sans étages
            <div className="space-y-4">
              <CompartmentList
                floorNumber={0}
                compartments={compartments[0] || []}
                newCompartmentName={newCompartmentName}
                setNewCompartmentName={setNewCompartmentName}
                onAddCompartment={handleAddCompartment}
                onDeleteCompartment={handleDeleteCompartment}
                onRenameClick={(name) => {
                  setSelectedCompartment({ floor: 0, name });
                  setIsRenameDialogOpen(true);
                }}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      <RenameDialog
        isOpen={isRenameDialogOpen}
        onClose={() => {
          setIsRenameDialogOpen(false);
          setSelectedCompartment(null);
        }}
        onRename={handleRenameCompartment}
        currentName={selectedCompartment?.name || ''}
        title="Renommer le compartiment"
      />
    </>
  );
};