export interface LeafMedicine {
  has_leaf_use: boolean;
  leaf_name: string;
  traditional_uses: string[];
  preparation: string;
  safety_warnings: string[];
  disclaimer: string;
}

export interface Fruit {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  nutrition: string;
  health_benefits: string[];
  seasonality: string;
  origin: string;
  image_url: string;
  slug: string;
  category: string[];
  how_to_eat: string;
  storage: string;
  color: string;
  emoji: string;
  related_fruit_ids: string[];
  views: number;
  leaf_medicine?: LeafMedicine;
}

const SUPABASE_STORAGE = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";

export const fruits: Fruit[] = [
  {
    id: "1",
    name: "Ackee",
    scientific_name: "Blighia sapida",
    description: "Ackee is the national fruit of Jamaica, known for its unique buttery flavor and creamy texture when cooked. It's a key ingredient in Jamaica's national dish, ackee and saltfish. The fruit must be fully ripe and properly prepared before eating, as unripe ackee contains hypoglycin, a toxin.",
    nutrition: "Rich in protein, healthy fats, vitamin C, zinc, and potassium. One cup provides about 150 calories with 15g of fat and 3g of protein.",
    health_benefits: [
      "High in healthy fatty acids that support heart health",
      "Rich in zinc which boosts immune function",
      "Contains vitamin C for skin health and collagen production",
      "Good source of dietary fiber aiding digestion",
      "Provides potassium for blood pressure regulation"
    ],
    seasonality: "January–March, June–August",
    origin: "West Africa, widely cultivated in Jamaica and Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-ackee.jpg`,
    slug: "ackee",
    category: ["popular", "medicinal"],
    how_to_eat: "Only eat fully ripened ackee that has opened naturally on the tree. Remove the black seeds and red membrane. Boil in salted water for 5-10 minutes. Traditionally sautéed with saltfish, onions, tomatoes, and scotch bonnet peppers.",
    storage: "Fresh ackee should be used within 2 days. Canned ackee can be stored for up to 2 years. Do not refrigerate uncooked fresh ackee.",
    color: "#FFD700",
    emoji: "🟡",
    related_fruit_ids: ["2", "5"],
    views: 4520,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Ackee Leaf",
      traditional_uses: [
        "Leaf infusion used in Caribbean folk medicine to treat colds and flu symptoms",
        "Bark decoction traditionally applied for wound healing and skin irritation",
        "Leaves used in poultice form for headache relief in Jamaican traditional practice",
        "Seeds roasted and used carefully in some African traditional remedies (requires expert preparation)"
      ],
      preparation: "Dry mature ackee leaves in shade for 3–5 days. Steep 3–4 dried leaves in 2 cups of boiling water for 10–15 minutes. Strain and allow to cool before drinking. Maximum one cup per day.",
      safety_warnings: [
        "NEVER consume raw ackee seeds or unripe fruit — they contain hypoglycin A and B, which are toxic",
        "Leaf preparations should be used sparingly and not as a substitute for medical treatment",
        "Pregnant or breastfeeding women should avoid ackee leaf preparations",
        "Consult a healthcare provider before use, especially if taking medications"
      ],
      disclaimer: "This information documents traditional Caribbean folk medicine practices. It is not medical advice. Never replace conventional medical treatment with herbal remedies."
    }
  },
  {
    id: "2",
    name: "Breadfruit",
    scientific_name: "Artocarpus altilis",
    description: "Breadfruit is a starchy, versatile tropical fruit that has been a staple food in the Caribbean for centuries. When cooked, its texture resembles freshly baked bread, giving it its name. It can be roasted, fried, boiled, or even made into flour.",
    nutrition: "Excellent source of complex carbohydrates, dietary fiber, vitamin C, potassium, and B vitamins. One cup contains about 227 calories.",
    health_benefits: [
      "High in fiber promoting digestive health",
      "Rich in potassium supporting cardiovascular function",
      "Contains antioxidants that fight free radicals",
      "Good source of energy from complex carbohydrates",
      "Provides essential B vitamins for metabolism"
    ],
    seasonality: "June–September (peak), available year-round in some regions",
    origin: "South Pacific, widely grown throughout the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-breadfruit.jpg`,
    slug: "breadfruit",
    category: ["popular", "seasonal"],
    how_to_eat: "Can be roasted directly over fire until skin is charred and inside is soft. Also excellent fried as chips, boiled like potatoes, or baked. Green breadfruit is starchy like potato; ripe breadfruit is sweeter.",
    storage: "Store unripe breadfruit at room temperature for 1-3 days. Once ripe, refrigerate and use within 2 days. Can be frozen after cooking for up to 3 months.",
    color: "#8BC34A",
    emoji: "🍞",
    related_fruit_ids: ["1", "4"],
    views: 3890,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Breadfruit Leaf",
      traditional_uses: [
        "Leaf tea is a traditional Caribbean remedy for lowering high blood pressure (hypertension)",
        "Latex from the leaf used topically to treat skin conditions and fungal infections",
        "Leaf poultice applied to relieve joint pain and inflammation in Polynesian medicine",
        "Dried leaves burned and ash used in traditional wound treatment"
      ],
      preparation: "Select 2–3 mature, dark green breadfruit leaves. Wash thoroughly and tear into pieces. Boil in 3 cups of water for 15–20 minutes until the water turns amber. Strain and drink warm. Take once daily.",
      safety_warnings: [
        "Breadfruit leaf tea may lower blood pressure — use cautiously if on hypertension medication",
        "The latex sap can cause skin irritation in sensitive individuals — handle with care",
        "Do not exceed one cup of leaf tea per day",
        "Not recommended for pregnant or breastfeeding women without medical consultation"
      ],
      disclaimer: "This information documents traditional Caribbean and Polynesian folk medicine practices. It is not medical advice. Always consult a qualified healthcare provider."
    }
  },
  {
    id: "3",
    name: "Soursop",
    scientific_name: "Annona muricata",
    description: "Soursop, also known as graviola or guanábana, is a large green spiny fruit with a creamy white flesh that has a unique sweet-sour flavor combining notes of strawberry and pineapple with citrusy undertones. It's widely used in juices, smoothies, and ice cream across the Caribbean.",
    nutrition: "Rich in vitamin C, B vitamins, potassium, magnesium, and fiber. One cup of pulp contains about 148 calories with 7.4g of fiber.",
    health_benefits: [
      "Extremely high in vitamin C boosting immune defense",
      "Contains acetogenins studied for anti-cancer properties",
      "Rich in antioxidants reducing oxidative stress",
      "Anti-inflammatory compounds for joint health",
      "Natural antimicrobial properties"
    ],
    seasonality: "Year-round in tropical climates, peak May–September",
    origin: "Central America and Caribbean, grown throughout tropics",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-soursop.jpg`,
    slug: "soursop",
    category: ["popular", "medicinal", "seasonal"],
    how_to_eat: "Cut the fruit in half and scoop out the white flesh. Remove the large black seeds. Eat fresh, blend into juice with water and sweetener, or use in smoothies, ice cream, and desserts. The pulp freezes beautifully.",
    storage: "Store unripe soursop at room temperature until slightly soft. Ripe fruit keeps 2-3 days in refrigerator. Freeze pulp for up to 6 months.",
    color: "#4CAF50",
    emoji: "🟢",
    related_fruit_ids: ["6", "8"],
    views: 5200,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Soursop Leaf (Graviola Leaf)",
      traditional_uses: [
        "Graviola leaf tea is the most widely used herbal tea in Caribbean folk medicine — prized for its calming, sedative effects",
        "Used traditionally to promote sleep and reduce anxiety and restlessness",
        "Leaf extracts studied for anti-cancer properties — acetogenins in leaves showed activity against cancer cell lines in laboratory research (Journal of Natural Products, 1996)",
        "Traditional remedy for reducing fever, inflammation, and parasitic infections",
        "Leaf poultice applied externally to soothe skin irritation and eczema",
        "Used in some Caribbean communities to help manage blood sugar levels"
      ],
      preparation: "Wash 2–3 fresh or dried soursop leaves. Place in a teapot and pour 2 cups of boiling water over them. Steep for 10–15 minutes. Strain and drink warm. Add honey or lime to taste. Best consumed in the evening for its calming properties.",
      safety_warnings: [
        "CRITICAL: Long-term, excessive consumption of soursop leaf tea is linked to neurotoxicity — compounds called annonacins may cause nerve damage and movement disorders similar to Parkinson's disease",
        "Limit consumption to 2–3 cups per week maximum — do not drink daily for extended periods",
        "Soursop leaves can lower blood pressure and blood sugar — dangerous if combined with diabetes or hypertension medications without medical supervision",
        "NEVER use soursop as a cancer treatment replacement — no human clinical trials support this use",
        "Pregnant and breastfeeding women should completely avoid soursop leaf preparations",
        "Do not consume the seeds — they contain concentrated neurotoxins"
      ],
      disclaimer: "This information documents traditional Caribbean folk medicine practices and published laboratory research. It is NOT medical advice. Soursop leaf tea should never replace conventional medical treatment for any condition, including cancer. Always consult a qualified healthcare provider before use."
    }
  },
  {
    id: "4",
    name: "Guinep",
    scientific_name: "Melicoccus bijugatus",
    description: "Guinep, also called Spanish lime or quenepa, is a beloved Caribbean street fruit. These small green fruits grow in clusters and have a thin, brittle shell encasing a juicy, tangy-sweet salmon-colored pulp surrounding a large seed. A true taste of Caribbean summer.",
    nutrition: "Good source of vitamin C, vitamin A, calcium, phosphorus, and iron. Low in calories with about 58 calories per 100g.",
    health_benefits: [
      "Rich in vitamin A supporting eye health",
      "High calcium content for bone strength",
      "Iron content helps prevent anemia",
      "Tryptophan content may improve sleep quality",
      "Low glycemic index suitable for blood sugar management"
    ],
    seasonality: "June–September (summer fruit)",
    origin: "Northern South America and Caribbean islands",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-guinep.jpg`,
    slug: "guinep",
    category: ["popular", "seasonal"],
    how_to_eat: "Crack the thin green shell with your teeth or by squeezing. Suck on the juicy pulp surrounding the seed. Don't bite the seed. Some people also make guinep juice by soaking the pulp in water with sugar.",
    storage: "Keep in a cool, dry place for up to one week. Can refrigerate for up to 2 weeks. The shells dry out over time so eat relatively fresh.",
    color: "#66BB6A",
    emoji: "🫒",
    related_fruit_ids: ["2", "7"],
    views: 4100
  },
  {
    id: "5",
    name: "Mango",
    scientific_name: "Mangifera indica",
    description: "Known as the 'King of Fruits,' mango is one of the most popular tropical fruits worldwide. Caribbean mangoes are prized for their exceptional sweetness, aromatic fragrance, and silky smooth flesh. Varieties like Julie, East Indian, and Bombay are Caribbean favorites.",
    nutrition: "Excellent source of vitamins A and C, folate, and fiber. One cup of sliced mango provides about 100 calories and over 100% of daily vitamin C.",
    health_benefits: [
      "Exceptionally high in vitamin A for eye and skin health",
      "Rich in vitamin C strengthening immune system",
      "Contains digestive enzymes like amylase for gut health",
      "Polyphenols may reduce risk of certain cancers",
      "Folate content supports cell growth and development"
    ],
    seasonality: "May–August (peak Caribbean mango season)",
    origin: "South Asia, widely cultivated throughout the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-mango.jpg`,
    slug: "mango",
    category: ["popular", "seasonal"],
    how_to_eat: "Slice along both sides of the flat seed. Score the flesh in a crosshatch pattern and invert to eat cubes. Also excellent in smoothies, salsas, chutneys, and desserts. Green mangoes are used for pickles and hot sauce.",
    storage: "Ripen at room temperature. Once ripe (slightly soft, fragrant), refrigerate for up to 5 days. Frozen mango chunks last 6+ months.",
    color: "#FF9800",
    emoji: "🥭",
    related_fruit_ids: ["1", "8"],
    views: 6800,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Mango Leaf",
      traditional_uses: [
        "Mango leaf tea used traditionally across the Caribbean and South Asia for managing blood sugar levels in type 2 diabetes",
        "Dried mango leaves burned and smoke inhaled to relieve hiccups and throat irritation in Jamaican folk medicine",
        "Young tender mango leaves chewed to strengthen gums and treat mouth ulcers",
        "Leaf decoction used as a traditional remedy for kidney stones and gallstones"
      ],
      preparation: "Select 5–6 tender, young mango leaves. Wash and soak in 2 cups of water overnight. Strain in the morning and drink on an empty stomach. Alternatively, boil leaves for 10 minutes, strain, and drink warm.",
      safety_warnings: [
        "Mango leaf tea may lower blood sugar — monitor levels carefully if diabetic or on glucose-lowering medication",
        "May interact with anticoagulant medications",
        "Do not consume in large quantities — moderate use only",
        "Not recommended during pregnancy without medical consultation"
      ],
      disclaimer: "This information documents traditional Ayurvedic and Caribbean folk medicine practices. It is not medical advice. Always consult a healthcare provider before using herbal remedies."
    }
  },
  {
    id: "6",
    name: "Passion Fruit",
    scientific_name: "Passiflora edulis",
    description: "Passion fruit is a beautifully aromatic tropical fruit with a tough purple or yellow rind and a fragrant, seed-filled pulpy interior. Its intense sweet-tart flavor makes it a prized ingredient in Caribbean juices, cocktails, desserts, and sauces.",
    nutrition: "Rich in vitamins A and C, iron, potassium, and dietary fiber. One fruit has only 17 calories but packs significant nutritional value.",
    health_benefits: [
      "High in antioxidants including vitamin C and beta-carotene",
      "Excellent source of dietary fiber for digestive health",
      "Iron content supports blood oxygen transport",
      "Contains piceatannol which may improve insulin sensitivity",
      "Natural sedative properties promote relaxation and sleep"
    ],
    seasonality: "Year-round, peak July–February",
    origin: "South America, widely grown in Caribbean islands",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-passion-fruit.png`,
    slug: "passion-fruit",
    category: ["popular", "medicinal", "rare"],
    how_to_eat: "Cut in half and scoop out the pulp and seeds with a spoon. Seeds are edible and add crunch. Strain for juice, add to yogurt, use in cocktails, or make passion fruit mousse and cheesecake.",
    storage: "Ripe passion fruit (wrinkled skin) can be refrigerated for 1-2 weeks. Pulp freezes well for up to 3 months.",
    color: "#9C27B0",
    emoji: "💜",
    related_fruit_ids: ["3", "8"],
    views: 3600,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Passion Fruit Leaf (Passiflora Leaf)",
      traditional_uses: [
        "Passiflora leaf tea is one of the most scientifically validated natural sedatives — used for centuries to treat insomnia and anxiety",
        "Contains flavonoids (chrysin, vitexin) that bind to GABA receptors in the brain, producing a calming effect similar to benzodiazepines but milder",
        "Used traditionally in the Caribbean as a nerve tonic for stress, tension, and restlessness",
        "Leaf infusion used to lower high blood pressure in Caribbean folk medicine",
        "Applied topically as a poultice for burns and skin inflammation"
      ],
      preparation: "Dry passion fruit leaves in shade for 3–5 days or use fresh. Steep 1–2 leaves in one cup of boiling water for 8–10 minutes. Strain and drink 30 minutes before bedtime for sleep support. Can add honey for sweetness.",
      safety_warnings: [
        "May cause drowsiness — do not drive or operate machinery after consuming passion fruit leaf tea",
        "Can interact with sedative medications, anti-anxiety drugs, and blood thinners",
        "Not recommended during pregnancy — may stimulate uterine contractions",
        "Do not combine with alcohol or other central nervous system depressants"
      ],
      disclaimer: "This information documents traditional Caribbean folk medicine practices supported by some clinical research. It is not medical advice. Consult a healthcare provider before use, especially if taking medications."
    }
  },
  {
    id: "7",
    name: "Star Apple",
    scientific_name: "Chrysophyllum cainito",
    description: "Star apple, known as caimito, is a magical-looking tropical fruit. When cut crosswise, the seeds form a beautiful star pattern. The flesh is sweet, milky-white or purple, with a creamy custard-like texture. It's a cherished dessert fruit across the Caribbean.",
    nutrition: "Good source of vitamin C, calcium, phosphorus, and iron. Contains about 67 calories per 100g with 2g of fiber.",
    health_benefits: [
      "Calcium-rich supporting bone and dental health",
      "Contains phosphorus working with calcium for strong bones",
      "Antioxidant properties from polyphenols",
      "Natural remedy traditionally used for throat inflammation",
      "Low glycemic fruit suitable for moderate consumption"
    ],
    seasonality: "February–May",
    origin: "Central America and West Indies",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-star-apple.jpg`,
    slug: "star-apple",
    category: ["rare", "seasonal"],
    how_to_eat: "Cut in half crosswise to reveal the star pattern. Scoop out the creamy flesh with a spoon, avoiding the skin and seeds. The latex near the skin is sticky — avoid it. Best eaten chilled.",
    storage: "Store at room temperature until ripe (slightly soft). Refrigerate ripe fruit for up to one week. Not suitable for freezing.",
    color: "#7B1FA2",
    emoji: "⭐",
    related_fruit_ids: ["4", "9"],
    views: 2800
  },
  {
    id: "8",
    name: "Papaya",
    scientific_name: "Carica papaya",
    description: "Papaya is a breakfast staple across the Caribbean, beloved for its sweet, musky flavor and butter-soft orange flesh. Rich in digestive enzymes, it's both a delicious fruit and a natural medicine. Green papaya is also used as a vegetable in salads and stews.",
    nutrition: "Outstanding source of vitamin C (224% DV per fruit), vitamin A, folate, and papain enzyme. One medium papaya has about 120 calories.",
    health_benefits: [
      "Contains papain enzyme aiding protein digestion",
      "Extremely high vitamin C content boosting immunity",
      "Rich in beta-carotene for eye health",
      "Anti-inflammatory properties reducing chronic inflammation",
      "Lycopene content may reduce cancer risk"
    ],
    seasonality: "Year-round in tropical climates",
    origin: "Central America, grown throughout Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-papaya.jpg`,
    slug: "papaya",
    category: ["popular", "medicinal"],
    how_to_eat: "Cut in half lengthwise, scoop out seeds (edible with peppery flavor). Slice or cube the flesh. Squeeze lime juice over it for a classic Caribbean breakfast. Also excellent in smoothies, salads, and salsas.",
    storage: "Ripen at room temperature. Ripe papaya keeps 2-3 days in refrigerator. Cut papaya should be consumed within 2 days. Seeds can be dried and used as pepper substitute.",
    color: "#FF7043",
    emoji: "🍈",
    related_fruit_ids: ["5", "3"],
    views: 4800,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Papaya Leaf",
      traditional_uses: [
        "Papaya leaf extract is gaining scientific recognition for increasing blood platelet count — studied for dengue fever treatment in Southeast Asia and the Caribbean",
        "Contains papain and chymopapain enzymes that aid digestion when consumed as tea",
        "Leaf juice used traditionally to treat malaria and parasitic infections across tropical regions",
        "Applied topically as a poultice for wound healing and to reduce swelling",
        "Leaf tea used in Caribbean folk medicine for liver health and detoxification"
      ],
      preparation: "Select 1–2 medium-sized mature papaya leaves (avoid very young or very old leaves). Wash thoroughly and remove the thick central stem. Blend or crush leaves and squeeze through cheesecloth to extract juice. Take 1–2 tablespoons of fresh juice daily. Alternatively, steep dried leaf pieces in hot water for 15 minutes for tea.",
      safety_warnings: [
        "Papaya leaf juice is very bitter — can be mixed with a small amount of honey",
        "May interact with blood-thinning medications (warfarin) due to its effect on platelet activity",
        "AVOID during pregnancy — papain may stimulate uterine contractions",
        "People with latex allergies may have cross-reactivity with papaya compounds",
        "Start with small amounts to test tolerance — some people experience nausea"
      ],
      disclaimer: "This information documents traditional tropical medicine practices and emerging clinical research. It is not medical advice. Papaya leaf products should not replace prescribed dengue or platelet treatments. Always consult a qualified healthcare provider."
    }
  },
  {
    id: "9",
    name: "Naseberry",
    scientific_name: "Manilkara zapota",
    description: "Naseberry, also known as sapodilla, is a brown-skinned fruit with exceptionally sweet, malty-flavored flesh that tastes like brown sugar and pear combined. This unassuming fruit is one of the sweetest natural fruits in the world and a Caribbean childhood favorite.",
    nutrition: "Good source of dietary fiber, vitamin A, vitamin C, iron, and potassium. Contains about 83 calories per 100g with natural sugars.",
    health_benefits: [
      "Very high in dietary fiber promoting gut health",
      "Tannins have anti-inflammatory and antibacterial properties",
      "Rich in vitamin A for vision health",
      "Natural energy source from healthy sugars",
      "Contains minerals like iron and copper for blood health"
    ],
    seasonality: "February–June, September–November",
    origin: "Central America, grown in Caribbean and South Asia",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-naseberry.jpg`,
    slug: "naseberry",
    category: ["rare", "medicinal"],
    how_to_eat: "Wait until the fruit is soft (like a ripe kiwi). Cut in half, remove the black seeds (they have a hook — don't swallow). Scoop the brown, grainy-sweet flesh with a spoon. Eat fresh for best flavor.",
    storage: "Ripen at room temperature for 3-7 days. Ripe naseberry keeps 2-3 days refrigerated. Can freeze pulp for smoothies.",
    color: "#795548",
    emoji: "🟤",
    related_fruit_ids: ["7", "10"],
    views: 2100,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Naseberry Leaf & Bark",
      traditional_uses: [
        "Bark decoction used traditionally in Caribbean and Central American medicine for treating diarrhea and dysentery",
        "Leaf tea used as a mild sedative and to relieve fever",
        "Bark contains tannins with astringent and antibacterial properties — used for wound treatment",
        "Sap (chicle) historically used as the base for chewing gum — has mild antiseptic properties"
      ],
      preparation: "Collect a small piece of bark (never strip bark completely — it harms the tree). Wash and boil in 2 cups of water for 20 minutes. Strain and drink in small amounts. For leaf tea, steep 3–4 dried leaves in boiling water for 10 minutes.",
      safety_warnings: [
        "Bark preparations are potent — use in small amounts only",
        "Tannins in high concentration can cause stomach upset",
        "Not recommended for extended daily use",
        "Consult a healthcare provider if taking medications for digestive conditions"
      ],
      disclaimer: "This information documents traditional Caribbean and Central American folk medicine practices. It is not medical advice. Always consult a qualified healthcare provider."
    }
  },
  {
    id: "10",
    name: "Guava",
    scientific_name: "Psidium guajava",
    description: "Guava is an incredibly fragrant tropical fruit with pink or white flesh packed with tiny edible seeds. In the Caribbean, guava is essential for making guava paste (guava cheese), jelly, juice, and the beloved guava and cheese pastry. Its aroma is unmistakable.",
    nutrition: "Extraordinarily high in vitamin C (4x more than oranges), fiber, folate, and potassium. One guava has about 37 calories.",
    health_benefits: [
      "Highest natural vitamin C content of any common fruit",
      "Rich in lycopene with anti-cancer properties",
      "High fiber helps regulate blood sugar levels",
      "Potassium content supports heart health",
      "Guava leaf tea is used to treat diarrhea and diabetes"
    ],
    seasonality: "Year-round, peak August–October",
    origin: "Central America, naturalized throughout Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-guava.jpg`,
    slug: "guava",
    category: ["popular", "medicinal", "seasonal"],
    how_to_eat: "Wash and eat whole — skin, seeds, and all are edible. Slice for fruit platters. Blend with water and strain for juice. Cook down with sugar to make guava paste or jelly. Pair with cream cheese for a classic combo.",
    storage: "Ripen at room temperature. Refrigerate ripe guava for up to 4 days. Guava paste and jelly have long shelf life. Freeze whole guavas for up to 8 months.",
    color: "#E91E63",
    emoji: "🩷",
    related_fruit_ids: ["8", "6"],
    views: 5100,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Guava Leaf",
      traditional_uses: [
        "Guava leaf tea is one of the most widely used and scientifically validated herbal remedies in the Caribbean — primarily for treating acute diarrhea",
        "Clinical trials published in the Journal of Ethnopharmacology confirmed guava leaf extract significantly reduces duration and severity of infectious diarrhea",
        "Used traditionally to manage blood sugar levels — a 2010 study in Nutrition & Metabolism showed guava leaf tea reduced post-meal blood glucose spikes",
        "Antimicrobial properties effective against oral bacteria — used as a mouthwash for toothache and gum inflammation",
        "Rich in quercetin which has anti-allergic and anti-inflammatory effects",
        "Leaf decoction used topically for hair loss treatment in Caribbean folk medicine"
      ],
      preparation: "Select 4–5 fresh, young guava leaves (lighter green, from the tips of branches). Wash thoroughly. Boil in 3 cups of water for 10–15 minutes until water reduces to about 1.5 cups. Strain and drink warm. For diarrhea: drink 2–3 times per day until symptoms resolve. For blood sugar: drink one cup after meals.",
      safety_warnings: [
        "Guava leaf tea may interact with diabetes medications — monitor blood sugar carefully if diabetic",
        "May cause constipation if consumed in very large quantities (tannin content)",
        "Can interact with blood-thinning medications",
        "Moderate consumption — 1–2 cups per day — is generally considered safe for most adults"
      ],
      disclaimer: "This information documents traditional Caribbean folk medicine practices supported by published clinical research. It is not medical advice. Always consult a qualified healthcare provider before using herbal remedies, especially if taking medications."
    }
  },
  {
    id: "11",
    name: "Coconut",
    scientific_name: "Cocos nucifera",
    description: "The coconut palm is called the 'Tree of Life' in the Caribbean for good reason — every part is used. Young jelly coconuts provide refreshing water and soft meat, while mature coconuts yield rich cream, oil, and dried copra. Essential to Caribbean cuisine and culture.",
    nutrition: "Rich in medium-chain triglycerides (MCTs), manganese, copper, and iron. Coconut water is nature's electrolyte drink with 46 calories per cup.",
    health_benefits: [
      "MCTs provide quick energy and may boost metabolism",
      "Coconut water is a natural electrolyte replenisher",
      "Lauric acid has antimicrobial and antiviral properties",
      "High in manganese for bone health and metabolism",
      "Coconut oil supports skin and hair health"
    ],
    seasonality: "Year-round",
    origin: "Indo-Pacific region, iconic across all Caribbean islands",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-coconut.jpg`,
    slug: "coconut",
    category: ["popular"],
    how_to_eat: "For young coconuts: cut top open, drink the water, then scoop soft jelly meat. For mature coconuts: crack open, grate the meat for cooking, or blend with water and strain for coconut milk/cream.",
    storage: "Whole mature coconuts last 2-3 months at room temperature. Opened coconut meat keeps 4-5 days refrigerated. Coconut milk/cream freezes well.",
    color: "#8D6E63",
    emoji: "🥥",
    related_fruit_ids: ["2", "5"],
    views: 5800,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Coconut Palm Leaf & Oil",
      traditional_uses: [
        "Coconut oil (extracted from the nut, not the leaf) is the primary medicinal product — rich in lauric acid with antimicrobial, antifungal, and antiviral properties",
        "Coconut water used traditionally as an oral rehydration solution for dehydration and cholera recovery",
        "Palm heart (inner core of young fronds) used in Caribbean medicine for kidney health",
        "Coconut husk fiber used traditionally to treat skin conditions and inflammation",
        "Oil pulling with coconut oil practiced for oral health — may reduce plaque and gingivitis"
      ],
      preparation: "For medicinal oil pulling: take 1 tablespoon of virgin coconut oil, swish in mouth for 15–20 minutes without swallowing, spit out. For topical use: apply cold-pressed virgin coconut oil directly to skin or hair. For hydration: drink fresh coconut water directly from a young green coconut.",
      safety_warnings: [
        "Coconut oil is high in saturated fat — consume in moderation if managing cholesterol",
        "Some individuals may have coconut allergies (rare but possible)",
        "Coconut water has natural sugars — diabetics should monitor intake",
        "Do not use coconut oil on deep wounds or severe burns — see a doctor"
      ],
      disclaimer: "This information documents traditional Caribbean and tropical medicine practices. It is not medical advice. Always consult a qualified healthcare provider."
    }
  },
  {
    id: "12",
    name: "Tamarind",
    scientific_name: "Tamarindus indica",
    description: "Tamarind is a pod-like fruit with a tangy, sweet-sour pulp that's fundamental to Caribbean cooking and refreshments. The brown sticky pulp is used to make tamarind balls (a beloved candy), drinks, sauces, and chutneys. Its unique flavor is both refreshing and addictive.",
    nutrition: "Excellent source of B vitamins, minerals including iron, magnesium, and potassium. High in tartaric acid and dietary fiber. About 239 calories per 100g.",
    health_benefits: [
      "Rich in polyphenols with potent antioxidant activity",
      "High magnesium content supports nerve and muscle function",
      "Tartaric acid acts as a natural laxative for digestion",
      "Iron content helps combat anemia",
      "Traditional remedy for fever and sore throat"
    ],
    seasonality: "March–July",
    origin: "Africa, widely naturalized in Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruits-tamarind.jpg`,
    slug: "tamarind",
    category: ["popular", "medicinal", "seasonal"],
    how_to_eat: "Crack the brittle shell and remove the pulp. Pull away the stringy fibers. Eat the sticky pulp around the seeds (spit seeds out). Make tamarind balls by rolling pulp with sugar and pepper. Soak in water for tangy juice.",
    storage: "Unshelled tamarind lasts months in a cool dry place. Pulp keeps indefinitely when stored in airtight container. Tamarind paste lasts years.",
    color: "#5D4037",
    emoji: "🫘",
    related_fruit_ids: ["4", "10"],
    views: 3400,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Tamarind Leaf",
      traditional_uses: [
        "Tamarind leaf tea used traditionally across Africa and the Caribbean as a fever reducer (antipyretic)",
        "Leaf juice applied to wounds and boils as an antiseptic in Jamaican folk medicine",
        "Poultice of mashed tamarind leaves applied to swollen joints for anti-inflammatory relief",
        "Flowers and leaves used in traditional remedies for sore throat and respiratory infections",
        "Bark decoction used as an astringent for digestive complaints"
      ],
      preparation: "Collect 8–10 fresh tamarind leaves (the small leaflets from compound leaves). Wash thoroughly. Boil in 2 cups of water for 15 minutes. Strain and drink warm. For external poultice: crush fresh leaves and apply directly to affected area, wrap with cloth for 30 minutes.",
      safety_warnings: [
        "Tamarind (fruit and leaves) may interact with aspirin and ibuprofen — increasing absorption of these drugs",
        "May lower blood sugar — monitor if diabetic",
        "Large quantities of tamarind can have a laxative effect",
        "Not recommended in high doses during pregnancy"
      ],
      disclaimer: "This information documents traditional African and Caribbean folk medicine practices. It is not medical advice. Always consult a qualified healthcare provider before use."
    }
  },
  {
    id: "13",
    name: "Banana",
    scientific_name: "Musa acuminata",
    description: "Bananas are one of the most widely consumed fruits in the Caribbean and the world. Caribbean banana varieties include the sweet Gros Michel, the small and flavorful apple banana, and green bananas used for cooking. Boiled green bananas are a beloved Caribbean side dish, often served with ackee and saltfish.",
    nutrition: "Excellent source of potassium, vitamin B6, vitamin C, and dietary fiber. One medium banana contains about 105 calories and 27g of carbohydrates.",
    health_benefits: [
      "Extremely high in potassium supporting heart health and muscle function",
      "Rich in vitamin B6 essential for brain development",
      "Natural prebiotic fiber feeds beneficial gut bacteria",
      "Quick-release energy ideal for athletes and active lifestyles",
      "Contains tryptophan which converts to serotonin for mood support"
    ],
    seasonality: "Year-round",
    origin: "Southeast Asia, cultivated extensively across the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-banana.jpg`,
    slug: "banana",
    category: ["popular", "seasonal"],
    how_to_eat: "Ripe bananas can be peeled and eaten fresh as a snack. Green bananas are boiled in salted water until tender — a Caribbean breakfast staple. Also great in smoothies, banana bread, fried as chips, or flambéed with rum for dessert.",
    storage: "Store at room temperature until ripe. Refrigerate ripe bananas to slow further ripening (skin will darken but fruit stays good). Freeze peeled bananas for smoothies up to 6 months.",
    color: "#FFE135",
    emoji: "🍌",
    related_fruit_ids: ["5", "8", "11"],
    views: 7200,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Banana Leaf",
      traditional_uses: [
        "Banana leaves used as natural wound dressings — their waxy surface creates a protective barrier that promotes healing and prevents infection",
        "Fresh banana leaf applied to burns and scalds in Caribbean first-aid tradition — provides cooling relief",
        "Banana flower (blossom) brewed as a tea to support lactation in breastfeeding mothers across South Asian and Caribbean communities",
        "Banana stem juice used traditionally to treat kidney stones and urinary tract infections"
      ],
      preparation: "For wound dressing: select a clean, fresh banana leaf, wash with clean water, and apply smooth (waxy) side down over the wound. Secure with cloth bandage. Replace every 8–12 hours. For banana flower tea: chop one banana blossom, boil in 3 cups water for 15 minutes, strain and drink.",
      safety_warnings: [
        "Banana leaf dressings are for minor wounds only — deep wounds, heavy bleeding, or signs of infection require medical attention",
        "Ensure leaves are clean and free from pesticides before topical application",
        "Banana flower tea may interact with blood sugar medications",
        "Some individuals may experience mild allergic reactions to banana latex"
      ],
      disclaimer: "This information documents traditional Caribbean and South Asian folk medicine practices. It is not medical advice. Always consult a qualified healthcare provider for wound care and health concerns."
    }
  },
  {
    id: "14",
    name: "Malay Apple",
    scientific_name: "Syzygium malaccense",
    description: "Malay apple, also known as Otaheite apple or mountain apple, is a stunning bell-shaped tropical fruit with a bright pink to deep red skin and crisp, white, juicy flesh. It has a mildly sweet, rose-scented flavor with a refreshing crunch. A beloved fruit tree in Caribbean yards.",
    nutrition: "Good source of vitamin C, vitamin A, calcium, iron, and dietary fiber. Low in calories with about 25 calories per 100g, making it an excellent light snack.",
    health_benefits: [
      "High water content promotes hydration",
      "Rich in vitamin C strengthening immune defense",
      "Contains iron helping prevent anemia",
      "Low calorie and high fiber aiding weight management",
      "Traditional Caribbean remedy for diabetes and digestive issues"
    ],
    seasonality: "May–August",
    origin: "Southeast Asia (Malaysia), widely grown in Jamaica and the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-malay-apple.jpg`,
    slug: "malay-apple",
    category: ["rare", "seasonal"],
    how_to_eat: "Wash and eat whole — the skin is edible. Bite into it like an apple for a refreshing, juicy crunch. The single seed in the center is not eaten. Also used in fruit salads and jams in the Caribbean.",
    storage: "Store at room temperature for 2-3 days. Refrigerate for up to one week. Not suitable for freezing due to high water content.",
    color: "#E91E63",
    emoji: "🍎",
    related_fruit_ids: ["7", "15"],
    views: 1800
  },
  {
    id: "15",
    name: "June Plum",
    scientific_name: "Spondias dulcis",
    description: "June plum, known as golden apple or pommecythere in Trinidad, is a crunchy, tangy tropical fruit beloved across the Caribbean. Green june plums are delightfully sour and often eaten with salt and pepper, while ripe ones turn golden and develop a sweet-tart tropical flavor.",
    nutrition: "Good source of vitamin C, vitamin A, iron, and calcium. Contains about 46 calories per 100g with 1g of fiber.",
    health_benefits: [
      "Very high in vitamin C boosting immune function",
      "Rich in vitamin A supporting healthy vision",
      "Iron content helps with oxygen transport in blood",
      "Contains antioxidants that protect against cellular damage",
      "Traditional remedy for coughs and digestive discomfort"
    ],
    seasonality: "June–October (peak), sometimes year-round",
    origin: "Polynesia, widely cultivated in Jamaica and the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-june-plum.jpeg`,
    slug: "june-plum",
    category: ["popular", "seasonal"],
    how_to_eat: "Green june plums are eaten with salt, pepper, and sometimes hot pepper sauce. Ripe golden fruits can be eaten fresh. Also juiced, pickled, or made into chutney. In Trinidad, it's made into a beloved juice called 'pommecythere juice'.",
    storage: "Store green june plums at room temperature for up to a week. Ripe ones should be refrigerated and eaten within 3-4 days. Can freeze juice for later use.",
    color: "#CDDC39",
    emoji: "🟡",
    related_fruit_ids: ["16", "5"],
    views: 3200
  },
  {
    id: "16",
    name: "Custard Apple",
    scientific_name: "Annona reticulata",
    description: "Custard apple, also known as bullock's heart in the Caribbean, is a heart-shaped fruit with a smooth reddish-brown skin and creamy, sweet white flesh with a custard-like texture. It's closely related to soursop and sugar apple, and is a cherished treat when in season.",
    nutrition: "Good source of vitamin C, B vitamins, potassium, magnesium, and dietary fiber. Contains about 101 calories per 100g with 4.4g of fiber.",
    health_benefits: [
      "Rich in vitamin C supporting collagen production and immunity",
      "High in potassium regulating blood pressure",
      "Contains magnesium supporting muscle and nerve function",
      "Dietary fiber promotes healthy digestion",
      "B vitamins support energy metabolism and brain function"
    ],
    seasonality: "August–November",
    origin: "Central America and Caribbean, grown across the tropics",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-custard-apple.png`,
    slug: "custard-apple",
    category: ["rare", "seasonal"],
    how_to_eat: "Wait until fully ripe (slightly soft to touch). Cut or break open and scoop out the sweet white flesh. Remove and discard the black seeds. Best enjoyed fresh and chilled. Can be blended into smoothies or ice cream base.",
    storage: "Ripen at room temperature — can take 3-5 days. Ripe fruit should be eaten within 1-2 days. The pulp can be frozen for up to 3 months.",
    color: "#8D6E63",
    emoji: "💛",
    related_fruit_ids: ["3", "9"],
    views: 1600
  },
  {
    id: "17",
    name: "Hog Plum",
    scientific_name: "Spondias mombin",
    description: "Hog plum, also called yellow mombin, is a small tangy-sweet fruit common throughout the Caribbean. The bright yellow fruit has a thin skin, juicy flesh, and a large spiny seed. It's a nostalgic childhood fruit for many Caribbean people, often picked wild from roadside trees.",
    nutrition: "Good source of vitamin C, vitamin A, calcium, and phosphorus. Contains about 50 calories per 100g. The high water content makes it refreshing.",
    health_benefits: [
      "Rich in vitamin C boosting the immune system",
      "Contains vitamin A promoting healthy vision",
      "Natural source of calcium for bone health",
      "High water content aids in hydration",
      "Traditional use as a natural fever reducer in Caribbean folk medicine"
    ],
    seasonality: "June–September",
    origin: "Tropical Americas and Caribbean, grows wild in Jamaica",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-hogplum.jpg`,
    slug: "hog-plum",
    category: ["rare", "seasonal"],
    how_to_eat: "Eat fresh when ripe (yellow and slightly soft). Suck the tangy flesh off the spiny seed. Often eaten with salt and pepper. Also made into juice, jam, or fermented into wine in some Caribbean islands.",
    storage: "Store at room temperature and consume within 3-4 days. Ripe hog plums bruise easily. Can be frozen for juice making later.",
    color: "#FFC107",
    emoji: "🟡",
    related_fruit_ids: ["15", "12"],
    views: 1400
  },
  {
    id: "18",
    name: "Dragon Fruit",
    scientific_name: "Hylocereus undatus",
    description: "Dragon fruit, also known as pitaya, is an exotic cactus fruit with a vibrant pink or yellow exterior and white or magenta flesh speckled with tiny black seeds. Its mild, subtly sweet flavor and stunning appearance have made it increasingly popular in Caribbean gardens and markets.",
    nutrition: "Low in calories (60 per 100g), high in fiber, vitamin C, and antioxidants. Contains iron, magnesium, and beneficial plant compounds like betalains.",
    health_benefits: [
      "High in antioxidants including betalains and hydroxycinnamates",
      "Excellent source of prebiotic fiber for gut health",
      "Contains iron which is rare in fruits",
      "May help lower blood sugar levels",
      "Supports healthy skin with vitamin C and hydration"
    ],
    seasonality: "Year-round in tropical climates",
    origin: "Central America, now grown across the Caribbean and tropics",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-dragonfruit.png`,
    slug: "dragon-fruit",
    category: ["rare"],
    how_to_eat: "Cut in half lengthwise and scoop out the flesh with a spoon, or peel and slice. Eat fresh, add to smoothie bowls, or use in fruit salads. The seeds are edible and add a pleasant crunch. Chill before serving for best flavor.",
    storage: "Store at room temperature for 2-3 days. Refrigerate ripe dragon fruit for up to 2 weeks. Cut fruit should be consumed within 2 days. Freezes well for smoothies.",
    color: "#EC4899",
    emoji: "🐉",
    related_fruit_ids: ["6", "8"],
    views: 2200
  },
  {
    id: "19",
    name: "Avocado",
    scientific_name: "Persea americana",
    description: "Avocado, known as 'pear' in many Caribbean islands, is a creamy, nutrient-dense fruit essential to Caribbean cuisine. Unlike most fruits, avocados are high in healthy fats rather than carbohydrates. They're eaten in salads, sandwiches, or simply with a squeeze of lime and salt.",
    nutrition: "Rich in heart-healthy monounsaturated fats, potassium (more than bananas), folate, vitamins K, E, C, and B6. One avocado contains about 240 calories.",
    health_benefits: [
      "High in monounsaturated fats supporting heart health",
      "More potassium than bananas for blood pressure control",
      "Rich in fiber aiding digestion and satiety",
      "Contains lutein for eye health",
      "Healthy fats help absorb fat-soluble vitamins"
    ],
    seasonality: "June–September (peak), some varieties year-round",
    origin: "Central America, widely cultivated across the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-avocado.jpeg`,
    slug: "avocado",
    category: ["popular", "seasonal"],
    how_to_eat: "Cut in half around the pit, twist to separate. Remove the pit and scoop flesh with a spoon. Eat with salt and lime, mash for guacamole, slice for salads and sandwiches, or blend into smoothies for creaminess.",
    storage: "Ripen at room temperature. Speed ripening by placing in a paper bag with a banana. Ripe avocados keep 2-3 days refrigerated. Sprinkle cut avocado with lime juice to prevent browning.",
    color: "#4ADE80",
    emoji: "🥑",
    related_fruit_ids: ["11", "8"],
    views: 4500,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Avocado Leaf",
      traditional_uses: [
        "Avocado leaf tea used traditionally in Caribbean and Mexican folk medicine to reduce high blood pressure",
        "Leaves contain quercetin and other flavonoids with anti-inflammatory and antioxidant properties",
        "Leaf infusion used as a digestive aid and to relieve stomach pain",
        "Traditional remedy for menstrual cramps and irregular cycles in some Caribbean communities",
        "Dried leaves burned and used in baths for muscle relaxation"
      ],
      preparation: "Select 3–4 dried avocado leaves (or 2 fresh ones). Wash thoroughly. Steep in 2 cups of boiling water for 10–15 minutes. Strain and drink warm. Can add honey or lime. Limit to one cup per day.",
      safety_warnings: [
        "Avocado leaves from the Guatemalan variety may contain persin, a fungicidal toxin — ensure you are using leaves from the Mexican or West Indian variety common in the Caribbean",
        "Avocado leaf tea can lower blood pressure — avoid if already on hypertension medication without medical advice",
        "Not safe for consumption by animals (toxic to dogs, cats, horses, birds)",
        "Do not consume during pregnancy"
      ],
      disclaimer: "This information documents traditional Caribbean and Latin American folk medicine practices. It is not medical advice. Always consult a qualified healthcare provider before use."
    }
  },
  {
    id: "20",
    name: "Sweetsop",
    scientific_name: "Annona squamosa",
    description: "Sweetsop, also known as sugar apple or custard apple in some regions, is a tropical fruit beloved for its intensely sweet, custard-like flesh. The green, knobby exterior hides creamy white segments that melt in your mouth with notes of vanilla custard and ripe pear. A true Caribbean delicacy.",
    nutrition: "Rich in vitamin C (151% DV per cup), vitamin B6, potassium, magnesium, and iron. Contains about 235 calories per cup with 5.5g of fiber and natural sugars.",
    health_benefits: [
      "Extremely high in vitamin C supporting collagen production and skin elasticity",
      "Rich in vitamin B6 essential for brain function and energy metabolism",
      "High iron content helps prevent anemia and boosts energy",
      "Potassium supports heart health and blood pressure regulation",
      "Antioxidant properties help protect cells from oxidative damage"
    ],
    seasonality: "July–October (peak), sometimes into December",
    origin: "Tropical Americas and West Indies, widely grown across the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-sweetsop-apple.jpeg`,
    slug: "sweetsop",
    category: ["rare", "seasonal"],
    how_to_eat: "Wait until fully ripe (soft to gentle pressure, segments separate easily). Break open with your hands and eat the creamy white flesh segment by segment, spitting out the shiny black seeds. Best enjoyed chilled. Do not eat the seeds or skin.",
    storage: "Ripen at room temperature for 2-4 days. Ripe sweetsop is very delicate — refrigerate and eat within 1-2 days. Pulp can be frozen for smoothies and ice cream.",
    color: "#A5D6A7",
    emoji: "🍏",
    related_fruit_ids: ["3", "16"],
    views: 1900,
    leaf_medicine: {
      has_leaf_use: true,
      leaf_name: "Sweetsop Leaf (Sugar Apple Leaf)",
      traditional_uses: [
        "Crushed sweetsop leaves applied to the scalp as a traditional treatment for head lice across the Caribbean",
        "Leaf decoction used to induce sleep and calm restlessness — similar sedative properties to its cousin soursop",
        "Leaves used in traditional baths for fever reduction in Jamaican and Trinidadian folk medicine",
        "Bark and leaf preparations used traditionally for treating dysentery and diarrhea"
      ],
      preparation: "For lice treatment: crush 8–10 fresh sweetsop leaves into a paste, apply to wet scalp, cover with a shower cap for 30 minutes, then wash thoroughly. For tea: steep 2–3 dried leaves in boiling water for 10 minutes. Strain and drink.",
      safety_warnings: [
        "Sweetsop seeds and leaves contain annonaceous acetogenins — the same compounds found in soursop that may cause neurotoxicity with long-term overuse",
        "NEVER consume sweetsop seeds — they are toxic",
        "Leaf paste for lice should not be left on skin for more than 30 minutes",
        "Internal use should be limited and not daily",
        "Avoid during pregnancy and breastfeeding"
      ],
      disclaimer: "This information documents traditional Caribbean folk medicine practices. It is not medical advice. Always consult a qualified healthcare provider before use. The lice treatment described is a folk remedy and not a substitute for medically approved treatments."
    }
  },
  {
    id: "21",
    name: "Sea Grape",
    scientific_name: "Coccoloba uvifera",
    description: "Sea grape is a coastal Caribbean fruit that grows in large, grape-like clusters on trees along beaches and dunes. The fruits turn from green to deep purple when ripe and have a mildly sweet, wine-like flavor. Traditionally eaten fresh, made into jellies, or fermented into homemade wine.",
    nutrition: "Contains vitamin C, iron, fiber, and polyphenol antioxidants. Lower in sugar than table grapes, with about 60 calories per 100g.",
    health_benefits: [
      "Provides antioxidants that help neutralize free radicals",
      "Traditional Caribbean remedy for sore throat and cough when made into syrup",
      "Mildly astringent properties support digestive health",
      "Rich in tannins which may support cardiovascular health",
      "Coastal plant that helps stabilize dunes and protect against erosion"
    ],
    seasonality: "June–September (coastal Caribbean)",
    origin: "Native to Caribbean coastlines, Florida, and Central America",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruits-seagrape.jpeg`,
    slug: "sea-grape",
    category: ["rare", "seasonal"],
    how_to_eat: "Eat ripe purple fruits fresh by sucking the pulp from the seed, or cook down with sugar and water to make a thick sea grape syrup or jelly. Traditionally fermented into homemade wine along Caribbean coasts.",
    storage: "Fresh sea grapes should be kept refrigerated and consumed within 3–4 days. Syrups, jellies, and wine have a much longer shelf life when properly bottled.",
    color: "#9C27B0",
    emoji: "🍇",
    related_fruit_ids: ["17", "10", "12"],
    views: 900
  },
  {
    id: "22",
    name: "Pineapple",
    scientific_name: "Ananas comosus",
    description: "Pineapple is a juicy tropical fruit loved across Jamaica and the Caribbean for its bright sweet-tart flavor. It's eaten fresh, juiced, and used in cakes, sauces, and festive drinks. Caribbean pineapples are especially fragrant when fully ripe.",
    nutrition: "A good source of vitamin C and manganese. Contains bromelain, an enzyme that helps break down proteins. About 50 calories per 100g.",
    health_benefits: [
      "Vitamin C supports immune health",
      "Bromelain may support digestion of proteins",
      "Hydrating fruit with natural electrolytes",
      "Antioxidants help reduce oxidative stress",
      "Manganese supports bone health and metabolism"
    ],
    seasonality: "Year-round, peak April–July",
    origin: "South America, widely cultivated throughout the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruits-pineapple.png`,
    slug: "pineapple",
    category: ["popular", "seasonal"],
    how_to_eat: "Slice off the crown and skin, remove the eyes, then cut into wedges or rings. Enjoy fresh, blend into juice, or use in desserts like pineapple upside-down cake.",
    storage: "Store whole pineapple at room temperature for 1–2 days or refrigerate for up to 5 days. Cut pineapple should be refrigerated and eaten within 2–3 days.",
    color: "#F9A825",
    emoji: "🍍",
    related_fruit_ids: ["5", "11", "13"],
    views: 4100
  },
  {
    id: "23",
    name: "Jackfruit",
    scientific_name: "Artocarpus heterophyllus",
    description: "Jackfruit is the largest tree-borne fruit in the world and is increasingly popular in the Caribbean for both sweet and savory uses. Ripe jackfruit is fragrant and sweet, while unripe jackfruit has a meaty texture that works well in stews and sandwiches.",
    nutrition: "Provides carbohydrates, fiber, and vitamin C, with small amounts of potassium and magnesium. About 95 calories per 100g.",
    health_benefits: [
      "Fiber supports digestive health",
      "Vitamin C supports immune function",
      "Provides energy from natural carbohydrates",
      "Contains antioxidants like carotenoids",
      "Potassium supports heart health"
    ],
    seasonality: "June–October",
    origin: "South Asia, now grown across the Caribbean and tropical regions",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-jackfruit.jpeg`,
    slug: "jackfruit",
    category: ["rare", "seasonal"],
    how_to_eat: "Ripe: eat the yellow pods fresh and discard seeds (seeds can be boiled/roasted separately). Unripe: cook in stews, curries, or shred for a savory filling.",
    storage: "Whole jackfruit is best cut and used within 2–3 days. Refrigerate cut pods in airtight containers for up to 5 days or freeze for longer storage.",
    color: "#FFB300",
    emoji: "🟡",
    related_fruit_ids: ["2", "22"],
    views: 1200
  },
  {
    id: "24",
    name: "Lychee",
    scientific_name: "Litchi chinensis",
    description: "Lychee is a fragrant tropical fruit with a rough pink-red shell and a translucent, juicy flesh that tastes like floral grape and pear. While more common in Asia, lychee is grown in parts of the Caribbean and is prized for refreshing drinks and desserts.",
    nutrition: "High in vitamin C and water content. About 66 calories per 100g.",
    health_benefits: [
      "Vitamin C supports immune defense",
      "Hydrating fruit with natural sugars for quick energy",
      "Contains polyphenol antioxidants",
      "Provides small amounts of copper",
      "Supports skin health via vitamin C"
    ],
    seasonality: "May–July",
    origin: "China and Southeast Asia, cultivated in tropical regions including parts of the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-lychee.png`,
    slug: "lychee",
    category: ["rare", "seasonal"],
    how_to_eat: "Peel away the shell, eat the juicy flesh, and discard the large seed. Enjoy chilled, in fruit salads, or blended into drinks.",
    storage: "Refrigerate lychees in a breathable bag and use within 5–7 days. Peeled lychees can be frozen.",
    color: "#E53935",
    emoji: "🔴",
    related_fruit_ids: ["6", "22"],
    views: 800
  },
  {
    id: "25",
    name: "Stinking Toe",
    scientific_name: "Hymenaea courbaril",
    description: "Stinking toe, also called West Indian locust, is a traditional Caribbean forest fruit with a hard brown pod. Inside is a dry, pale pulp with a strong aroma and a sweet, floury taste similar to roasted chestnut or caramel. Often eaten as a nostalgic snack.",
    nutrition: "Contains carbohydrates, fiber, and minerals. The dry pulp is energy-dense compared to watery fruits.",
    health_benefits: [
      "Traditional energy food due to carbohydrate-rich pulp",
      "Contains fiber that supports digestion",
      "Historically used as a survival food in rural Caribbean communities",
      "May provide minerals like calcium and iron",
      "Pulp is shelf-stable and travel-friendly"
    ],
    seasonality: "January–May",
    origin: "Native to the Caribbean and tropical Americas",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-stinking-toe.png`,
    slug: "stinking-toe",
    category: ["rare", "seasonal"],
    how_to_eat: "Crack open the hard pod, smell the distinctive aroma, then eat the dry pulp. Avoid chewing the very hard seeds. Traditionally eaten plain or mixed into porridge in some communities.",
    storage: "Unopened pods keep for weeks in a dry place. Once opened, keep pulp dry and sealed.",
    color: "#6D4C41",
    emoji: "🟤",
    related_fruit_ids: ["12", "9"],
    views: 650
  },
  {
    id: "26",
    name: "Breadnut",
    scientific_name: "Artocarpus camansi",
    description: "Breadnut is a close relative of breadfruit, valued in the Caribbean for its nutritious seeds. The cooked seeds are eaten like nuts or beans — roasted, boiled, or stewed — and have a mild, chestnut-like flavor.",
    nutrition: "Good source of plant protein, complex carbohydrates, and minerals. The seeds are more protein-rich than breadfruit flesh.",
    health_benefits: [
      "Plant-based protein supports muscle repair and satiety",
      "Complex carbs provide steady energy",
      "Contains fiber for digestive health",
      "Seeds provide minerals like magnesium and potassium",
      "Versatile staple for budget-friendly nutrition"
    ],
    seasonality: "June–September",
    origin: "New Guinea, now grown in parts of the Caribbean",
    image_url: `${SUPABASE_STORAGE}/fruit-images/fruit-breadnut.png`,
    slug: "breadnut",
    category: ["rare", "seasonal"],
    how_to_eat: "Remove seeds from the fruit, rinse, then boil in salted water for 20–30 minutes until tender. Roast for a nuttier flavor. Eat as a snack or add to stews.",
    storage: "Fresh seeds spoil quickly—cook within 1–2 days. Cooked seeds refrigerate for 3–4 days or freeze.",
    color: "#8BC34A",
    emoji: "🌰",
    related_fruit_ids: ["2", "23"],
    views: 300
  }
];

export const getFruitBySlug = (slug: string): Fruit | undefined => {
  return fruits.find(f => f.slug === slug);
};

export const getFruitById = (id: string): Fruit | undefined => {
  return fruits.find(f => f.id === id);
};

export const getFruitsByCategory = (category: string): Fruit[] => {
  return fruits.filter(f => f.category.includes(category));
};

export const getRelatedFruits = (fruit: Fruit): Fruit[] => {
  return fruit.related_fruit_ids.map(id => getFruitById(id)).filter(Boolean) as Fruit[];
};

export const getSeasonalFruits = (): Fruit[] => {
  const month = new Date().toLocaleString('default', { month: 'long' });
  return fruits.filter(f => f.seasonality.toLowerCase().includes(month.toLowerCase().substring(0, 3)) || f.seasonality.includes("Year-round"));
};

export const getTrendingFruits = (): Fruit[] => {
  return [...fruits].sort((a, b) => b.views - a.views).slice(0, 4);
};

export const searchFruits = (query: string): Fruit[] => {
  const q = query.toLowerCase();
  return fruits.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.description.toLowerCase().includes(q) ||
    f.scientific_name.toLowerCase().includes(q)
  );
};
