interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };
const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";

export function CaribbeanEncyclopediaCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(1.5deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.55))"}}>
        <defs>
          <linearGradient id="enc-bg" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#1A2A0A"/>
            <stop offset="40%" stopColor="#243510"/>
            <stop offset="100%" stopColor="#0E1808"/>
          </linearGradient>
          <linearGradient id="enc-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6B4800"/><stop offset="25%" stopColor="#FFD700"/>
            <stop offset="55%" stopColor="#E8B800"/><stop offset="80%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#6B4800"/>
          </linearGradient>
          <linearGradient id="enc-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE566"/><stop offset="50%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          <radialGradient id="enc-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="enc-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#enc-clip)">
          <rect width="256" height="352" fill="url(#enc-bg)"/>
          <rect width="256" height="352" fill="url(#enc-aura)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Double ornamental border */}
          <rect x="6" y="6" width="244" height="340" rx="4" fill="none" stroke="url(#enc-gold)" strokeWidth="0.7" opacity="0.6"/>
          <rect x="10" y="10" width="236" height="332" rx="3" fill="none" stroke="#FFD700" strokeWidth="0.35" opacity="0.25"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="46" fill="#0E1808"/>
          <rect x="0" y="44" width="256" height="2" fill="url(#enc-gold)"/>
          {[16,240].map((cx,i)=><g key={i}><circle cx={cx} cy="22" r="4" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.6"/><circle cx={cx} cy="22" r="1.5" fill="#FFD700" opacity="0.5"/></g>)}
          <text x="128" y="17" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="29" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="39" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#4A6030" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Large emblem */}
          <circle cx="128" cy="88" r="32" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.35"/>
          <circle cx="128" cy="88" r="29" fill="none" stroke="url(#enc-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="88" r="25.5" fill="#0E1808"/>
          {Array.from({length:20}).map((_,i)=>{
            const a=(i*18)*Math.PI/180;
            return <line key={i} x1={128+Math.cos(a)*27} y1={88+Math.sin(a)*27} x2={128+Math.cos(a)*32} y2={88+Math.sin(a)*32} stroke="#FFD700" strokeWidth="1.2" opacity="0.7"/>;
          })}
          <ellipse cx="128" cy="88" rx="12" ry="16" fill="#FF8C00" opacity="0.9"/>
          <ellipse cx="128" cy="85" rx="8" ry="10" fill="#FFB300" opacity="0.75"/>
          <path d="M128,72 Q135,65 137,73 Q132,75 128,72Z" fill="#2E7D32"/>
          <path d="M128,72 Q121,65 119,73 Q124,75 128,72Z" fill="#388E3C" opacity="0.7"/>
          <text x="128" y="108" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Gold shimmer line */}
          <rect x="30" y="126" width="196" height="1" fill="url(#enc-gold)" opacity="0.7"/>

          {/* 6-fruit grid */}
          {[[28,136],[99,136],[170,136],[28,200],[99,200],[170,200]].map(([x,y],i)=>{
            const fruits = ['fruit-mango','fruit-soursop','fruit-guava','fruit-papaya','fruit-coconut','fruit-passion-fruit'];
            return <g key={i}>
              <circle cx={x+28} cy={y+28} r="28" fill="#1A2A0A" opacity="0.6" stroke="#FFD700" strokeWidth="0.8" strokeOpacity="0.4"/>
              <image href={`${SB}/fruit-images/${fruits[i]}.jpg`} x={x} y={y} width="56" height="56" preserveAspectRatio="xMidYMid slice" opacity="0.88" style={{clipPath:`circle(28px at 28px 28px)`}}/>
            </g>;
          })}
          {/* Labels under grid */}
          {[['MANGO',56],['SOURSOP',127],['GUAVA',198]].map(([n,x])=>(
            <text key={String(x)} x={Number(x)} y="272" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#FFD700" opacity="0.7">{n}</text>
          ))}
          {[['PAPAYA',56],['COCONUT',127],['PASSION FRUIT',198]].map(([n,x])=>(
            <text key={String(x)} x={Number(x)} y="234" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#B8860B" opacity="0.7">{n}</text>
          ))}

          {/* Divider ornament */}
          <rect x="0" y="278" width="256" height="2" fill="url(#enc-gold)"/>
          <text x="128" y="292" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" fill="#FFD700" letterSpacing="2">📖 ENCYCLOPEDIA</text>

          {/* Title */}
          <text x="128" y="312" textAnchor="middle" fontFamily="Georgia,serif" fontSize="16" fontWeight="900" fill="white" letterSpacing="-0.3">CARIBBEAN</text>
          <text x="128" y="328" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="900" fill="#FFD700" letterSpacing="-0.2">FRUIT ENCYCLOPEDIA</text>

          {/* Bottom */}
          <rect x="0" y="340" width="256" height="12" fill="#0E1808"/>
          <rect x="0" y="340" width="256" height="1.5" fill="url(#enc-gold)"/>
          <text x="128" y="349" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5" fill="#B8860B" letterSpacing="1.5">Island<tspan fill="#FFD700">Fruit</tspan>Guide.com</text>
          <text x="234" y="349" textAnchor="end" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#4A6030">100+ FRUITS</text>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,0,0,0.6),transparent)"}}/>
    </div>
  );
}
