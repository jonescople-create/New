const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function TropicalDessertsCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(2deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(80,30,0,0.5))"}}>
        <defs>
          <linearGradient id="td-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#1A0800"/><stop offset="40%" stopColor="#2D1000"/><stop offset="100%" stopColor="#0E0400"/>
          </linearGradient>
          <radialGradient id="td-aura" cx="50%" cy="48%" r="50%">
            <stop offset="0%" stopColor="#FF8F00" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="td-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6B3800"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#6B3800"/>
          </linearGradient>
          <linearGradient id="td-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B4A00"/>
          </linearGradient>
          <linearGradient id="td-warm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8F00" stopOpacity="0"/>
            <stop offset="30%" stopColor="#FFCA28" stopOpacity="0.8"/>
            <stop offset="70%" stopColor="#FF8F00" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#FF8F00" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="td-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#td-clip)">
          <rect width="256" height="352" fill="url(#td-bg)"/>
          <rect width="256" height="352" fill="url(#td-aura)"/>
          <rect width="10" height="352" fill="black" opacity="0.55"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#100400"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#td-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#5E3A10" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="84" r="29" fill="none" stroke="url(#td-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="84" r="25.5" fill="#100400"/>
          {Array.from({length:18}).map((_,i)=>{const a=(i*20)*Math.PI/180; return <line key={i} x1={128+Math.cos(a)*26.5} y1={84+Math.sin(a)*26.5} x2={128+Math.cos(a)*31} y2={84+Math.sin(a)*31} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;})}
          {/* Cake slice in emblem */}
          <path d="M118,90 L138,90 L133,80 L123,80 Z" fill="#FF8F00" opacity="0.85"/>
          <path d="M118,90 L138,90 L137,92 L119,92 Z" fill="#FFCA28" opacity="0.9"/>
          <circle cx="128" cy="78" rx="2" ry="2" r="2" fill="#FF5252" opacity="0.9"/>
          <rect x="127" y="70" width="2" height="10" rx="1" fill="#FFD700" opacity="0.8"/>
          <text x="128" y="103" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Warm shimmer */}
          <rect x="0" y="118" width="256" height="2" fill="url(#td-warm)"/>

          {/* Hero dessert image */}
          <rect x="20" y="124" width="216" height="130" rx="10" fill="#1A0800" opacity="0.6"/>
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="24" y="128" width="100" height="60" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-papaya.jpg`} x="132" y="128" width="100" height="60" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-passion-fruit.jpg`} x="24" y="192" width="100" height="58" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-pineapple.jpg`} x="132" y="192" width="100" height="58" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 8px)"}}/>

          {/* Golden overlay text on images */}
          <rect x="20" y="174" width="110" height="14" fill="#100400" opacity="0.75"/>
          <text x="74" y="184" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#FFCA28">MANGO TART</text>
          <rect x="130" y="174" width="110" height="14" fill="#100400" opacity="0.75"/>
          <text x="185" y="184" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#FFCA28">PAPAYA MOUSSE</text>
          <rect x="20" y="236" width="110" height="14" fill="#100400" opacity="0.75"/>
          <text x="74" y="246" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#FFCA28">PASSION PANNA COTTA</text>
          <rect x="130" y="236" width="110" height="14" fill="#100400" opacity="0.75"/>
          <text x="185" y="246" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#FFCA28">PINEAPPLE CAKE</text>

          {/* Divider */}
          <rect x="0" y="258" width="256" height="2" fill="url(#td-gold)"/>

          {/* Tag */}
          <rect x="60" y="264" width="136" height="16" rx="7" fill="#FF8F00" opacity="0.12"/>
          <text x="128" y="276" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" fill="#FFCA28" letterSpacing="2">🍰 60+ RECIPES</text>

          {/* Title */}
          <text x="128" y="302" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="900" fill="white" letterSpacing="-0.3">TROPICAL FRUIT</text>
          <text x="128" y="318" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="900" fill="#FFCA28" letterSpacing="-0.3">DESSERTS</text>
          <text x="128" y="331" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fontWeight="400" fill="#FF8F00" letterSpacing="1">Delicious &amp; Exotic Recipes</text>

          {/* Bottom */}
          <rect x="0" y="340" width="256" height="12" fill="#100400"/>
          <rect x="0" y="340" width="256" height="1.5" fill="url(#td-gold)"/>
          <text x="128" y="349" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(80,30,0,0.6),transparent)"}}/>
    </div>
  );
}
