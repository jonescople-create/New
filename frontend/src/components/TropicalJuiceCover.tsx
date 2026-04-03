interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };
const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";

export function TropicalJuiceCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-2deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,150,150,0.4))"}}>
        <defs>
          <linearGradient id="tj-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#004D5B"/>
            <stop offset="50%" stopColor="#006E7A"/>
            <stop offset="100%" stopColor="#002D38"/>
          </linearGradient>
          <linearGradient id="tj-burst" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#00BCD4" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="tj-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A5C00"/><stop offset="30%" stopColor="#FFD700"/>
            <stop offset="70%" stopColor="#FFC107"/><stop offset="100%" stopColor="#7A5C00"/>
          </linearGradient>
          <linearGradient id="tj-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#B8860B"/>
          </linearGradient>
          <linearGradient id="tj-stripe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF7043" stopOpacity="0"/>
            <stop offset="30%" stopColor="#FF7043" stopOpacity="0.9"/>
            <stop offset="70%" stopColor="#FFAB40" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#FFAB40" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="tj-glow" cx="50%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="tj-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#tj-clip)">
          <rect width="256" height="352" fill="url(#tj-bg)"/>
          <rect width="256" height="352" fill="url(#tj-glow)"/>
          <rect width="256" height="352" fill="url(#tj-burst)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Header band */}
          <rect x="0" y="0" width="256" height="44" fill="#003040"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#tj-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#4A8090" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="82" r="28" fill="none" stroke="url(#tj-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="25" fill="#003040"/>
          {Array.from({length:18}).map((_,i)=>{
            const a=(i*20)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*26} y1={82+Math.sin(a)*26} x2={128+Math.cos(a)*31} y2={82+Math.sin(a)*31} stroke="#FFD700" strokeWidth="1.2" opacity="0.65"/>;
          })}
          {/* Smoothie glass in emblem */}
          <path d="M122,74 L134,74 L131,90 L125,90 Z" fill="#00BCD4" opacity="0.8"/>
          <path d="M122,74 L134,74 L133,78 L123,78 Z" fill="#FF7043" opacity="0.7"/>
          <rect x="127" y="68" width="2" height="8" rx="1" fill="#FFD700" opacity="0.9"/>
          <ellipse cx="128" cy="74" rx="7" ry="2.5" fill="#FF7043" opacity="0.6"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Stripe */}
          <rect x="0" y="116" width="256" height="2" fill="url(#tj-stripe)"/>

          {/* Fruit images */}
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="16" y="124" width="70" height="70" preserveAspectRatio="xMidYMid slice" opacity="0.9" style={{clipPath:"inset(0 round 10px)"}}/>
          <image href={`${SB}/fruit-images/fruit-passion-fruit.jpg`} x="93" y="120" width="75" height="75" preserveAspectRatio="xMidYMid slice" opacity="0.9" style={{clipPath:"inset(0 round 10px)"}}/>
          <image href={`${SB}/fruit-images/fruit-papaya.jpg`} x="174" y="124" width="68" height="68" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 10px)"}}/>
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="28" y="198" width="58" height="58" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"circle(29px at 29px 29px)"}}/>
          <image href={`${SB}/fruit-images/fruit-pineapple.jpg`} x="164" y="196" width="58" height="62" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>

          {/* Smoothie glasses overlay */}
          <ellipse cx="128" cy="168" rx="28" ry="20" fill="#FF7043" opacity="0.2"/>
          <text x="128" y="173" textAnchor="middle" fontSize="32">🍹</text>

          {/* Labels */}
          <rect x="14" y="194" width="46" height="10" rx="5" fill="#FFD700" opacity="0.9"/>
          <text x="37" y="202" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fontWeight="700" fill="#003040">MANGO</text>
          <rect x="95" y="118" width="66" height="10" rx="5" fill="#FF7043" opacity="0.9"/>
          <text x="128" y="126" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fontWeight="700" fill="white">PASSION FRUIT</text>
          <rect x="174" y="194" width="58" height="10" rx="5" fill="#4CAF50" opacity="0.9"/>
          <text x="203" y="202" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fontWeight="700" fill="white">PAPAYA</text>

          {/* Divider */}
          <rect x="0" y="264" width="256" height="2" fill="url(#tj-gold)"/>

          {/* Recipe count tag */}
          <rect x="60" y="270" width="136" height="16" rx="7" fill="#FF7043" opacity="0.15"/>
          <text x="128" y="282" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" fill="#FF7043" letterSpacing="2">🥤 50+ RECIPES</text>

          {/* Title */}
          <text x="128" y="305" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="900" fill="white" letterSpacing="-0.3">TROPICAL JUICE</text>
          <text x="128" y="321" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="900" fill="#FFD700" letterSpacing="-0.3">&amp; SMOOTHIE</text>
          <text x="128" y="334" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" fontWeight="700" fill="#80DEEA" letterSpacing="0.5">Recipe Book</text>

          {/* Bottom */}
          <rect x="0" y="340" width="256" height="12" fill="#003040"/>
          <rect x="0" y="340" width="256" height="1.5" fill="url(#tj-gold)"/>
          <text x="128" y="349" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,150,150,0.5),transparent)"}}/>
    </div>
  );
}
