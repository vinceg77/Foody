import { openDB, IDBPDatabase } from 'idb';

class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, Promise<IDBPDatabase<any>>> = new Map();
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async initialize() {
    if (!this.initializationPromise) {
      this.initializationPromise = Promise.all([
        this.getConnection('foodie-db', 3, (db) => {
          if (!db.objectStoreNames.contains("foodItems")) {
            db.createObjectStore("foodItems", { keyPath: "id", autoIncrement: true });
          }
        }),
        this.getConnection('settings-db', 2, (db) => {
          if (!db.objectStoreNames.contains("settings")) {
            const store = db.createObjectStore("settings");
            store.put({
              freshProducts: { warningDays: 2, enabled: true },
              otherProducts: { warningDays: 7, enabled: true }
            }, 'expirySettings');
          }
        }),
        this.getConnection('activity-history-db', 1, (db) => {
          if (!db.objectStoreNames.contains("activities")) {
            const store = db.createObjectStore("activities", {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('timestamp', 'timestamp');
          }
        })
      ]).then(() => {});
    }
    return this.initializationPromise;
  }

  async getConnection(
    dbName: string, 
    version: number, 
    upgradeCallback: (db: IDBDatabase, oldVersion: number, newVersion: number | null) => void
  ): Promise<IDBPDatabase<any>> {
    let connection = this.connections.get(dbName);
    
    if (!connection) {
      connection = openDB(dbName, version, { 
        upgrade: upgradeCallback,
        blocking: () => {
          this.connections.delete(dbName);
        },
        terminated: () => {
          this.connections.delete(dbName);
        }
      });
      this.connections.set(dbName, connection);
    }
    
    return connection;
  }

  async closeAll() {
    for (const [name, connectionPromise] of this.connections) {
      const connection = await connectionPromise;
      connection.close();
      this.connections.delete(name);
    }
  }
}

export const dbManager = DatabaseManager.getInstance();