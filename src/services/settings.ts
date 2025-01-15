import { openDB } from 'idb';

const DB_NAME = 'settings-db';
const STORE_NAME = 'settings';
const DB_VERSION = 2;

export interface ExpirySettings {
  freshProducts: {
    warningDays: number;
    enabled: boolean;
  };
  otherProducts: {
    warningDays: number;
    enabled: boolean;
  };
}

const DEFAULT_SETTINGS: ExpirySettings = {
  freshProducts: {
    warningDays: 2,
    enabled: true
  },
  otherProducts: {
    warningDays: 7,
    enabled: true
  }
};

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME);
        store.put(DEFAULT_SETTINGS, 'expirySettings');
      }
      
      // Migration des anciennes données si nécessaire
      if (oldVersion === 1) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.store.get('expiryWarningDays').then(oldDays => {
          if (oldDays) {
            const newSettings = {
              ...DEFAULT_SETTINGS,
              otherProducts: {
                ...DEFAULT_SETTINGS.otherProducts,
                warningDays: oldDays
              }
            };
            tx.store.put(newSettings, 'expirySettings');
          }
        });
      }
    },
  });
};

export const getExpirySettings = async (): Promise<ExpirySettings> => {
  const db = await initDB();
  const settings = await db.get(STORE_NAME, 'expirySettings');
  return settings ?? DEFAULT_SETTINGS;
};

export const updateExpirySettings = async (settings: ExpirySettings): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, settings, 'expirySettings');
};