interface BookCoverProps {
  size?: "sm" | "md" | "lg" | "xl";
  rotate?: boolean;
}

export function BookCover({ size = "lg", rotate = false }: BookCoverProps) {
  const sizeClasses = {
    sm: "w-32 h-44",
    md: "w-48 h-66",
    lg: "w-64 h-88",
    xl: "w-80 h-[440px]",
  };

  return (
    <div className={`${rotate ? "transform -rotate-2 hover:rotate-0 transition-transform duration-500" : ""}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-2xl group cursor-pointer`}
        style={{
          background: "linear-gradient(145deg, #1F7A4D 0%, #165C3A 40%, #0E3D26 70%, #1A4D35 100%)",
        }}
      >
        {/* Spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-[6%] bg-gradient-to-r from-black/30 to-transparent z-10"></div>
        
        {/* Decorative top band */}
        <div className="absolute top-0 left-0 right-0 h-[22%] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #F9A825 0%, #FF9800 50%, #FF7043 100%)",
            }}
          ></div>
          {/* Tropical leaf pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <path d="M0,50 Q50,10 100,50 T200,50 T300,50 T400,50 L400,0 L0,0 Z" fill="white" opacity="0.3" />
              <circle cx="50" cy="30" r="15" fill="white" opacity="0.15" />
              <circle cx="150" cy="60" r="10" fill="white" opacity="0.1" />
              <circle cx="250" cy="25" r="12" fill="white" opacity="0.12" />
              <circle cx="350" cy="50" r="8" fill="white" opacity="0.1" />
            </svg>
          </div>
          {/* Fruit emojis */}
          <div className="absolute inset-0 flex items-center justify-center gap-1 text-white/80" style={{ fontSize: size === "sm" ? "10px" : size === "md" ? "14px" : "18px" }}>
            <span>🥭</span>
            <span>🍌</span>
            <span>🥥</span>
            <span>🍈</span>
            <span>🩷</span>
          </div>
        </div>

        {/* Main content area */}
        <div className="absolute top-[24%] left-0 right-0 bottom-0 flex flex-col items-center justify-between px-[8%] pb-[6%]">
          {/* Title section */}
          <div className="text-center mt-[4%]">
            <div
              className="font-heading font-extrabold text-white leading-tight"
              style={{
                fontSize: size === "sm" ? "9px" : size === "md" ? "13px" : size === "lg" ? "17px" : "21px",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
              }}
            >
              THE CARIBBEAN
            </div>
            <div
              className="font-heading font-extrabold leading-tight"
              style={{
                fontSize: size === "sm" ? "12px" : size === "md" ? "18px" : size === "lg" ? "24px" : "30px",
                textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #F9A825, #FF9800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TROPICAL
              <br />
              FRUIT GUIDE
            </div>
          </div>

          {/* Center illustration - fruit circle */}
          <div className="relative my-[3%]">
            <div
              className="rounded-full border-2 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm"
              style={{
                width: size === "sm" ? "50px" : size === "md" ? "70px" : size === "lg" ? "95px" : "115px",
                height: size === "sm" ? "50px" : size === "md" ? "70px" : size === "lg" ? "95px" : "115px",
              }}
            >
              <span
                style={{
                  fontSize: size === "sm" ? "24px" : size === "md" ? "34px" : size === "lg" ? "48px" : "58px",
                }}
              >
                🌴
              </span>
            </div>
            {/* Orbiting fruits */}
            <span className="absolute -top-1 -right-1" style={{ fontSize: size === "sm" ? "10px" : size === "md" ? "14px" : "20px" }}>🥭</span>
            <span className="absolute -bottom-1 -left-1" style={{ fontSize: size === "sm" ? "10px" : size === "md" ? "14px" : "20px" }}>🍈</span>
            <span className="absolute top-1/2 -right-3 -translate-y-1/2" style={{ fontSize: size === "sm" ? "8px" : size === "md" ? "12px" : "16px" }}>🥥</span>
            <span className="absolute top-1/2 -left-3 -translate-y-1/2" style={{ fontSize: size === "sm" ? "8px" : size === "md" ? "12px" : "16px" }}>🍌</span>
          </div>

          {/* Subtitle */}
          <div
            className="text-center text-white/80 leading-snug"
            style={{
              fontSize: size === "sm" ? "5px" : size === "md" ? "7px" : size === "lg" ? "9px" : "11px",
            }}
          >
            Recipes • Health Benefits • Seasonal Guides
            <br />
            Storage Tips • Nutrition Facts
          </div>

          {/* Decorative divider */}
          <div className="w-[60%] h-[1px] bg-gradient-to-r from-transparent via-mango/60 to-transparent my-[2%]"></div>

          {/* Author / Brand */}
          <div className="text-center">
            <div
              className="text-white/60 uppercase tracking-widest"
              style={{
                fontSize: size === "sm" ? "4px" : size === "md" ? "5px" : size === "lg" ? "7px" : "8px",
              }}
            >
              Published by
            </div>
            <div
              className="font-heading font-bold text-white"
              style={{
                fontSize: size === "sm" ? "6px" : size === "md" ? "8px" : size === "lg" ? "11px" : "13px",
              }}
            >
              Island<span style={{ color: "#F9A825" }}>Fruit</span>Guide
            </div>
          </div>
        </div>

        {/* Glossy reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Hover glow */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Book shadow underneath */}
      <div
        className="mx-auto mt-1 rounded-full opacity-30"
        style={{
          width: size === "sm" ? "100px" : size === "md" ? "160px" : size === "lg" ? "220px" : "280px",
          height: "8px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)",
        }}
      ></div>
    </div>
  );
}
