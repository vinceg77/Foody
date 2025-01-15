import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ChevronRight, Box, Home, Layers } from "lucide-react";
import { StorageSpaceModal } from './StorageSpaceModal';
import { RenameDialog } from '../ui/RenameDialog';
import toast from 'react-hot-toast';
import {
  fetchAllRooms,
  addRoom,
  deleteRoom,
  renameRoom,
  fetchStorageSpaces,
  addStorageSpace,
  deleteStorageSpace,
  renameStorageSpace,
} from "../../services/storageDatabase";

export const StorageManagement: React.FC = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [storageSpaces, setStorageSpaces] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newStorageName, setNewStorageName] = useState("");
  const [useFloors, setUseFloors] = useState(false);
  const [useCompartments, setUseCompartments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStorage, setActiveStorage] = useState<any>(null);
  const [isRenameRoomDialogOpen, setIsRenameRoomDialogOpen] = useState(false);
  const [isRenameStorageDialogOpen, setIsRenameStorageDialogOpen] = useState(false);
  const [selectedItemToRename, setSelectedItemToRename] = useState<{ name: string; type: 'room' | 'storage' } | null>(null);

  const loadData = async () => {
    try {
      const rooms = await fetchAllRooms();
      setRooms(rooms || []);

      if (selectedRoom) {
        const spaces = await fetchStorageSpaces(selectedRoom);
        setStorageSpaces(spaces || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedRoom]);

  const handleAddRoom = async () => {
    if (newRoomName.trim()) {
      try {
        await addRoom(newRoomName);
        await loadData();
        setNewRoomName("");
        toast.success('Pièce ajoutée');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la pièce:', error);
        toast.error('Erreur lors de l\'ajout de la pièce');
      }
    }
  };

  const handleDeleteRoom = async (room: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la pièce "${room}" ?`)) {
      try {
        await deleteRoom(room);
        await loadData();
        if (selectedRoom === room) {
          setSelectedRoom(null);
        }
        toast.success('Pièce supprimée');
      } catch (error) {
        console.error('Erreur lors de la suppression de la pièce:', error);
        toast.error('Erreur lors de la suppression de la pièce');
      }
    }
  };

  const handleAddStorageSpace = async () => {
    if (selectedRoom && newStorageName.trim()) {
      try {
        const newSpace = {
          name: newStorageName,
          hasFloors: useFloors,
          hasCompartments: useCompartments,
          floors: useFloors ? { 1: [] } : {},
        };
        
        await addStorageSpace(selectedRoom, newSpace);
        await loadData();
        setNewStorageName("");
        setUseFloors(false);
        setUseCompartments(false);
        toast.success('Espace de rangement ajouté');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'espace de rangement:', error);
        toast.error('Erreur lors de l\'ajout de l\'espace de rangement');
      }
    }
  };

  const handleRenameRoom = async (newName: string) => {
    if (selectedItemToRename && newName && newName !== selectedItemToRename.name) {
      try {
        await renameRoom(selectedItemToRename.name, newName);
        if (selectedRoom === selectedItemToRename.name) {
          setSelectedRoom(newName);
        }
        await loadData();
        toast.success('Pièce renommée');
      } catch (error) {
        console.error('Erreur lors du renommage de la pièce:', error);
        toast.error('Erreur lors du renommage de la pièce');
      }
    }
    setIsRenameRoomDialogOpen(false);
    setSelectedItemToRename(null);
  };

  const handleRenameStorageSpace = async (newName: string) => {
    if (selectedRoom && selectedItemToRename && newName && newName !== selectedItemToRename.name) {
      try {
        await renameStorageSpace(selectedRoom, selectedItemToRename.name, newName);
        await loadData();
        toast.success('Espace de rangement renommé');
      } catch (error) {
        console.error('Erreur lors du renommage de l\'espace de rangement:', error);
        toast.error('Erreur lors du renommage de l\'espace de rangement');
      }
    }
    setIsRenameStorageDialogOpen(false);
    setSelectedItemToRename(null);
  };

  const handleDeleteStorageSpace = async (spaceName: string) => {
    if (selectedRoom && window.confirm(`Êtes-vous sûr de vouloir supprimer l'espace "${spaceName}" ?`)) {
      try {
        await deleteStorageSpace(selectedRoom, spaceName);
        await loadData();
        toast.success('Espace de rangement supprimé');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'espace de rangement:', error);
        toast.error('Erreur lors de la suppression de l\'espace de rangement');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <Box className="mr-2 h-6 w-6 text-green-600" />
          Gestion des Espaces de Stockage
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Liste des pièces */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Home className="mr-2 h-5 w-5 text-gray-600" />
              Pièces
            </h2>

            <div className="space-y-2 mb-4">
              {rooms.map((room) => (
                <div
                  key={room}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedRoom === room
                      ? "bg-green-100 text-green-700"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="flex items-center flex-grow"
                  >
                    <span className="font-medium">{room}</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </button>
                  <div className="flex items-center ml-2">
                    <button
                      onClick={() => {
                        setSelectedItemToRename({ name: room, type: 'room' });
                        setIsRenameRoomDialogOpen(true);
                      }}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room)}
                      className="p-1 text-gray-500 hover:text-red-600 ml-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center mt-4">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Nouvelle pièce..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Espaces de rangement */}
          {selectedRoom && (
            <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Layers className="mr-2 h-5 w-5 text-gray-600" />
                Espaces de rangement - {selectedRoom}
              </h2>

              <div className="grid gap-4 mb-6">
                {storageSpaces.map((space) => (
                  <div
                    key={space.name}
                    className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{space.name}</h3>
                      <p className="text-sm text-gray-500">
                        {space.hasFloors ? "Avec étages" : "Sans étages"} •{" "}
                        {space.hasCompartments ? "Avec compartiments" : "Sans compartiments"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(space.hasFloors || space.hasCompartments) && (
                        <button
                          onClick={() => {
                            setActiveStorage(space);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        >
                          Gérer
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedItemToRename({ name: space.name, type: 'storage' });
                          setIsRenameStorageDialogOpen(true);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStorageSpace(space.name)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-800 mb-3">Ajouter un espace de rangement</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newStorageName}
                    onChange={(e) => setNewStorageName(e.target.value)}
                    placeholder="Nom de l'espace..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={useFloors}
                        onChange={(e) => setUseFloors(e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Avec étages</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={useCompartments}
                        onChange={(e) => setUseCompartments(e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Avec compartiments</span>
                    </label>
                  </div>
                  <button
                    onClick={handleAddStorageSpace}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de gestion des étages/compartiments */}
      {isModalOpen && activeStorage && (
        <StorageSpaceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveStorage(null);
            loadData();
          }}
          storageSpace={activeStorage}
          roomName={selectedRoom || ''}
        />
      )}

      {/* Dialogs de renommage */}
      <RenameDialog
        isOpen={isRenameRoomDialogOpen}
        onClose={() => {
          setIsRenameRoomDialogOpen(false);
          setSelectedItemToRename(null);
        }}
        onRename={handleRenameRoom}
        currentName={selectedItemToRename?.name || ''}
        title="Renommer la pièce"
      />

      <RenameDialog
        isOpen={isRenameStorageDialogOpen}
        onClose={() => {
          setIsRenameStorageDialogOpen(false);
          setSelectedItemToRename(null);
        }}
        onRename={handleRenameStorageSpace}
        currentName={selectedItemToRename?.name || ''}
        title="Renommer l'espace de rangement"
      />
    </div>
  );
};