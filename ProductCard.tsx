import { Heart, Plus } from "lucide-react";
import type { TeaProduct } from "../types/product";

interface ProductCardProps {
  product: TeaProduct;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAdd: (product: TeaProduct) => void;
  onOpen: (product: TeaProduct) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAdd,
  onOpen,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button className="image-button" onClick={() => onOpen(product)} aria-label={`Открыть ${product.name}`}>
          <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        </button>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => onToggleFavorite(product.id)}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{product.category}</span><span>{product.weight}</span></div>
        <button className="product-title" onClick={() => onOpen(product)}>{product.name}</button>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <span className="product-price">{product.price.toLocaleString("ru-RU")} ₽</span>
          <button className="add-button" onClick={() => onAdd(product)} disabled={!product.available}>
            <Plus size={17} /> <span>{product.available ? "В корзину" : "Нет в наличии"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}