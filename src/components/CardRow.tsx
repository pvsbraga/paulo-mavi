import { useState, useRef } from "react";
import { CardItem } from "@/data/loveData";
import { Heart } from "lucide-react";

interface CardRowProps {
  title: string;
  items: CardItem[];
  delay?: number;
}

export function LoveCard({ item }: { item: CardItem }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-48 md:w-56 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card image */}
      <div
        className="relative overflow-hidden rounded-lg transition-all duration-300"
        style={{
          transform: hovered ? "scale(1.08)" : "scale(1)",
          boxShadow: hovered
            ? "0 0 0 2px hsl(var(--netflix-red)), 0 20px 40px hsl(0 0% 0% / 0.6)"
            : "none",
          zIndex: hovered ? 10 : 1,
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          width={512}
          height={512}
          className="w-full aspect-video object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 netflix-gradient-overlay" />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-xs text-muted-foreground mb-1">{item.tag} · {item.year}</p>
          <h3 className="font-display text-foreground text-lg leading-tight">{item.title}</h3>
        </div>

        {/* Hover extra info */}
        {hovered && (
          <div className="absolute inset-0 bg-netflix-darker/90 flex flex-col justify-end p-3 transition-opacity duration-200">
            <p className="text-xs text-muted-foreground mb-1">{item.tag} · {item.year}</p>
            <h3 className="font-display text-foreground text-lg leading-tight mb-2">{item.title}</h3>
            <p className="text-foreground/90 text-xs italic leading-snug">"{item.phrase}"</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked((l) => !l);
              }}
              className="mt-2 self-start"
            >
              <Heart
                size={18}
                className={`transition-all duration-200 ${liked ? "fill-netflix-red text-netflix-red animate-pulse-heart" : "text-muted-foreground"}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CardRow({ title, items, delay = 0 }: CardRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="mb-8 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <h2 className="font-display text-foreground text-2xl md:text-3xl px-6 md:px-12 mb-3 tracking-wide">
        {title}
      </h2>
      <div
        ref={scrollRef}
        className="flex gap-3 px-6 md:px-12 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {items.map((item) => (
          <LoveCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
