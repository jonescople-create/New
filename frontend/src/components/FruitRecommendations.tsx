import { useEffect, useState } from 'react';
import { navigate } from '../App';
import { RecipeCard } from './RecipeCard';
import { recipes, type Recipe } from '../data/recipes';
import { fruits } from '../data/fruits';
import { products } from '../data/products';

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  cover_image: string;
  short_description: string;
}

interface Props {
  fruitName: string;
  fruitSlug: string;
}

export function FruitRecommendations({ fruitName, fruitSlug: _fruitSlug }: Props) {
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [fruitName]);

  const loadRecommendations = () => {
    try {
      // Find the fruit to get its ID
      const fruit = fruits.find(f =>
        f.name.toLowerCase() === fruitName.toLowerCase() ||
        f.slug === _fruitSlug
      );

      // Get related recipes from local data
      const related = recipes.filter(r =>
        (fruit && r.related_fruit_ids.includes(fruit.id)) ||
        r.title.toLowerCase().includes(fruitName.toLowerCase()) ||
        r.description?.toLowerCase().includes(fruitName.toLowerCase())
      ).slice(0, 6);
      setRelatedRecipes(related);

      // Get featured ebook products from local data
      const ebookProducts = products
        .filter(p => p.category === 'ebook')
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          title: p.title || p.name || '',
          slug: p.slug,
          category: p.category,
          price: p.price,
          cover_image: p.cover_image,
          short_description: p.short_description,
        }));
      setRecommendedProducts(ebookProducts);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-caribbean-green"></div>
      </div>
    );
  }

  return (
    <>
      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-charcoal">
              🍽️ Recipes with {fruitName}
            </h2>
            <button
              onClick={() => navigate('/recipes')}
              className="text-caribbean-green hover:underline text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 mb-8">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">
            📚 Love {fruitName}? Get Our Ebook Collections!
          </h2>
          <p className="text-charcoal-light mb-6">
            Discover 115+ tropical fruit recipes in our complete ebook series
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {recommendedProducts.map(product => (
              <a
                key={product.id}
                href={`/store/${product.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="aspect-[2/3] bg-gray-100">
                  <img
                    src={product.cover_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 group-hover:text-caribbean-green transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-caribbean-green">${product.price}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="/store/ebooks" className="btn-primary inline-block">
              Browse All Ebooks →
            </a>
          </div>
        </div>
      )}
    </>
  );
}
