const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm"|"md"|"lg"|"xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function HealingDrinksBookCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-1.5deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,188,140,0.3))"}}>
        <defs>
          <linearGradient id="hd-bg" x1="0" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor="#001812"/><stop offset="55%" stopColor="#002018"/><stop offset="100%" stopColor="#000E0A"/>
          </linearGradient>
          <radialGradient id="hd-glow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#00BCD4" stopOpacity="0.18"/><stop offset="65%" stopColor="#009688" stopOpacity="0.06"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="hd-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A5C00"/><stop offset="30%" stopColor="#FFD700"/><stop offset="70%" stopColor="#FFC107"/><stop offset="100%" stopColor="#7A5C00"/>
          </linearGradient>
          <linearGradient id="hd-goldv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#B8860B"/>
          </linearGradient>
          <linearGradient id="hd-teal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00BCD4" stopOpacity="0"/><stop offset="25%" stopColor="#00BCD4" stopOpacity="0.9"/><stop offset="75%" stopColor="#009688" stopOpacity="0.9"/><stop offset="100%" stopColor="#009688" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="hd-title2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00E5FF"/><stop offset="50%" stopColor="#80DEEA"/><stop offset="100%" stopColor="#00E5FF"/>
          </linearGradient>
          <clipPath id="hd-clip"><rect width="256" height="352" rx="8"/></clipPath>
        </defs>
        <g clipPath="url(#hd-clip)">
          <rect width="256" height="352" fill="url(#hd-bg)"/>
          <rect width="256" height="352" fill="url(#hd-glow)"/>
          <rect width="10" height="352" fill="black" opacity="0.55"/>
          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#001210"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#hd-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#2A7070" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>
          {/* Emblem */}
          <circle cx="128" cy="82" r="28" fill="none" stroke="url(#hd-goldv)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="25" fill="#001210"/>
          {Array.from({length:18}).map((_,i)=>{
            const a=(i*20)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*26} y1={82+Math.sin(a)*26} x2={128+Math.cos(a)*31} y2={82+Math.sin(a)*31} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;
          })}
          <ellipse cx="128" cy="82" rx="10" ry="13" fill="#FF8C00" opacity="0.95"/>
          <ellipse cx="128" cy="79" rx="7" ry="9" fill="#FFA500" opacity="0.8"/>
          <ellipse cx="128" cy="76" rx="4" ry="5" fill="#FFD700" opacity="0.65"/>
          <path d="M128,69 Q133,65 134,70 Q130,72 128,69Z" fill="#2E7D32"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>
          {/* Teal line */}
          <rect x="0" y="116" width="256" height="2" fill="url(#hd-teal)"/>
          {/* Fruit card */}
          <rect x="18" y="124" width="220" height="128" rx="10" fill="#001510" opacity="0.9"/>
          <rect x="18" y="124" width="220" height="128" rx="10" fill="none" stroke="#00BCD4" strokeWidth="0.8" opacity="0.5"/>
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="22" y="128" width="68" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.95"/>
          <image href={`${SB}/fruit-images/fruit-tamarind.jpg`} x="96" y="128" width="68" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.95"/>
          <image href={`${SB}/fruit-images/fruit-coconut.jpg`} x="170" y="128" width="64" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.9"/>
          <rect x="22" y="204" width="52" height="12" rx="5" fill="#00BCD4" opacity="0.9"/>
          <text x="48" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#001210">SOURSOP</text>
          <rect x="96" y="204" width="52" height="12" rx="5" fill="#FFD700" opacity="0.9"/>
          <text x="122" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#001210">TAMARIND</text>
          <rect x="170" y="204" width="48" height="12" rx="5" fill="#009688" opacity="0.9"/>
          <text x="194" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="white">COCONUT</text>
          {/* Divider */}
          <rect x="0" y="258" width="256" height="2" fill="url(#hd-gold)"/>
          <rect x="20" y="264" width="216" height="18" rx="6" fill="#00BCD4" opacity="0.1"/>
          <text x="128" y="277" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#00E5FF" letterSpacing="2" fontWeight="700">💚 40+ RECIPES</text>
          {/* Title */}
          <text x="128" y="299" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="900" fill="white" letterSpacing="0.3">TROPICAL SUPERFRUIT</text>
          <text x="128" y="316" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14.5" fontWeight="900" fill="url(#hd-title2)" letterSpacing="-0.2">HEALING DRINKS</text>
          {/* Bottom */}
          <rect x="0" y="334" width="256" height="18" fill="#001210"/>
          <rect x="0" y="334" width="256" height="1.5" fill="url(#hd-gold)"/>
          <text x="128" y="346" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,188,212,0.45),transparent)"}}/>
    </div>
  );
}
