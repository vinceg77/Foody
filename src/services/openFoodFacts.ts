import axios from "axios";
import { ProductInfo, NutrimentsInfo } from "../types/product";

const BASE_URL = "https://world.openfoodfacts.org/api/v2";
const LOCALE = "fr";

const formatNutriments = (nutriments: any): NutrimentsInfo => ({
  "energy-kcal_100g": nutriments?.["energy-kcal_100g"] || null,
  proteins_100g: nutriments?.proteins_100g || null,
  carbohydrates_100g: nutriments?.carbohydrates_100g || null,
  fat_100g: nutriments?.fat_100g || null,
});

const getLocalizedField = (product: any, field: string): string => {
  // Essaie d'abord de récupérer le champ dans la langue demandée
  const localizedField = product[`${field}_${LOCALE}`];
  if (localizedField) return localizedField;

  // Sinon, essaie le champ par défaut
  if (product[field]) return product[field];

  // Si aucun n'est disponible, retourne "Non disponible"
  return "Non disponible";
};

const getOptimalImageUrl = (product: any): string => {
  // Préfère l'image en haute qualité si disponible
  const imageUrl = product.selected_images?.front?.display?.fr ||
                  product.selected_images?.front?.display?.en ||
                  product.image_front_url ||
                  product.image_url ||
                  "";
  return imageUrl;
};

export const fetchProductInfo = async (barcode: string): Promise<ProductInfo | null> => {
  if (!barcode) {
    console.error("Code-barres manquant");
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/product/${barcode}.json`, {
      params: {
        lc: LOCALE // Demande explicitement la version française
      }
    });

    if (response.status === 200 && response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      return {
        name: getLocalizedField(product, "product_name"),
        brands: getLocalizedField(product, "brands"),
        code: product.code || barcode,
        nutriscore: product.nutriscore_grade || null,
        ingredients: getLocalizedField(product, "ingredients_text"),
        imageUrl: getOptimalImageUrl(product),
        nutriments: formatNutriments(product.nutriments),
        quantity: product.quantity || "Non spécifiée",
        categories: getLocalizedField(product, "categories"),
        labels: getLocalizedField(product, "labels"),
        origins: getLocalizedField(product, "origins"),
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    return null;
  }
};