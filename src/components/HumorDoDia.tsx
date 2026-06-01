import { useState } from "react";

type Mood = {
  id: string;
  emoji: string;
  name: string;
  color: string; // hex/hsl background tint
  ring: string; // ring color
  description: string;
  tips: string;
};

const moods: Mood[] = [
  {
    id: "feliz",
    emoji: "😊",
    name: "Radiante",
    color: "#FFD978",
    ring: "#F5B82E",
    description: "Aquele dia em que tudo dá certo, com sorriso de canto de boca e energia de sobra.",
    tips: "Aproveita pra mandar áudio fofo, marcar um date e me chamar de 'meu amor' várias vezes 💛",
  },
  {
    id: "apaixonada",
    emoji: "🥰",
    name: "Apaixonadinha",
    color: "#FFB5C5",
    ring: "#E84C7A",
    description: "Modo carinho ativado: quer abraço, quer beijinho, quer ficar grudada igual chiclete.",
    tips: "Hora perfeita pra um filme juntinhos, colo e muita massagem nos cachos 💗",
  },
  {
    id: "atleta",
    emoji: "🎾",
    name: "Atleta Imparável",
    color: "#A8E6CF",
    ring: "#2DBE7C",
    description: "Tênis, vôlei, corrida, academia… tá pronta pra arrebentar e ainda sobrar energia.",
    tips: "Te apoio do lado de fora torcendo e gravando os melhores pontos 🏐",
  },
  {
    id: "manhosa",
    emoji: "🥺",
    name: "Manhosinha",
    color: "#E0BBE4",
    ring: "#9B5DE5",
    description: "Voz fininha, biquinho, olhar pidão. Quer mimo, comida e atenção em dose dupla.",
    tips: "Resposta certa: 'pode pedir tudo, meu amor'. E um docinho resolve metade 🍫",
  },
  {
    id: "brava",
    emoji: "😤",
    name: "Brabinha",
    color: "#FFB3A7",
    ring: "#E84545",
    description: "Cuidado: tá com pavio curto, monossílabos e cara fechada. Mas no fundo só quer carinho.",
    tips: "Escuta sem interromper, pede desculpa mesmo sem culpa e abraça forte 🤍",
  },
  {
    id: "preguicosa",
    emoji: "😴",
    name: "Modo Cobertor",
    color: "#B8D8F8",
    ring: "#4A90E2",
    description: "Só quer cama, manta, série e nada de responsabilidade hoje, por favor.",
    tips: "Maratona, cabeça no seu peito e zero cobrança. Dia oficial de não fazer nada juntos 🛋️",
  },
  {
    id: "diva",
    emoji: "💅",
    name: "Diva Suprema",
    color: "#FFC8DD",
    ring: "#FF4FA3",
    description: "Arrumadíssima, perfumada, confiante. Tá linda e sabe disso (e eu também sei).",
    tips: "Elogia muito, tira mil fotos e leva pra um lugar à altura 📸✨",
  },
  {
    id: "saudade",
    emoji: "🥹",
    name: "Saudosa",
    color: "#D4B5F9",
    ring: "#7B5BD9",
    description: "Tá sentindo sua falta de longe, querendo videochamada e mensagem a cada 10 minutos.",
    tips: "Manda foto, áudio fofo e marca o próximo encontro o quanto antes 💌",
  },
  {
    id: "fominha",
    emoji: "🍔",
    name: "Modo Fominha",
    color: "#FFD3A5",
    ring: "#F58A3F",
    description: "Tá com fome de tudo: hambúrguer, açaí, doce, salgado, japa… e logo!",
    tips: "Pede iFood sem perguntar muito, ou já marca um restaurante. Comida resolve 🍣",
  },
  {
    id: "filosofa",
    emoji: "🌙",
    name: "Pensativa",
    color: "#B5C7E0",
    ring: "#3D5A80",
    description: "Modo madrugada filosófica: pensando na vida, no futuro, em nós e em tudo.",
    tips: "Senta junto, escuta com atenção e diz que tá com ela em qualquer plano 🌌",
  },
  {
    id: "festeira",
    emoji: "🎉",
    name: "Festeira",
    color: "#FFE066",
    ring: "#F2994A",
    description: "Música alta, vontade de sair, dançar e curtir a vida com os amigos.",
    tips: "Embarca na vibe, dança feio com ela e tira foto de tudo 🕺",
  },
  {
    id: "cienciuda",
    emoji: "📚",
    name: "Focada nos Estudos",
    color: "#C5E1A5",
    ring: "#558B2F",
    description: "Modo foco total: caderno, fichamento, prova chegando. Não atrapalha.",
    tips: "Leva um café, um abraço silencioso e some até ela chamar 📖☕",
  },
];

export function HumorDoDia() {
  const [selected, setSelected] = useState<Mood>(moods[0]);

  return (
    <section className="px-6 md:px-12 mb-12">
      <h2 className="font-display text-foreground text-2xl md:text-3xl mb-1 tracking-wide">
        Humor do Dia
      </h2>
      <p className="text-muted-foreground text-sm mb-5">
        Como minha Mavi tá se sentindo hoje? Toca pra descobrir 💗
      </p>

      <div
        className="rounded-3xl p-5 md:p-8 transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${selected.color}33, hsl(var(--netflix-card)))`,
          border: `1px solid ${selected.ring}55`,
        }}
      >
        {/* Selected mood big card */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-5xl md:text-6xl mb-3 transition-all duration-500"
            style={{
              backgroundColor: selected.color,
              boxShadow: `0 0 0 6px ${selected.ring}33, 0 12px 30px ${selected.ring}55`,
            }}
          >
            {selected.emoji}
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-foreground tracking-wide">
            {selected.name}
          </h3>
          <p className="text-foreground/80 text-sm md:text-base max-w-md mt-2 leading-relaxed">
            {selected.description}
          </p>
          <div
            className="mt-4 rounded-2xl px-4 py-3 text-xs md:text-sm text-foreground/90 max-w-md"
            style={{ backgroundColor: `${selected.ring}22`, border: `1px dashed ${selected.ring}77` }}
          >
            <span className="font-semibold uppercase tracking-widest text-[10px] block mb-1" style={{ color: selected.ring }}>
              Modo Paulo
            </span>
            {selected.tips}
          </div>
        </div>

        {/* Mood grid (Clue style circles) */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4 justify-items-center">
          {moods.map((m) => {
            const active = m.id === selected.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: m.color,
                    boxShadow: active
                      ? `0 0 0 3px ${m.ring}, 0 8px 20px ${m.ring}66`
                      : `0 4px 12px hsl(0 0% 0% / 0.4)`,
                    opacity: active ? 1 : 0.85,
                  }}
                >
                  {m.emoji}
                </div>
                <span
                  className="text-[10px] md:text-xs text-center leading-tight transition-colors"
                  style={{ color: active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
                >
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
