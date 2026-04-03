/**
 * Sitemap Generator for IslandFruitGuide
 * Generates XML sitemaps for search engine submission
 */

import { fruits } from '../data/fruits';
import { recipes } from '../data/recipes';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

interface ImageSitemapEntry {
  loc: string;
  image: {
    loc: string;
    title: string;
    caption: string;
  };
}

/**
 * Generate XML for main sitemap
 */
export function generateMainSitemap(): string {
  const urls: SitemapURL[] = [
    {
      loc: 'https://www.islandfruitguide.com/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: 'https://www.islandfruitguide.com/fruits',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: 'https://www.islandfruitguide.com/recipes',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: 'https://www.islandfruitguide.com/medicinal-leaves',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: 'https://www.islandfruitguide.com/seasonal-fruits',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: 'https://www.islandfruitguide.com/about',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: 'https://www.islandfruitguide.com/contact',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: 'https://www.islandfruitguide.com/editorial-policy',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.4
    }
  ];

  return generateSitemapXML(urls);
}

/**
 * Generate XML for fruits sitemap
 */
export function generateFruitsSitemap(): string {
  const urls: SitemapURL[] = fruits.map(fruit => ({
    loc: `https://www.islandfruitguide.com/fruits/${fruit.slug}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  }));

  return generateSitemapXML(urls);
}

/**
 * Generate XML for recipes sitemap
 */
export function generateRecipesSitemap(): string {
  const urls: SitemapURL[] = recipes.map(recipe => ({
    loc: `https://www.islandfruitguide.com/recipes/${recipe.slug}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7
  }));

  return generateSitemapXML(urls);
}

/**
 * Generate XML for image sitemap
 */
export function generateImageSitemap(): string {
  const entries: ImageSitemapEntry[] = [];

  // Add fruit images
  fruits.forEach(fruit => {
    entries.push({
      loc: `https://www.islandfruitguide.com/fruits/${fruit.slug}`,
      image: {
        loc: fruit.image_url.startsWith('http')
          ? fruit.image_url
          : `https://www.islandfruitguide.com${fruit.image_url}`,
        title: `${fruit.name} - ${fruit.scientific_name}`,
        caption: fruit.description.substring(0, 150)
      }
    });
  });

  // Add recipe images
  recipes.forEach(recipe => {
    entries.push({
      loc: `https://www.islandfruitguide.com/recipes/${recipe.slug}`,
      image: {
        loc: recipe.image_url.startsWith('http')
          ? recipe.image_url
          : `https://www.islandfruitguide.com${recipe.image_url}`,
        title: recipe.title,
        caption: recipe.description.substring(0, 150)
      }
    });
  });

  return generateImageSitemapXML(entries);
}

/**
 * Generate sitemap index
 */
export function generateSitemapIndex(): string {
  const sitemaps = [
    {
      loc: 'https://www.islandfruitguide.com/sitemap-main.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://www.islandfruitguide.com/sitemap-fruits.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://www.islandfruitguide.com/sitemap-recipes.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://www.islandfruitguide.com/sitemap-images.xml',
      lastmod: new Date().toISOString().split('T')[0]
    }
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${sitemap.loc}</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';

  return xml;
}

/**
 * Helper: Generate sitemap XML from URL list
 */
function generateSitemapXML(urls: SitemapURL[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

/**
 * Helper: Generate image sitemap XML
 */
function generateImageSitemapXML(entries: ImageSitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.loc}</loc>\n`;
    xml += '    <image:image>\n';
    xml += `      <image:loc>${escapeXML(entry.image.loc)}</image:loc>\n`;
    xml += `      <image:title>${escapeXML(entry.image.title)}</image:title>\n`;
    xml += `      <image:caption>${escapeXML(entry.image.caption)}</image:caption>\n`;
    xml += '    </image:image>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

/**
 * Helper: Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Download sitemap as file
 */
export function downloadSitemap(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Generate all sitemaps and download as zip (browser)
 */
export function generateAllSitemaps() {
  return {
    'sitemap.xml': generateSitemapIndex(),
    'sitemap-main.xml': generateMainSitemap(),
    'sitemap-fruits.xml': generateFruitsSitemap(),
    'sitemap-recipes.xml': generateRecipesSitemap(),
    'sitemap-images.xml': generateImageSitemap()
  };
}
