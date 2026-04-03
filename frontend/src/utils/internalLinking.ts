/**
 * Internal Linking Intelligence System
 * Algorithmic internal linking for SEO and crawl depth optimization
 */

import { fruits } from '../data/fruits';
import { recipes } from '../data/recipes';

interface InternalLink {
  text: string;
  url: string;
  type: 'fruit' | 'recipe' | 'guide';
}

/**
 * Get related fruits based on category, origin, or seasonality
 */
export function getRelatedFruits(currentFruitId: string, limit: number = 3): InternalLink[] {
  const currentFruit = fruits.find(f => f.id === currentFruitId);
  if (!currentFruit) return [];

  // Score-based matching
  const scored = fruits
    .filter(f => f.id !== currentFruitId)
    .map(fruit => {
      let score = 0;
      
      // Category overlap
      const categoryOverlap = fruit.category.filter(c => 
        currentFruit.category.includes(c)
      ).length;
      score += categoryOverlap * 3;
      
      // Same origin region
      if (fruit.origin.toLowerCase().includes('caribbean') && 
          currentFruit.origin.toLowerCase().includes('caribbean')) {
        score += 2;
      }
      
      // Seasonality overlap
      if (fruit.seasonality === currentFruit.seasonality) {
        score += 1;
      }
      
      // Explicitly related
      if (currentFruit.related_fruit_ids?.includes(fruit.id)) {
        score += 5;
      }
      
      return { fruit, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ fruit }) => ({
    text: `${fruit.name} - ${fruit.scientific_name}`,
    url: `/fruits/${fruit.slug}`,
    type: 'fruit'
  }));
}

/**
 * Get related recipes for a fruit
 */
export function getRelatedRecipesForFruit(fruitId: string, limit: number = 2): InternalLink[] {
  const relatedRecipes = recipes
    .filter(recipe => recipe.related_fruit_ids?.includes(fruitId))
    .slice(0, limit);

  return relatedRecipes.map(recipe => ({
    text: recipe.title,
    url: `/recipes/${recipe.slug}`,
    type: 'recipe'
  }));
}

/**
 * Get related fruits for a recipe
 */
export function getRelatedFruitsForRecipe(recipeId: string, limit: number = 3): InternalLink[] {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe || !recipe.related_fruit_ids) return [];

  const relatedFruits = fruits
    .filter(fruit => recipe.related_fruit_ids.includes(fruit.id))
    .slice(0, limit);

  return relatedFruits.map(fruit => ({
    text: fruit.name,
    url: `/fruits/${fruit.slug}`,
    type: 'fruit'
  }));
}

/**
 * Get contextual guide links (for topical authority)
 */
export function getGuideLinks(context: 'fruit' | 'recipe'): InternalLink[] {
  const guides: InternalLink[] = [];
  
  if (context === 'fruit') {
    guides.push(
      {
        text: 'Complete Tropical Fruits Encyclopedia',
        url: '/guides/tropical-fruits-encyclopedia',
        type: 'guide'
      },
      {
        text: 'Caribbean Fruit Nutrition Database',
        url: '/guides/nutrition-database',
        type: 'guide'
      }
    );
  } else {
    guides.push(
      {
        text: 'Caribbean Recipe Collection',
        url: '/recipes',
        type: 'guide'
      }
    );
  }
  
  return guides;
}

/**
 * Generate internal linking block for fruit pages
 */
export function generateFruitInternalLinks(fruitId: string) {
  return {
    relatedFruits: getRelatedFruits(fruitId, 3),
    relatedRecipes: getRelatedRecipesForFruit(fruitId, 2),
    guides: getGuideLinks('fruit')
  };
}

/**
 * Generate internal linking block for recipe pages
 */
export function generateRecipeInternalLinks(recipeId: string) {
  return {
    relatedFruits: getRelatedFruitsForRecipe(recipeId, 3),
    relatedRecipes: getRelatedRecipes(recipeId, 2),
    guides: getGuideLinks('recipe')
  };
}

/**
 * Get related recipes based on ingredients similarity
 */
function getRelatedRecipes(recipeId: string, limit: number = 2): InternalLink[] {
  const currentRecipe = recipes.find(r => r.id === recipeId);
  if (!currentRecipe) return [];

  // Find recipes with similar ingredients or difficulty
  const scored = recipes
    .filter(r => r.id !== recipeId)
    .map(recipe => {
      let score = 0;
      
      // Same difficulty
      if (recipe.difficulty === currentRecipe.difficulty) {
        score += 2;
      }
      
      // Similar serving size
      if (Math.abs(recipe.servings - currentRecipe.servings) <= 2) {
        score += 1;
      }
      
      // Shared fruit IDs
      const sharedFruits = recipe.related_fruit_ids?.filter(id =>
        currentRecipe.related_fruit_ids?.includes(id)
      ).length || 0;
      score += sharedFruits * 3;
      
      return { recipe, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ recipe }) => ({
    text: recipe.title,
    url: `/recipes/${recipe.slug}`,
    type: 'recipe'
  }));
}

/**
 * Generate sitemap-ready URLs
 */
export function generateSitemapURLs() {
  const fruitURLs = fruits.map(fruit => ({
    url: `https://www.islandfruitguide.com/fruits/${fruit.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  }));

  const recipeURLs = recipes.map(recipe => ({
    url: `https://www.islandfruitguide.com/recipes/${recipe.slug}`,
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  }));

  const staticURLs = [
    {
      url: 'https://www.islandfruitguide.com/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: 'https://www.islandfruitguide.com/fruits',
      changefreq: 'daily',
      priority: 0.9,
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: 'https://www.islandfruitguide.com/recipes',
      changefreq: 'daily',
      priority: 0.9,
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: 'https://www.islandfruitguide.com/about',
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString().split('T')[0]
    }
  ];

  return {
    all: [...staticURLs, ...fruitURLs, ...recipeURLs],
    fruits: fruitURLs,
    recipes: recipeURLs,
    static: staticURLs
  };
}

/**
 * Generate image sitemap data
 */
export function generateImageSitemapData() {
  const fruitImages = fruits.map(fruit => ({
    loc: `https://www.islandfruitguide.com/fruits/${fruit.slug}`,
    image: {
      loc: fruit.image_url.startsWith('http')
        ? fruit.image_url
        : `https://www.islandfruitguide.com${fruit.image_url}`,
      title: `${fruit.name} - ${fruit.scientific_name}`,
      caption: fruit.description.substring(0, 100)
    }
  }));

  const recipeImages = recipes.map(recipe => ({
    loc: `https://www.islandfruitguide.com/recipes/${recipe.slug}`,
    image: {
      loc: recipe.image_url.startsWith('http')
        ? recipe.image_url
        : `https://www.islandfruitguide.com${recipe.image_url}`,
      title: recipe.title,
      caption: recipe.description.substring(0, 100)
    }
  }));

  return [...fruitImages, ...recipeImages];
}
