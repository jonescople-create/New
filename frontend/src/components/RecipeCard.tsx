import { useState, useEffect } from "react";
import { navigate } from "../App";
import { isRecipeFavorited, toggleRecipeFavorite } from "../utils/favorites";
import { OptimizedImage } from "./OptimizedImage";
import type { Recipe } from "../data/recipes";

export interface RecipeCardProps {
  recipe: Recipe;
  horizontal?: boolean;
}

export function RecipeCard({ recipe, horizontal = false }: RecipeCardProps) {
  const hasImage = recipe.image_url && recipe.image_url.length > 0;
  const [fav, setFav] = useState(false);
  useEffect(() => { setFav(isRecipeFavorited(recipe.id)); }, [recipe.id]);
  const handleFav = (e: React.MouseEvent) => { e.stopPropagation(); setFav(toggleRecipeFavorite(recipe.id)); };

  if (horizontal) {
    return (
      <div
        onClick={() => navigate(`/recipes/${recipe.slug}`)}
        className="recipe-card-hover bg-white rounded-2xl border border-gray-100 text-left min-w-[280px] max-w-[320px] flex-shrink-0 group cursor-pointer overflow-hidden relative"
      >
        <div onClick={handleFav} className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${fav ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-300 opacity-0 group-hover:opacity-100"}`} aria-label="Favorite" role="button">{fav ? "❤️" : "🤍"}</div>
        <div className="w-full h-44 bg-gradient-to-br from-mango/20 via-coral/10 to-leaf/20 flex items-center justify-center overflow-hidden">
          {hasImage ? (
            <OptimizedImage
                src={recipe.image_url!}
                alt={`${recipe.title} – IslandFruitGuide Recipe`}
                width={640}
                height={352}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              fallbackEmoji="🍽️"
              sizes="(max-width: 640px) 70vw, 320px"
            />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition-transform">🍽️</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors text-sm leading-snug">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-charcoal-light">
            <span>⏱️ {recipe.prep_time}</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.category?.slice(0, 2).map(cat => (
              <span key={cat} className="text-xs bg-leaf/10 text-leaf px-2 py-0.5 rounded-full font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.slug}`)}
              className="recipe-card-hover bg-white rounded-2xl border border-gray-100 text-left w-full group cursor-pointer overflow-hidden relative"
      >
        <div onClick={handleFav} className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer ${fav ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-300 opacity-0 group-hover:opacity-100"}`} aria-label="Favorite" role="button">{fav ? "❤️" : "🤍"}</div>
        <div className="w-full h-48 bg-gradient-to-br from-mango/20 via-coral/10 to-leaf/20 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <OptimizedImage
            src={recipe.image_url!}
            alt={`${recipe.title} – IslandFruitGuide Recipe`}
            width={720}
            height={432}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            fallbackEmoji="🍽️"
            sizes="(max-width: 768px) 90vw, 420px"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform">🍽️</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors">
          {recipe.title}
        </h3>
        <p className="text-sm text-charcoal-light mt-1 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-light">
          <span className="flex items-center gap-1">⏱️ {recipe.prep_time} prep</span>
          <span className="flex items-center gap-1">🔥 {recipe.cook_time} cook</span>
          <span className="flex items-center gap-1">👥 {recipe.servings}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.category?.slice(0, 3).map(cat => (
            <span key={cat} className="text-xs bg-leaf/10 text-leaf px-2 py-0.5 rounded-full font-medium">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
