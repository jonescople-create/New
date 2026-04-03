const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm"|"md"|"lg"|"xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function GymEnergyBookCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-2deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(57,255,20,0.25))"}}>
        <defs>
          <linearGradient id="ge-bg" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#050E05"/><stop offset="55%" stopColor="#0C1C08"/><stop offset="100%" stopColor="#040C04"/>
          </linearGradient>
          <radialGradient id="ge-glow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#39FF14" stopOpacity="0.16"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="ge-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A5C00"/><stop offset="30%" stopColor="#FFD700"/><stop offset="70%" stopColor="#FFA500"/><stop offset="100%" stopColor="#7A5C00"/>
          </linearGradient>
          <linearGradient id="ge-goldv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#B8860B"/>
          </linearGradient>
          <linearGradient id="ge-neon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#39FF14" stopOpacity="0"/><stop offset="25%" stopColor="#39FF14" stopOpacity="0.9"/><stop offset="75%" stopColor="#00E676" stopOpacity="0.9"/><stop offset="100%" stopColor="#00E676" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="ge-title1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#DDDDDD"/>
          </linearGradient>
          <linearGradient id="ge-title2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#39FF14"/><stop offset="50%" stopColor="#7FFF00"/><stop offset="100%" stopColor="#39FF14"/>
          </linearGradient>
          <clipPath id="ge-clip"><rect width="256" height="352" rx="8"/></clipPath>
        </defs>
        <g clipPath="url(#ge-clip)">
          <rect width="256" height="352" fill="url(#ge-bg)"/>
          <rect width="256" height="352" fill="url(#ge-glow)"/>
          {/* Spine */}
          <rect width="10" height="352" fill="black" opacity="0.55"/>
          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#071005"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#ge-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#4A6B2F" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>
          {/* Emblem */}
          <circle cx="128" cy="82" r="28" fill="none" stroke="url(#ge-goldv)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="25" fill="#071005"/>
          {Array.from({length:18}).map((_,i)=>{
            const a=(i*20)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*26} y1={82+Math.sin(a)*26} x2={128+Math.cos(a)*31} y2={82+Math.sin(a)*31} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;
          })}
          <ellipse cx="128" cy="82" rx="10" ry="13" fill="#FF8C00" opacity="0.95"/>
          <ellipse cx="128" cy="79" rx="7" ry="9" fill="#FFA500" opacity="0.8"/>
          <ellipse cx="128" cy="76" rx="4" ry="5" fill="#FFD700" opacity="0.65"/>
          <path d="M128,69 Q133,65 134,70 Q130,72 128,69Z" fill="#2E7D32"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>
          {/* Neon line */}
          <rect x="0" y="116" width="256" height="2" fill="url(#ge-neon)"/>
          {/* Fruit card */}
          <rect x="18" y="124" width="220" height="128" rx="10" fill="#060F04" opacity="0.85"/>
          <rect x="18" y="124" width="220" height="128" rx="10" fill="none" stroke="#39FF14" strokeWidth="0.8" opacity="0.45"/>
          <image href={`${SB}/fruit-images/fruit-banana.jpg`} x="22" y="128" width="68" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.95"/>
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="96" y="128" width="68" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.95"/>
          <image href={`${SB}/fruit-images/fruit-pineapple.jpg`} x="170" y="128" width="64" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.9"/>
          <rect x="22" y="204" width="50" height="12" rx="5" fill="#39FF14" opacity="0.9"/>
          <text x="47" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#050E05">BANANA</text>
          <rect x="96" y="204" width="46" height="12" rx="5" fill="#FFD700" opacity="0.9"/>
          <text x="119" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#050E05">MANGO</text>
          <rect x="168" y="204" width="52" height="12" rx="5" fill="#FF6B35" opacity="0.9"/>
          <text x="194" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="white">PINEAPPLE</text>
          {/* Divider */}
          <rect x="0" y="258" width="256" height="2" fill="url(#ge-gold)"/>
          {/* Energy badge */}
          <rect x="20" y="264" width="216" height="18" rx="6" fill="#39FF14" opacity="0.1"/>
          <text x="128" y="277" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#39FF14" letterSpacing="3" fontWeight="700">⚡ 50+ RECIPES</text>
          {/* Title */}
          <text x="128" y="303" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="900" fill="url(#ge-title1)" letterSpacing="-0.5">TROPICAL GYM</text>
          <text x="128" y="321" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="900" fill="url(#ge-title2)" letterSpacing="-0.5">ENERGY RECIPES</text>
          {/* Bottom */}
          <rect x="0" y="334" width="256" height="18" fill="#071005"/>
          <rect x="0" y="334" width="256" height="1.5" fill="url(#ge-gold)"/>
          <text x="128" y="346" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(57,255,20,0.4),transparent)"}}/>
    </div>
  );
}
