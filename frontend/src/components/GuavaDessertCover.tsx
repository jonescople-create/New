const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function GuavaDessertCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(-1deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(180,0,80,0.35))"}}>
        <defs>
          <linearGradient id="gd-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#180010"/><stop offset="40%" stopColor="#200018"/><stop offset="100%" stopColor="#0C0008"/>
          </linearGradient>
          <radialGradient id="gd-burst" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#FF4081" stopOpacity="0.14"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="gd-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A0038"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="60%" stopColor="#FFC107"/><stop offset="100%" stopColor="#5A0038"/>
          </linearGradient>
          <linearGradient id="gd-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B0050"/>
          </linearGradient>
          <linearGradient id="gd-rose" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF4081" stopOpacity="0"/>
            <stop offset="30%" stopColor="#FF80AB" stopOpacity="0.85"/>
            <stop offset="70%" stopColor="#F50057" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#FF4081" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="gd-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#gd-clip)">
          <rect width="256" height="352" fill="url(#gd-bg)"/>
          <rect width="256" height="352" fill="url(#gd-burst)"/>
          <rect width="10" height="352" fill="black" opacity="0.55"/>

          {/* Ornamental border */}
          <rect x="7" y="7" width="242" height="338" rx="4" fill="none" stroke="url(#gd-gold)" strokeWidth="0.6" opacity="0.45"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#0C0008"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#gd-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#5E2040" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="82" r="27" fill="none" stroke="url(#gd-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="23.5" fill="#0C0008"/>
          {Array.from({length:18}).map((_,i)=>{const a=(i*20)*Math.PI/180; return <line key={i} x1={128+Math.cos(a)*24.5} y1={82+Math.sin(a)*24.5} x2={128+Math.cos(a)*29} y2={82+Math.sin(a)*29} stroke="#FFD700" strokeWidth="1.2" opacity="0.65"/>;})}
          {/* Guava cross-section */}
          <circle cx="128" cy="82" r="12" fill="#FF4081" opacity="0.75"/>
          <circle cx="128" cy="82" r="8" fill="#FF80AB" opacity="0.65"/>
          <circle cx="128" cy="82" r="4" fill="#FFCCDD" opacity="0.55"/>
          {Array.from({length:6}).map((_,i)=>{const a=(i*60)*Math.PI/180; return <ellipse key={i} cx={128+Math.cos(a)*6} cy={82+Math.sin(a)*6} rx="2" ry="1.5" fill="#FFD700" opacity="0.7" transform={`rotate(${i*60},${128+Math.cos(a)*6},${82+Math.sin(a)*6})`}/>;})}
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Rose shimmer */}
          <rect x="0" y="114" width="256" height="2" fill="url(#gd-rose)"/>

          {/* Hero guava */}
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="16" y="122" width="224" height="145" preserveAspectRatio="xMidYMid slice" opacity="0.9" style={{clipPath:"inset(0 round 12px)"}}/>

          {/* Recipe names */}
          <rect x="16" y="260" width="224" height="26" rx="8" fill="#0C0008" opacity="0.9"/>
          <text x="128" y="270" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fill="#FF80AB" fontWeight="700">10 SWEET &amp; ELEGANT CREATIONS</text>
          <text x="128" y="280" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#B8860B" opacity="0.85">Tart • Mousse • Cheesecake • Jam • Ice Cream</text>

          {/* 3 small images */}
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="16" y="290" width="68" height="46" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="96" y="290" width="68" height="46" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="176" y="290" width="64" height="46" preserveAspectRatio="xMidYMid slice" opacity="0.85" style={{clipPath:"inset(0 round 8px)"}}/>

          {/* Divider */}
          <rect x="0" y="340" width="256" height="2" fill="url(#gd-gold)"/>

          {/* Title */}
          <text x="128" y="324" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15.5" fontStyle="italic" fontWeight="900" fill="white">Guava</text>
          <text x="128" y="337" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="700" fill="#FF80AB">DESSERT COLLECTION</text>
          <text x="128" y="348" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fill="#B8860B" letterSpacing="0.8">Sweet Treats and Elegant Creations</text>

          {/* Bottom */}
          <rect x="0" y="350" width="256" height="2" fill="url(#gd-gold)" opacity="0.5"/>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(180,0,80,0.4),transparent)"}}/>
    </div>
  );
}
