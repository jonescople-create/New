export interface Product {
  id: string;
  name?: string;
  title: string;
  slug: string;
  category: 'ebook' | 'recipe-pack' | 'printable';
  price: number;
  original_price?: number;
  short_description: string;
  long_description?: string;
  description?: string;
  cover_image: string;
  images?: string[];
  table_of_contents?: string[];
  features: string[];
  page_count: number;
  file_format: string;
  file_size: string;
  download_url: string;
  related_fruits: string[];
  seo_title: string;
  seo_description: string;
  is_featured: boolean;
  created_at: string;
}

export const products: Product[] = [
  {
    id: "ebook-001",
    title: "Tropical Juice & Smoothie Recipe Book",
    slug: "tropical-juice-smoothie-recipes",
    category: "ebook",
    price: 12,
    short_description: "50 delicious tropical juice and smoothie recipes featuring Caribbean fruits like mango, papaya, guava, and passion fruit.",
    long_description: `Discover the vibrant world of Caribbean tropical drinks with this comprehensive recipe collection. 

This ebook features 50 carefully curated recipes that showcase the incredible flavors of tropical fruits. From energizing breakfast smoothies to refreshing afternoon juices and detox drinks, each recipe is designed to bring the taste of the islands to your kitchen.

**What You'll Learn:**
• How to select and prepare tropical fruits for maximum flavor
• Perfect fruit combinations for balanced taste and nutrition
• Traditional Caribbean drink recipes passed down through generations
• Modern twists on classic tropical beverages
• Nutritional benefits of each featured fruit

**Featured Fruits:**
This collection highlights papaya, passion fruit, guava, soursop, dragon fruit, mango, pineapple, tamarind, and many more exotic Caribbean fruits.

**Perfect For:**
• Home cooks wanting to explore Caribbean cuisine
• Health enthusiasts seeking nutritious tropical drinks
• Anyone craving authentic island flavors
• Smoothie lovers looking for new recipe inspiration

Each recipe includes detailed instructions, ingredient lists, nutritional information, and tips for customization. Full-color photos accompany select recipes.`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/09c02ddbfbdb6b291fbfd337cb0bbc8542f5b55dc7b7fdd71b9c9aa0d5bb52bd.png",
    table_of_contents: [
      "Introduction to Caribbean Tropical Fruits",
      "Chapter 1: Morning Energy Smoothies (10 recipes)",
      "  - Papaya Sunrise Smoothie",
      "  - Mango Energy Blast",
      "  - Guava Power Bowl",
      "  - Tropical Green Smoothie",
      "Chapter 2: Refreshing Juices (15 recipes)",
      "  - Passion Fruit Paradise Juice",
      "  - Soursop Immunity Booster",
      "  - Dragon Fruit Refresher",
      "  - Pineapple Ginger Zing",
      "Chapter 3: Detox & Wellness Drinks (10 recipes)",
      "  - Papaya Cleanse Smoothie",
      "  - Guava Detox Juice",
      "  - Tamarind Digestive Tonic",
      "Chapter 4: Dessert Smoothies (10 recipes)",
      "  - Mango Coconut Dream",
      "  - Passion Fruit Cheesecake Smoothie",
      "  - Soursop Ice Cream Shake",
      "Chapter 5: Party Mocktails (5 recipes)",
      "  - Caribbean Sunset Punch",
      "  - Tropical Fruit Sangria",
      "  - Guava Mojito Mocktail",
      "Bonus: Fruit Selection & Storage Guide",
      "Appendix: Nutritional Information Chart"
    ],
    features: [
      "50 unique tropical drink recipes",
      "Full-color photography",
      "Step-by-step instructions",
      "Nutritional information for each recipe",
      "Ingredient substitution guide",
      "Fruit selection and storage tips",
      "Equipment recommendations",
      "Instant digital download"
    ],
    page_count: 78,
    file_format: "PDF",
    file_size: "25 MB",
    download_url: "/downloads/tropical-juice-smoothie-recipes.pdf",
    related_fruits: ["mango", "papaya", "guava", "passion-fruit", "soursop", "dragon-fruit"],
    seo_title: "50 Caribbean Tropical Juices & Smoothies Recipe Book - Download PDF",
    seo_description: "Download a tropical smoothie and juice recipe book featuring Caribbean fruits like papaya, guava, mango, and passion fruit. 50 recipes with full instructions.",
    is_featured: true,
    created_at: "2024-03-07"
  },
  {
    id: "ebook-002",
    title: "Caribbean Fruit Encyclopedia",
    slug: "caribbean-fruit-guide",
    category: "ebook",
    price: 24,
    short_description: "The definitive guide to 100+ tropical and Caribbean fruits with detailed profiles, health benefits, and culinary uses.",
    long_description: `The most comprehensive digital guide to Caribbean and tropical fruits ever created. This authoritative encyclopedia is your complete resource for understanding, selecting, and enjoying over 100 exotic fruits.

**What Makes This Encyclopedia Special:**
• Detailed profiles of 100+ tropical fruits
• Stunning botanical illustrations and photography
• Cultural and historical context for each fruit
• Evidence-based health benefit information
• Traditional and modern recipe applications

**Each Fruit Profile Includes:**
• **Origin & History** - Where the fruit comes from and its cultural significance
• **Flavor Profile** - Detailed taste descriptions to help you know what to expect
• **Nutritional Analysis** - Complete breakdown of vitamins, minerals, and health compounds
• **Health Benefits** - Science-backed information on medicinal properties
• **Selection Guide** - How to choose perfectly ripe fruit
• **Storage Tips** - Proper storage methods to maximize freshness
• **Culinary Uses** - Traditional and creative ways to enjoy each fruit
• **Recipe Ideas** - Quick recipe suggestions featuring each fruit

**Featured Fruits Include:**
Mango, Soursop, Ackee, Breadfruit, Guava, Dragon Fruit, Papaya, Tamarind, Star Apple, Otaheite Apple, Passion Fruit, Carambola, Guinep, Golden Apple, June Plum, Naseberry, Custard Apple, Sugar Apple, Mammee Apple, and 80+ more!

**Perfect For:**
• Food enthusiasts exploring Caribbean cuisine
• Health-conscious individuals seeking nutritional information
• Travelers visiting tropical destinations
• Culinary students and professional chefs
• Anyone curious about exotic fruits

This encyclopedia is the result of extensive research, combining traditional Caribbean knowledge with modern nutritional science. It's an essential reference for anyone interested in tropical fruits.`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/07119d53adca3e611b37ddd1cffcca420e0bf0dd5a6a09117d44138778df32d4.png",
    table_of_contents: [
      "Introduction: The Rich Diversity of Caribbean Fruits",
      "How to Use This Encyclopedia",
      "Part I: Popular Caribbean Fruits (20 fruits)",
      "  - Mango: The King of Tropical Fruits",
      "  - Papaya: The Digestive Powerhouse",
      "  - Guava: Vitamin C Champion",
      "  - Soursop: The Immunity Booster",
      "  - Ackee: Jamaica's National Treasure",
      "Part II: Common Island Fruits (25 fruits)",
      "  - Breadfruit: The Caribbean Staple",
      "  - Passion Fruit: Tropical Tanginess",
      "  - Dragon Fruit: The Exotic Beauty",
      "  - Tamarind: Sweet and Sour Delight",
      "  - Star Apple: The Purple Gem",
      "Part III: Lesser-Known Treasures (30 fruits)",
      "  - Otaheite Apple: Crisp and Refreshing",
      "  - Guinep: The Summer Favorite",
      "  - Naseberry: Caramel Sweetness",
      "  - June Plum: Tart and Juicy",
      "  - Golden Apple: Sweet Nostalgia",
      "Part IV: Rare & Exotic Varieties (25 fruits)",
      "  - Mammee Apple: The Brown Beauty",
      "  - Custard Apple: Creamy Indulgence",
      "  - Sea Grape: Coastal Delight",
      "  - Carambola: The Star Fruit",
      "Part V: Seasonal Availability Guide",
      "Part VI: Fruit Pairing & Combination Chart",
      "Part VII: Growing Your Own Tropical Fruits",
      "Appendix A: Nutritional Comparison Tables",
      "Appendix B: Health Benefits Quick Reference",
      "Appendix C: Glossary of Terms",
      "Index"
    ],
    features: [
      "100+ detailed fruit profiles",
      "Beautiful botanical illustrations",
      "High-quality photography",
      "Nutritional data for every fruit",
      "Health benefit information",
      "Selection and storage guides",
      "Recipe suggestions for each fruit",
      "Seasonal availability calendar",
      "Searchable PDF format",
      "Lifetime access and updates"
    ],
    page_count: 245,
    file_format: "PDF",
    file_size: "68 MB",
    download_url: "/downloads/caribbean-fruit-encyclopedia.pdf",
    related_fruits: ["mango", "soursop", "ackee", "breadfruit", "guava", "papaya", "tamarind", "passion-fruit"],
    seo_title: "Caribbean Fruit Encyclopedia - Complete Guide to 100+ Tropical Fruits",
    seo_description: "The definitive digital encyclopedia of Caribbean and tropical fruits. Detailed profiles, health benefits, nutritional information, and culinary uses for 100+ exotic fruits.",
    is_featured: true,
    created_at: "2024-03-07"
  },
  {
    id: "ebook-003",
    title: "Caribbean Medicinal Leaves Guide",
    slug: "medicinal-leaves-guide",
    category: "ebook",
    price: 15,
    short_description: "Complete guide to 39 Caribbean medicinal plants and leaves, including traditional uses, preparation methods, and safety information.",
    long_description: `Discover the healing power of Caribbean medicinal plants with this authoritative guide to traditional herbal remedies.

This comprehensive ebook documents 39 medicinal plants used throughout the Caribbean for generations. Each plant profile combines traditional folk medicine knowledge with modern safety information.

**What's Included:**
• 39 detailed medicinal plant profiles
• Traditional uses and folk medicine practices
• Tea and preparation recipes
• Safety notes and contraindications
• Pregnancy warnings where applicable
• Dosage recommendations
• Plant identification guides

**Featured Plants:**
Soursop leaves, guava leaves, breadfruit leaves, cerasee, moringa, tamarind leaves, neem, fever grass, sage, and 30+ more traditional healing plants.

**Important Note:**
This guide documents traditional practices and is NOT medical advice. All information is for educational purposes. Always consult a healthcare provider before using any herbal remedies.

**Perfect For:**
• Anyone interested in natural medicine
• Students of Caribbean culture and herbalism
• Home gardeners growing medicinal plants
• Researchers of traditional healing practices`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/995810efc60d2e86bd5c9833b65be0858e51b412598a6c4fd835f05d44ca230c.png",
    table_of_contents: [
      "Introduction to Caribbean Herbal Medicine",
      "How to Use This Guide Safely",
      "Part 1: Popular Medicinal Leaves (10 plants)",
      "  - Soursop Leaves: Cancer Research & Immunity",
      "  - Guava Leaves: Digestive Health & Diabetes",
      "  - Moringa: The Miracle Tree",
      "  - Cerasee: Bitter Detox & Blood Sugar",
      "Part 2: Common Healing Plants (15 plants)",
      "  - Neem: Skin Conditions & Infections",
      "  - Fever Grass: Cold & Flu Relief",
      "  - Breadfruit Leaves: Blood Pressure Support",
      "  - Tamarind Leaves: Digestive Aid",
      "Part 3: Lesser-Known Remedies (14 plants)",
      "  - Sage: Respiratory Health",
      "  - Guinea Hen Weed: Anti-inflammatory",
      "  - Trumpet Tree: Respiratory & Diabetes",
      "Part 4: Tea Preparation Methods",
      "Part 5: Safety & Contraindications",
      "Appendix: Quick Reference Guide",
      "Glossary of Terms"
    ],
    features: [
      "39 medicinal plant profiles",
      "Traditional uses documentation",
      "Tea and tincture recipes",
      "Safety and contraindication warnings",
      "Pregnancy and medication interaction flags",
      "Plant identification photos",
      "Dosage guidelines",
      "Instant digital download"
    ],
    page_count: 156,
    file_format: "PDF",
    file_size: "42 MB",
    download_url: "/downloads/medicinal-leaves-guide.pdf",
    related_fruits: ["soursop", "guava", "breadfruit", "tamarind"],
    seo_title: "Caribbean Medicinal Leaves Guide - 39 Traditional Healing Plants",
    seo_description: "Complete guide to Caribbean medicinal plants and leaves. Learn traditional uses, tea recipes, and safety information for 39 healing plants including soursop, guava, and moringa.",
    is_featured: false,
    created_at: "2024-03-07"
  },
  {
    id: "ebook-004",
    title: "Tropical Fruit Desserts",
    slug: "tropical-fruit-desserts",
    category: "ebook",
    price: 12,
    short_description: "60 mouthwatering dessert recipes featuring tropical fruits like mango, papaya, passion fruit, and guava.",
    long_description: `Indulge in the sweet side of Caribbean fruits with this delicious dessert collection.

This ebook features 60 tested dessert recipes that showcase tropical fruits in cakes, tarts, ice creams, puddings, and more. From simple fruit salads to elaborate layered desserts, each recipe brings the natural sweetness of island fruits to your table.

**Recipe Categories:**
• Cakes & Cheesecakes (15 recipes)
• Tarts & Pies (12 recipes)
• Ice Cream & Frozen Treats (10 recipes)
• Puddings & Custards (8 recipes)
• Simple Fruit Desserts (10 recipes)
• Party Desserts (5 recipes)

**Featured Fruits:**
Mango, papaya, passion fruit, guava, soursop, breadfruit, banana, pineapple, coconut, tamarind, and more.

**Each Recipe Includes:**
• Step-by-step instructions
• Ingredient measurements (US & metric)
• Prep and cooking times
• Serving suggestions
• Storage tips
• Substitution options

**Perfect For:**
• Home bakers exploring tropical flavors
• Party hosts needing impressive desserts
• Anyone with a sweet tooth for island treats
• Culinary students studying Caribbean cuisine`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/7fddc191c7a9d052a5fcd265d024a97285e7ee482459025d35713dd29f88e4c5.png",
    table_of_contents: [
      "Introduction: Tropical Fruits in Desserts",
      "Essential Ingredients & Equipment",
      "Chapter 1: Cakes & Cheesecakes",
      "  - Mango Passion Cheesecake",
      "  - Guava Cream Cake",
      "  - Coconut Pineapple Layer Cake",
      "  - Papaya Upside-Down Cake",
      "Chapter 2: Tarts & Pies",
      "  - Classic Guava Tart",
      "  - Passion Fruit Meringue Pie",
      "  - Mango Coconut Tart",
      "  - Soursop Cream Pie",
      "Chapter 3: Ice Cream & Frozen Treats",
      "  - Soursop Ice Cream",
      "  - Mango Sorbet",
      "  - Coconut Popsicles",
      "  - Passion Fruit Granita",
      "Chapter 4: Puddings & Custards",
      "  - Breadfruit Pudding",
      "  - Mango Panna Cotta",
      "  - Papaya Custard",
      "Chapter 5: Simple Fruit Desserts",
      "  - Tropical Fruit Salad",
      "  - Grilled Pineapple with Rum",
      "  - Caramelized Banana",
      "Chapter 6: Party Showstoppers",
      "  - Tropical Fruit Trifle",
      "  - Mango Pavlova",
      "  - Caribbean Fruit Tower",
      "Appendix: Ingredient Substitutions"
    ],
    features: [
      "60 tropical dessert recipes",
      "Full-color photos",
      "US and metric measurements",
      "Prep and cooking times",
      "Difficulty ratings",
      "Storage and serving tips",
      "Ingredient substitution guide",
      "Instant download"
    ],
    page_count: 128,
    file_format: "PDF",
    file_size: "55 MB",
    download_url: "/downloads/tropical-fruit-desserts.pdf",
    related_fruits: ["mango", "papaya", "passion-fruit", "guava", "soursop", "breadfruit"],
    seo_title: "Tropical Fruit Desserts - 60 Caribbean Dessert Recipes",
    seo_description: "60 delicious tropical dessert recipes featuring mango, papaya, guava, and passion fruit. Cakes, tarts, ice cream, puddings, and more Caribbean sweet treats.",
    is_featured: false,
    created_at: "2024-03-07"
  },
  {
    id: "pack-001",
    title: "Mango Recipe Collection",
    slug: "mango-recipe-pack",
    category: "recipe-pack",
    price: 5,
    short_description: "15 delicious mango recipes including drinks, desserts, main dishes, and sauces featuring the king of tropical fruits.",
    long_description: `Everything you need to master cooking with mangoes! This focused recipe pack features 15 tested recipes that showcase mango in all its glory.

**What's Included:**
• 5 Mango Drinks (smoothies, juices, cocktails)
• 4 Mango Desserts (cheesecake, ice cream, tart, mousse)
• 3 Main Dishes (curry, salad, grilled chicken)
• 3 Sauces & Condiments (chutney, salsa, BBQ sauce)

**Each Recipe Features:**
• Detailed instructions
• Ingredient lists
• Prep/cook times
• Serving suggestions
• Tips for selecting ripe mangoes

Perfect for mango lovers who want quick, delicious recipes without a full cookbook.`,
    cover_image: "https://customer-assets.emergentagent.com/job_zip-site-clone/artifacts/iuzhbzrc_Gemini_Generated_Image_jfpezfjfpezfjfpe.png",
    table_of_contents: [
      "Mango Selection Guide",
      "Drinks Section (5 recipes)",
      "Desserts Section (4 recipes)",
      "Main Dishes (3 recipes)",
      "Sauces & Condiments (3 recipes)",
      "Bonus: Mango Storage Tips"
    ],
    features: [
      "15 mango-focused recipes",
      "Multiple categories covered",
      "Quick-reference format",
      "Beginner-friendly instructions",
      "Shopping list included",
      "Instant digital download"
    ],
    page_count: 28,
    file_format: "PDF",
    file_size: "12 MB",
    download_url: "/downloads/mango-recipe-pack.pdf",
    related_fruits: ["mango"],
    seo_title: "Mango Recipe Collection - 15 Tropical Mango Recipes",
    seo_description: "Download 15 delicious mango recipes including drinks, desserts, main dishes, and sauces. Perfect for mango lovers!",
    is_featured: false,
    created_at: "2024-03-07"
  },
  {
    id: "print-001",
    title: "Caribbean Fruit Season Calendar",
    slug: "fruit-season-calendar",
    category: "printable",
    price: 3,
    short_description: "Beautiful printable wall calendar showing peak seasons for 30+ Caribbean and tropical fruits throughout the year.",
    long_description: `Never miss peak fruit season again with this gorgeous printable calendar!

This beautifully designed wall calendar shows you exactly when each tropical fruit is at its best. Perfect for kitchen walls, farmer's market planning, or gardening schedules.

**Features:**
• 30+ tropical fruits tracked
• Month-by-month availability
• Color-coded peak seasons
• Beautiful botanical illustrations
• Print-ready high-resolution PDF

**Fruits Included:**
Mango, papaya, guava, soursop, ackee, breadfruit, passion fruit, dragon fruit, tamarind, star apple, and 20+ more.

**Print Options:**
• Letter size (8.5" x 11")
• A4 size
• Poster size (11" x 17")

Hang it in your kitchen and plan your tropical fruit adventures all year long!`,
    cover_image: "https://customer-assets.emergentagent.com/job_zip-site-clone/artifacts/a7yu7sao_Gemini_Generated_Image_cdguk5cdguk5cdgu.png",
    table_of_contents: [
      "How to Use This Calendar",
      "Full Year Calendar View",
      "January - March Fruits",
      "April - June Fruits",
      "July - September Fruits",
      "October - December Fruits",
      "Regional Variations Guide"
    ],
    features: [
      "30+ fruits tracked",
      "High-resolution printable PDF",
      "Multiple print sizes supported",
      "Color-coded peak seasons",
      "Beautiful botanical design",
      "Instant download"
    ],
    page_count: 3,
    file_format: "PDF",
    file_size: "8 MB",
    download_url: "/downloads/fruit-season-calendar.pdf",
    related_fruits: ["mango", "papaya", "guava", "soursop", "ackee", "breadfruit"],
    seo_title: "Caribbean Fruit Season Calendar - Printable Tropical Fruit Guide",
    seo_description: "Beautiful printable calendar showing peak seasons for 30+ Caribbean tropical fruits. Perfect for kitchen planning and farmer's market visits.",
    is_featured: false,
    created_at: "2024-03-07"
  },
  {
    id: "pack-002",
    title: "Papaya Recipe Collection",
    slug: "papaya-recipe-pack",
    category: "recipe-pack",
    price: 5,
    short_description: "12 delicious papaya recipes including smoothies, salads, desserts, and main dishes featuring the digestive powerhouse fruit.",
    long_description: `Master the art of cooking with papaya! This focused recipe collection features 12 tested recipes showcasing papaya's versatility.

**What's Included:**
• 4 Papaya Smoothies & Drinks (breakfast energizers, digestive tonics)
• 3 Fresh Salads (green papaya salad, tropical fruit mix)
• 3 Desserts (papaya pudding, sorbet, cheesecake)
• 2 Main Dishes (papaya chicken, grilled fish with papaya salsa)

**Each Recipe Features:**
• Detailed step-by-step instructions
• Ingredient lists with alternatives
• Prep and cooking times
• Nutritional benefits of papaya
• Tips for selecting ripe papayas

**Health Benefits:**
Learn how papaya's powerful enzyme papain aids digestion, plus get tips on using papaya for skin care and natural remedies.

Perfect for health-conscious cooks who want to incorporate this superfruit into their daily meals!`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/babaccc35d2212b8d413b6d8ee3275b4c5310eaaf26287fafc1ba0bf686fe5d2.png",
    table_of_contents: [
      "Introduction: The Power of Papaya",
      "Selecting & Storing Papayas",
      "Smoothies & Drinks (4 recipes)",
      "  - Papaya Sunrise Smoothie",
      "  - Digestive Wellness Shake",
      "  - Tropical Green Smoothie",
      "  - Papaya Lassi",
      "Fresh Salads (3 recipes)",
      "  - Classic Green Papaya Salad",
      "  - Tropical Papaya Fruit Salad",
      "  - Papaya Avocado Salad",
      "Desserts (3 recipes)",
      "  - Creamy Papaya Pudding",
      "  - Papaya Sorbet",
      "  - Mini Papaya Cheesecakes",
      "Main Dishes (2 recipes)",
      "  - Papaya-Glazed Chicken",
      "  - Grilled Fish with Papaya Salsa",
      "Bonus: Papaya Seed Uses"
    ],
    features: [
      "12 papaya-focused recipes",
      "Multiple meal categories",
      "Health benefit information",
      "Quick-reference format",
      "Beginner to intermediate level",
      "Shopping list included",
      "Instant digital download"
    ],
    page_count: 24,
    file_format: "PDF",
    file_size: "10 MB",
    download_url: "/downloads/papaya-recipe-pack.pdf",
    related_fruits: ["papaya"],
    seo_title: "Papaya Recipe Collection - 12 Healthy Papaya Recipes PDF",
    seo_description: "Download 12 delicious papaya recipes including smoothies, salads, desserts, and main dishes. Perfect for digestive health and tropical cooking.",
    is_featured: false,
    created_at: "2024-03-08"
  },
  {
    id: "pack-003",
    title: "Soursop Drinks & Smoothies",
    slug: "soursop-drinks-pack",
    category: "recipe-pack",
    price: 5,
    short_description: "10 refreshing soursop drink recipes from traditional Caribbean teas to modern smoothie bowls featuring this immunity-boosting superfruit.",
    long_description: `Discover the incredible flavor and health benefits of soursop with this drink-focused recipe collection!

**What's Included:**
• 4 Soursop Smoothies (creamy, tropical, protein-packed)
• 3 Traditional Soursop Teas (hot and iced variations)
• 2 Soursop Juices (pure and blended)
• 1 Soursop Smoothie Bowl (with toppings guide)

**Each Recipe Features:**
• Clear instructions for fresh or frozen soursop
• Flavor pairing suggestions
• Sweetener options (natural and refined)
• Health benefit highlights
• Serving suggestions

**Health Focus:**
Soursop is traditionally used for immune support, relaxation, and digestive health. Learn the proper ways to prepare soursop drinks while preserving nutrients.

**Safety Information:**
Complete guide on safe soursop consumption, proper preparation methods, and who should avoid soursop (with medical conditions).

Perfect for health enthusiasts exploring Caribbean superfruits and natural wellness drinks!`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/67b9dae6501289484f5b470fdab283cf84e099f5546cb0398b12b0619eb12b37.png",
    table_of_contents: [
      "Introduction: The Soursop Superfruit",
      "How to Select & Prepare Soursop",
      "Safety Guidelines",
      "Soursop Smoothies (4 recipes)",
      "  - Classic Soursop Smoothie",
      "  - Soursop Banana Protein Shake",
      "  - Green Soursop Detox",
      "  - Soursop Mango Fusion",
      "Traditional Teas (3 recipes)",
      "  - Hot Soursop Leaf Tea",
      "  - Iced Soursop Tea",
      "  - Soursop Ginger Tea",
      "Fresh Juices (2 recipes)",
      "  - Pure Soursop Juice",
      "  - Soursop Pineapple Blend",
      "Smoothie Bowls (1 recipe)",
      "  - Tropical Soursop Bowl with Toppings",
      "Bonus: Soursop Health Benefits Guide"
    ],
    features: [
      "10 soursop drink recipes",
      "Traditional and modern preparations",
      "Safety guidelines included",
      "Health benefit information",
      "Fresh and frozen options",
      "Natural sweetener alternatives",
      "Instant digital download"
    ],
    page_count: 20,
    file_format: "PDF",
    file_size: "9 MB",
    download_url: "/downloads/soursop-drinks-pack.pdf",
    related_fruits: ["soursop"],
    seo_title: "Soursop Drinks & Smoothies - 10 Immunity-Boosting Recipes",
    seo_description: "10 refreshing soursop drink recipes including smoothies, teas, and juices. Learn safe preparation methods and health benefits of this Caribbean superfruit.",
    is_featured: false,
    created_at: "2024-03-08"
  },
  {
    id: "pack-004",
    title: "Guava Dessert Collection",
    slug: "guava-dessert-pack",
    category: "recipe-pack",
    price: 5,
    short_description: "10 sweet guava dessert recipes from traditional Caribbean guava cheese to modern tarts and mousses featuring this vitamin C-rich fruit.",
    long_description: `Indulge in the sweet, aromatic flavor of guava with this dessert-focused recipe collection!

**What's Included:**
• 3 Guava Pastries (tarts, turnovers, pasteles)
• 3 Creamy Desserts (mousse, panna cotta, cheesecake)
• 2 Traditional Treats (guava cheese/paste, guava bars)
• 2 Simple Desserts (fruit salad, grilled guava)

**Each Recipe Features:**
• Detailed baking instructions
• Fresh vs. canned guava guidance
• Ingredient substitutions
• Serving and presentation tips
• Storage recommendations

**Cultural Heritage:**
Learn about traditional Caribbean guava desserts and their cultural significance, plus modern twists on classic recipes.

**Baking Tips:**
Master working with guava's unique texture and natural pectin, perfect for jams, jellies, and pastry fillings.

Perfect for home bakers who want to explore tropical fruit desserts with a Caribbean flair!`,
    cover_image: "https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/b408b7cde3cdc99811b922a41fcb7857a373739f4f8861e03155a2089403ce66.png",
    table_of_contents: [
      "Introduction: Baking with Guava",
      "Fresh vs. Canned Guava Guide",
      "Guava Pastries (3 recipes)",
      "  - Classic Guava Tart",
      "  - Guava Cream Cheese Turnovers",
      "  - Guava Pasteles",
      "Creamy Desserts (3 recipes)",
      "  - Guava Mousse",
      "  - Guava Panna Cotta",
      "  - Mini Guava Cheesecakes",
      "Traditional Treats (2 recipes)",
      "  - Homemade Guava Cheese/Paste",
      "  - Guava Coconut Bars",
      "Simple Desserts (2 recipes)",
      "  - Tropical Guava Fruit Salad",
      "  - Grilled Guava with Honey",
      "Bonus: Guava Sauce & Glaze Recipes"
    ],
    features: [
      "10 guava dessert recipes",
      "Traditional and modern styles",
      "Baking tips and techniques",
      "Fresh and canned guava options",
      "Step-by-step photos",
      "Difficulty ratings",
      "Instant digital download"
    ],
    page_count: 22,
    file_format: "PDF",
    file_size: "11 MB",
    download_url: "/downloads/guava-dessert-pack.pdf",
    related_fruits: ["guava"],
    seo_title: "Guava Dessert Collection - 10 Caribbean Sweet Recipes PDF",
    seo_description: "10 delicious guava dessert recipes including tarts, mousse, cheesecake, and traditional guava cheese. Perfect for tropical baking enthusiasts.",
    is_featured: false,
    created_at: "2024-03-08"
  },


  // ── IslandFruitGuide Tropical Nutrition Series ───────────────────────────
  {
    id: "ebook-gym-energy-recipes",
    title: "Tropical Gym Energy Recipes",
    slug: "gym-energy-recipes",
    category: "ebook",
    price: 9.99,
    original_price: 17.99,
    short_description: "50+ natural pre & post-workout smoothies and juices powered by Caribbean tropical fruits. Fuel your training the clean, tropical way.",
    long_description: `Discover the power of Caribbean superfruits for your training goals. This ebook brings together 50+ natural energy recipes using banana, mango, pineapple, dragon fruit, coconut water, and more — the same fruits that fuel Caribbean athletes for generations.

**What's Inside:**
• 50+ pre-workout, intra-workout & recovery recipes
• Full nutritional breakdown per recipe
• 7-Day Tropical Athlete Meal Plan
• Natural electrolyte drink formulas
• Fruit pairing guide for peak performance
• How to use coconut water as a sports drink

**Why Tropical Fruits?**
Tropical fruits contain natural sugars, potassium, vitamin C, and enzymes that support sustained energy, hydration, and faster muscle recovery — without synthetic additives.

**Perfect For:**
Athletes, gym-goers, runners, dancers, martial artists, and anyone who wants clean natural energy from real Caribbean fruits.`,
    cover_image: "",
    table_of_contents: [
      "Introduction: Why Tropical Fruits Power Performance",
      "Chapter 1: Pre-Workout Boosters (12 recipes)",
      "  - Mango Power Blast",
      "  - Banana Peanut Butter Fuel",
      "  - Pineapple Ginger Ignite",
      "  - Dragon Fruit Lightning Shake",
      "  - Green Banana Energy Bowl",
      "Chapter 2: Intra-Workout Hydration (8 recipes)",
      "  - Coconut Water Electrolyte Elixir",
      "  - Watermelon Mint Recovery Sip",
      "  - Banana Lime Endurance Drink",
      "Chapter 3: Post-Workout Recovery (15 recipes)",
      "  - Mango Turmeric Repair Shake",
      "  - Papaya Enzyme Recovery Bowl",
      "  - Soursop Calm & Restore Drink",
      "  - Passion Fruit Protein Punch",
      "Chapter 4: Morning Energy Rituals (10 recipes)",
      "  - Caribbean Sunrise Smoothie",
      "  - Tropical Green Wake-Up",
      "  - Guava Glow Morning Blend",
      "Chapter 5: Evening Wind-Down (5 recipes)",
      "  - Soursop Sleeptime Tonic",
      "  - Banana Honey Calm Shake",
      "Bonus: 7-Day Tropical Athlete Meal Plan",
      "Appendix: Nutritional Charts",
    ],
    features: [
      "50+ natural energy recipes",
      "Nutritional data per recipe",
      "7-Day tropical athlete meal plan",
      "Natural electrolyte drink guide",
      "Pre, intra & post-workout chapters",
      "Instant digital download",
    ],
    page_count: 68,
    file_format: "PDF",
    file_size: "9 MB",
    download_url: "/downloads/gym-energy-recipes.pdf",
    related_fruits: ["banana", "mango", "pineapple", "dragon-fruit", "coconut"],
    seo_title: "Tropical Gym Energy Recipes — 50+ Natural Caribbean Workout Smoothies PDF",
    seo_description: "50+ natural pre and post-workout recipes using Caribbean tropical fruits. Clean energy for athletes without synthetic supplements. Instant PDF download.",
    is_featured: true,
    created_at: "2025-01-15",
  },
  {
    id: "ebook-fat-loss-smoothies",
    title: "Caribbean Smoothies for Fat Loss",
    slug: "fat-loss-smoothies",
    category: "ebook",
    price: 9.99,
    original_price: 16.99,
    short_description: "30+ tropical smoothie recipes using papaya, guava, passion fruit, and soursop to support healthy weight management.",
    long_description: `Transform your approach to weight management with the natural fat-fighting power of Caribbean superfruits. This ebook features 30+ carefully crafted smoothie recipes using papaya, guava, passion fruit, soursop, tamarind, and more — nature's most powerful metabolic fruits.

**What's Inside:**
• 30+ fat-loss smoothie recipes
• 14-Day Caribbean Smoothie Cleanse Plan
• Calorie counts and macros per recipe
• Enzyme & fibre science explained simply
• Thermogenic fruit combinations
• Gut-health boosting blends

**The Science Behind It:**
Papaya contains papain — a powerful enzyme that aids protein digestion. Guava has three times more fibre than pineapple. Passion fruit is rich in slow-releasing carbohydrates that prevent sugar spikes. Together, these fruits form a natural metabolic toolkit.

**Perfect For:**
Anyone on a weight-loss journey who wants satisfying, delicious, nutrient-dense smoothies that support fat burning naturally.`,
    cover_image: "",
    table_of_contents: [
      "Introduction: The Caribbean Fat-Loss Fruit System",
      "Chapter 1: Morning Metabolic Boosters (8 recipes)",
      "  - Papaya Enzyme Kickstart",
      "  - Guava Green Detox Blast",
      "  - Passion Fruit Power Flush",
      "  - Soursop Slim Shake",
      "Chapter 2: Midday Hunger Crushers (7 recipes)",
      "  - Breadfruit Satiety Bowl",
      "  - Fibre-Rich Guava Blend",
      "  - Papaya Pineapple Fullness Shake",
      "Chapter 3: Evening Slim Tonics (6 recipes)",
      "  - Soursop Night Calm",
      "  - Tamarind Digestive Tonic",
      "  - Guava Bedtime Blend",
      "Chapter 4: Detox & Cleanse Specials (5 recipes)",
      "  - 3-Day Caribbean Fruit Flush",
      "  - Soursop Leaf Detox Water",
      "Chapter 5: Post-Workout Lean Shakes (4 recipes)",
      "  - Passion Fruit Recovery Slim",
      "  - Low-Cal Tropical Protein Shake",
      "14-Day Caribbean Smoothie Plan",
      "Appendix: Calorie & Macro Charts",
    ],
    features: [
      "30+ fat-loss smoothie recipes",
      "14-day Caribbean smoothie plan",
      "Calorie counts per recipe",
      "Enzyme & fibre science explained",
      "Thermogenic fruit combinations",
      "Instant digital download",
    ],
    page_count: 55,
    file_format: "PDF",
    file_size: "8 MB",
    download_url: "/downloads/fat-loss-smoothies.pdf",
    related_fruits: ["papaya", "guava", "passion-fruit", "soursop", "tamarind"],
    seo_title: "Caribbean Smoothies for Fat Loss — 30+ Tropical Weight-Loss Recipes PDF",
    seo_description: "30+ Caribbean smoothie recipes using papaya, guava and passion fruit to support healthy fat loss. With 14-day plan and calorie counts.",
    is_featured: true,
    created_at: "2025-01-15",
  },
  {
    id: "ebook-healing-drinks",
    title: "Tropical Superfruit Healing Drinks",
    slug: "healing-drinks",
    category: "ebook",
    price: 11.99,
    original_price: 19.99,
    short_description: "40+ traditional Caribbean herbal drinks and healing tonics featuring soursop leaf tea, tamarind tonics, and coconut therapies.",
    long_description: `Rediscover the healing wisdom of the Caribbean through this comprehensive guide to traditional superfruit drinks and herbal tonics. Drawing from generations of Caribbean folk medicine and modern nutritional science, this ebook presents 40+ healing drink recipes that address immunity, digestion, sleep, pain, and more.

**What's Inside:**
• 40+ healing drink recipes
• Cultural & historical context for each remedy
• Safety guides and contraindications
• Preparation methods with detailed instructions
• Dosage and frequency guidance
• Seasonal healing drink calendar

**Traditional Remedies Covered:**
Soursop leaf tea, tamarind digestive tonic, coconut oil pulling, guava leaf tea, moringa lemon tonic, breadfruit leaf tea, bitter melon juice, and dozens more.

**Scientific Backing:**
Each recipe is paired with evidence-based nutritional notes explaining the active compounds, health mechanisms, and research supporting traditional use.

**Important Note:**
These are traditional food-based drinks for general wellness. Always consult a healthcare provider for medical conditions.`,
    cover_image: "",
    table_of_contents: [
      "Introduction: Caribbean Healing Wisdom & Modern Science",
      "Chapter 1: Immunity Tonics (10 recipes)",
      "  - Soursop Leaf Immunity Tea",
      "  - Turmeric Mango Tonic",
      "  - Guava Vitamin C Bomb",
      "  - Moringa Lemon Elixir",
      "  - Tamarind Digestive Shield",
      "Chapter 2: Sleep & Calm Remedies (8 recipes)",
      "  - Soursop Sleeptime Tea",
      "  - Banana Chamomile Calm",
      "  - Coconut Milk Nightcap",
      "Chapter 3: Digestive Healing Drinks (8 recipes)",
      "  - Papaya Enzyme Tonic",
      "  - Tamarind Gut Health Shot",
      "  - Breadfruit Leaf Digestive Tea",
      "Chapter 4: Anti-Inflammatory Blends (7 recipes)",
      "  - Golden Mango Turmeric Latte",
      "  - Pineapple Bromelain Tonic",
      "  - Soursop Anti-Inflammation Blend",
      "Chapter 5: Skin & Beauty Drinks (4 recipes)",
      "  - Papaya Glow Tonic",
      "  - Guava Collagen Booster",
      "Chapter 6: Pain Relief Tonics (3 recipes)",
      "  - Soursop Leaf Headache Tea",
      "  - Coconut Turmeric Pain Remedy",
      "Safety Guide & Contraindications",
      "Seasonal Healing Calendar",
    ],
    features: [
      "40+ healing drink recipes",
      "Cultural & historical context",
      "Safety guides & contraindications",
      "Preparation methods with instructions",
      "Dosage & frequency guidance",
      "Instant digital download",
    ],
    page_count: 82,
    file_format: "PDF",
    file_size: "12 MB",
    download_url: "/downloads/healing-drinks.pdf",
    related_fruits: ["soursop", "tamarind", "coconut", "papaya", "guava"],
    seo_title: "Tropical Superfruit Healing Drinks — 40+ Caribbean Herbal Tonics PDF",
    seo_description: "40+ traditional Caribbean healing drink recipes. Soursop tea, tamarind tonics, coconut therapies. With safety guides and cultural context.",
    is_featured: true,
    created_at: "2025-01-15",
  },
  {
    id: "ebook-pre-workout-drinks",
    title: "Island Pre-Workout Natural Drinks",
    slug: "pre-workout-drinks",
    category: "ebook",
    price: 9.99,
    original_price: 16.99,
    short_description: "35+ natural Caribbean pre-workout drinks using dragon fruit, lychee, banana, and coconut. Replace synthetic supplements with clean tropical fuel.",
    long_description: `Stop buying expensive synthetic pre-workout supplements. The Caribbean has everything you need growing naturally. This ebook teaches you to craft 35+ high-performance pre-workout drinks from dragon fruit, lychee, banana, coconut water, tamarind, and more.

**What's Inside:**
• 35+ natural pre-workout drink recipes
• Dragon fruit performance guide
• Natural electrolyte formulas
• Intra & post-workout blends
• Timing guides for optimal performance
• DIY Caribbean sports drinks

**Why These Fruits Work:**
Dragon fruit provides natural betaine for endurance. Lychee contains oligonol — an antioxidant that reduces workout-induced oxidative stress. Banana's fructose-glucose ratio is optimal for sustained energy. Coconut water is nature's electrolyte drink.

**What You'll Replace:**
• Commercial pre-workout powders
• Artificial energy drinks
• Overpriced sports drinks
• Synthetic electrolyte tablets

**Perfect For:**
Gym-goers, runners, cyclists, team sport athletes, and anyone who wants cleaner, more affordable workout fuel.`,
    cover_image: "",
    table_of_contents: [
      "Introduction: Ditch the Powder, Drink the Island",
      "Chapter 1: Dragon Fruit Performance Drinks (8 recipes)",
      "  - Dragon Fruit Power Shot",
      "  - Red Dragon Pre-Workout Shake",
      "  - Dragon Lychee Endurance Blend",
      "  - Pink Dragon Cardio Fuel",
      "Chapter 2: Lychee & Antioxidant Boosters (7 recipes)",
      "  - Lychee Endurance Elixir",
      "  - Lychee Mango Focus Blend",
      "  - Antioxidant Pre-Workout Burst",
      "Chapter 3: Banana-Based Fuel (7 recipes)",
      "  - Classic Banana Pre-Workout",
      "  - Green Banana Slow Release Shake",
      "  - Banana Coconut Power Blend",
      "Chapter 4: Natural Electrolyte Formulas (6 recipes)",
      "  - Pure Coconut Water Sports Drink",
      "  - Tamarind Electrolyte Shot",
      "  - Pineapple Sea Salt Recovery Mix",
      "Chapter 5: Intra-Workout Sips (4 recipes)",
      "  - Banana Lemon Endurance Water",
      "  - Coconut Lime Workout Water",
      "Chapter 6: Post-Workout Recovery (3 recipes)",
      "  - Dragon Fruit Muscle Repair Shake",
      "  - Lychee Mango Cool-Down",
      "Performance Timing Guide",
      "Appendix: Natural vs. Synthetic Comparison",
    ],
    features: [
      "35+ pre-workout drink recipes",
      "Dragon fruit performance guide",
      "Natural electrolyte formulas",
      "Intra & post-workout blends",
      "Performance timing guide",
      "Instant digital download",
    ],
    page_count: 62,
    file_format: "PDF",
    file_size: "9 MB",
    download_url: "/downloads/pre-workout-drinks.pdf",
    related_fruits: ["dragon-fruit", "lychee", "banana", "coconut", "tamarind"],
    seo_title: "Island Pre-Workout Natural Drinks — 35+ Caribbean Performance Recipes PDF",
    seo_description: "35+ natural pre-workout drink recipes using dragon fruit, lychee and banana. Replace synthetic supplements with clean Caribbean fuel.",
    is_featured: true,
    created_at: "2025-01-15",
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.is_featured);
};

export const getRelatedProducts = (productId: string, limit: number = 3): Product[] => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  return products
    .filter(p => p.id !== productId)
    .filter(p => p.related_fruits.some(fruit => product.related_fruits.includes(fruit)))
    .slice(0, limit);
};
