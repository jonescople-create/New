import { useState, useEffect } from "react";
import { navigate } from "../App";
import type { Fruit } from "../data/fruits";
import { isFruitFavorited, toggleFruitFavorite } from "../utils/favorites";
import { OptimizedImage } from "./OptimizedImage";

export interface FruitCardProps {
  fruit: Fruit;
  size?: "sm" | "md" | "lg";
}

export function FruitCard({ fruit, size = "md" }: FruitCardProps) {
  const [fav, setFav] = useState(false);
  useEffect(() => { setFav(isFruitFavorited(fruit.id)); }, [fruit.id]);
  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowFav = toggleFruitFavorite(fruit.id);
    setFav(nowFav);
  };
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const categoryColors: Record<string, string> = {
    popular: "bg-mango/20 text-amber-800",
    seasonal: "bg-leaf/15 text-leaf-dark",
    rare: "bg-purple-100 text-purple-800",
    medicinal: "bg-coral/15 text-red-800",
  };

  const hasImage = fruit.image_url && fruit.image_url.length > 0;

  return (
    <div
      onClick={() => navigate(`/fruits/${fruit.slug}`)}
      className={`fruit-card-hover bg-white rounded-2xl ${sizeClasses[size]} border border-gray-100 text-left w-full group cursor-pointer relative`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/fruits/${fruit.slug}`)}
    >
      {/* Favorite heart */}
      <button
        onClick={handleFav}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
          fav ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-300 opacity-0 group-hover:opacity-100"
        }`}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        {fav ? "❤️" : "🤍"}
      </button>
      {/* Image area */}
      <div
        className="w-full aspect-square rounded-xl mb-3 flex items-center justify-center relative overflow-hidden"
        style={!hasImage ? { background: `linear-gradient(135deg, ${fruit.color}22, ${fruit.color}44)` } : {}}
      >
        {hasImage ? (
          <OptimizedImage
            src={fruit.image_url}
            alt={`Fresh ${fruit.name} tropical fruit – IslandFruitGuide`}
            width={size === "sm" ? 200 : size === "lg" ? 420 : 320}
            height={size === "sm" ? 200 : size === "lg" ? 420 : 320}
            className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
            fallbackEmoji={fruit.emoji}
            sizes={size === "sm" ? "(max-width: 640px) 45vw, 200px" : "(max-width: 1024px) 45vw, 320px"}
          />
        ) : (
          <span className={`${size === "lg" ? "text-7xl" : size === "sm" ? "text-4xl" : "text-6xl"} group-hover:scale-110 transition-transform duration-300`}>
            {fruit.emoji}
          </span>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {fruit.category.slice(0, 1).map(cat => (
            <span key={cat} className={`category-badge text-[10px] backdrop-blur-sm ${categoryColors[cat] || "bg-gray-100 text-gray-600"}`}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      <h3 className={`font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors ${size === "lg" ? "text-xl" : "text-base"}`}>
        {fruit.name}
      </h3>
      <p className="text-xs text-charcoal-light italic mb-1">{fruit.scientific_name}</p>
      {size !== "sm" && (
        <p className="text-sm text-charcoal-light line-clamp-2 mt-1">
          {fruit.description.substring(0, 100)}...
        </p>
      )}
      <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-2 group-hover:gap-2 transition-all">
        View Guide
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </span>
    </div>
  );
}
