interface SoursopBookCoverProps {
  size?: "sm" | "md" | "lg" | "xl";
  rotate?: boolean;
}

export function SoursopBookCover({ size = "lg", rotate = false }: SoursopBookCoverProps) {
  const sizeClasses = {
    sm: "w-32 h-44",
    md: "w-48 h-66",
    lg: "w-64 h-88",
    xl: "w-80 h-[440px]",
  };

  return (
    <div className={`${rotate ? "transform rotate-2 hover:rotate-0 transition-transform duration-500" : ""}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-2xl group cursor-pointer`}
        style={{
          background: "linear-gradient(145deg, #1B5E20 0%, #2E7D32 25%, #1B5E20 60%, #0D3B12 100%)",
        }}
      >
        {/* Spine effect */}
        <div className="absolute left-0 top-0 bottom-0 w-[6%] bg-gradient-to-r from-black/30 to-transparent z-10"></div>

        {/* Top section - soursop green gradient band */}
        <div className="absolute top-0 left-0 right-0 h-[18%] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #81C784 0%, #4CAF50 50%, #388E3C 100%)",
            }}
          ></div>
          {/* Organic pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <ellipse cx="80" cy="40" rx="60" ry="30" fill="white" opacity="0.15" />
              <ellipse cx="220" cy="35" rx="45" ry="25" fill="white" opacity="0.1" />
              <ellipse cx="340" cy="45" rx="50" ry="28" fill="white" opacity="0.12" />
            </svg>
          </div>
          {/* Leaf accents */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-white/70" style={{ fontSize: size === "sm" ? "10px" : size === "md" ? "14px" : "18px" }}>
            <span>🌿</span>
            <span>🍃</span>
            <span>🌱</span>
            <span>🌿</span>
          </div>
        </div>

        {/* Main content */}
        <div className="absolute top-[20%] left-0 right-0 bottom-0 flex flex-col items-center justify-between px-[8%] pb-[6%]">
          {/* Title */}
          <div className="text-center mt-[2%]">
            <div
              className="font-heading font-bold text-white/80 uppercase tracking-wider"
              style={{
                fontSize: size === "sm" ? "5px" : size === "md" ? "7px" : size === "lg" ? "9px" : "11px",
              }}
            >
              The Complete Guide
            </div>
            <div
              className="font-heading font-extrabold text-white leading-tight mt-[2%]"
              style={{
                fontSize: size === "sm" ? "10px" : size === "md" ? "15px" : size === "lg" ? "20px" : "25px",
                textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
              }}
            >
              THE
            </div>
            <div
              className="font-heading font-extrabold leading-tight"
              style={{
                fontSize: size === "sm" ? "13px" : size === "md" ? "20px" : size === "lg" ? "26px" : "33px",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #A5D6A7, #66BB6A, #43A047)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SOURSOP
              <br />
              GUIDE
            </div>
          </div>

          {/* Subtitle badge */}
          <div
            className="text-center px-[6%] py-[2%] bg-white/10 rounded-full border border-white/20"
            style={{
              fontSize: size === "sm" ? "5px" : size === "md" ? "7px" : size === "lg" ? "9px" : "11px",
            }}
          >
            <span className="text-[#A5D6A7] font-semibold">Nature's Green Powerhouse</span>
          </div>

          {/* Center illustration - soursop fruit */}
          <div className="relative my-[2%]">
            <div
              className="rounded-full border-2 border-[#A5D6A7]/30 flex items-center justify-center bg-white/10 backdrop-blur-sm"
              style={{
                width: size === "sm" ? "45px" : size === "md" ? "65px" : size === "lg" ? "85px" : "105px",
                height: size === "sm" ? "45px" : size === "md" ? "65px" : size === "lg" ? "85px" : "105px",
              }}
            >
              <img
                src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-soursop.jpg"
                alt="Soursop fruit"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `<span style="font-size:${size === "sm" ? "24px" : size === "md" ? "34px" : size === "lg" ? "44px" : "54px"}">🍈</span>`;
                  }
                }}
              />
            </div>
            {/* Orbiting elements */}
            <span className="absolute -top-1 -right-1" style={{ fontSize: size === "sm" ? "8px" : size === "md" ? "12px" : "16px" }}>🍃</span>
            <span className="absolute -bottom-1 -left-1" style={{ fontSize: size === "sm" ? "8px" : size === "md" ? "12px" : "16px" }}>💚</span>
            <span className="absolute top-1/2 -right-3 -translate-y-1/2" style={{ fontSize: size === "sm" ? "7px" : size === "md" ? "10px" : "14px" }}>✨</span>
          </div>

          {/* Content topics */}
          <div
            className="text-center text-white/70 leading-snug"
            style={{
              fontSize: size === "sm" ? "4.5px" : size === "md" ? "6.5px" : size === "lg" ? "8.5px" : "10.5px",
            }}
          >
            Health Benefits • Nutrition Facts • Cancer Research
            <br />
            Preparation • Safety • Traditional Uses
          </div>

          {/* Divider */}
          <div className="w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[#A5D6A7]/50 to-transparent my-[2%]"></div>

          {/* Brand */}
          <div className="text-center">
            <div
              className="text-white/50 uppercase tracking-widest"
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
              Island<span style={{ color: "#A5D6A7" }}>Fruit</span>Guide
            </div>
          </div>
        </div>

        {/* Glossy reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Shadow */}
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
