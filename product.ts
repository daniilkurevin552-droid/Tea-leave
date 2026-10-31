export type TeaCategory =
  | "Пуэр"
  | "Улун"
  | "Красный чай"
  | "Зелёный чай"
  | "Белый чай"
  | "Наборы";

export interface TeaProduct {
  id: string;
  slug: string;
  name: string;
  category: TeaCategory;
  description: string;
  price: number;
  weight: string;
  origin: string;
  flavorNotes: string[];
  brewingTemperature: string;
  brewingTime: string;
  image: string;
  featured: boolean;
  available: boolean;
  badge?: string;
}