const SB = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public";
interface Props { size?: "sm" | "md" | "lg" | "xl"; rotate?: boolean; }
const DIMS = { sm:{w:128,h:176,cls:"w-32 h-44"}, md:{w:192,h:264,cls:"w-48 h-66"}, lg:{w:256,h:352,cls:"w-64 h-88"}, xl:{w:320,h:440,cls:"w-80 h-[440px]"} };

export function FruitCalendarCover({ size = "lg", rotate = false }: Props) {
  const d = DIMS[size];
  const months = [
    {label:"JAN",color:"#2196F3",fruits:"🍋🥥"},
    {label:"FEB",color:"#E91E63",fruits:"🥭🍍"},
    {label:"MAR",color:"#FF9800",fruits:"🍌🥭"},
    {label:"APR",color:"#4CAF50",fruits:"🥥🍈"},
    {label:"MAY",color:"#9C27B0",fruits:"🍹🌿"},
    {label:"JUN",color:"#FF5722",fruits:"🥭🍑"},
    {label:"JUL",color:"#FFD700",fruits:"🍈🥥"},
    {label:"AUG",color:"#00BCD4",fruits:"🍍🥭"},
    {label:"SEP",color:"#8BC34A",fruits:"🥝🍋"},
    {label:"OCT",color:"#FF9800",fruits:"🍊🥭"},
    {label:"NOV",color:"#795548",fruits:"🥥🍌"},
    {label:"DEC",color:"#F44336",fruits:"🍹🎉"},
  ];
  return (
    <div className={`${d.cls} relative flex-shrink-0 cursor-pointer`} style={rotate?{transform:"rotate(1deg)"}:{}}>
      <svg width={d.w} height={d.h} viewBox="0 0 256 352" xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-2xl block" style={{filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.55))"}}>
        <defs>
          <linearGradient id="cal-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#03111A"/><stop offset="100%" stopColor="#010A10"/>
          </linearGradient>
          <linearGradient id="cal-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A3800"/><stop offset="30%" stopColor="#FFD700"/>
            <stop offset="70%" stopColor="#FFC107"/><stop offset="100%" stopColor="#5A3800"/>
          </linearGradient>
          <linearGradient id="cal-gold-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B5A00"/>
          </linearGradient>
          <clipPath id="cal-clip"><rect width="256" height="352" rx="6"/></clipPath>
        </defs>
        <g clipPath="url(#cal-clip)">
          <rect width="256" height="352" fill="url(#cal-bg)"/>
          <rect width="10" height="352" fill="black" opacity="0.5"/>

          {/* Header */}
          <rect x="0" y="0" width="256" height="44" fill="#010A10"/>
          <rect x="0" y="42" width="256" height="2" fill="url(#cal-gold)"/>
          <text x="128" y="16" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#FFD700" letterSpacing="2" fontWeight="700">ISLANDFRUITGUIDE</text>
          <text x="128" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#B8860B" letterSpacing="1.5">TROPICAL NUTRITION SERIES</text>
          <text x="128" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="4.5" fill="#1E4A60" letterSpacing="0.8">Natural Energy • Tropical Health • Caribbean Recipes</text>

          {/* Emblem */}
          <circle cx="128" cy="82" r="27" fill="none" stroke="url(#cal-gold-v)" strokeWidth="2"/>
          <circle cx="128" cy="82" r="23.5" fill="#010A10"/>
          {Array.from({length:18}).map((_,i)=>{const a=(i*20)*Math.PI/180; return <line key={i} x1={128+Math.cos(a)*24.5} y1={82+Math.sin(a)*24.5} x2={128+Math.cos(a)*29} y2={82+Math.sin(a)*29} stroke="#FFD700" strokeWidth="1.2" opacity="0.65"/>;})}
          {/* Calendar icon in emblem */}
          <rect x="120" y="72" width="16" height="14" rx="2" fill="#00BCD4" opacity="0.8"/>
          <rect x="120" y="72" width="16" height="5" rx="2" fill="#FF5722" opacity="0.9"/>
          <line x1="123" y1="79" x2="123" y2="84" stroke="white" strokeWidth="0.7" opacity="0.6"/>
          <line x1="126" y1="79" x2="126" y2="84" stroke="white" strokeWidth="0.7" opacity="0.6"/>
          <line x1="129" y1="79" x2="129" y2="84" stroke="white" strokeWidth="0.7" opacity="0.6"/>
          <line x1="132" y1="79" x2="132" y2="84" stroke="white" strokeWidth="0.7" opacity="0.6"/>
          <text x="128" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4" fill="#FFD700" letterSpacing="1.2">✦ ISLANDFRUITGUIDE APPROVED ✦</text>

          {/* Stripe */}
          <rect x="0" y="114" width="256" height="2" fill="url(#cal-gold)"/>

          {/* 12-month calendar grid */}
          {months.map((m,i)=>{
            const col = i % 4;
            const row = Math.floor(i/4);
            const x = 16 + col * 58;
            const y = 122 + row * 48;
            return (
              <g key={m.label}>
                <rect x={x} y={y} width="52" height="42" rx="5" fill={m.color} opacity="0.18"/>
                <rect x={x} y={y} width="52" height="42" rx="5" fill="none" stroke={m.color} strokeWidth="0.7" opacity="0.5"/>
                <rect x={x} y={y} width="52" height="11" rx="5" fill={m.color} opacity="0.7"/>
                <text x={x+26} y={y+8} textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fontWeight="700" fill="white">{m.label}</text>
                <text x={x+26} y={y+27} textAnchor="middle" fontSize="13">{m.fruits.split('')[0]}</text>
                <text x={x+26} y={y+39} textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5" fill="#B8860B" opacity="0.7">In Season</text>
              </g>
            );
          })}

          {/* Fruit image strip at bottom */}
          <image href={`${SB}/fruit-images/fruit-mango.jpg`} x="16" y="268" width="55" height="42" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 6px)"}}/>
          <image href={`${SB}/fruit-images/fruit-pineapple.jpg`} x="76" y="268" width="55" height="42" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 6px)"}}/>
          <image href={`${SB}/fruit-images/fruit-guava.jpg`} x="136" y="268" width="55" height="42" preserveAspectRatio="xMidYMid slice" opacity="0.8" style={{clipPath:"inset(0 round 6px)"}}/>
          <image href={`${SB}/fruit-images/fruit-soursop.jpg`} x="196" y="268" width="48" height="42" preserveAspectRatio="xMidYMid slice" opacity="0.75" style={{clipPath:"inset(0 round 6px)"}}/>

          {/* Divider + title */}
          <rect x="0" y="316" width="256" height="2" fill="url(#cal-gold)"/>
          <text x="128" y="330" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="900" fill="white">CARIBBEAN FRUIT</text>
          <text x="128" y="344" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10.5" fontWeight="900" fill="#FFD700">SEASON CALENDAR</text>

          {/* Bottom */}
          <rect x="0" y="348" width="256" height="4" fill="#010A10"/>
          <rect x="0" y="348" width="256" height="1.5" fill="url(#cal-gold)" opacity="0.5"/>
        </g>
      </svg>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full opacity-40" style={{width:d.w*0.85,height:10,background:"radial-gradient(ellipse,rgba(0,0,0,0.6),transparent)"}}/>
    </div>
  );
}
