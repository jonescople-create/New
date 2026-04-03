interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  rotate?: boolean;
}

export function SuperfruitsBookCover({ size = "lg", rotate = false }: Props) {
  const sizeClasses = {
    sm: "w-32 h-44",
    md: "w-48 h-66",
    lg: "w-64 h-88",
    xl: "w-80 h-[440px]",
  };

  const titleSize = {
    sm: "text-[8px]",
    md: "text-xs",
    lg: "text-base",
    xl: "text-lg",
  };

  const subtitleSize = {
    sm: "text-[5px]",
    md: "text-[7px]",
    lg: "text-[9px]",
    xl: "text-[10px]",
  };

  return (
    <div className={`${rotate ? "hover:rotate-0 transition-transform duration-500" : ""}`} style={rotate ? { transform: "rotate(-2deg)" } : {}}>
      <div
        className={`${sizeClasses[size]} relative rounded-r-xl rounded-l-sm overflow-hidden shadow-2xl flex flex-col`}
        style={{
          background: "linear-gradient(135deg, #FF6F00 0%, #E65100 25%, #BF360C 50%, #8D2B0B 75%, #5D2906 100%)",
        }}
      >
        {/* Spine shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent z-10" />

        {/* Decorative top band */}
        <div className="relative z-10 pt-3 px-3">
          <div className="h-1 w-full rounded-full" style={{ background: "linear-gradient(90deg, #FFD54F, #FF8F00, #FFD54F)" }} />
        </div>

        {/* Fruit trio circles */}
        <div className="relative z-10 flex justify-center gap-1 mt-3 px-2">
          {/* Soursop */}
          <div className={`${size === "sm" ? "w-7 h-7" : size === "md" ? "w-10 h-10" : size === "lg" ? "w-14 h-14" : "w-16 h-16"} rounded-full border-2 border-[#FFD54F]/60 overflow-hidden bg-[#2E7D32] flex items-center justify-center`}>
            <img
              src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-soursop.jpg"
              alt="Soursop"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          {/* Papaya */}
          <div className={`${size === "sm" ? "w-7 h-7" : size === "md" ? "w-10 h-10" : size === "lg" ? "w-14 h-14" : "w-16 h-16"} rounded-full border-2 border-[#FFD54F]/60 overflow-hidden bg-[#FF6F00] flex items-center justify-center -mt-1`}>
            <img
              src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-papaya.jpg"
              alt="Papaya"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          {/* Banana */}
          <div className={`${size === "sm" ? "w-7 h-7" : size === "md" ? "w-10 h-10" : size === "lg" ? "w-14 h-14" : "w-16 h-16"} rounded-full border-2 border-[#FFD54F]/60 overflow-hidden bg-[#F9A825] flex items-center justify-center`}>
            <img
              src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-banana.jpg"
              alt="Banana"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>

        {/* Top label */}
        <div className="relative z-10 mt-2 px-3 text-center">
          <span className={`${subtitleSize[size]} font-bold tracking-[0.15em] uppercase text-[#FFD54F]`}>
            The Complete Guide to
          </span>
        </div>

        {/* Title */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-3 text-center">
          <h3 className={`${titleSize[size]} font-heading font-black text-white leading-tight`}>
            CARIBBEAN
          </h3>
          <h3 className={`${size === "sm" ? "text-[10px]" : size === "md" ? "text-sm" : size === "lg" ? "text-xl" : "text-2xl"} font-heading font-black leading-tight`} style={{ color: "#FFD54F" }}>
            SUPERFRUITS
          </h3>
          <div className="mt-1">
            <div className="h-[1px] w-3/4 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #FFD54F, transparent)" }} />
          </div>
          <p className={`${subtitleSize[size]} text-white/80 mt-1 leading-snug font-medium`}>
            Soursop, Papaya & Banana
          </p>
          <p className={`${size === "sm" ? "text-[4px]" : size === "md" ? "text-[5px]" : size === "lg" ? "text-[7px]" : "text-[8px]"} text-white/60 mt-1 leading-snug`}>
            Understanding, Preparing & Enjoying
            <br />
            Nature's Tropical Powerhouses
          </p>
        </div>

        {/* Decorative fruit icons */}
        <div className="relative z-10 flex justify-center gap-1 mb-1">
          <span className={`${size === "sm" ? "text-[8px]" : size === "md" ? "text-xs" : "text-sm"}`}>🥑</span>
          <span className={`${size === "sm" ? "text-[8px]" : size === "md" ? "text-xs" : "text-sm"}`}>🍈</span>
          <span className={`${size === "sm" ? "text-[8px]" : size === "md" ? "text-xs" : "text-sm"}`}>🍌</span>
        </div>

        {/* Bottom band */}
        <div className="relative z-10 px-3 pb-1">
          <div className="h-[1px] w-full" style={{ background: "linear-gradient(90deg, transparent, #FFD54F, transparent)" }} />
        </div>

        {/* Bottom branding */}
        <div className="relative z-10 pb-3 px-3 text-center">
          <p className={`${size === "sm" ? "text-[4px]" : size === "md" ? "text-[6px]" : size === "lg" ? "text-[8px]" : "text-[9px]"} text-[#FFD54F] font-bold tracking-[0.2em] uppercase`}>
            IslandFruitGuide
          </p>
          <p className={`${size === "sm" ? "text-[3px]" : size === "md" ? "text-[4px]" : size === "lg" ? "text-[6px]" : "text-[7px]"} text-white/50 mt-0.5`}>
            Recipes • Health • Meal Plans • Safety
          </p>
        </div>

        {/* Glossy reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent z-20 pointer-events-none" />

        {/* Subtle texture */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
      </div>
    </div>
  );
}
