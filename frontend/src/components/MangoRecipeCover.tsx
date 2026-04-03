const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function MangoRecipeCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-1.5deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(200,80,0,0.5))"}}>
        <defs>
          <linearGradient id="mr-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#150500"/><stop offset="40%" stopColor="#1E0A00"/><stop offset="100%" stopColor="#0A0200"/>
          </linearGradient>
          <radialGradient id="mr-burst" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FF8F00" stopOpacity="0.18"/>
            <stop offset="55%" stopColor="#FF6D00" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="mr-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6B3500"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#6B3500"/>
          </linearGradient>
          <linearGradient id="mr-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B4500"/>
          </linearGradient>
          <linearGradient id="mr-stripe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8F00" stopOpacity="0"/>
            <stop offset="25%" stopColor="#FFCA28" stopOpacity="0.9"/>
            <stop offset="75%" stopColor="#FF8F00" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#FF8F00" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="mr-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#mr-clip)">
          <rect width="256" height="352" fill="url(#mr-bg)"/>
          <rect width="256" height="352" fill="url(#mr-burst)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#0A0200"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#mr-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#5E3A10" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="83" r="28" fill="none" stroke="url(#mr-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="83" r="24.5" fill="#0A0200"/>
          {Array.from({length:18}).map((_,i)=>{const a=(i*20)*Math.PI/180; return <line key={i} x1={128+Math.cos(a)*25.5} y1={83+Math.sin(a)*25.5} x2={128+Math.cos(a)*30} y2={83+Math.sin(a)*30} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;})}
          <ellipse cx="128" cy="83" rx="11" ry="14" fill="#FF8F00" opacity="0.9"/>
          <ellipse cx="128" cy="80" rx="7.5" ry="9.5" fill="#FFCA28" opacity="0.8"/>
          <path d="M128,69 Q134,63 136,70 Q131,72 128,69Z" fill="#2E7D32"/>
          <text x="128" y="101" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Stripe */}
          <rect x="0" y="116" width="256" height="2" fill="url(#mr-stripe)"/>

          {/* Large mango hero */}
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="18" y="124" width="220" height="140" preserveAspectRatio="xMidYMid slice" opacity="0.9" style={{clipPath:"inset(0 round 12px)"}}/>
          
          {/* Mango dishes overlay strip */}
          <rect x="18" y="248" width="220" height="20" fill="#0A0200" opacity="0.85"/>
          <text x="128" y="261" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fill="#FFCA28" fontWeight="700">Chutney • Smoothie • Cake • Salsa • Curry • Ice Cream</text>

          {/* Small accent images */}
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="18" y="270" width="66" height="50" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="96" y="270" width="66" height="50" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="174" y="270" width="64" height="50" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>

          {/* Divider */}
          <rect x="0" y="326" width="256" height="2" fill="url(#mr-gold)"/>

          {/* Title */}
          <text x="128" y="311" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="900" fill="white">MANGO</text>
          <text x="128" y="325" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="900" fill="#FFCA28">RECIPE COLLECTION</text>

          {/* Bottom */}
          <rect x="0" y="336" width="256" height="16" fill="#0A0200"/>
          <rect x="0" y="336" width="256" height="1.5" fill="url(#mr-gold)"/>
          <text x="128" y="347" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
          <text x="234" y="347" textAnchor="end" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#5E3A10">15 RECIPES</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(200,80,0,0.5),transparent)"}}/>
    </div>
  );
}
