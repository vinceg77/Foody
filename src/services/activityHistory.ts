import { openDB } from 'idb';

export interface Activity {
  id?: number;
  type: 'add' | 'remove' | 'update';
  description: string;
  timestamp: number;
  productName: string;
  productId?: number;
}

const DB_NAME = 'activity-history-db';
const STORE_NAME = 'activities';
const DB_VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
};

export const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
  const db = await initDB();
  return db.add(STORE_NAME, {
    ...activity,
    timestamp: Date.now(),
  });
};

export const getRecentActivities = async (limit = 5): Promise<Activity[]> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const index = store.index('timestamp');
  
  const activities = await index.getAll();
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

export const clearOldActivities = async (daysToKeep = 30) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  
  const activities = await store.index('timestamp').getAllKeys();
  
  for (const key of activities) {
    const activity = await store.get(key);
    if (activity.timestamp < cutoffTime) {
      await store.delete(key);
    }
  }
};