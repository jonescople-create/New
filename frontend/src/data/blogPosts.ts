export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  date: string;
  readTime: string;
  relatedFruitSlugs: string[];
  content: string[];
}

const SUPABASE_STORAGE = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "soursop-health-benefits-fact-vs-fiction",
    title: "Soursop Health Benefits: What Science Actually Says (Fact vs. Fiction)",
    excerpt: "Can soursop really fight cancer? We cut through the hype with peer-reviewed research and honest analysis of what this tropical fruit can and can't do.",
    category: "Health",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-soursop.jpg`,
    date: "2025-01-15",
    readTime: "8 min read",
    relatedFruitSlugs: ["soursop"],
    content: [
      "Soursop, also known as Graviola or Guanabana, has exploded in popularity thanks to viral claims about its health benefits — especially around cancer. But what does the science actually say?",
      "**The Nutritional Facts**\n\nSoursop is genuinely nutrient-dense. A 100g serving provides 34% of your daily Vitamin C, 8% of your Potassium, 5% of your Magnesium, and 3.3g of dietary fiber. It's rich in antioxidants like luteolin, quercetin, and tangeretin.",
      "**Proven Benefits**\n\n• **High Antioxidant Load** — Protects cells from oxidative stress. A 2014 study in Food Chemistry confirmed significant antioxidant activity.\n• **Anti-Inflammatory** — Soursop leaf extracts reduced inflammation by up to 37% in animal studies (Journal of Ethnopharmacology).\n• **Immune Support** — One cup provides 77% of daily Vitamin C needs.\n• **Digestive Health** — 3.3g fiber per 100g promotes gut health.\n• **Antibacterial** — Effective against bacteria causing gum disease, cavities, and cholera (BMC Complementary Medicine, 2016).",
      "**The Cancer Debate**\n\nIn laboratory settings, soursop extracts containing acetogenins have killed breast and liver cancer cells. A 1996 study found potency 10,000x greater than the chemo drug Adriamycin — in a test tube.\n\nHowever, there are NO large-scale human clinical trials. Killing cancer cells in a lab is fundamentally different from treating cancer in a person. Many substances kill cancer cells in labs. The challenge is doing so safely inside a living body.",
      "**The Verdict**\n\nSoursop is a healthy, nutritious tropical fruit with exciting research potential. Eat it because it's delicious and nutritious. Don't eat it expecting it to cure disease. Never replace conventional medical treatment with soursop.",
      "**Safety Warnings**\n\nLong-term, excessive consumption of soursop tea is linked to neurotoxicity. Always discard the seeds. Consult your doctor if you take blood pressure or diabetes medication."
    ]
  },
  {
    id: "b2",
    slug: "7-day-tropical-superfruit-meal-plan",
    title: "The 7-Day Tropical Superfruit Meal Plan for Better Health",
    excerpt: "A complete weekly meal plan featuring soursop, papaya, banana, and other Caribbean superfruits. Balanced nutrition with island flavor.",
    category: "Nutrition",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-papaya.jpg`,
    date: "2025-01-20",
    readTime: "6 min read",
    relatedFruitSlugs: ["soursop", "papaya", "banana"],
    content: [
      "Looking to incorporate more tropical fruits into your diet? This 7-day meal plan spaces out soursop intake to safe, moderate levels while maximizing the nutritional benefits of Caribbean superfruits.",
      "**Day 1**\n• Breakfast: Soursop & Banana Smoothie\n• Lunch: Grilled chicken salad with mango salsa\n• Snack: Handful of raw almonds",
      "**Day 2**\n• Breakfast: Oatmeal topped with fresh berries\n• Lunch: Black bean and roasted sweet potato bowl\n• Evening: 1 cup Soursop Leaf Tea",
      "**Day 3**\n• Breakfast: Greek yogurt with ½ cup fresh raw soursop chunks\n• Lunch: Quinoa salad with avocado and lime\n• Snack: Carrot sticks and hummus",
      "**Day 4**\n• Breakfast: Scrambled eggs with spinach\n• Lunch: Leftover quinoa salad\n• Dessert: 1 scoop Dairy-Free Soursop Sorbet",
      "**Day 5**\n• Breakfast: Classic Soursop Juice & whole wheat toast\n• Lunch: Lentil soup with mixed greens\n• Evening: Chamomile tea",
      "**Day 6**\n• Breakfast: Tropical Fruit Bowl (papaya, mango, banana)\n• Lunch: Grilled fish tacos with cabbage slaw\n• Snack: Plantain chips",
      "**Day 7**\n• Breakfast: Soursop Smoothie Bowl topped with chia seeds\n• Lunch: Spicy jerk chicken wrap\n• Evening: 1 cup Soursop Leaf Tea",
      "**Key Guidelines**\n\n• Soursop is included 3-4 times per week, not daily — respecting safety guidelines\n• Tea is limited to 2 cups per week maximum\n• Each portion is approximately ½ to 1 cup of pulp\n• Total calories: approximately 1,600-2,000 per day (adjustable)"
    ]
  },
  {
    id: "b3",
    slug: "classic-jamaican-soursop-juice-recipe",
    title: "Classic Jamaican-Style Soursop Juice Recipe",
    excerpt: "The quintessential Caribbean soursop drink — creamy, fragrant, and deeply refreshing. Made with condensed milk, nutmeg, and vanilla.",
    category: "Recipes",
    image_url: `${SUPABASE_STORAGE}/recipe-images/fruit-soursop-juice.webp`,
    date: "2025-02-01",
    readTime: "4 min read",
    relatedFruitSlugs: ["soursop"],
    content: [
      "If there's one drink that defines Caribbean tropical flavor, it's soursop juice. This recipe is the classic Jamaican preparation — creamy, fragrant, and utterly refreshing on a hot day.",
      "**Ingredients**\n\n• 1 ripe soursop\n• 3 cups water\n• 1 tsp vanilla extract\n• ½ tsp grated nutmeg\n• Condensed milk or sugar to taste\n• Squeeze of lime",
      "**Instructions**\n\n1. Peel the soursop and extract the white pulp.\n2. Using your hands in a large bowl, squeeze and massage the pulp in the water to release the juices. **Remove and discard ALL seeds.**\n3. Strain through a fine-mesh sieve or cheesecloth into a pitcher.\n4. Stir in the vanilla, nutmeg, sweetener, and lime juice.\n5. Serve chilled over ice.",
      "**Pro Tips**\n\n• Use condensed milk for the traditional Caribbean taste — it adds a creaminess that sugar alone can't match.\n• Freshly grated nutmeg makes a huge difference over pre-ground.\n• If using frozen soursop pulp, use 2 cups pulp to 3 cups water.\n• This juice keeps in the refrigerator for 2-3 days — shake before serving as the pulp settles.",
      "**Nutritional Benefit**\n\nThis single glass delivers over 75% of your daily Vitamin C, plus significant antioxidants from the soursop pulp. The lime juice adds additional Vitamin C and helps preserve freshness."
    ]
  },
  {
    id: "b4",
    slug: "guava-vitamin-c-powerhouse",
    title: "Why Guava Has 4x More Vitamin C Than Oranges",
    excerpt: "Forget oranges — guava is the real Vitamin C champion. Discover why this Caribbean fruit should be your go-to immune booster.",
    category: "Health",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-guava.jpg`,
    date: "2025-02-10",
    readTime: "5 min read",
    relatedFruitSlugs: ["guava"],
    content: [
      "When most people think of Vitamin C, they think of oranges. But guava contains approximately 228mg of Vitamin C per 100g — compared to just 53mg in oranges. That's over 4 times more.",
      "**Why Vitamin C Matters**\n\n• Strengthens immune system by stimulating white blood cell production\n• Essential for collagen synthesis (skin, joints, wound healing)\n• Powerful antioxidant protecting cells from damage\n• Enhances iron absorption from plant foods\n• May reduce duration of common cold symptoms",
      "**Guava's Full Nutritional Profile**\n\nBeyond Vitamin C, guava offers:\n• Rich in lycopene (anti-cancer properties)\n• High in dietary fiber (5.4g per 100g)\n• Good source of potassium (heart health)\n• Contains folate (especially important during pregnancy)\n• Only 68 calories per 100g",
      "**How to Get More Guava in Your Diet**\n\n1. Eat it raw — the whole fruit is edible (skin, seeds, and all)\n2. Blend into smoothies for an immune boost\n3. Make guava paste (guava cheese) — a Caribbean classic\n4. Brew guava leaf tea — traditionally used for digestive health\n5. Add to fruit salads with a squeeze of lime",
      "**Caribbean Health Tradition**\n\nIn Caribbean folk medicine, guava leaf tea has been used for centuries to treat diarrhea, manage blood sugar, and soothe digestive issues. Modern research is beginning to validate some of these traditional uses."
    ]
  },
  {
    id: "b5",
    slug: "coconut-oil-skin-hair-beauty-guide",
    title: "Coconut Oil for Skin & Hair: The Caribbean Beauty Secret",
    excerpt: "Caribbean women have used coconut oil for centuries as a natural moisturizer, hair treatment, and beauty staple. Here's the science behind it.",
    category: "Health & Beauty",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-coconut.jpg`,
    date: "2025-02-15",
    readTime: "6 min read",
    relatedFruitSlugs: ["coconut"],
    content: [
      "Long before coconut oil became a global wellness trend, Caribbean women used it as their primary beauty product. And the science backs them up.",
      "**For Skin**\n\n• **Natural Moisturizer**: Coconut oil's medium-chain fatty acids penetrate skin better than mineral oil. A study in Dermatitis journal found it significantly improved skin hydration.\n• **Antimicrobial Protection**: Lauric acid (50% of coconut oil) kills bacteria, fungi, and viruses — helping with acne and skin infections.\n• **Anti-Aging**: Antioxidants in virgin coconut oil help reduce appearance of fine lines.\n• **Wound Healing**: Studies show accelerated wound closure when treated with coconut oil.",
      "**For Hair**\n\n• **Protein Loss Prevention**: Unlike other oils, coconut oil actually penetrates the hair shaft and reduces protein loss. Published in the Journal of Cosmetic Science.\n• **Deep Conditioning**: Apply warm coconut oil, wrap in a towel, leave for 30 minutes. Caribbean women have done this for generations.\n• **Scalp Health**: Antimicrobial properties help control dandruff.\n• **Frizz Control**: A tiny amount smoothed through damp hair controls frizz naturally.",
      "**How to Choose**\n\n• Use **virgin (unrefined) coconut oil** for beauty — it retains the beneficial compounds\n• Look for cold-pressed — heat processing destroys some antioxidants\n• Organic is preferred to avoid pesticide residues\n• The oil should smell like fresh coconut — if it doesn't, it's been overly processed",
      "**DIY Caribbean Beauty Recipes**\n\n**Island Glow Body Butter**: Mix ½ cup coconut oil + 2 tbsp shea butter + 10 drops lavender essential oil. Whip until fluffy.\n\n**Tropical Hair Mask**: Blend 3 tbsp coconut oil + ½ ripe avocado + 1 tbsp honey. Apply to damp hair for 30 minutes."
    ]
  },
  {
    id: "b6",
    slug: "papaya-enzyme-digestion-skincare",
    title: "Papaya's Secret Enzyme: How Papain Transforms Digestion & Skin",
    excerpt: "Papaya contains a powerful enzyme called papain that aids protein digestion and exfoliates skin naturally. Here's how to use it.",
    category: "Health & Beauty",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-papaya.jpg`,
    date: "2025-03-01",
    readTime: "5 min read",
    relatedFruitSlugs: ["papaya"],
    content: [
      "Papaya isn't just delicious — it contains papain, a proteolytic enzyme that breaks down protein. This makes it incredibly useful for both digestion and skincare.",
      "**For Digestion**\n\n• Papain helps break down tough protein fibers in meat and other foods\n• Reduces bloating and gas after heavy meals\n• Traditionally used across the Caribbean as a digestive aid\n• Green (unripe) papaya contains the highest concentration of papain\n• Eating a few slices of papaya after a meal can significantly improve digestion",
      "**For Skin**\n\n• Papain acts as a natural exfoliant — dissolving dead skin cells without abrasion\n• Used in many commercial enzyme peels and face masks\n• Helps fade dark spots and even skin tone\n• Anti-inflammatory properties soothe irritated skin\n• Rich in Vitamin A (beta-carotene) which promotes skin cell renewal",
      "**DIY Papaya Face Mask**\n\nMash ¼ ripe papaya + 1 tbsp honey + 1 tsp lime juice. Apply to clean face for 15 minutes. Rinse with warm water. Use 2x per week for glowing skin.\n\n**Warning**: Papain can be irritating for sensitive skin. Always patch-test first. Avoid if you have a latex allergy (cross-reactivity).",
      "**Nutrition Powerhouse**\n\nOne medium papaya provides:\n• 224% of daily Vitamin C\n• 31% of daily Vitamin A\n• 14% of daily Folate\n• Only 120 calories\n\nPapaya is one of the most nutrient-dense fruits available in the Caribbean."
    ]
  },
  {
    id: "b7",
    slug: "how-to-store-tropical-fruits",
    title: "The Complete Guide to Storing Tropical Fruits (Keep Them Fresh Longer)",
    excerpt: "Stop wasting tropical fruits! Expert storage tips for every Caribbean fruit — from ripening tricks to freezing methods.",
    category: "Guides",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-mango.jpg`,
    date: "2025-03-10",
    readTime: "7 min read",
    relatedFruitSlugs: ["mango", "banana", "papaya", "avocado"],
    content: [
      "Tropical fruits are delicious but perishable. Here's how to store every Caribbean fruit for maximum freshness and minimum waste.",
      "**General Rules**\n\n1. Ripen at room temperature — never refrigerate unripe tropical fruits\n2. Once ripe, refrigerate to slow further ripening\n3. Most cut fruit lasts 2-3 days refrigerated\n4. Freeze purées for smoothies — most last 6+ months frozen",
      "**Fruit-by-Fruit Guide**\n\n• **Mango**: Ripen at room temperature. Ripe = slightly soft, fragrant. Refrigerate ripe mangoes for up to 5 days. Freeze cubes for 6+ months.\n• **Banana**: Store at room temperature. Refrigerate ripe bananas (skin darkens but fruit is fine). Peel and freeze for smoothies.\n• **Soursop**: Ripen at room temperature until slightly soft. Use within 2-3 days of ripening. Freeze pulp (seeds removed) for up to 6 months.\n• **Papaya**: Ripen at room temperature. Ripe papaya keeps 2-3 days refrigerated. Squeeze lime on cut surfaces to prevent browning.\n• **Avocado**: Ripen at room temperature. Speed up by placing in paper bag with banana. Ripe keeps 2-3 days in fridge. Lime juice prevents browning.",
      "**Pro Tip: The Paper Bag Trick**\n\nPlace unripe fruit in a brown paper bag with a ripe banana. The ethylene gas from the banana speeds ripening. Works for: mango, avocado, papaya, soursop, guava.",
      "**Freezing Guide**\n\n• Peel, seed, and cut fruit into chunks\n• Spread on a baking sheet lined with parchment paper\n• Freeze for 2 hours until solid\n• Transfer to airtight freezer bags\n• Label with fruit name and date\n• Most tropical fruits keep 6-12 months frozen"
    ]
  },
  {
    id: "b8",
    slug: "tamarind-balls-recipe-caribbean-candy",
    title: "Traditional Caribbean Tamarind Balls Recipe",
    excerpt: "Sweet, sour, and spicy — tamarind balls are the quintessential Caribbean candy. A nostalgic island treat loved by all ages.",
    category: "Recipes",
    image_url: `${SUPABASE_STORAGE}/recipe-images/recipe-tamarind-balls.png`,
    date: "2025-03-15",
    readTime: "4 min read",
    relatedFruitSlugs: ["tamarind"],
    content: [
      "Tamarind balls are one of the most beloved candies across the Caribbean. Sweet, sour, and often with a kick of pepper — they're nostalgic, simple, and absolutely addictive.",
      "**Ingredients**\n\n• 1 lb tamarind pulp (seeds removed)\n• 1½ cups brown sugar\n• 1 tsp salt\n• ½ tsp cayenne pepper (optional — but recommended!)\n• Extra granulated sugar for rolling",
      "**Instructions**\n\n1. Remove tamarind from shells and pull out seeds and stringy fibers\n2. Mix pulp with brown sugar, salt, and cayenne pepper in a bowl\n3. Knead the mixture until sugar is fully incorporated\n4. Roll into 1-inch balls between your palms\n5. Roll each ball in granulated sugar to coat\n6. Let set for 30 minutes before serving\n7. Store in an airtight container for up to 2 weeks",
      "**Variations**\n\n• **Spicy**: Add more cayenne or scotch bonnet pepper powder\n• **Extra Sweet**: Use condensed milk instead of some brown sugar\n• **Chocolate**: Roll in cocoa powder instead of sugar\n• **Ginger**: Add 1 tsp grated fresh ginger to the mix",
      "**Health Benefits of Tamarind**\n\nTamarind isn't just tasty — it's rich in polyphenol antioxidants, magnesium, iron, and B vitamins. Tartaric acid acts as a natural laxative. Traditionally used across the Caribbean for sore throat and fever."
    ]
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(p => p.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  if (category === "All") return blogPosts;
  return blogPosts.filter(p => p.category === category);
};

export const searchBlogPosts = (query: string): BlogPost[] => {
  const q = query.toLowerCase();
  return blogPosts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
};
