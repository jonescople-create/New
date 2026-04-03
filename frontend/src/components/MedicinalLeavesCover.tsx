const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function MedicinalLeavesCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-1deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,80,0,0.45))"}}>
        <defs>
          <linearGradient id="ml-bg" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0%" stopColor="#051208"/><stop offset="45%" stopColor="#081A0C"/><stop offset="100%" stopColor="#020804"/>
          </linearGradient>
          <radialGradient id="ml-aura" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="ml-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A3800"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#5A3800"/>
          </linearGradient>
          <linearGradient id="ml-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B5A00"/>
          </linearGradient>
          <linearGradient id="ml-green" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C853" stopOpacity="0"/>
            <stop offset="30%" stopColor="#69F0AE" stopOpacity="0.7"/>
            <stop offset="70%" stopColor="#00E676" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#00C853" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="ml-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#ml-clip)">
          <rect width="256" height="352" fill="url(#ml-bg)"/>
          <rect width="256" height="352" fill="url(#ml-aura)"/>
          <rect width="10" height="352" fill="black" opacity="0.55"/>

          {/* Ornamental frame */}
          <rect x="7" y="7" width="242" height="338" rx="4" fill="none" stroke="url(#ml-gold)" strokeWidth="0.7" opacity="0.5"/>
          <rect x="11" y="11" width="234" height="330" rx="3" fill="none" stroke="#FFD700" strokeWidth="0.35" opacity="0.2"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#040C06"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#ml-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#2E5E38" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="86" r="30" fill="none" stroke="url(#ml-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="86" r="26.5" fill="#040C06"/>
          {Array.from({length:20}).map((_,i)=>{
            const a=(i*18)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*28} y1={86+Math.sin(a)*28} x2={128+Math.cos(a)*33} y2={86+Math.sin(a)*33} stroke="#FFD700" strokeWidth="1.2" opacity="0.65"/>;
          })}
          {/* Leaf in emblem */}
          <path d="M128,70 Q142,78 128,98 Q114,78 128,70Z" fill="#00C853" opacity="0.85"/>
          <path d="M128,70 Q128,84 128,98" stroke="#00E676" strokeWidth="0.8" opacity="0.7"/>
          <path d="M128,78 Q134,80 136,84" stroke="#00E676" strokeWidth="0.5" opacity="0.5"/>
          <path d="M128,78 Q122,80 120,84" stroke="#00E676" strokeWidth="0.5" opacity="0.5"/>
          <text x="128" y="104" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Green shimmer */}
          <rect x="0" y="120" width="256" height="1.5" fill="url(#ml-green)"/>

          {/* 4-leaf showcase */}
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="20" y="130" width="100" height="100" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 10px)"}}/>
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="136" y="130" width="100" height="100" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 10px)"}}/>
          <image href={`${SB}/fruit-images/fruit-breadfruit.jpg`} x="20" y="236" width="100" height="80" preserveAspectRatio="xMidYMid slice" opacity="0.75" style={{clipPath:"inset(0 round 10px)"}}/>
          <image href={`${SB}/fruit-images/fruit-papaya.jpg`} x="136" y="236" width="100" height="80" preserveAspectRatio="xMidYMid slice" opacity="0.75" style={{clipPath:"inset(0 round 10px)"}}/>

          {/* Overlay labels */}
          <rect x="20" y="220" width="100" height="12" rx="0" fill="#040C06" opacity="0.8"/>
          <text x="70" y="229" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#69F0AE">SOURSOP LEAF</text>
          <rect x="136" y="220" width="100" height="12" rx="0" fill="#040C06" opacity="0.8"/>
          <text x="186" y="229" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#69F0AE">GUAVA LEAF</text>
          <rect x="20" y="306" width="100" height="12" rx="0" fill="#040C06" opacity="0.8"/>
          <text x="70" y="315" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#69F0AE">BREADFRUIT LEAF</text>
          <rect x="136" y="306" width="100" height="12" rx="0" fill="#040C06" opacity="0.8"/>
          <text x="186" y="315" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#69F0AE">PAPAYA LEAF</text>

          {/* Bottom title band */}
          <rect x="0" y="320" width="256" height="32" fill="#040C06"/>
          <rect x="0" y="320" width="256" height="2" fill="url(#ml-gold)"/>
          <text x="128" y="333" textAnchor="middle" fontFamily="Georgia,serif" fontSize="12.5" fontWeight="900" fill="white">CARIBBEAN</text>
          <text x="128" y="346" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9.5" fontWeight="900" fill="#69F0AE">Medicinal Leaves Guide</text>

          {/* Footer */}
          <rect x="0" y="350" width="256" height="2" fill="url(#ml-gold)" opacity="0.5"/>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,100,0,0.5),transparent)"}}/>
    </div>
  );
}
