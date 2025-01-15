export interface NutrimentsInfo {
  "energy-kcal_100g": number | null;
  proteins_100g: number | null;
  carbohydrates_100g: number | null;
  fat_100g: number | null;
}

export interface ProductInfo {
  name: string;
  brands: string;
  nutriscore: string | null;
  ingredients: string;
  imageUrl: string;
  code: string;
  nutriments: NutrimentsInfo;
  quantity: string;
  categories: string;
  labels: string;
  origins: string;
}