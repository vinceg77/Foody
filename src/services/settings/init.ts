import { dbManager } from '../database/core';

const DB_NAME = 'settings-db';
const STORE_NAME = 'settings';
const DB_VERSION = 2;

export const initSettingsDB = async () => {
  return dbManager.getConnection(DB_NAME, DB_VERSION, (db, oldVersion, newVersion) => {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME);
      store.put({
        freshProducts: { warningDays: 2, enabled: true },
        otherProducts: { warningDays: 7, enabled: true }
      }, 'expirySettings');
    }
  });
};