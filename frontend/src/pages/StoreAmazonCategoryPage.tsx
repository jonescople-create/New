import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from '../App';

const AMAZON_AFFILIATE_ID = 'islandfruitgu-20';

interface CategoryProps {
  category: 'fruit-growing' | 'kitchen-tools' | 'fruit-seeds' | 'wall-charts';
}

const CATEGORY_CONFIG = {
  'fruit-growing': {
    title: '🌱 Fruit Growing Supplies',
    description: 'Essential tools and supplies for growing your own tropical fruits at home',
    hero: 'Everything you need to start your tropical fruit garden',
    products: [
      {
        title: 'Tropical Fruit Tree Growing Guide Book',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        description: 'Complete guide to growing tropical fruits from seed to harvest',
        amazonSearch: 'tropical+fruit+growing+book',
        price: '$24.99'
      },
      {
        title: 'Premium Potting Soil for Tropical Plants',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
        description: 'Nutrient-rich soil blend specifically formulated for tropical fruits',
        amazonSearch: 'tropical+plant+potting+soil',
        price: '$19.99'
      },
      {
        title: 'Plant Grow Lights for Indoor Fruits',
        image: 'https://images.unsplash.com/photo-1585519374299-d4d8d4a3c515?w=400',
        description: 'Full spectrum LED grow lights for year-round fruit growing',
        amazonSearch: 'led+grow+lights+indoor',
        price: '$45.99'
      },
      {
        title: 'Grafting Tool Kit',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        description: 'Professional grafting tools for propagating fruit trees',
        amazonSearch: 'grafting+tool+kit',
        price: '$32.99'
      }
    ]
  },
  'kitchen-tools': {
    title: '🔪 Kitchen Tools for Tropical Fruits',
    description: 'Premium tools for preparing and enjoying tropical fruits',
    hero: 'Make fruit prep easier with professional-grade tools',
    products: [
      {
        title: 'Professional Mango Splitter',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400',
        description: 'Perfectly slice mangoes in seconds with this specialized tool',
        amazonSearch: 'mango+splitter+tool',
        price: '$14.99'
      },
      {
        title: 'Pineapple Corer and Slicer',
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400',
        description: 'Core and slice pineapples effortlessly',
        amazonSearch: 'pineapple+corer+slicer',
        price: '$12.99'
      },
      {
        title: 'High-Speed Blender for Smoothies',
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
        description: 'Professional blender perfect for tropical smoothies',
        amazonSearch: 'high+speed+blender+smoothies',
        price: '$89.99'
      },
      {
        title: 'Citrus Juicer Press',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
        description: 'Manual press for fresh tropical citrus juice',
        amazonSearch: 'citrus+juicer+press',
        price: '$18.99'
      }
    ]
  },
  'fruit-seeds': {
    title: '🌱 Tropical Fruit Seeds',
    description: 'Authentic tropical fruit seeds for your home garden',
    hero: 'Grow exotic fruits from seed with our curated collection',
    products: [
      {
        title: 'Mango Seed Collection (5 Varieties)',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
        description: 'Premium mango seeds from the Caribbean',
        amazonSearch: 'mango+seeds+growing',
        price: '$16.99'
      },
      {
        title: 'Dragon Fruit Seeds',
        image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400',
        description: 'Exotic pitaya seeds for home cultivation',
        amazonSearch: 'dragon+fruit+seeds',
        price: '$12.99'
      },
      {
        title: 'Passion Fruit Vine Seeds',
        image: 'https://images.unsplash.com/photo-1523843799912-e56c7c6c9a0e?w=400',
        description: 'Fast-growing passion fruit vine seeds',
        amazonSearch: 'passion+fruit+seeds',
        price: '$9.99'
      },
      {
        title: 'Papaya Seeds (Hawaiian Variety)',
        image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400',
        description: 'Sweet Hawaiian papaya seeds',
        amazonSearch: 'papaya+seeds+hawaiian',
        price: '$8.99'
      }
    ]
  },
  'wall-charts': {
    title: '📊 Educational Wall Charts',
    description: 'Beautiful tropical fruit reference posters and charts',
    hero: 'Decorate your space with educational fruit posters',
    products: [
      {
        title: 'Tropical Fruits of the Caribbean Poster',
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400',
        description: 'Large format wall chart featuring 50+ tropical fruits',
        amazonSearch: 'tropical+fruits+poster+chart',
        price: '$24.99'
      },
      {
        title: 'Fruit Nutrition Chart',
        image: 'https://images.unsplash.com/photo-1498579397066-22750a3cb424?w=400',
        description: 'Nutritional information for tropical fruits',
        amazonSearch: 'fruit+nutrition+chart+poster',
        price: '$18.99'
      },
      {
        title: 'Seasonal Fruit Calendar Poster',
        image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400',
        description: 'Month-by-month tropical fruit seasonality guide',
        amazonSearch: 'seasonal+fruit+calendar',
        price: '$19.99'
      },
      {
        title: 'Smoothie Recipe Wall Chart',
        image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
        description: 'Visual guide to 30 tropical smoothie recipes',
        amazonSearch: 'smoothie+recipes+poster',
        price: '$16.99'
      }
    ]
  }
};

export function StoreAmazonCategoryPage({ category }: CategoryProps) {
  const config = CATEGORY_CONFIG[category];

  useEffect(() => {
    setupPageSEO({
      title: `${config.title} | IslandFruitGuide Store`,
      description: config.description,
      path: `/store/${category}`
    });
  }, [category]);

  const buildAmazonLink = (searchTerm: string) => {
    return `https://www.amazon.com/s?k=${searchTerm}&tag=${AMAZON_AFFILIATE_ID}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-caribbean-green to-leaf py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/store')}
            className="text-white/90 hover:text-white mb-4 text-sm"
          >
            ← Back to Store
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {config.title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {config.hero}
          </p>
        </div>
      </div>

      {/* Amazon Disclosure */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-amber-900">
            💡 <strong>Amazon Affiliate Disclosure:</strong> IslandFruitGuide is a participant in the Amazon Services LLC Associates Program. 
            We may earn a small commission from qualifying purchases at no extra cost to you.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.products.map((product, index) => (
            <a
              key={index}
              href={buildAmazonLink(product.amazonSearch)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-900">
                  Amazon
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-caribbean-green transition-colors line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-caribbean-green">
                    {product.price}
                  </span>
                  <span className="text-caribbean-green text-sm font-medium group-hover:underline">
                    View on Amazon →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Why Shop Through Us */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Shop Through IslandFruitGuide?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-2">Curated Selection</h3>
              <p className="text-gray-600 text-sm">We only recommend products we trust and use ourselves</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🌴</div>
              <h3 className="font-bold text-lg mb-2">Support Our Mission</h3>
              <p className="text-gray-600 text-sm">Your purchases help us create more free tropical fruit content</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-lg mb-2">Amazon Protection</h3>
              <p className="text-gray-600 text-sm">Secure checkout and customer service through Amazon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
