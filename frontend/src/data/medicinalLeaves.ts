/**
 * MEDICINAL LEAF INTELLIGENCE — Phase 6
 * IslandFruitGuide.com
 *
 * IMPORTANT DISCLAIMER:
 * All content here documents traditional Caribbean and ethnobotanical folk medicine practices.
 * This is NOT medical advice. Never replace conventional medical treatment with herbal remedies.
 * Always consult a qualified healthcare provider before use.
 *
 * Content Standard: Cultural / Traditional use ONLY.
 * ❌ No "cures" | ❌ No "treats" | ❌ No "prevents disease"
 * ✅ Traditional use | ✅ Cultural context | ✅ Preparation methods
 */

export type CompatibilityLevel = "safe" | "caution" | "avoid";
export type RuleType = "block" | "warn" | "conditional";
export type PreparationType = "tea" | "porridge" | "sauce" | "decoction" | "juice" | "topical" | "bath" | "any";

// ─────────────────────────────────────────────
// ENTITY: Medicinal Leaf
// ─────────────────────────────────────────────
export interface MedicinalLeaf {
  leaf_id: string;
  common_name: string;
  local_names: string[];
  scientific_name: string;
  plant_part_used: string;
  traditional_uses: string[];
  preparation_methods: {
    method: string;
    instructions: string;
    heat_required: boolean;
    allowed_with: PreparationType[];
  }[];
  flavor_profile: string;
  contraindications: string[];
  pregnancy_warning: boolean;
  interaction_flags: string[];
  image_id: string | null;
  source_notes: string;
  slug: string;
  fruit_id: string; // Primary fruit this leaf comes from
  seo_title: string;
  seo_description: string;
  disclaimer: string;
}

// ─────────────────────────────────────────────
// ENTITY: Leaf ↔ Fruit Compatibility (Pivot)
// ─────────────────────────────────────────────
export interface LeafFruitCompatibility {
  leaf_id: string;
  fruit_id: string;
  compatibility_level: CompatibilityLevel;
  reason: string;
  heat_required: boolean;
  max_frequency_note: string;
  allowed_preparations: PreparationType[];
}

// ─────────────────────────────────────────────
// ENTITY: Safety Rule (Admin QA Engine)
// ─────────────────────────────────────────────
export interface SafetyRule {
  rule_id: string;
  rule_type: RuleType;
  trigger: {
    fruit_ids?: string[];
    leaf_ids?: string[];
    preparation_types?: PreparationType[];
  };
  rule_reason: string;
  display_message: string;
  admin_notes: string;
}

// ─────────────────────────────────────────────
// SEED DATA: Medicinal Leaves
// ─────────────────────────────────────────────
export const medicinalLeaves: MedicinalLeaf[] = [
  {
    leaf_id: "leaf-01",
    common_name: "Soursop Leaf",
    local_names: ["Graviola Leaf", "Guanabana Leaf", "Corossol"],
    scientific_name: "Annona muricata",
    plant_part_used: "Mature green leaves; sometimes bark",
    traditional_uses: ["Steeped as a calming bedtime tea to support relaxation and sleep quality", "Used in traditional Caribbean practice as a warm bath for general wellness and skin soothing", "Leaf decoctions prepared in folk medicine communities for general vitality", "Historically prepared as a poultice applied externally to areas of skin discomfort"],
    preparation_methods: [{"method": "Graviola Tea", "instructions": "Wash 2\u20133 fresh or dried soursop leaves. Place in a teapot. Pour 2 cups of boiling water over them. Steep for 10\u201315 minutes. Strain and drink warm. Add honey or lime to taste. Best consumed in the evening.", "heat_required": true, "allowed_with": ["tea", "decoction"]}, {"method": "Wellness Bath", "instructions": "Boil 8\u201310 soursop leaves in a large pot of water for 15 minutes. Allow to cool to a warm, comfortable temperature. Add to bath or use as a body rinse. For external use only.", "heat_required": true, "allowed_with": ["bath"]}, {"method": "Topical Poultice", "instructions": "Wash fresh leaves thoroughly. Crush or bruise the leaves to release their properties. Apply gently to the external skin area of concern. Cover loosely with a clean cloth. Remove after 20\u201330 minutes and rinse area with water.", "heat_required": false, "allowed_with": ["topical"]}],
    flavor_profile: "Mildly bitter, earthy, with a faint floral undertone. Best sweetened with honey.",
    contraindications: ["Long-term or excessive daily consumption is associated with neurotoxicity risk \u2014 annonacin compounds", "Not to be combined with blood pressure or diabetes medications without physician oversight", "Never combined with alcohol preparations", "Seeds of the soursop fruit are toxic and must never be used in any preparation"],
    pregnancy_warning: true,
    interaction_flags: ["Blood pressure medications (antihypertensives)", "Diabetes / blood sugar medications", "Sedative medications (CNS depressants)"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-soursop-leaf.png",
    source_notes: "Caribbean ethnobotanical tradition. Laboratory research on annonacin published in Journal of Natural Products (1996). Neurotoxicity link documented in Movement Disorders journal (2012).",
    slug: "soursop-leaf",
    fruit_id: "3",
    seo_title: "Soursop Leaf (Graviola) — Traditional Caribbean Uses & Preparation | IslandFruitGuide",
    seo_description: "Learn about traditional Caribbean uses of soursop (graviola) leaves, preparation methods, safety notes, and cultural context. Educational content only — not medical advice.",
    disclaimer: "This content documents traditional Caribbean folk medicine practices only. It is NOT medical advice. Soursop leaf tea should never replace conventional medical treatment. Always consult a qualified healthcare provider."
  },
  {
    leaf_id: "leaf-02",
    common_name: "Guava Leaf",
    local_names: ["Guyava Leaf", "Jambu Batu Leaf"],
    scientific_name: "Psidium guajava",
    plant_part_used: "Young tender leaves from branch tips",
    traditional_uses: ["Guava leaf tea is one of the most widely used traditional remedies in the Caribbean, primarily prepared for digestive support", "Used in folk practice as a mouth rinse for oral hygiene and tooth discomfort", "Leaf decoctions traditionally prepared for general wellness as a daily tonic", "Applied topically to the scalp in some Caribbean communities for hair care"],
    preparation_methods: [{"method": "Guava Leaf Tea", "instructions": "Select 4\u20135 fresh, young guava leaves from branch tips. Wash thoroughly. Boil in 3 cups of water for 10\u201315 minutes until the water reduces to about 1.5 cups and turns amber. Strain and drink warm. Can add a squeeze of lime.", "heat_required": true, "allowed_with": ["tea", "decoction"]}, {"method": "Oral Rinse", "instructions": "Prepare guava leaf tea (above method). Allow to cool to a comfortable temperature. Swish in the mouth for 30\u201360 seconds. Spit out \u2014 do not swallow the rinse. Rinse with clean water afterward.", "heat_required": true, "allowed_with": ["any"]}, {"method": "Scalp Application", "instructions": "Prepare a strong guava leaf decoction using 8\u201310 leaves in 2 cups of water for 20 minutes. Cool completely. Apply to the scalp after washing hair. Massage gently and leave for 20\u201330 minutes. Rinse thoroughly.", "heat_required": true, "allowed_with": ["topical"]}],
    flavor_profile: "Mild, slightly astringent, with a light earthy-green taste. Pairs well with lime and honey.",
    contraindications: ["May interact with blood sugar medications \u2014 monitor carefully if managing glucose levels", "High tannin content may cause temporary constipation if consumed in very large quantities", "May interact with blood-thinning (anticoagulant) medications", "Moderate consumption (1\u20132 cups per day) is the traditional practice"],
    pregnancy_warning: false,
    interaction_flags: ["Blood sugar medications (hypoglycemics)", "Anticoagulant / blood thinners"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-guava-leaf.png",
    source_notes: "Journal of Ethnopharmacology — guava leaf for digestive health. Nutrition & Metabolism (2010) — blood glucose study. Traditional Caribbean and South Asian ethnobotany.",
    slug: "guava-leaf",
    fruit_id: "10",
    seo_title: "Guava Leaf — Traditional Caribbean Uses, Tea Preparation & Safety | IslandFruitGuide",
    seo_description: "Discover traditional Caribbean uses of guava leaves including tea preparation, oral rinse, and scalp care. Educational content only — not medical advice.",
    disclaimer: "This content documents traditional Caribbean folk medicine practices. It is NOT medical advice. Always consult a qualified healthcare provider before using herbal preparations."
  },
  {
    leaf_id: "leaf-03",
    common_name: "Papaya Leaf",
    local_names: ["Pawpaw Leaf", "Carica Leaf", "Papaw Leaf"],
    scientific_name: "Carica papaya",
    plant_part_used: "Mature papaya leaves; sometimes young leaves",
    traditional_uses: ["Prepared as a juice in some tropical communities for traditional wellness practices", "Used as a tenderizing wrap \u2014 papaya leaves wrapped around meat before cooking to soften texture (culinary use)", "Leaf poultice applied externally to wounds in traditional Caribbean first-aid", "Prepared as a tea used in folk practice for digestive support"],
    preparation_methods: [{"method": "Papaya Leaf Tea", "instructions": "Select 1\u20132 medium mature papaya leaves. Wash thoroughly and remove the thick central stem. Tear leaves into smaller pieces. Steep in 2 cups of boiling water for 10\u201315 minutes. Strain well and drink warm. Very bitter \u2014 add honey generously.", "heat_required": true, "allowed_with": ["tea", "decoction"]}, {"method": "Culinary Meat Wrapper", "instructions": "Select large, fresh papaya leaves. Wash well. Wrap raw meat (chicken, goat, fish) in the leaves. Tie with kitchen string. Allow to rest for 30\u201360 minutes before cooking. The natural enzymes (papain) tenderize the meat. Remove leaves before serving.", "heat_required": false, "allowed_with": ["any"]}, {"method": "Topical Compress", "instructions": "Wash fresh papaya leaves. Warm slightly (do not boil). Apply the warm leaf directly to the external skin area. Cover with a clean cloth. Remove after 20 minutes. Rinse area with clean water.", "heat_required": false, "allowed_with": ["topical"]}],
    flavor_profile: "Very bitter and astringent. Requires significant sweetening with honey or coconut water when consumed as tea.",
    contraindications: ["Papain enzymes may stimulate uterine activity \u2014 AVOID during pregnancy", "May interact with blood-thinning medications (warfarin) due to platelet effects", "People with latex allergies may experience cross-reactivity", "Very bitter taste \u2014 start with small amounts to assess tolerance"],
    pregnancy_warning: true,
    interaction_flags: ["Anticoagulants / blood thinners (warfarin)", "Platelet medications", "Latex allergy cross-reactivity"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-papaya-leaf.png",
    source_notes: "Emerging clinical research on papaya leaf and platelet support. Traditional Caribbean and South Asian ethnobotany. Culinary use of papain for tenderizing is well-established.",
    slug: "papaya-leaf",
    fruit_id: "8",
    seo_title: "Papaya Leaf — Traditional Uses, Tea Preparation & Culinary Wraps | IslandFruitGuide",
    seo_description: "Explore traditional Caribbean and tropical uses of papaya leaves including tea, culinary meat wraps, and topical applications. Educational only — not medical advice.",
    disclaimer: "This content documents traditional tropical folk medicine practices and culinary uses. It is NOT medical advice. Papaya leaf should not replace any prescribed medical treatment. Consult a healthcare provider before internal use."
  },
  {
    leaf_id: "leaf-04",
    common_name: "Mango Leaf",
    local_names: ["Mango Patta", "Manguier Leaf"],
    scientific_name: "Mangifera indica",
    plant_part_used: "Young, tender mango leaves (lighter green)",
    traditional_uses: ["Young mango leaves steeped as a morning tea in South Asian and Caribbean folk tradition", "Dried leaves historically burned as an aromatic during cultural ceremonies", "Young leaves chewed in some traditional practices for oral care", "Leaf decoction used as a traditional foot soak in some Caribbean communities"],
    preparation_methods: [{"method": "Morning Leaf Tea", "instructions": "Select 5\u20136 tender young mango leaves (the fresh reddish-green ones near branch tips). Wash thoroughly. Soak in 2 cups of clean water overnight. Strain in the morning and drink the infused water on an empty stomach. Alternatively, lightly boil for 10 minutes, cool, and drink warm.", "heat_required": false, "allowed_with": ["tea"]}, {"method": "Warm Foot Soak", "instructions": "Boil 10\u201312 mango leaves in a large pot of water for 15 minutes. Cool to a comfortable warm temperature. Pour into a basin and soak feet for 20\u201330 minutes. For external use only.", "heat_required": true, "allowed_with": ["bath", "topical"]}],
    flavor_profile: "Mildly tangy, slightly resinous, with a faint fruity note. Less bitter than papaya or soursop leaf.",
    contraindications: ["May affect blood sugar levels \u2014 caution if managing diabetes or on glucose-lowering medications", "Some individuals may be allergic to mango \u2014 this extends to the leaves (contact dermatitis possible)", "Not to be used in large quantities", "May interact with anticoagulant medications"],
    pregnancy_warning: true,
    interaction_flags: ["Blood sugar medications", "Anticoagulants", "Mango / urushiol allergy (related to poison ivy)"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-mango-leaf.png",
    source_notes: "Traditional Ayurvedic medicine and Caribbean folk use. Mango allergy connection documented via urushiol cross-reactivity (Anacardiaceae family).",
    slug: "mango-leaf",
    fruit_id: "5",
    seo_title: "Mango Leaf — Traditional Uses, Morning Tea & Folk Preparation | IslandFruitGuide",
    seo_description: "Learn about traditional Caribbean and Ayurvedic uses of mango leaves including morning tea and foot soaks. Educational content only — not medical advice.",
    disclaimer: "This content documents traditional Ayurvedic and Caribbean folk medicine practices. It is NOT medical advice. Always consult a qualified healthcare provider before use."
  },
  {
    leaf_id: "leaf-05",
    common_name: "Breadfruit Leaf",
    local_names: ["Breadfruit Tea Leaf", "Arbre \u00e0 Pain Leaf"],
    scientific_name: "Artocarpus altilis",
    plant_part_used: "Mature, dark green breadfruit leaves",
    traditional_uses: ["Breadfruit leaf tea is one of the most popular traditional teas in the Caribbean \u2014 widely drunk for general heart and circulatory wellness", "Used in folk tradition as a soothing rinse for skin conditions", "Leaf latex (milky sap) applied topically in traditional wound care", "Dried leaves woven into traditional crafts and historically used as writing surfaces"],
    preparation_methods: [{"method": "Breadfruit Leaf Tea", "instructions": "Select 2\u20133 mature, dark green breadfruit leaves. Wash thoroughly and tear into manageable pieces. Boil in 3 cups of water for 15\u201320 minutes until the water turns a rich amber-brown. Strain and drink warm. Traditionally taken once daily in the morning.", "heat_required": true, "allowed_with": ["tea", "decoction"]}, {"method": "Skin Soothing Rinse", "instructions": "Prepare breadfruit leaf tea using the standard method above. Allow to cool completely. Use as an external rinse over the affected skin area. Do not apply to open wounds. Pat dry gently after application.", "heat_required": true, "allowed_with": ["topical", "bath"]}],
    flavor_profile: "Mild, earthy, slightly woody. More neutral than soursop or papaya leaf — generally easy to drink.",
    contraindications: ["May lower blood pressure \u2014 use cautiously if already on antihypertensive medication", "The latex sap from the leaf can cause skin irritation in sensitive individuals \u2014 handle with gloves if needed", "Do not exceed one cup of leaf tea per day in traditional practice", "Not recommended for pregnant or breastfeeding women without medical consultation"],
    pregnancy_warning: true,
    interaction_flags: ["Antihypertensive medications (blood pressure)", "Latex sensitivity"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-breadfruit-leaf.png",
    source_notes: "Caribbean ethnobotany tradition. Used extensively across Jamaica, Trinidad, and Barbados. Polynesian traditional medicine reference.",
    slug: "breadfruit-leaf",
    fruit_id: "2",
    seo_title: "Breadfruit Leaf Tea — Traditional Caribbean Uses & Preparation | IslandFruitGuide",
    seo_description: "Discover the traditional Caribbean practice of making breadfruit leaf tea, its preparation method, and important safety notes. Educational only — not medical advice.",
    disclaimer: "This content documents traditional Caribbean folk medicine practices. It is NOT medical advice. Always consult a qualified healthcare provider."
  },
  {
    leaf_id: "leaf-06",
    common_name: "Passion Fruit Leaf",
    local_names: ["Passiflora Leaf", "Maracuya Leaf", "Grenadille Leaf"],
    scientific_name: "Passiflora edulis",
    plant_part_used: "Mature passion fruit vine leaves",
    traditional_uses: ["Passiflora leaf tea is used in Caribbean tradition as a calming evening preparation", "Traditional bedtime tea in Jamaica and Trinidad for restful sleep support", "Used in folk practice as a poultice for burns and skin irritation", "Traditionally prepared as a tonic for general nervous system relaxation"],
    preparation_methods: [{"method": "Calming Passiflora Tea", "instructions": "Dry passion fruit leaves in shade for 2\u20133 days. Steep 1\u20132 dried leaves (or 2 fresh) in one cup of boiling water for 8\u201310 minutes. Strain and drink 30 minutes before bedtime. May add honey and a drop of vanilla.", "heat_required": true, "allowed_with": ["tea"]}, {"method": "Cooling Skin Poultice", "instructions": "Wash fresh passion fruit leaves. Crush gently to release the plant juices. Apply the crushed leaves directly to minor skin irritation or the affected area. Cover loosely with a clean cotton cloth. Leave for 15\u201320 minutes. Rinse with clean water.", "heat_required": false, "allowed_with": ["topical"]}],
    flavor_profile: "Mild, slightly floral, and faintly sweet — one of the more pleasant-tasting leaf teas.",
    contraindications: ["May cause drowsiness \u2014 do not drive or operate machinery after consuming", "NEVER combine with alcohol or other CNS depressants", "May interact with sedative medications, anti-anxiety drugs (benzodiazepines)", "May interact with blood-thinning medications"],
    pregnancy_warning: true,
    interaction_flags: ["Sedative medications", "Benzodiazepines / anti-anxiety drugs", "Anticoagulants", "Alcohol (hard block)"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-passion-fruit-leaf.png",
    source_notes: "Passiflora leaf sedative properties documented in clinical literature. Traditional Caribbean and South American use. Chrysin and vitexin GABA-receptor activity research.",
    slug: "passion-fruit-leaf",
    fruit_id: "6",
    seo_title: "Passion Fruit Leaf (Passiflora) — Traditional Calming Tea & Preparation | IslandFruitGuide",
    seo_description: "Learn how passiflora (passion fruit) leaves are used in Caribbean tradition as a calming tea, preparation method, and important safety notes. Educational only.",
    disclaimer: "This content documents traditional Caribbean folk medicine practices supported by some research. It is NOT medical advice. Consult a healthcare provider before use, especially if taking medications."
  },
  {
    leaf_id: "leaf-07",
    common_name: "Avocado Leaf",
    local_names: ["Pear Leaf", "Aguacate Leaf"],
    scientific_name: "Persea americana (West Indian / Mexican variety)",
    plant_part_used: "Dried mature leaves of West Indian or Mexican avocado varieties",
    traditional_uses: ["Avocado leaf tea used traditionally in Caribbean and Mexican folk culture for circulatory wellness", "Leaves sometimes used as aromatic additions to traditional Caribbean stews and rice dishes (culinary use)", "Dried leaf decoctions used as a traditional digestive tea after heavy meals", "Leaves used in traditional bath preparations for general muscle relaxation"],
    preparation_methods: [{"method": "Avocado Leaf Tea", "instructions": "Use only dried avocado leaves from Caribbean West Indian or Mexican varieties. Select 3\u20134 dried leaves. Wash gently. Steep in 2 cups of boiling water for 10\u201315 minutes. Strain and drink warm. May add honey or lime. Limit to one cup per day.", "heat_required": true, "allowed_with": ["tea", "decoction"]}, {"method": "Culinary Aromatic Use", "instructions": "Dry avocado leaves until crackly (1\u20132 weeks in shade). Use 1\u20132 whole dried leaves per dish as an aromatic flavor base \u2014 similar to bay leaves. Add to bean pots, rice, soups, or stews. Remove before serving. This is primarily a culinary application.", "heat_required": true, "allowed_with": ["sauce", "porridge"]}, {"method": "Relaxing Bath", "instructions": "Boil 8\u201310 dried avocado leaves in a large pot of water for 15 minutes. Cool to comfortable temperature and add to bath. Soak for 20 minutes. External use only.", "heat_required": true, "allowed_with": ["bath"]}],
    flavor_profile: "Mildly anise-like, slightly sweet and earthy when dried. Adds a subtle, pleasant aroma to dishes.",
    contraindications: ["CRITICAL: Only use West Indian or Mexican variety avocado leaves. Guatemalan variety leaves may contain persin, a fungicidal toxin harmful to humans in large amounts", "May lower blood pressure \u2014 avoid combining with antihypertensive medication without medical advice", "Toxic to dogs, cats, horses, birds, and most animals \u2014 keep away from pets", "Not safe during pregnancy"],
    pregnancy_warning: true,
    interaction_flags: ["Antihypertensive medications", "Pet safety concern (toxic to animals \u2014 not for human topical use around pets)"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-avacado-leaf.png",
    source_notes: "Avocado persin toxicology documented in veterinary literature. West Indian vs Guatemalan variety distinction from USDA botanical records. Traditional Mexican culinary use of avocado leaves is well-established.",
    slug: "avocado-leaf",
    fruit_id: "19",
    seo_title: "Avocado Leaf — Traditional Uses, Culinary Aromatic & Safety Notes | IslandFruitGuide",
    seo_description: "Discover traditional Caribbean and Mexican uses of avocado leaves as tea and culinary aromatics, with important variety-specific safety notes. Educational only.",
    disclaimer: "This content documents traditional folk medicine and culinary practices. It is NOT medical advice. Ensure correct avocado variety before use. Always consult a healthcare provider."
  },
  {
    leaf_id: "leaf-08",
    common_name: "Tamarind Leaf",
    local_names: ["Tamarin Leaf", "Imli Leaf"],
    scientific_name: "Tamarindus indica",
    plant_part_used: "Small compound leaflets; sometimes bark",
    traditional_uses: ["Tamarind leaf tea used traditionally across Africa and the Caribbean in folk wellness practices", "Leaf juice and decoctions applied externally to areas of inflammation in traditional first-aid", "Young leaves used in traditional Caribbean cooking as a tart flavoring in soups and stews (culinary use)", "Bark decoctions used in traditional astringent preparations for digestive support"],
    preparation_methods: [{"method": "Tamarind Leaf Tea", "instructions": "Collect 8\u201310 fresh tamarind leaflets (small leaves from the compound frond). Wash thoroughly. Boil in 2 cups of water for 15 minutes. Strain and drink warm. Can sweeten with honey. Drink once per day \u2014 not for extended daily use.", "heat_required": true, "allowed_with": ["tea", "decoction"]}, {"method": "External Poultice", "instructions": "Wash fresh tamarind leaves. Crush into a paste using a mortar and pestle. Apply the paste directly to the external area of concern. Cover with a clean cloth for 30 minutes. Rinse thoroughly with clean water. External use only.", "heat_required": false, "allowed_with": ["topical"]}, {"method": "Culinary Souring Agent", "instructions": "Young tender tamarind leaves can be added to soups, lentil dishes, and rice preparations during cooking as a natural tart flavoring. Use a small handful of young leaves. Remove before serving or leave in for texture.", "heat_required": true, "allowed_with": ["sauce", "porridge"]}],
    flavor_profile: "Tart, slightly sour, with a tangy citrus-like quality. Very different from the fruit — less sweet, more acidic.",
    contraindications: ["May interact with aspirin and ibuprofen \u2014 can increase drug absorption", "High quantities may lower blood sugar \u2014 monitor carefully if managing diabetes", "Large amounts of tamarind (fruit or leaf) may produce a laxative effect", "Bark preparations are more potent \u2014 use in very small amounts only"],
    pregnancy_warning: true,
    interaction_flags: ["Aspirin / NSAIDs (ibuprofen, naproxen)", "Blood sugar medications", "Anticoagulants"],
    image_id: "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruitleaf-images/fruitleaf-tamarind-leaf.png",
    source_notes: "African and Caribbean ethnobotanical tradition. Drug-tamarind interaction documented in clinical pharmacology literature (aspirin absorption increase).",
    slug: "tamarind-leaf",
    fruit_id: "12",
    seo_title: "Tamarind Leaf — Traditional Caribbean Uses, Tea & Culinary Applications | IslandFruitGuide",
    seo_description: "Explore traditional Caribbean uses of tamarind leaves including tea, external poultice, and culinary souring agent. Educational only — not medical advice.",
    disclaimer: "This content documents traditional African and Caribbean folk medicine practices. It is NOT medical advice. Always consult a qualified healthcare provider before use."
  }
];

// ─────────────────────────────────────────────
// SEED DATA: Leaf ↔ Fruit Compatibility
// ─────────────────────────────────────────────
export const leafFruitCompatibility: LeafFruitCompatibility[] = [
  // Soursop Leaf ↔ Fruits
  { leaf_id: "leaf-01", fruit_id: "3",  compatibility_level: "safe",    reason: "Same plant — traditional direct pairing in Caribbean wellness tea", heat_required: true, max_frequency_note: "Max 2–3 times per week", allowed_preparations: ["tea", "decoction"] },
  { leaf_id: "leaf-01", fruit_id: "6",  compatibility_level: "caution", reason: "Both have sedative properties — combined effect may be stronger; limit to single cup", heat_required: true, max_frequency_note: "Max once per week combined", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-01", fruit_id: "8",  compatibility_level: "safe",    reason: "Papaya is a common Caribbean pairing in porridge base — no known interactions", heat_required: true, max_frequency_note: "Occasional use", allowed_preparations: ["porridge", "tea"] },
  { leaf_id: "leaf-01", fruit_id: "1",  compatibility_level: "avoid",   reason: "Ackee must only be consumed fully cooked and ripe; adding raw soursop leaf preparation increases preparation complexity and risk of error", heat_required: true, max_frequency_note: "Avoid combination", allowed_preparations: [] },
  { leaf_id: "leaf-01", fruit_id: "13", compatibility_level: "safe",    reason: "Banana and soursop leaf commonly combined in Caribbean porridge and smoothies", heat_required: false, max_frequency_note: "Occasional use", allowed_preparations: ["porridge", "tea"] },

  // Guava Leaf ↔ Fruits
  { leaf_id: "leaf-02", fruit_id: "10", compatibility_level: "safe",    reason: "Same plant — traditional pairing; guava leaf tea with guava fruit is widely practiced", heat_required: true, max_frequency_note: "1–2 cups per day", allowed_preparations: ["tea", "decoction"] },
  { leaf_id: "leaf-02", fruit_id: "8",  compatibility_level: "safe",    reason: "Papaya and guava commonly combined in Caribbean wellness teas and porridges", heat_required: true, max_frequency_note: "Daily as tea if well-tolerated", allowed_preparations: ["tea", "porridge"] },
  { leaf_id: "leaf-02", fruit_id: "5",  compatibility_level: "safe",    reason: "Mango and guava are commonly paired in Caribbean cuisine with no known interactions", heat_required: false, max_frequency_note: "Regular use as food/tea", allowed_preparations: ["tea", "juice", "sauce"] },
  { leaf_id: "leaf-02", fruit_id: "3",  compatibility_level: "caution", reason: "Both guava leaf and soursop fruit may affect blood sugar — monitor levels if diabetic", heat_required: true, max_frequency_note: "Occasional use; not daily", allowed_preparations: ["tea"] },

  // Papaya Leaf ↔ Fruits
  { leaf_id: "leaf-03", fruit_id: "8",  compatibility_level: "safe",    reason: "Same plant — papaya leaf with ripe papaya is a traditional Caribbean tonic preparation", heat_required: true, max_frequency_note: "Occasional use — not daily", allowed_preparations: ["tea", "decoction"] },
  { leaf_id: "leaf-03", fruit_id: "13", compatibility_level: "safe",    reason: "Banana and papaya leaf traditionally combined in Caribbean porridge bases", heat_required: true, max_frequency_note: "Occasional use", allowed_preparations: ["porridge"] },
  { leaf_id: "leaf-03", fruit_id: "5",  compatibility_level: "safe",    reason: "Mango and papaya are classic Caribbean fruit pairings; leaf tea alongside mango is fine", heat_required: true, max_frequency_note: "Occasional use", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-03", fruit_id: "1",  compatibility_level: "avoid",   reason: "Ackee preparation requires strict protocol; papaya leaf adds unnecessary complexity to a high-risk fruit preparation", heat_required: true, max_frequency_note: "Avoid combination", allowed_preparations: [] },

  // Mango Leaf ↔ Fruits
  { leaf_id: "leaf-04", fruit_id: "5",  compatibility_level: "safe",    reason: "Same plant — traditional pairing in Ayurvedic and Caribbean practice", heat_required: false, max_frequency_note: "Once daily as morning infusion", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-04", fruit_id: "8",  compatibility_level: "safe",    reason: "Mango leaf and papaya commonly served as complementary morning tonics", heat_required: false, max_frequency_note: "Regular moderate use", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-04", fruit_id: "11", compatibility_level: "safe",    reason: "Coconut water commonly taken alongside mango leaf morning infusion in Caribbean practice", heat_required: false, max_frequency_note: "Regular moderate use", allowed_preparations: ["tea", "juice"] },
  { leaf_id: "leaf-04", fruit_id: "3",  compatibility_level: "caution", reason: "Soursop fruit can lower blood pressure; combined with mango leaf (also BP-affecting) may amplify effect", heat_required: true, max_frequency_note: "Avoid daily combination", allowed_preparations: ["tea"] },

  // Breadfruit Leaf ↔ Fruits
  { leaf_id: "leaf-05", fruit_id: "2",  compatibility_level: "safe",    reason: "Same plant — breadfruit leaf tea alongside cooked breadfruit is a traditional Caribbean wellness combination", heat_required: true, max_frequency_note: "Once daily as morning tea", allowed_preparations: ["tea", "decoction"] },
  { leaf_id: "leaf-05", fruit_id: "11", compatibility_level: "safe",    reason: "Coconut water and breadfruit leaf tea are commonly consumed together in Caribbean morning routines", heat_required: true, max_frequency_note: "Regular moderate use", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-05", fruit_id: "1",  compatibility_level: "caution", reason: "Both ackee and breadfruit leaf can affect blood pressure — caution for those on medication", heat_required: true, max_frequency_note: "Occasional use with caution", allowed_preparations: ["tea"] },

  // Passion Fruit Leaf ↔ Fruits
  { leaf_id: "leaf-06", fruit_id: "6",  compatibility_level: "safe",    reason: "Same plant — passion fruit leaf tea and fresh passion fruit are traditionally paired as a wellness evening routine", heat_required: true, max_frequency_note: "Evening use only; max 1 cup per day", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-06", fruit_id: "13", compatibility_level: "safe",    reason: "Banana and passion fruit leaf tea make a pleasant calming evening drink with no known interactions", heat_required: true, max_frequency_note: "Occasional evening use", allowed_preparations: ["tea"] },
  { leaf_id: "leaf-06", fruit_id: "3",  compatibility_level: "caution", reason: "Both soursop fruit juice and passion fruit leaf have calming/sedative properties — combined effect may be stronger", heat_required: true, max_frequency_note: "Avoid daily combination", allowed_preparations: ["tea"] },

  // Avocado Leaf ↔ Fruits
  { leaf_id: "leaf-07", fruit_id: "19", compatibility_level: "safe",    reason: "Same plant — avocado leaf as culinary aromatic alongside ripe avocado is a traditional Mexican and Caribbean practice", heat_required: true, max_frequency_note: "Culinary use as needed", allowed_preparations: ["sauce", "tea"] },
  { leaf_id: "leaf-07", fruit_id: "11", compatibility_level: "safe",    reason: "Coconut and avocado are classic Caribbean pairings; avocado leaf as aromatic adds no known conflict", heat_required: true, max_frequency_note: "Culinary use as needed", allowed_preparations: ["sauce"] },
  { leaf_id: "leaf-07", fruit_id: "2",  compatibility_level: "safe",    reason: "Avocado leaf used as a flavor base in breadfruit stews — a traditional Caribbean culinary combination", heat_required: true, max_frequency_note: "Culinary use as needed", allowed_preparations: ["sauce", "porridge"] },

  // Tamarind Leaf ↔ Fruits
  { leaf_id: "leaf-08", fruit_id: "12", compatibility_level: "safe",    reason: "Same plant — tamarind leaf in cooking alongside tamarind fruit is a traditional practice in Caribbean and South Asian cuisine", heat_required: true, max_frequency_note: "Culinary use as needed", allowed_preparations: ["sauce", "tea"] },
  { leaf_id: "leaf-08", fruit_id: "5",  compatibility_level: "safe",    reason: "Mango and tamarind are classic Caribbean chutney partners; leaf in sauce preparation is traditional", heat_required: true, max_frequency_note: "Culinary use as needed", allowed_preparations: ["sauce"] },
  { leaf_id: "leaf-08", fruit_id: "15", compatibility_level: "safe",    reason: "June plum and tamarind are both sour fruits in Caribbean cuisine; tamarind leaf in sauces complements the flavor profile", heat_required: true, max_frequency_note: "Culinary use as needed", allowed_preparations: ["sauce"] },
];

// ─────────────────────────────────────────────
// SEED DATA: Safety Rules (Admin QA Engine)
// ─────────────────────────────────────────────
export const safetyRules: SafetyRule[] = [
  {
    rule_id: "rule-001",
    rule_type: "block",
    trigger: { fruit_ids: ["1"], preparation_types: ["juice", "any"] },
    rule_reason: "Ackee must only be prepared when fully ripe and properly cooked. Raw or unripe ackee contains hypoglycin A and B — life-threatening toxins.",
    display_message: "⚠️ Ackee cannot be used in raw preparations. Ackee must be fully ripened, opened naturally, and properly cooked before consumption.",
    admin_notes: "Hard block. Never allow raw ackee in any juice, smoothie, or uncooked preparation. Ackee + unripe = toxin risk."
  },
  {
    rule_id: "rule-002",
    rule_type: "block",
    trigger: { leaf_ids: ["leaf-01", "leaf-06", "leaf-07", "leaf-03", "leaf-04", "leaf-05", "leaf-08"], preparation_types: ["any"] },
    rule_reason: "Leaf preparations must never be combined with alcohol of any type.",
    display_message: "⚠️ Medicinal leaf preparations cannot be combined with alcohol. Alcohol interactions with these plant compounds are unsafe.",
    admin_notes: "Global hard block. All leaf teas / decoctions + alcohol = blocked. No exceptions."
  },
  {
    rule_id: "rule-003",
    rule_type: "block",
    trigger: { leaf_ids: ["leaf-01"], preparation_types: ["juice"] },
    rule_reason: "Soursop leaf should not be used in cold raw juice preparations — only in hot teas or decoctions. Raw cold-pressed soursop leaf juice has not been evaluated for safety.",
    display_message: "⚠️ Soursop leaf is only suitable for hot tea or decoction preparations. Cold raw juice preparation is not recommended.",
    admin_notes: "Block soursop leaf in juice/blended preparations. Allow tea/decoction only."
  },
  {
    rule_id: "rule-004",
    rule_type: "block",
    trigger: { fruit_ids: ["3", "6"], leaf_ids: ["leaf-01", "leaf-06"] },
    rule_reason: "Soursop leaf + passion fruit leaf + soursop/passion fruit — triple sedative combination. Combined calming effects are too strong.",
    display_message: "⚠️ Combining soursop leaf and passion fruit leaf together is not recommended. Each has calming properties — use one at a time.",
    admin_notes: "Block dual sedative leaf combination. Either leaf alone is acceptable."
  },
  {
    rule_id: "rule-005",
    rule_type: "warn",
    trigger: { leaf_ids: ["leaf-01"] },
    rule_reason: "Soursop leaf contains annonacin — neurotoxicity risk with long-term daily consumption.",
    display_message: "⚠️ Traditional Notice: Soursop leaf tea should not be consumed daily for extended periods. Traditional practice limits use to 2–3 times per week maximum.",
    admin_notes: "Warn on all soursop leaf selections. Include neurotoxicity disclaimer."
  },
  {
    rule_id: "rule-006",
    rule_type: "warn",
    trigger: { leaf_ids: ["leaf-06"] },
    rule_reason: "Passion fruit leaf (Passiflora) causes drowsiness — must warn before serving.",
    display_message: "⚠️ Passion fruit leaf tea may cause drowsiness. Do not drive or operate machinery after consuming. Best taken in the evening.",
    admin_notes: "Always warn on passion fruit leaf selection."
  },
  {
    rule_id: "rule-007",
    rule_type: "warn",
    trigger: { leaf_ids: ["leaf-03"] },
    rule_reason: "Papaya leaf is very bitter and may cause nausea if not properly prepared.",
    display_message: "⚠️ Papaya leaf tea is very bitter. Start with a small amount to test your tolerance. Add honey generously.",
    admin_notes: "Warn on papaya leaf — taste and tolerance issue."
  },
  {
    rule_id: "rule-008",
    rule_type: "conditional",
    trigger: { leaf_ids: ["leaf-07"] },
    rule_reason: "Avocado leaf variety must be confirmed — only West Indian or Mexican variety is safe.",
    display_message: "⚠️ Only use avocado leaves from Caribbean West Indian or Mexican avocado varieties. Guatemalan variety leaves may contain persin. When in doubt, use in culinary applications only (cooking destroys most persin).",
    admin_notes: "Conditional — require heat for avocado leaf. Add variety disclaimer to all avocado leaf content."
  },
  {
    rule_id: "rule-009",
    rule_type: "block",
    trigger: { fruit_ids: ["3", "16", "20"], leaf_ids: ["leaf-01"] },
    rule_reason: "Soursop leaf combined with other Annona family fruits (custard apple, sweetsop) creates an annonacin concentration risk.",
    display_message: "⚠️ Soursop leaf should not be combined with custard apple or sweetsop in the same preparation. All three are from the Annona family and share compounds that accumulate.",
    admin_notes: "Block Annona family stacking. Soursop leaf + custard apple/sweetsop = elevated annonacin risk."
  },
  {
    rule_id: "rule-010",
    rule_type: "conditional",
    trigger: { leaf_ids: ["leaf-01", "leaf-02", "leaf-03", "leaf-04", "leaf-05", "leaf-06", "leaf-07", "leaf-08"] },
    rule_reason: "All medicinal leaf preparations are for adults only.",
    display_message: "⚠️ Traditional leaf preparations documented here are for adult use only. Do not prepare for children under 12 without qualified professional guidance.",
    admin_notes: "Apply globally to all leaf-containing mixes. Add age disclaimer."
  }
];

// ─────────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────────
export const getLeafById = (id: string): MedicinalLeaf | undefined =>
  medicinalLeaves.find(l => l.leaf_id === id);

export const getLeafBySlug = (slug: string): MedicinalLeaf | undefined =>
  medicinalLeaves.find(l => l.slug === slug);

export const getLeafByFruitId = (fruitId: string): MedicinalLeaf | undefined =>
  medicinalLeaves.find(l => l.fruit_id === fruitId);

export const getCompatibility = (leafId: string, fruitId: string): LeafFruitCompatibility | undefined =>
  leafFruitCompatibility.find(c => c.leaf_id === leafId && c.fruit_id === fruitId);

export const getCompatibleFruitsForLeaf = (leafId: string): LeafFruitCompatibility[] =>
  leafFruitCompatibility.filter(c => c.leaf_id === leafId);

export const getCompatibleLeavesForFruit = (fruitId: string): LeafFruitCompatibility[] =>
  leafFruitCompatibility.filter(c => c.fruit_id === fruitId && c.compatibility_level !== "avoid");

export const checkSafetyRules = (
  fruitIds: string[],
  leafIds: string[],
  preparationType?: PreparationType
): SafetyRule[] => {
  return safetyRules.filter(rule => {
    const fruitMatch = rule.trigger.fruit_ids
      ? rule.trigger.fruit_ids.some(id => fruitIds.includes(id))
      : false;
    const leafMatch = rule.trigger.leaf_ids
      ? rule.trigger.leaf_ids.some(id => leafIds.includes(id))
      : false;
    const prepMatch = rule.trigger.preparation_types
      ? rule.trigger.preparation_types.includes(preparationType || "any") ||
        rule.trigger.preparation_types.includes("any")
      : true;

    return (fruitMatch || leafMatch) && prepMatch;
  });
};

export const hasBlockingRule = (
  fruitIds: string[],
  leafIds: string[],
  preparationType?: PreparationType
): boolean => {
  const rules = checkSafetyRules(fruitIds, leafIds, preparationType);
  return rules.some(r => r.rule_type === "block");
};
