import { FoodItem } from "../../types";
import { initDatabase } from "./init";
import { addActivity } from "../activityHistory";

// Fonction pour ajouter un aliment
export const addFoodItem = async (item: Omit<FoodItem, "id">) => {
  const db = await initDatabase();
  const id = await db.add("foodItems", item);
  
  await addActivity({
    type: 'add',
    description: `Nouveau produit ajouté: ${item.name}`,
    productName: item.name,
    productId: id as number
  });
  
  return id;
};

// Fonction pour récupérer tous les aliments
export const fetchAllFoodItems = async (): Promise<FoodItem[]> => {
  const db = await initDatabase();
  return await db.getAll("foodItems");
};

// Fonction pour récupérer un aliment par son code-barres
export const getFoodItemByBarcode = async (barcode: string): Promise<FoodItem | undefined> => {
  const db = await initDatabase();
  const items = await db.getAll("foodItems");
  return items.find(item => item.barcode === barcode);
};

// Met à jour un aliment existant
export const updateFoodItem = async (id: number, updatedData: Partial<FoodItem>) => {
  const db = await initDatabase();
  const tx = db.transaction("foodItems", "readwrite");
  const store = tx.objectStore("foodItems");
  const item = await store.get(id);
  
  if (!item) throw new Error("Item not found");
  
  const updatedItem = { ...item, ...updatedData };
  await store.put(updatedItem);
  await tx.done;
  
  await addActivity({
    type: 'update',
    description: `Produit modifié: ${item.name}`,
    productName: item.name,
    productId: id
  });
  
  return updatedItem;
};

// Supprime un aliment de la base
export const deleteFoodItem = async (id: number) => {
  const db = await initDatabase();
  const tx = db.transaction("foodItems", "readwrite");
  const store = tx.objectStore("foodItems");
  const item = await store.get(id);
  
  if (item) {
    await store.delete(id);
    await addActivity({
      type: 'remove',
      description: `Produit supprimé: ${item.name}`,
      productName: item.name,
      productId: id
    });
  }
  
  await tx.done;
};