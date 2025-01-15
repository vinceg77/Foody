import { dbManager } from './core';

const DB_NAME = "foodie-db";
const DB_VERSION = 3;

export const initDatabase = async () => {
  return dbManager.getConnection(DB_NAME, DB_VERSION, (db, oldVersion, newVersion) => {
    if (!db.objectStoreNames.contains("foodItems")) {
      db.createObjectStore("foodItems", { keyPath: "id", autoIncrement: true });
    }
  });
};