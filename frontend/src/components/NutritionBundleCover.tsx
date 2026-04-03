const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function NutritionBundleCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-1deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 24px 48px rgba(0,0,0,0.7))"}}>
        <defs>
          <linearGradient id="nb-bg" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#050E05"/><stop offset="45%" stopColor="#081408"/><stop offset="100%" stopColor="#020602"/>
          </linearGradient>
          <radialGradient id="nb-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="nb-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A3800"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#5A3800"/>
          </linearGradient>
          <linearGradient id="nb-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE566"/><stop offset="50%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          <linearGradient id="nb-fade-tl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#050E05" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="nb-fade-br" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#050E05" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="nb-clip"><rect width="256" height="352" rx="6"/></clipPath>
          <clipPath id="nb-tl"><rect x="14" y="112" width="114" height="106" rx="8"/></clipPath>
          <clipPath id="nb-tr"><rect x="134" y="112" width="108" height="106" rx="8"/></clipPath>
          <clipPath id="nb-bl"><rect x="14" y="224" width="114" height="100" rx="8"/></clipPath>
          <clipPath id="nb-br"><rect x="134" y="224" width="108" height="100" rx="8"/></clipPath>
        </defs>
        <g clipPath="url(#nb-clip)">
          <rect width="256" height="352" fill="url(#nb-bg)"/>
          <rect width="256" height="352" fill="url(#nb-glow)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Ornamental border */}
          <rect x="5" y="5" width="246" height="342" rx="5" fill="none" stroke="url(#nb-gold)" strokeWidth="0.8" opacity="0.6"/>
          <rect x="9" y="9" width="238" height="334" rx="4" fill="none" stroke="#FFD700" strokeWidth="0.35" opacity="0.2"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="50" fill="#030806"/>
          <rect x="0" y="48" width="256" height="2.5" fill="url(#nb-gold)"/>
          <text x="128" y="18" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#FFD700" letterSpacing="2.5" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="6.5" fill="#B8860B" letterSpacing="2">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="43" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#2A5E2A" letterSpacing="1">Complete 4-Book Bundle</text>

          {/* Large central emblem */}
          <circle cx="128" cy="88" r="33" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="128" cy="88" r="30" fill="none" stroke="url(#nb-gold-v)" strokeWidth="2.5"/>
          <circle cx="128" cy="88" r="26" fill="#030806"/>
          {Array.from({length:24}).map((_,i)=>{
            const a=(i*15)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*27.5} y1={88+Math.sin(a)*27.5} x2={128+Math.cos(a)*33} y2={88+Math.sin(a)*33} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;
          })}
          {/* 4 mini icons in emblem quadrants */}
          <text x="120" y="84" fontSize="8" textAnchor="middle">⚡</text>
          <text x="136" y="84" fontSize="8" textAnchor="middle">🌿</text>
          <text x="120" y="96" fontSize="8" textAnchor="middle">🥤</text>
          <text x="136" y="96" fontSize="8" textAnchor="middle">💪</text>
          <line x1="128" y1="76" x2="128" y2="100" stroke="#FFD700" strokeWidth="0.5" opacity="0.4"/>
          <line x1="116" y1="88" x2="140" y2="88" stroke="#FFD700" strokeWidth="0.5" opacity="0.4"/>
          <text x="128" y="108" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4.5" fill="#FFD700" letterSpacing="1.5">✦ COMPLETE BUNDLE ✦</text>

          {/* 4-cover mosaic grid */}
          {/* Top-left: Caribbean Smoothies for Fat Loss - green smoothie */}
          <image href={`${SB}/fruit-images/fruit-papaya.jpg`} x="14" y="112" width="114" height="106" preserveAspectRatio="xMidYMid slice" clipPath="url(#nb-tl)" opacity="0.88"/>
          <rect x="14" y="112" width="114" height="106" rx="8" fill="none" stroke="#CCFF00" strokeWidth="1.2" opacity="0.5"/>
          <rect x="14" y="112" width="114" height="24" rx="8" fill="#0B1F10" opacity="0.85"/>
          <rect x="14" y="196" width="114" height="22" rx="0" fill="#0B1F10" opacity="0.85"/>
          <rect x="14" y="207" width="114" height="11" rx="8" fill="#0B1F10" opacity="0.85"/>
          <text x="71" y="125" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#CCFF00">CARIBBEAN SMOOTHIES</text>
          <text x="71" y="133" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#CCFF00" opacity="0.8">for Fat Loss</text>
          <text x="71" y="212" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#CCFF00" opacity="0.7">$9.99</text>

          {/* Top-right: Island Pre-Workout - dragon fruit/power */}
          <image href={`${SB}/fruit-images/fruit-dragon-fruit.jpg`} x="134" y="112" width="108" height="106" preserveAspectRatio="xMidYMid slice" clipPath="url(#nb-tr)" opacity="0.88"/>
          <rect x="134" y="112" width="108" height="106" rx="8" fill="none" stroke="#FF4081" strokeWidth="1.2" opacity="0.5"/>
          <rect x="134" y="112" width="108" height="24" rx="8" fill="#100008" opacity="0.85"/>
          <rect x="134" y="196" width="108" height="22" rx="0" fill="#100008" opacity="0.85"/>
          <rect x="134" y="207" width="108" height="11" rx="8" fill="#100008" opacity="0.85"/>
          <text x="188" y="125" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="#FF80AB">ISLAND PRE-WORKOUT</text>
          <text x="188" y="133" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#FF80AB" opacity="0.8">Natural Drinks</text>
          <text x="188" y="212" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#FF80AB" opacity="0.7">$9.99</text>

          {/* Bottom-left: Tropical Gym Energy */}
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="14" y="224" width="114" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#nb-bl)" opacity="0.88"/>
          <rect x="14" y="224" width="114" height="100" rx="8" fill="none" stroke="#39FF14" strokeWidth="1.2" opacity="0.5"/>
          <rect x="14" y="224" width="114" height="22" rx="8" fill="#050E05" opacity="0.85"/>
          <rect x="14" y="308" width="114" height="16" rx="8" fill="#050E05" opacity="0.85"/>
          <text x="71" y="236" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#39FF14">TROPICAL GYM ENERGY</text>
          <text x="71" y="244" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4" fill="#39FF14" opacity="0.8">Recipes</text>
          <text x="71" y="318" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#39FF14" opacity="0.7">$9.99</text>

          {/* Bottom-right: Tropical Superfruit Healing */}
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="134" y="224" width="108" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#nb-br)" opacity="0.88"/>
          <rect x="134" y="224" width="108" height="100" rx="8" fill="none" stroke="#FFD700" strokeWidth="1.2" opacity="0.5"/>
          <rect x="134" y="224" width="108" height="22" rx="8" fill="#071A07" opacity="0.85"/>
          <rect x="134" y="308" width="108" height="16" rx="8" fill="#071A07" opacity="0.85"/>
          <text x="188" y="236" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#FFD700">SUPERFRUIT HEALING</text>
          <text x="188" y="244" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4" fill="#FFD700" opacity="0.8">Drinks</text>
          <text x="188" y="318" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#FFD700" opacity="0.7">$11.99</text>

          {/* Center cross divider */}
          <rect x="122" y="112" width="4" height="212" fill="#050E05"/>
          <rect x="14" y="220" width="228" height="4" fill="#050E05"/>
          <circle cx="124" cy="222" r="6" fill="#050E05"/>
          <circle cx="124" cy="222" r="4" fill="#FFD700" opacity="0.9"/>
          <circle cx="124" cy="222" r="2" fill="#050E05"/>

          {/* Bottom banner */}
          <rect x="0" y="326" width="256" height="26" fill="#030806"/>
          <rect x="0" y="326" width="256" height="2" fill="url(#nb-gold)"/>

          {/* Bundle price */}
          <text x="80" y="338" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9.5" fontWeight="900" fill="white">COMPLETE BUNDLE</text>
          <text x="80" y="348" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fill="#B8860B" letterSpacing="0.5">4 Books — Save 40%</text>
          
          {/* Price tag */}
          <rect x="162" y="330" width="76" height="20" rx="8" fill="#FFD700" opacity="0.95"/>
          <text x="200" y="340" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fontWeight="900" fill="#030806">$29.99</text>
          <text x="200" y="348" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#030806" opacity="0.7">was $41.96</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-50" style={{width:d.w*0.85,height:12,background:"radial-gradient(ellipse,rgba(0,0,0,0.7),transparent)"}}/>
    </div>
  );
}
