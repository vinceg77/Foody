import { openDB } from "idb";

const DB_NAME = "storage-db";
const DB_VERSION = 2;

interface StorageSpace {
  id: string;
  name: string;
  hasFloors: boolean;
  hasCompartments: boolean;
  floors: { [key: string]: string[] };
}

interface Room {
  name: string;
  storageSpaces: StorageSpace[];
}

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Store for rooms
    if (!db.objectStoreNames.contains("rooms")) {
      const roomsStore = db.createObjectStore("rooms", { keyPath: "name" });
      const defaultRooms = ["Cuisine", "Salle à manger", "Chambre", "Salle de bain", "Garage", "Salon", "Cave"];
      defaultRooms.forEach((room) => roomsStore.add({ name: room, storageSpaces: [] }));
    }

    // Store for storage spaces details
    if (!db.objectStoreNames.contains("storageSpaces")) {
      db.createObjectStore("storageSpaces", { keyPath: "id" });
    }
  },
});

export const fetchAllRooms = async (): Promise<string[]> => {
  const db = await dbPromise;
  const rooms = await db.getAll("rooms");
  return rooms.map((room) => room.name);
};

export const addRoom = async (name: string) => {
  const db = await dbPromise;
  await db.put("rooms", { name, storageSpaces: [] });
};

export const deleteRoom = async (name: string) => {
  const db = await dbPromise;
  const room = await db.get("rooms", name);
  if (room?.storageSpaces) {
    // Delete all storage spaces associated with this room
    const tx = db.transaction(["rooms", "storageSpaces"], "readwrite");
    for (const space of room.storageSpaces) {
      await tx.objectStore("storageSpaces").delete(`${name}_${space.name}`);
    }
    await tx.objectStore("rooms").delete(name);
    await tx.done;
  } else {
    await db.delete("rooms", name);
  }
};

export const renameRoom = async (oldName: string, newName: string) => {
  const db = await dbPromise;
  const tx = db.transaction(["rooms", "storageSpaces"], "readwrite");
  
  const room = await tx.objectStore("rooms").get(oldName);
  if (room) {
    // Update room name
    await tx.objectStore("rooms").put({ ...room, name: newName });
    await tx.objectStore("rooms").delete(oldName);

    // Update storage space IDs
    if (room.storageSpaces) {
      for (const space of room.storageSpaces) {
        const oldKey = `${oldName}_${space.name}`;
        const newKey = `${newName}_${space.name}`;
        const spaceData = await tx.objectStore("storageSpaces").get(oldKey);
        if (spaceData) {
          await tx.objectStore("storageSpaces").put({ ...spaceData, id: newKey });
          await tx.objectStore("storageSpaces").delete(oldKey);
        }
      }
    }
  }
  await tx.done;
};

export const fetchStorageSpaces = async (roomName: string): Promise<StorageSpace[]> => {
  const db = await dbPromise;
  const room = await db.get("rooms", roomName);
  return room?.storageSpaces || [];
};

export const addStorageSpace = async (roomName: string, space: Omit<StorageSpace, "id">) => {
  const db = await dbPromise;
  const tx = db.transaction(["rooms", "storageSpaces"], "readwrite");

  const spaceWithId = {
    ...space,
    id: `${roomName}_${space.name}`,
  };

  const room = await tx.objectStore("rooms").get(roomName);
  if (room) {
    room.storageSpaces = [...(room.storageSpaces || []), spaceWithId];
    await tx.objectStore("rooms").put(room);
    await tx.objectStore("storageSpaces").put({
      id: spaceWithId.id,
      floors: space.floors || {}
    });
  }
  await tx.done;
};

export const deleteStorageSpace = async (roomName: string, spaceName: string) => {
  const db = await dbPromise;
  const tx = db.transaction(["rooms", "storageSpaces"], "readwrite");

  const room = await tx.objectStore("rooms").get(roomName);
  if (room) {
    room.storageSpaces = room.storageSpaces.filter((space: StorageSpace) => space.name !== spaceName);
    await tx.objectStore("rooms").put(room);
    await tx.objectStore("storageSpaces").delete(`${roomName}_${spaceName}`);
  }
  await tx.done;
};

export const renameStorageSpace = async (roomName: string, oldName: string, newName: string) => {
  const db = await dbPromise;
  const tx = db.transaction(["rooms", "storageSpaces"], "readwrite");

  const room = await tx.objectStore("rooms").get(roomName);
  if (room) {
    const spaceIndex = room.storageSpaces.findIndex((space: StorageSpace) => space.name === oldName);
    if (spaceIndex !== -1) {
      const oldSpaceKey = `${roomName}_${oldName}`;
      const newSpaceKey = `${roomName}_${newName}`;

      // Update space name in room
      room.storageSpaces[spaceIndex].name = newName;
      room.storageSpaces[spaceIndex].id = newSpaceKey;
      await tx.objectStore("rooms").put(room);

      // Update storage space data
      const spaceData = await tx.objectStore("storageSpaces").get(oldSpaceKey);
      if (spaceData) {
        await tx.objectStore("storageSpaces").put({ ...spaceData, id: newSpaceKey });
        await tx.objectStore("storageSpaces").delete(oldSpaceKey);
      }
    }
  }
  await tx.done;
};

export const updateStorageSpace = async (roomName: string, spaceName: string, updatedSpace: Partial<StorageSpace>) => {
  const db = await dbPromise;
  const tx = db.transaction(["rooms", "storageSpaces"], "readwrite");

  const spaceKey = `${roomName}_${spaceName}`;
  const room = await tx.objectStore("rooms").get(roomName);
  
  if (room) {
    const spaceIndex = room.storageSpaces.findIndex((space: StorageSpace) => space.name === spaceName);
    if (spaceIndex !== -1) {
      // Update space in room
      room.storageSpaces[spaceIndex] = {
        ...room.storageSpaces[spaceIndex],
        ...updatedSpace,
        id: spaceKey
      };
      await tx.objectStore("rooms").put(room);

      // Update storage space data
      await tx.objectStore("storageSpaces").put({
        id: spaceKey,
        floors: updatedSpace.floors || {}
      });
    }
  }
  await tx.done;
};

export const addCompartment = async (roomName: string, spaceName: string, floorNumber: number, compartmentName: string) => {
  const db = await dbPromise;
  const tx = db.transaction(["storageSpaces"], "readwrite");
  const spaceKey = `${roomName}_${spaceName}`;
  
  const spaceData = await tx.objectStore("storageSpaces").get(spaceKey);
  if (spaceData) {
    const floors = spaceData.floors || {};
    const floorKey = floorNumber.toString();
    floors[floorKey] = [...(floors[floorKey] || []), compartmentName];
    
    await tx.objectStore("storageSpaces").put({
      ...spaceData,
      floors
    });
  }
  await tx.done;
};

export const deleteCompartment = async (roomName: string, spaceName: string, floorNumber: number, compartmentName: string) => {
  const db = await dbPromise;
  const tx = db.transaction(["storageSpaces"], "readwrite");
  const spaceKey = `${roomName}_${spaceName}`;
  
  const spaceData = await tx.objectStore("storageSpaces").get(spaceKey);
  if (spaceData?.floors) {
    const floorKey = floorNumber.toString();
    spaceData.floors[floorKey] = spaceData.floors[floorKey].filter((name: string) => name !== compartmentName);
    await tx.objectStore("storageSpaces").put(spaceData);
  }
  await tx.done;
};

export const renameCompartment = async (
  roomName: string,
  spaceName: string,
  floorNumber: number,
  oldName: string,
  newName: string
) => {
  const db = await dbPromise;
  const tx = db.transaction(["storageSpaces"], "readwrite");
  const spaceKey = `${roomName}_${spaceName}`;
  
  const spaceData = await tx.objectStore("storageSpaces").get(spaceKey);
  if (spaceData?.floors) {
    const floorKey = floorNumber.toString();
    spaceData.floors[floorKey] = spaceData.floors[floorKey].map((name: string) =>
      name === oldName ? newName : name
    );
    await tx.objectStore("storageSpaces").put(spaceData);
  }
  await tx.done;
};

export const deleteFloor = async (roomName: string, spaceName: string, floorNumber: number) => {
  const db = await dbPromise;
  const tx = db.transaction(["storageSpaces"], "readwrite");
  const spaceKey = `${roomName}_${spaceName}`;
  
  const spaceData = await tx.objectStore("storageSpaces").get(spaceKey);
  if (spaceData?.floors) {
    const floorKey = floorNumber.toString();
    const { [floorKey]: deletedFloor, ...remainingFloors } = spaceData.floors;
    await tx.objectStore("storageSpaces").put({
      ...spaceData,
      floors: remainingFloors
    });
  }
  await tx.done;
};