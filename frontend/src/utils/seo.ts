/**
 * SEO/AEO Utility Functions for IslandFruitGuide
 * Handles canonical URLs, meta tags, structured data, and performance optimizations
 */

// Base URL for the application
const BASE_URL = "https://www.islandfruitguide.com";

/**
 * Set canonical URL for the current page
 */
export function setCanonicalURL(path: string) {
  const canonical = `${BASE_URL}${path}`;
  
  // Remove existing canonical if present
  const existing = document.querySelector('link[rel="canonical"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new canonical
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = canonical;
  document.head.appendChild(link);
}

/**
 * Update Open Graph meta tags
 */
export function setOpenGraphTags(data: {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url: string;
}) {
  const tags = [
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:type', content: data.type || 'website' },
    { property: 'og:url', content: `${BASE_URL}${data.url}` },
    { property: 'og:site_name', content: 'IslandFruitGuide' },
  ];
  
  if (data.image) {
    tags.push({ property: 'og:image', content: data.image });
    tags.push({ property: 'og:image:width', content: '1200' });
    tags.push({ property: 'og:image:height', content: '630' });
    tags.push({ property: 'og:image:alt', content: data.title });
  }
  
  tags.forEach(tag => {
    let meta = document.querySelector(`meta[property="${tag.property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', tag.content);
  });
}

/**
 * Update Twitter Card meta tags
 */
export function setTwitterCardTags(data: {
  title: string;
  description: string;
  image?: string;
}) {
  const tags = [
    { name: 'twitter:card', content: data.image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: data.title },
    { name: 'twitter:description', content: data.description },
  ];
  
  if (data.image) {
    tags.push({ name: 'twitter:image', content: data.image });
    tags.push({ name: 'twitter:image:alt', content: data.title });
  }
  
  tags.forEach(tag => {
    let meta = document.querySelector(`meta[name="${tag.name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', tag.name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', tag.content);
  });
}

/**
 * Add JSON-LD structured data
 */
export function addStructuredData(data: object) {
  // Remove existing structured data with same @type
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => {
    try {
      const parsed = JSON.parse(script.textContent || '{}');
      if (parsed['@type'] === (data as any)['@type']) {
        script.remove();
      }
    } catch (e) {
      // ignore
    }
  });
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(resources: { href: string; as: string; type?: string }[]) {
  resources.forEach(resource => {
    const existing = document.querySelector(`link[href="${resource.href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    }
  });
}

/**
 * Add preconnect to external domains
 */
export function addPreconnect(domains: string[]) {
  domains.forEach(domain => {
    const existing = document.querySelector(`link[href="${domain}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.insertBefore(link, document.head.firstChild);
      
      // Add dns-prefetch as fallback
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = domain;
      document.head.insertBefore(dnsPrefetch, document.head.firstChild);
    }
  });
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      const image = img as HTMLImageElement;
      image.src = image.dataset.src || '';
      image.removeAttribute('data-src');
    });
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * Generate recipe structured data (Schema.org Recipe)
 */
export function generateRecipeSchema(recipe: {
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    'name': recipe.name,
    'description': recipe.description,
    'image': recipe.image,
    'prepTime': `PT${recipe.prepTime.replace(' ', '')}`,
    'cookTime': `PT${recipe.cookTime.replace(' ', '')}`,
    'recipeYield': `${recipe.servings} servings`,
    'recipeIngredient': recipe.ingredients,
    'recipeInstructions': recipe.instructions.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'text': step
    })),
    'author': {
      '@type': 'Organization',
      'name': 'IslandFruitGuide'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'IslandFruitGuide',
      'url': BASE_URL
    }
  };
}

/**
 * Optimize Core Web Vitals
 */
export function optimizeCoreWebVitals() {
  // Preconnect to critical domains
  addPreconnect([
    'https://raguzwxnrdanynjnppze.supabase.co',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]);
  
  // Lazy load images
  lazyLoadImages();
  
  // Reduce layout shift by reserving space for images
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.style.aspectRatio = '16 / 9';
    }
  });
}

/**
 * Set meta robots tag
 */
export function setMetaRobots(content: string = 'index, follow') {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Add hreflang tags for international SEO (if needed in future)
 */
export function addHreflangTags(alternates: { lang: string; url: string }[]) {
  alternates.forEach(alt => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = alt.lang;
    link.href = `${BASE_URL}${alt.url}`;
    document.head.appendChild(link);
  });
}

/**
 * Complete SEO setup for a page
 */
export function setupPageSEO(config: {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: string;
  breadcrumbs?: { name: string; url: string }[];
  structuredData?: object;
}) {
  // Set canonical URL
  setCanonicalURL(config.path);
  
  // Set document title
  document.title = config.title;
  
  // Set meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);
  
  // Set Open Graph tags
  setOpenGraphTags({
    title: config.title,
    description: config.description,
    image: config.image,
    type: config.type,
    url: config.path
  });
  
  // Set Twitter Card tags
  setTwitterCardTags({
    title: config.title,
    description: config.description,
    image: config.image
  });
  
  // Add breadcrumb schema if provided
  if (config.breadcrumbs) {
    addStructuredData(generateBreadcrumbSchema(config.breadcrumbs));
  }
  
  // Add custom structured data if provided
  if (config.structuredData) {
    addStructuredData(config.structuredData);
  }
  
  // Set robots meta
  setMetaRobots();
  
  // Optimize Core Web Vitals
  optimizeCoreWebVitals();
}
