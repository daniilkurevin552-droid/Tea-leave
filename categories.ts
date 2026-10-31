import type { TeaCategory } from "../types/product";

export const categories: { name: TeaCategory; subtitle: string; image: string }[] = [
  {
    name: "Пуэр",
    subtitle: "Глубокий, тёплый, неспешный",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Улун",
    subtitle: "Цветы, сливки и горный воздух",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Зелёный чай",
    subtitle: "Свежесть и лёгкость",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Красный чай",
    subtitle: "Мёд, сухофрукты и уют",
    image: "https://images.unsplash.com/photo-1563911892437-1f2955e3434d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Белый чай",
    subtitle: "Тонкий и деликатный",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Наборы",
    subtitle: "Маленькое чайное путешествие",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85",
  },
];