const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function SoursopDrinksCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(1.5deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,80,30,0.5))"}}>
        <defs>
          <linearGradient id="sd-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#021408"/><stop offset="40%" stopColor="#031E0C"/><stop offset="100%" stopColor="#010A04"/>
          </linearGradient>
          <radialGradient id="sd-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="sd-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A3800"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#5A3800"/>
          </linearGradient>
          <linearGradient id="sd-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B5A00"/>
          </linearGradient>
          <linearGradient id="sd-lime" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0"/>
            <stop offset="30%" stopColor="#69F0AE" stopOpacity="0.85"/>
            <stop offset="70%" stopColor="#00C853" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#00E676" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="sd-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#sd-clip)">
          <rect width="256" height="352" fill="url(#sd-bg)"/>
          <rect width="256" height="352" fill="url(#sd-glow)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#010A04"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#sd-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#1A5E30" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="82" r="27" fill="none" stroke="url(#sd-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="23.5" fill="#010A04"/>
          {Array.from({length:18}).map((_,i)=>{const a=(i*20)*Math.PI/180; return <line key={i} x1={128+Math.cos(a)*24.5} y1={82+Math.sin(a)*24.5} x2={128+Math.cos(a)*29} y2={82+Math.sin(a)*29} stroke="#FFD700" strokeWidth="1.2" opacity="0.65"/>;})}
          {/* Soursop spiky shape */}
          {Array.from({length:12}).map((_,i)=>{
            const a=(i*30-90)*Math.PI/180;
            const r=i%2===0?13:9;
            return <polygon key={i} points={`${128+Math.cos(a)*r},${82+Math.sin(a)*r} ${128+Math.cos(a+Math.PI/12)*10},${82+Math.sin(a+Math.PI/12)*10} ${128+Math.cos(a+Math.PI/6)*(r===13?9:13)},${82+Math.sin(a+Math.PI/6)*(r===13?9:13)}`} fill="#2E7D32" opacity="0.85"/>;
          })}
          <circle cx="128" cy="82" r="6" fill="#1B5E20" opacity="0.9"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Lime shimmer */}
          <rect x="0" y="114" width="256" height="2" fill="url(#sd-lime)"/>

          {/* Soursop image hero */}
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="16" y="122" width="224" height="140" preserveAspectRatio="xMidYMid slice" opacity="0.9" style={{clipPath:"inset(0 round 12px)"}}/>

          {/* Drink types strip */}
          <rect x="16" y="256" width="224" height="14" rx="6" fill="#010A04" opacity="0.9"/>
          <text x="128" y="266" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fill="#69F0AE" fontWeight="700">Juice • Smoothie • Tea • Shake • Ice Cream • Sorbet</text>

          {/* 3 drink accent images */}
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="16" y="274" width="68" height="48" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="96" y="274" width="68" height="48" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="176" y="274" width="64" height="48" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>

          {/* Divider */}
          <rect x="0" y="328" width="256" height="2" fill="url(#sd-gold)"/>

          {/* Title */}
          <text x="128" y="314" textAnchor="middle" fontFamily="Georgia,serif" fontSize="21" fontWeight="900" fill="white" letterSpacing="1">SOURSOP</text>
          <text x="128" y="327" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="700" fill="#69F0AE">Drinks &amp; Smoothies</text>

          {/* Bottom */}
          <rect x="0" y="336" width="256" height="16" fill="#010A04"/>
          <rect x="0" y="336" width="256" height="1.5" fill="url(#sd-gold)"/>
          <text x="128" y="347" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5" fill="#B8860B" letterSpacing="1">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
          <text x="234" y="347" textAnchor="end" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#1A5E30">10 RECIPES</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,80,30,0.5),transparent)"}}/>
    </div>
  );
}
