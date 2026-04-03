/**
 * SEO Schema Generation Utilities
 * Generates JSON-LD structured data for tropical fruits and recipes
 */

interface Fruit {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  nutrition: string;
  health_benefits: string[];
  image_url: string;
  origin: string;
  category: string[];
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image_url: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
}

/**
 * Generate Recipe Schema (JSON-LD)
 */
export function generateRecipeSchema(recipe: Recipe, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.title,
    "description": recipe.description,
    "image": recipe.image_url.startsWith('http') 
      ? recipe.image_url 
      : `https://www.islandfruitguide.com${recipe.image_url}`,
    "author": {
      "@type": "Organization",
      "name": "IslandFruitGuide",
      "url": "https://www.islandfruitguide.com"
    },
    "datePublished": "2024-01-01",
    "prepTime": convertToDuration(recipe.prep_time),
    "cookTime": convertToDuration(recipe.cook_time),
    "totalTime": calculateTotalTime(recipe.prep_time, recipe.cook_time),
    "recipeYield": `${recipe.servings} servings`,
    "recipeCategory": "Caribbean Cuisine",
    "recipeCuisine": "Caribbean",
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.instructions.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    })),
    "keywords": `${recipe.title}, Caribbean recipe, tropical fruit recipe`,
    "url": url
  };
}

/**
 * Generate Fruit Article Schema (JSON-LD)
 */
export function generateFruitArticleSchema(fruit: Fruit, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${fruit.name} - Complete Tropical Fruit Guide`,
    "description": fruit.description,
    "image": fruit.image_url.startsWith('http')
      ? fruit.image_url
      : `https://www.islandfruitguide.com${fruit.image_url}`,
    "author": {
      "@type": "Organization",
      "name": "IslandFruitGuide Tropical Fruit Research Team",
      "url": "https://www.islandfruitguide.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IslandFruitGuide",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.islandfruitguide.com/logo.png"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": url,
    "keywords": `${fruit.name}, tropical fruit, ${fruit.scientific_name}, Caribbean fruit, exotic fruit`,
    "articleSection": "Tropical Fruits",
    "about": {
      "@type": "Thing",
      "name": fruit.name,
      "description": fruit.description
    }
  };
}

/**
 * Generate Food Schema for Fruit
 */
export function generateFoodSchema(fruit: Fruit) {
  return {
    "@context": "https://schema.org",
    "@type": "Food",
    "name": fruit.name,
    "description": fruit.description,
    "image": fruit.image_url.startsWith('http')
      ? fruit.image_url
      : `https://www.islandfruitguide.com${fruit.image_url}`,
    "scientificName": fruit.scientific_name,
    "origin": fruit.origin,
    "keywords": `tropical fruit, ${fruit.name}, exotic fruit`,
    "additionalProperty": fruit.health_benefits.map(benefit => ({
      "@type": "PropertyValue",
      "name": "Health Benefit",
      "value": benefit
    }))
  };
}

/**
 * Generate FAQ Schema for Answer Engine Optimization (AEO)
 */
export function generateFruitFAQSchema(fruit: Fruit) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${fruit.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fruit.description.substring(0, 200)
        }
      },
      {
        "@type": "Question",
        "name": `What are the health benefits of ${fruit.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fruit.health_benefits.slice(0, 3).join('. ')
        }
      },
      {
        "@type": "Question",
        "name": `Where does ${fruit.name} come from?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${fruit.name} originates from ${fruit.origin}.`
        }
      }
    ]
  };
}

/**
 * Generate Organization Schema (Site Identity)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IslandFruitGuide",
    "url": "https://www.islandfruitguide.com",
    "logo": "https://www.islandfruitguide.com/logo.png",
    "description": "The world's most comprehensive tropical and Caribbean fruit encyclopedia, featuring health benefits, recipes, and growing guides.",
    "sameAs": [
      "https://www.facebook.com/islandfruitguide",
      "https://www.instagram.com/islandfruitguide",
      "https://twitter.com/islandfruitguide"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Editorial",
      "email": "editorial@islandfruitguide.com"
    }
  };
}

/**
 * Generate WebSite Schema with Search Action
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IslandFruitGuide",
    "url": "https://www.islandfruitguide.com",
    "description": "Your complete guide to tropical and Caribbean fruits - from ackee to soursop. Explore health benefits, recipes, and expert growing tips.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.islandfruitguide.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IslandFruitGuide"
    }
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Helper: Convert time string to ISO 8601 duration
 */
function convertToDuration(timeStr: string): string {
  const match = timeStr.match(/(\d+)\s*(min|hour)/i);
  if (!match) return 'PT30M';
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('hour')) {
    return `PT${value}H`;
  }
  return `PT${value}M`;
}

/**
 * Helper: Calculate total time
 */
function calculateTotalTime(prepTime: string, cookTime: string): string {
  const prep = convertToDuration(prepTime);
  const cook = convertToDuration(cookTime);
  
  const prepMins = parseInt(prep.replace(/\D/g, ''));
  const cookMins = parseInt(cook.replace(/\D/g, ''));
  
  return `PT${prepMins + cookMins}M`;
}

/**
 * Inject Schema into Head
 */
export function injectSchema(schema: object) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Generate Canonical URL
 */
export function generateCanonicalURL(path: string): string {
  // Remove trailing slash, lowercase, remove query params
  const cleanPath = path
    .toLowerCase()
    .replace(/\/$/, '')
    .split('?')[0];
  
  return `https://www.islandfruitguide.com${cleanPath}`;
}

/**
 * Set Canonical Link Tag
 */
export function setCanonicalURL(url: string) {
  // Remove existing canonical
  const existing = document.querySelector('link[rel="canonical"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new canonical
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Generate optimized meta description
 */
export function generateMetaDescription(type: 'fruit' | 'recipe', name: string, description: string): string {
  if (type === 'fruit') {
    return `Discover ${name} - tropical fruit guide with health benefits, nutrition facts, recipes, and growing tips. ${description.substring(0, 100)}...`;
  } else {
    return `${name} - authentic Caribbean recipe with step-by-step instructions. ${description.substring(0, 100)}...`;
  }
}

/**
 * Generate optimized page title
 */
export function generatePageTitle(type: 'fruit' | 'recipe', name: string): string {
  if (type === 'fruit') {
    return `${name} Fruit Guide | Benefits, Nutrition & Recipes`;
  } else {
    return `${name} | Authentic Caribbean Recipe`;
  }
}
