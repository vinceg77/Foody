export interface FoodItem {
  id?: number;
  name: string;
  brand?: string;
  category?: 'fresh' | 'other';
  barcode?: string;
  quantity: number;
  expirationDate: string;
  storageLocation: string;
  imageUrl?: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  consumed?: boolean;
  consumedDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    darkMode: boolean;
    dietaryRestrictions: string[];
  };
}

export interface StorageLocation {
  id: string;
  name: string;
  type: 'fridge' | 'freezer' | 'pantry' | 'cabinet';
  items: FoodItem[];
}

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