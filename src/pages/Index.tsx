import { useState, useEffect, useRef } from "react";
import { Heart, Play, Info, X, LogOut } from "lucide-react";
import { heroData } from "@/data/loveData";
import { CardRow } from "@/components/CardRow";
import { HumorDoDia } from "@/components/HumorDoDia";
import { destaquesRow, momentosRow } from "@/data/loveData";
import { useAuth } from "@/hooks/useAuth";
import { profileAvatars } from "@/lib/profileAvatars";
import { Button } from "@/components/ui/button";
import { ListaDeFilmes } from "@/components/ListaDeFilmes";
import { MusicControl } from "@/components/MusicControl";

export default function Index() {
  const { username, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const destaquesRef = useRef<HTMLDivElement>(null);
  const mavisRef = useRef<HTMLDivElement>(null);
  const humorRef = useRef<HTMLDivElement>(null);
  const filmesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-netflix-dark text-foreground">

      {/* ── VIDEO MODAL ── */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={() => setShowVideo(false)}
              variant="ghost"
              size="sm"
              className="absolute -top-10 right-0 text-foreground/70 hover:text-foreground"
            >
              <X size={18} /> Fechar
            </Button>
            <video
              ref={videoRef}
              src={heroData.video}
              className="w-full rounded-xl shadow-2xl"
              autoPlay
              controls
              playsInline
            />
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 md:px-12 py-3 transition-all duration-500"
        style={{
          background: scrolled
            ? "hsl(var(--netflix-darker))"
            : "linear-gradient(to bottom, hsl(0 0% 5% / 0.8), transparent)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-display text-netflix-red text-3xl md:text-4xl tracking-wider select-none">
            LOVEFLIX
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-foreground/80">
          <Button
            variant="ghost" size="sm"
            className="text-foreground/80 hover:text-foreground px-2"
            onClick={() => destaquesRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Destaques de Nós
          </Button>
          <Button
            variant="ghost" size="sm"
            className="text-foreground/80 hover:text-foreground px-2"
            onClick={() => mavisRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Mavis e Paulo
          </Button>
          <Button
            variant="ghost" size="sm"
            className="text-foreground/80 hover:text-foreground px-2"
            onClick={() => humorRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Humor do Dia
          </Button>
          <Button
            variant="ghost" size="sm"
            className="text-foreground/80 hover:text-foreground px-2"
            onClick={() => filmesRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Lista de Filmes
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {username && (
            <div className="flex items-center gap-2">
              <img
                src={profileAvatars[username]}
                alt={username}
                className="w-9 h-9 rounded-full object-cover border-2 border-netflix-red"
              />
              <span className="hidden sm:inline text-xs text-foreground/80 uppercase tracking-widest font-semibold">
                {username === "mavi" ? "Mavi" : "Paulo"}
              </span>
            </div>
          )}
          <Heart size={22} className="text-netflix-red fill-netflix-red animate-pulse-heart" />
          <MusicControl />
          <Button
            onClick={signOut}
            title="Sair"
            aria-label="Sair"
            variant="ghost" size="icon"
            className="text-foreground/70 hover:text-foreground"
          >
            <LogOut size={18} />
          </Button>
        </div>
        <div className="flex lg:hidden order-last w-full items-center gap-1 overflow-x-auto whitespace-nowrap pt-2 text-xs -mx-1 px-1" aria-label="Seções">
          <Button variant="ghost" size="sm" className="shrink-0 px-2 text-foreground/80" onClick={() => destaquesRef.current?.scrollIntoView({ behavior: "smooth" })}>Destaques de Nós</Button>
          <Button variant="ghost" size="sm" className="shrink-0 px-2 text-foreground/80" onClick={() => mavisRef.current?.scrollIntoView({ behavior: "smooth" })}>Mavis e Paulo</Button>
          <Button variant="ghost" size="sm" className="shrink-0 px-2 text-foreground/80" onClick={() => humorRef.current?.scrollIntoView({ behavior: "smooth" })}>Humor do Dia</Button>
          <Button variant="ghost" size="sm" className="shrink-0 px-2 text-foreground/80" onClick={() => filmesRef.current?.scrollIntoView({ behavior: "smooth" })}>Lista de Filmes</Button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
        {/* Background */}
        <img
          src={heroData.image}
          alt="Paulo beijando a Mavi na comemoração de um ano"
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover object-[center_68%] md:object-[center_57%]"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 hero-gradient-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-40 netflix-gradient-overlay" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-12">
          {/* Badge */}
          <div
            className="mb-3 animate-fade-in-up"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            <span className="bg-netflix-red text-foreground text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-widest">
              Original Só Nosso
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground max-w-2xl leading-none mb-3 animate-fade-in-up"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            {heroData.title}
          </h1>

          {/* Match */}
          <p
            className="text-sm text-green-400 font-semibold mb-3 animate-fade-in-up"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            {heroData.match}
          </p>

          {/* Tags */}
          <div
            className="flex gap-2 flex-wrap mb-4 animate-fade-in-up"
            style={{ animationDelay: "350ms", animationFillMode: "both" }}
          >
            {heroData.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p
            className="text-foreground/85 text-sm md:text-base max-w-md mb-6 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            {heroData.description}
          </p>

          {/* Buttons */}
          <div
            className="flex gap-3 animate-fade-in-up"
            style={{ animationDelay: "500ms", animationFillMode: "both" }}
          >
            <Button
              onClick={() => setShowVideo(true)}
              className="bg-foreground text-background font-semibold px-6 hover:bg-foreground/80"
            >
              <Play size={16} className="fill-background" />
              Assistir
            </Button>
            <Button
              onClick={() => setShowInfo(!showInfo)}
              variant="secondary"
              className="bg-muted/80 text-foreground font-semibold px-6 hover:bg-muted backdrop-blur-sm"
            >
              <Info size={16} />
              Mais Info
            </Button>
          </div>

          {/* Info panel */}
          {showInfo && (
            <div className="mt-4 max-w-xl max-h-[38vh] overflow-y-auto bg-netflix-card/90 backdrop-blur-md rounded-lg p-4 border border-border animate-fade-in-up">
              <p className="text-foreground/90 text-sm leading-relaxed">
                Eu te amo de incontáveis formas Mavi, sou cada dia mais feliz contigo e não tenho medo de nada que possa nos abalar pois sei que nosso laço é mais forte que tudo, e ao invés de nos afastarmos, sinto que sempre saímos de situações difíceis mais unidos e fortes que antes. Parabéns para nós, meu amor. Ansioso pelos próximos dias, meses e anos ao seu lado
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTENT ROWS ── */}
      <div className="relative z-10 -mt-8 pb-16">
        <div ref={destaquesRef}>
          <CardRow title="Destaques de Nós" items={destaquesRow} delay={200} />
        </div>
        <div ref={mavisRef}>
          <CardRow title="Mavis e Paulo" items={momentosRow} delay={400} />
        </div>
        <div ref={humorRef} className="mt-8">
          <HumorDoDia />
        </div>
        <div ref={filmesRef} className="scroll-mt-28">
          <ListaDeFilmes />
        </div>


        {/* ── CUTE MESSAGE BANNER ── */}
        <section
          className="mx-6 md:mx-12 my-8 rounded-xl overflow-hidden relative animate-fade-in-up"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
        >
          <div
            className="p-8 md:p-12 text-center relative z-10"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--netflix-red) / 0.15), hsl(var(--netflix-card)), hsl(var(--netflix-red) / 0.08))",
              border: "1px solid hsl(var(--netflix-red) / 0.3)",
              borderRadius: "12px",
            }}
          >
            <Heart
              size={40}
              className="text-netflix-red fill-netflix-red mx-auto mb-4 animate-pulse-heart"
            />
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
              Para você, Maria Victória
            </h2>
            <p className="text-foreground/75 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Cada foto e vídeo que coloquei aqui representa uma parte da minha alma e personalidade
              com você, cada parte do meu eu cru. Você é minha série que maratonarei sempre e o filme
              que assistirei 1 milhão de vezes, especialmente depois dos nossos dias difíceis.
              <br /><br />
              Eu te amo, meu amor 🤍
            </p>
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              {["❤️ Te amo", "🥰 Você é incrível", "✨ Minha favorita", "💫 Para sempre"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-netflix-red/20 text-netflix-red border border-netflix-red/30 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border px-6 md:px-12 py-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-display text-netflix-red text-2xl">LOVEFLIX</span>
          <Heart size={14} className="text-netflix-red fill-netflix-red" />
        </div>
        <p className="text-muted-foreground text-xs text-center">
          Feito com ❤️ especialmente para você · {new Date().getFullYear()}
        </p>
        <p className="text-muted-foreground text-xs text-right mt-2">
          Paulo Victor
        </p>
      </footer>
    </div>
  );
}
