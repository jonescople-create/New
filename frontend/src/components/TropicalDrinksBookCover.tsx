import { cn } from "../utils/cn";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  rotate?: boolean;
}

export function TropicalDrinksBookCover({ size = "lg", rotate = false }: Props) {
  const sizeClasses = {
    sm: "w-32 h-44",
    md: "w-48 h-66",
    lg: "w-64 h-88",
    xl: "w-80 h-[440px]",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl shadow-2xl overflow-hidden transition-all duration-300",
        sizeClasses[size],
        rotate && "hover:-rotate-1 hover:scale-105"
      )}
      style={{
        background: "linear-gradient(135deg, #FF6B9D 0%, #FEC163 50%, #A8E6CF 100%)",
      }}
    >
      {/* Decorative tropical pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl">🍹</div>
        <div className="absolute bottom-8 left-4 text-5xl">🥥</div>
        <div className="absolute top-1/3 left-1/4 text-4xl">🍋</div>
      </div>

      {/* Main content */}
      <div className="relative h-full flex flex-col justify-between p-6 text-white">
        {/* Top badge */}
        <div className="flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
            4 RECIPES
          </div>
          <div className="text-4xl">🌴</div>
        </div>

        {/* Title section */}
        <div className="text-center space-y-3">
          <div className="space-y-1">
            <h3 className="font-heading text-2xl font-extrabold leading-tight tracking-tight">
              TROPICAL
            </h3>
            <h2 className="font-heading text-3xl font-black leading-none">
              DRINKS
            </h2>
            <h3 className="font-heading text-2xl font-extrabold leading-tight">
              COLLECTION
            </h3>
          </div>
          <div className="h-px bg-white/40 w-3/4 mx-auto"></div>
          <p className="text-sm font-medium opacity-90">
            4 Signature Recipes
          </p>
        </div>

        {/* Bottom section */}
        <div className="space-y-3">
          {/* Recipe highlights */}
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">🥭</span>
              <span className="font-medium">Island Trio Elixir</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🐉</span>
              <span className="font-medium">Lychee Dragon Splash</span>
            </div>
          </div>
          
          {/* Publisher */}
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider">
              ISLAND<span className="text-yellow-200">FRUIT</span>GUIDE
            </p>
          </div>
        </div>
      </div>

      {/* Spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/30 to-transparent"></div>
      
      {/* Page edge effect */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-white/20 to-transparent"></div>
    </div>
  );
}
