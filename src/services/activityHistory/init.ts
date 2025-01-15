import { dbManager } from '../database/core';

const DB_NAME = 'activity-history-db';
const STORE_NAME = 'activities';
const DB_VERSION = 1;

export const initActivityDB = async () => {
  return dbManager.getConnection(DB_NAME, DB_VERSION, (db) => {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('timestamp', 'timestamp');
    }
  });
};