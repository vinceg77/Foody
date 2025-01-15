import { initActivityDB } from './init';

export interface Activity {
  id?: number;
  type: 'add' | 'remove' | 'update';
  description: string;
  timestamp: number;
  productName: string;
  productId?: number;
}

export const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
  const db = await initActivityDB();
  return db.add('activities', {
    ...activity,
    timestamp: Date.now(),
  });
};

export const getRecentActivities = async (limit = 5): Promise<Activity[]> => {
  const db = await initActivityDB();
  const tx = db.transaction('activities', 'readonly');
  const store = tx.objectStore('activities');
  const index = store.index('timestamp');
  
  const activities = await index.getAll();
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

export const clearOldActivities = async (daysToKeep = 30) => {
  const db = await initActivityDB();
  const tx = db.transaction('activities', 'readwrite');
  const store = tx.objectStore('activities');
  const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  
  const activities = await store.index('timestamp').getAllKeys();
  
  for (const key of activities) {
    const activity = await store.get(key);
    if (activity.timestamp < cutoffTime) {
      await store.delete(key);
    }
  }
};