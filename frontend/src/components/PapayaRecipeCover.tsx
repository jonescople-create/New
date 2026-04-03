const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function PapayaRecipeCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-2deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,100,0,0.4))"}}>
        <defs>
          <linearGradient id="pp-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#051A05"/><stop offset="45%" stopColor="#082408"/><stop offset="100%" stopColor="#020E02"/>
          </linearGradient>
          <radialGradient id="pp-burst" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#FF6F00" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="pp-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A3800"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#5A3800"/>
          </linearGradient>
          <linearGradient id="pp-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B5A00"/>
          </linearGradient>
          <linearGradient id="pp-orange" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6F00" stopOpacity="0"/>
            <stop offset="30%" stopColor="#FFAB40" stopOpacity="0.85"/>
            <stop offset="70%" stopColor="#FF8F00" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#FF6F00" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="pp-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#pp-clip)">
          <rect width="256" height="352" fill="url(#pp-bg)"/>
          <rect width="256" height="352" fill="url(#pp-burst)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#030E03"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#pp-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#2E5E18" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="82" r="27" fill="none" stroke="url(#pp-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="23.5" fill="#030E03"/>
          {Array.from({length:18}).map((_,i)=>{const a=(i*20)*Math.PI/180; return <line key={i} x1={128+Math.cos(a)*24.5} y1={82+Math.sin(a)*24.5} x2={128+Math.cos(a)*29} y2={82+Math.sin(a)*29} stroke="#FFD700" strokeWidth="1.2" opacity="0.65"/>;})}
          <ellipse cx="128" cy="83" rx="9" ry="13" fill="#FF6F00" opacity="0.85"/>
          <ellipse cx="128" cy="81" rx="6" ry="8.5" fill="#FFAB40" opacity="0.75"/>
          <circle cx="128" cy="83" r="3" fill="#333" opacity="0.6"/>
          <path d="M126,69 Q128,63 130,69 Q128,72 126,69Z" fill="#2E7D32"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Orange stripe */}
          <rect x="0" y="114" width="256" height="2" fill="url(#pp-orange)"/>

          {/* Large papaya hero image */}
          <image href={`${SB}/fruit-images/fruit-papaya.jpg`} x="16" y="122" width="224" height="150" preserveAspectRatio="xMidYMid slice" opacity="0.9" style={{clipPath:"inset(0 round 12px)"}}/>

          {/* Recipe strip */}
          <rect x="16" y="262" width="224" height="36" rx="8" fill="#030E03" opacity="0.85"/>
          <text x="128" y="275" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fill="#FFAB40" fontWeight="700">12 RECIPES INSIDE</text>
          <text x="128" y="288" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#8BC34A" opacity="0.85">Salads • Smoothies • Desserts • Main Dishes</text>

          {/* Divider */}
          <rect x="0" y="304" width="256" height="2" fill="url(#pp-gold)"/>

          {/* Title area */}
          <text x="128" y="324" textAnchor="middle" fontFamily="Georgia,serif" fontSize="21" fontWeight="900" fill="white" letterSpacing="1">PAPAYA</text>
          <text x="128" y="338" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12" fontWeight="700" fill="#FFAB40" letterSpacing="1">RECIPE PACK</text>

          {/* Bottom */}
          <rect x="0" y="344" width="256" height="8" fill="#030E03"/>
          <rect x="0" y="344" width="256" height="1.5" fill="url(#pp-gold)"/>
          <text x="128" y="350" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4.5" fill="#B8860B" letterSpacing="1">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,100,0,0.4),transparent)"}}/>
    </div>
  );
}
