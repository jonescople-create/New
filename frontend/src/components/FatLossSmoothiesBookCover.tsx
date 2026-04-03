const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm"|"md"|"lg"|"xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function FatLossSmoothiesBookCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(1.5deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(255,64,129,0.3))"}}>
        <defs>
          <linearGradient id="fl-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#1A0010"/><stop offset="50%" stopColor="#2A0018"/><stop offset="100%" stopColor="#100008"/>
          </linearGradient>
          <radialGradient id="fl-glow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FF4081" stopOpacity="0.2"/><stop offset="70%" stopColor="#E91E8C" stopOpacity="0.06"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="fl-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A5C00"/><stop offset="30%" stopColor="#FFD700"/><stop offset="70%" stopColor="#FFC107"/><stop offset="100%" stopColor="#7A5C00"/>
          </linearGradient>
          <linearGradient id="fl-goldv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#B8860B"/>
          </linearGradient>
          <linearGradient id="fl-stripe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF4081" stopOpacity="0"/><stop offset="25%" stopColor="#FF4081" stopOpacity="0.9"/><stop offset="75%" stopColor="#E91E8C" stopOpacity="0.9"/><stop offset="100%" stopColor="#E91E8C" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="fl-title1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#EEEEEE"/>
          </linearGradient>
          <linearGradient id="fl-title2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF4081"/><stop offset="50%" stopColor="#FF80AB"/><stop offset="100%" stopColor="#FF4081"/>
          </linearGradient>
          <clipPath id="fl-clip"><rect width="256" height="352" rx="8"/></clipPath>
        </defs>
        <g clipPath="url(#fl-clip)">
          <rect width="256" height="352" fill="url(#fl-bg)"/>
          <rect width="256" height="352" fill="url(#fl-glow)"/>
          <rect width="10" height="352" fill="black" opacity="0.55"/>
          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#12000C"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#fl-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#8B5070" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>
          {/* Emblem */}
          <circle cx="128" cy="82" r="28" fill="none" stroke="url(#fl-goldv)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="25" fill="#12000C"/>
          {Array.from({length:18}).map((_,i)=>{
            const a=(i*20)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*26} y1={82+Math.sin(a)*26} x2={128+Math.cos(a)*31} y2={82+Math.sin(a)*31} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;
          })}
          <ellipse cx="128" cy="82" rx="10" ry="13" fill="#FF8C00" opacity="0.95"/>
          <ellipse cx="128" cy="79" rx="7" ry="9" fill="#FFA500" opacity="0.8"/>
          <ellipse cx="128" cy="76" rx="4" ry="5" fill="#FFD700" opacity="0.65"/>
          <path d="M128,69 Q133,65 134,70 Q130,72 128,69Z" fill="#2E7D32"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>
          {/* Pink accent line */}
          <rect x="0" y="116" width="256" height="2" fill="url(#fl-stripe)"/>
          {/* Fruit card */}
          <rect x="18" y="124" width="220" height="128" rx="10" fill="#12000A" opacity="0.9"/>
          <rect x="18" y="124" width="220" height="128" rx="10" fill="none" stroke="#FF4081" strokeWidth="0.8" opacity="0.5"/>
          <image href={`${SB}/fruit-images/fruit-papaya.jpg`} x="22" y="128" width="68" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.95"/>
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="96" y="128" width="68" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.95"/>
          <image href={`${SB}/fruit-images/fruit-passion-fruit.jpg`} x="170" y="128" width="64" height="72" preserveAspectRatio="xMidYMid slice" style={{clipPath:"inset(0 round 7px)"}} opacity="0.9"/>
          <rect x="22" y="204" width="50" height="12" rx="5" fill="#FF4081" opacity="0.9"/>
          <text x="47" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="white">PAPAYA</text>
          <rect x="96" y="204" width="46" height="12" rx="5" fill="#FFD700" opacity="0.9"/>
          <text x="119" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fontWeight="700" fill="#12000A">GUAVA</text>
          <rect x="168" y="204" width="64" height="12" rx="5" fill="#E91E8C" opacity="0.9"/>
          <text x="200" y="213" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fontWeight="700" fill="white">PASSION FRUIT</text>
          {/* Divider */}
          <rect x="0" y="258" width="256" height="2" fill="url(#fl-gold)"/>
          <rect x="20" y="264" width="216" height="18" rx="6" fill="#FF4081" opacity="0.1"/>
          <text x="128" y="277" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#FF80AB" letterSpacing="2" fontWeight="700">🌿 30+ RECIPES</text>
          {/* Title */}
          <text x="128" y="302" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fontWeight="900" fill="url(#fl-title1)" letterSpacing="0.3">CARIBBEAN SMOOTHIES</text>
          <text x="128" y="319" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="900" fill="url(#fl-title2)" letterSpacing="-0.3">FOR FAT LOSS</text>
          {/* Bottom */}
          <rect x="0" y="334" width="256" height="18" fill="#12000C"/>
          <rect x="0" y="334" width="256" height="1.5" fill="url(#fl-gold)"/>
          <text x="128" y="346" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(255,64,129,0.5),transparent)"}}/>
    </div>
  );
}
