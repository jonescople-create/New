import{j as s,n as N}from"./index-D7--IeHV.js";import{s as F}from"./seo-BpeC6lHR.js";import{r as l}from"./vendor-paypal-DYIK6HnI.js";import{f as S}from"./fruits-CSg1d-p8.js";import{r as C}from"./recipes-Cha3uUbP.js";import{B as $}from"./Breadcrumb-DG4RqhD-.js";import"./vendor-react-Dh3zDKDA.js";import"./vendor-supabase-Dsb38-Dp.js";function L(){const[g,p]=l.useState([{id:"welcome",type:"assistant",content:`Hi! I'm Fruitsy 🍎, your Caribbean fruit assistant! I can help you with:

• Browse our NEW tropical ebooks (4 collections!)
• Find fruits and their health benefits
• Suggest recipes and meal ideas
• Shop for growing supplies & tools
• Nutrition and storage tips

What would you like to know?`,timestamp:new Date}]),[c,d]=l.useState(""),[m,h]=l.useState(!1),[u,b]=l.useState([]),[f,x]=l.useState([]);l.useEffect(()=>{F({path:"/assistant",title:"Fruitsy — Caribbean Fruit AI Assistant | IslandFruitGuide",description:"Chat with Fruitsy, the IslandFruitGuide AI assistant. Ask about Caribbean fruits, recipes, health benefits, seasonal availability, and get personalised tropical fruit guidance."})},[]),l.useEffect(()=>{w()},[]);const w=()=>{b(S),x(C)},y=["Show me the NEW ebooks","What's in the store?","What fruits are in season now?","Health benefits of soursop","Best fruits for smoothies","I have mango, what can I make?","Growing supplies and tools","Recipe collections","Interactive fruit tools"],k=r=>{const e=r.toLowerCase();if(e.includes("ebook")||e.includes("recipe book")||e.includes("download")||e.includes("pdf")||e.includes("collection"))return`📚 **NEW! Tropical Fruit Ebook Collection:**

We have 4 amazing recipe ebooks with 115+ recipes:

• **Tropical Gym Energy Recipes** - $14.99 (30 recipes)
  Power workouts with Caribbean superfruits

• **Caribbean Smoothies for Fat Loss** - $12.99 (28 recipes)
  Metabolism-boosting tropical drinks

• **Tropical Superfruit Healing Drinks** - $15.99 (32 recipes)
  Natural remedies from island fruits

• **Island Pre-Workout Natural Drinks** - $13.99 (25 recipes)
  Fuel training with tropical power

All include nutritional info, prep tips, and instant PDF download!

[👉 Browse Ebooks](/store/ebooks)`;if(e.includes("store")||e.includes("shop")||e.includes("buy")||e.includes("purchase")||e.includes("product"))return`🏪 **IslandFruitGuide Store:**

Explore our complete tropical fruit collection:

📚 **Ebooks & Guides** - Recipe collections and nutrition guides
🌱 **Growing Supplies** - Seeds, soil, tools for your fruit garden
🔪 **Kitchen Tools** - Professional fruit prep equipment
🌱 **Fruit Seeds** - Grow your own tropical fruits
📊 **Wall Charts** - Educational posters & reference charts
🎁 **Bundles** - Coming soon!

[👉 Visit Store](/store)
[👉 Browse Ebooks](/store/ebooks)
[👉 Growing Supplies](/store/fruit-growing)`;if(e.includes("grow")||e.includes("seed")||e.includes("plant")||e.includes("supplie")||e.includes("tool"))return`🌱 **Growing Tropical Fruits:**

Start your own fruit garden!

• **Seeds** - Mango, dragon fruit, papaya, passion fruit
• **Supplies** - Premium soil, grow lights, grafting tools
• **Kitchen Tools** - Mango splitters, pineapple corers, blenders

All curated products with Amazon affiliate links.

[👉 Growing Supplies](/store/fruit-growing)
[👉 Kitchen Tools](/store/kitchen-tools)
[👉 Fruit Seeds](/store/fruit-seeds)`;if(e.includes("season")||e.includes("ripe")||e.includes("available")){const t=new Date().toLocaleString("default",{month:"long"}),o=u.filter(n=>n.seasonality?.toLowerCase().includes(t.toLowerCase().substring(0,3))||n.seasonality?.includes("Year-round")).slice(0,5).map(n=>n.name).join(", ");return`🌦️ **Fruits in Season (${t}):**

${o||"Mango, Papaya, Guava"}, and more!

Tip: Year-round fruits like coconut, papaya, and banana are always available.

[👉 View full seasonal guide](/seasonal-fruits)`}if(e.includes("make")||e.includes("recipe")||e.includes("cook")||e.includes("what can i")){const t=f.filter(o=>o.title.toLowerCase().includes(e)||o.description?.toLowerCase().includes(e));if(t.length>0)return`🍽️ **Here are some recipes you might like:**

${t.slice(0,3).map(n=>`• ${n.title}`).join(`
`)}

We have ${f.length}+ recipes!

[👉 Browse all recipes](/recipes)
[👉 Or get our Ebook collections](/store/ebooks)`;const i=u.filter(o=>e.includes(o.name.toLowerCase())||e.includes(o.slug));if(i.length>0){const o=i[0];return`With **${o.name}**, you can make:

• Fresh ${o.name.toLowerCase()} juice or smoothie
• ${o.name} chutney or jam
• Add to fruit salads
• Use in desserts and ice cream

💡 Check out our ebook collections for 115+ tropical recipes!

[👉 See ${o.name} recipes](/fruits/${o.slug})
[👉 Browse Ebooks](/store/ebooks)`}return`I'd be happy to suggest recipes! Could you tell me what fruits or ingredients you have available?

Or browse our NEW ebook collections with 115+ tropical fruit recipes!

[👉 Recipe Ebooks](/store/ebooks)`}if(e.includes("health")||e.includes("benefit")||e.includes("good for")||e.includes("nutrition")){const t=u.filter(i=>e.includes(i.name.toLowerCase())||e.includes(i.slug));if(t.length>0){const i=t[0],o=i.health_benefits?.slice(0,3).map(n=>`✓ ${n}`).join(`
`)||"Packed with vitamins and minerals";return`💚 **Health Benefits of ${i.name}:**

${o}

**Nutrition:** ${i.nutrition?.substring(0,150)||"Rich in vitamins and antioxidants"}...

[👉 Full ${i.name} guide](/fruits/${i.slug})`}return`Caribbean fruits are packed with nutrients! Some highlights:

• **Guava**: 4x more Vitamin C than oranges
• **Soursop**: Powerful antioxidants
• **Coconut**: Healthy MCTs for energy
• **Papaya**: Digestive enzymes

[👉 Explore health guides](/health-wellness)
[👉 Healing Drinks Ebook](/store/ebooks)`}if(e.includes("store")&&!e.includes("shop")||e.includes("keep")||e.includes("fresh")||e.includes("preserve")){const t=u.filter(i=>e.includes(i.name.toLowerCase())||e.includes(i.slug));if(t.length>0){const i=t[0];return`📦 **How to Store ${i.name}:**

${i.storage||"Store at room temperature until ripe, then refrigerate."}

**Pro tip:** Most tropical fruits should be ripened at room temperature, then refrigerated once ripe.

[👉 Full ${i.name} guide](/fruits/${i.slug})`}return`General tropical fruit storage tips:

• Ripen at room temperature
• Refrigerate once ripe
• Most last 3-7 days when refrigerated
• Freeze puréed fruit for smoothies

Which fruit do you want specific storage tips for?`}if(e.includes("money")||e.includes("income")||e.includes("sell")||e.includes("business")||e.includes("earn"))return`💰 **Ways to Earn with Tropical Fruits:**

• Start a juice/smoothie business
• Sell homemade jams and preserves
• Fruit farming and direct sales
• Create content about Caribbean food
• Offer fruit-based catering

[👉 Full Income Guide](/income-guide)`;if(e.includes("compare")||e.includes("match")||e.includes("match-up")||e.includes("versus")||e.includes("vs")||e.includes("quiz")||e.includes("tool"))return`🥊 **Try our interactive tools:**

• **Fruit Recommender** - Find your perfect tropical fruit
• **Recipe Builder** - Create custom recipes
• **Medicinal Advisor** - Natural healing remedies
• **Fruit Comparison** - Side-by-side analysis
• **Caribbean Superfruit IQ Quiz**

[👉 All Tools](/tools)
[👉 Fruit Match-Up](/fruit-match-up)
[👉 Compare Fruits](/compare)`;if(e.includes("how to eat")||e.includes("how do you eat")||e.includes("prepare")){const t=u.filter(i=>e.includes(i.name.toLowerCase())||e.includes(i.slug));if(t.length>0){const i=t[0];return`🍴 **How to Eat ${i.name}:**

${i.how_to_eat||"Wash, peel, and enjoy fresh!"}

[👉 Full ${i.name} guide](/fruits/${i.slug})`}return'I can tell you how to prepare any tropical fruit! Just ask me about a specific fruit like "How to eat soursop?" or "How to prepare breadfruit?"'}if(e.includes("smoothie")||e.includes("juice")||e.includes("drink")||e.includes("blend"))return`🥤 **Best Fruits for Smoothies:**

• **Mango**: Sweet, creamy base
• **Papaya**: Tropical flavor + digestive enzymes
• **Soursop**: Unique sweet-sour taste
• **Banana**: Natural sweetness + thickness
• **Passion Fruit**: Tangy flavor punch

**Pro tip:** Freeze fruits in advance for thick, cold smoothies without ice!

📚 **NEW!** Check out our smoothie ebook collections:
• Caribbean Smoothies for Fat Loss ($12.99)
• Pre-Workout Natural Drinks ($13.99)

[👉 Browse Ebooks](/store/ebooks)
[👉 See smoothie recipes](/recipes)`;const a=u.filter(t=>e.includes(t.name.toLowerCase())||e.includes(t.slug));if(a.length>0){const t=a[0];return`🍎 **${t.name}** (${t.scientific_name||"Tropical fruit"})

${t.description?.substring(0,200)||"A delicious Caribbean tropical fruit"}...

**Season:** ${t.seasonality||"Year-round"}
**Origin:** ${t.origin||"Caribbean"}

[👉 Full ${t.name} guide](/fruits/${t.slug})`}return`Thanks for your question! I'm here to help with Caribbean tropical fruits. You can ask me about:

• 📚 **NEW Ebooks** (4 recipe collections!)
• 🏪 Store & Products
• 🍎 Specific fruits (e.g., "Tell me about soursop")
• 🍽️ Recipes (e.g., "What can I make with mango?")
• 💚 Health benefits (e.g., "Benefits of guava")
• 📦 Storage tips
• 🌱 Growing supplies

What would you like to know? 🌴

[👉 Browse Ebooks](/store/ebooks)
[👉 Visit Store](/store)`},v=r=>{if(r.preventDefault(),!c.trim())return;const e={id:Date.now().toString(),type:"user",content:c.trim(),timestamp:new Date};p(a=>[...a,e]),d(""),h(!0),setTimeout(()=>{const a=k(e.content),t={id:(Date.now()+1).toString(),type:"assistant",content:a,timestamp:new Date};p(i=>[...i,t]),h(!1)},1e3)},j=r=>{d(r)};return s.jsxs("div",{className:"animate-fade-in",children:[s.jsx("div",{className:"bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 lg:py-12",children:s.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[s.jsx($,{items:[{label:"Fruitsy Assistant"}]}),s.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[s.jsx("span",{className:"text-4xl",children:"🤖"}),s.jsx("h1",{className:"font-heading text-3xl lg:text-4xl font-bold",children:"Fruitsy — Your Fruit Assistant"})]}),s.jsx("p",{className:"text-white/80 mt-2 text-lg max-w-2xl",children:"Ask me anything about Caribbean fruits, recipes, nutrition, and more!"})]})}),s.jsxs("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8",children:[s.jsxs("div",{className:"mb-6",children:[s.jsx("p",{className:"text-sm text-charcoal-light mb-3",children:"Quick questions:"}),s.jsx("div",{className:"flex flex-wrap gap-2",children:y.map(r=>s.jsx("button",{onClick:()=>j(r),className:"text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-leaf hover:bg-leaf/5 transition-colors text-charcoal-light hover:text-leaf",children:r},r))})]}),s.jsxs("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",children:[s.jsxs("div",{className:"h-[400px] overflow-y-auto p-4 space-y-4",children:[g.map(r=>s.jsx("div",{className:`flex ${r.type==="user"?"justify-end":"justify-start"}`,children:s.jsxs("div",{className:`max-w-[80%] rounded-2xl px-4 py-3 ${r.type==="user"?"bg-leaf text-white rounded-br-md":"bg-gray-100 text-charcoal rounded-bl-md"}`,children:[r.type==="assistant"&&s.jsxs("div",{className:"flex items-center gap-2 mb-2 text-xs text-charcoal-light",children:[s.jsx("span",{children:"🤖"}),s.jsx("span",{className:"font-semibold",children:"Fruitsy"})]}),s.jsx("div",{className:"text-sm whitespace-pre-wrap",children:r.content.split(/(\[👉[^\]]+\]\([^)]+\))/g).map((e,a)=>{const t=e.match(/\[👉([^\]]+)\]\(([^)]+)\)/);return t?s.jsxs("button",{onClick:()=>N(t[2]),className:"text-leaf underline hover:no-underline font-medium",children:["👉 ",t[1]]},a):s.jsx("span",{children:e},a)})})]})},r.id)),m&&s.jsx("div",{className:"flex justify-start",children:s.jsx("div",{className:"bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3",children:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("span",{children:"🤖"}),s.jsx("span",{className:"text-sm text-charcoal-light",children:"Fruitsy is typing..."}),s.jsx("span",{className:"animate-pulse",children:"💭"})]})})})]}),s.jsx("form",{onSubmit:v,className:"border-t border-gray-100 p-4",children:s.jsxs("div",{className:"flex gap-3",children:[s.jsx("input",{type:"text",value:c,onChange:r=>d(r.target.value),placeholder:"Ask Fruitsy anything...",className:"flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"}),s.jsx("button",{type:"submit",disabled:!c.trim()||m,className:"btn-primary disabled:opacity-50 disabled:cursor-not-allowed",children:"Send"})]})})]}),s.jsx("div",{className:"mt-8 grid sm:grid-cols-3 gap-4",children:[{icon:"🍎",title:"Fruit Info",desc:"Learn about any tropical fruit"},{icon:"🍽️",title:"Recipe Ideas",desc:"Get meal suggestions"},{icon:"💚",title:"Health Tips",desc:"Nutrition & wellness advice"}].map(r=>s.jsxs("div",{className:"bg-white rounded-xl p-4 border border-gray-100 text-center",children:[s.jsx("span",{className:"text-3xl block mb-2",children:r.icon}),s.jsx("h3",{className:"font-heading font-semibold text-charcoal",children:r.title}),s.jsx("p",{className:"text-sm text-charcoal-light",children:r.desc})]},r.title))})]})]})}export{L as SmartAssistantPage};
