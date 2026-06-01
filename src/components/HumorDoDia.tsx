import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import imgFelizinha from "@/assets/moods/felizinha.jpg";
import imgQueroDengo from "@/assets/moods/quero-dengo.png";
import imgSoninho from "@/assets/moods/soninho.jpg";
import imgSaudades from "@/assets/moods/saudades.jpg";
import imgFominha from "@/assets/moods/fominha.jpg";
import imgCansadinha from "@/assets/moods/cansadinha.png";
import imgEnergetica from "@/assets/moods/energetica.jpg";
import imgEstudantinha from "@/assets/moods/estudantinha.jpg";
import imgEsportista from "@/assets/moods/esportista.jpg";
import imgBrabinha from "@/assets/moods/brabinha.png";
import imgDramatica from "@/assets/moods/dramatica.jpg";
import imgSurtada from "@/assets/moods/surtada.jpg";
import imgTristinha from "@/assets/moods/tristinha.jpg";
import imgEmburrada from "@/assets/moods/emburrada.jpg";

type Mood = {
  id: string;
  name: string;
  image: string;
  color: string;
  ring: string;
  description: string;
};

const moods: Mood[] = [
  { id: "felizinha", name: "Felizinha", image: imgFelizinha, color: "#FFD978", ring: "#F5B82E", description: "Aquele dia em que tudo dá certo, com sorriso de canto de boca e energia de sobra." },
  { id: "quero-dengo", name: "Quero Dengo", image: imgQueroDengo, color: "#FFB5C5", ring: "#E84C7A", description: "Voz fininha, biquinho, olhar pidão. Quer mimo, colo e atenção em dose dupla." },
  { id: "esportista", name: "Esportista", image: imgEsportista, color: "#A8E6CF", ring: "#2DBE7C", description: "Tênis, vôlei, corrida, academia… tá pronta pra arrebentar e ainda sobrar energia." },
  { id: "brabinha", name: "Brabinha", image: imgBrabinha, color: "#FFB3A7", ring: "#E84545", description: "Cuidado: pavio curto, monossílabos e cara fechada. No fundo só quer carinho." },
  { id: "soninho", name: "Soninho", image: imgSoninho, color: "#B8D8F8", ring: "#4A90E2", description: "Só quer cama, manta, série e nada de responsabilidade hoje, por favor." },
  { id: "saudades", name: "Saudades", image: imgSaudades, color: "#D4B5F9", ring: "#7B5BD9", description: "Tá sentindo sua falta de longe, querendo videochamada e mensagem a cada 10 minutos." },
  { id: "fominha", name: "Fominha", image: imgFominha, color: "#FFD3A5", ring: "#F58A3F", description: "Tá com fome de tudo: hambúrguer, açaí, doce, salgado, japa… e logo!" },
  { id: "cansadinha", name: "Cansadinha", image: imgCansadinha, color: "#B5C7E0", ring: "#3D5A80", description: "Bateria no zero, só quer descansar e ser cuidada hoje." },
  { id: "energetica", name: "Energética", image: imgEnergetica, color: "#FFE066", ring: "#F2994A", description: "Energia lá em cima! Música alta, vontade de dançar e curtir a vida." },
  { id: "estudantinha", name: "Estudantinha", image: imgEstudantinha, color: "#C5E1A5", ring: "#558B2F", description: "Modo foco total: caderno, fichamento, prova chegando. Não atrapalha." },
  { id: "dramatica", name: "Dramática", image: imgDramatica, color: "#E0BBE4", ring: "#9B5DE5", description: "Tudo é o fim do mundo hoje. Novela mexicana ativada, mão na testa." },
  { id: "surtada", name: "Surtada", image: imgSurtada, color: "#FFC8DD", ring: "#FF4FA3", description: "Olhos arregalados, mil coisas na cabeça, energia caótica no talo." },
  { id: "tristinha", name: "Tristinha", image: imgTristinha, color: "#B8D4E8", ring: "#6B8FB3", description: "Coraçãozinho apertado, sem muito ânimo. Precisa de abraço apertado." },
  { id: "emburrada", name: "Emburrada", image: imgEmburrada, color: "#F8C8D8", ring: "#C45C7C", description: "Cara fechada, biquinho, braços cruzados. Tá sentida e não vai esconder." },
];

export function HumorDoDia() {
  const { username } = useAuth();
  const isMavi = username === "mavi";

  const [selectedIds, setSelectedIds] = useState<string[]>(["felizinha"]);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Initial load
  useEffect(() => {
    supabase
      .from("mood_state")
      .select("selected_ids, note")
      .eq("id", "current")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSelectedIds(data.selected_ids?.length ? data.selected_ids : ["felizinha"]);
          setNote(data.note ?? "");
        }
      });

    // Realtime
    const channel = supabase
      .channel("mood-state")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mood_state" },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          setSelectedIds(row.selected_ids?.length ? row.selected_ids : ["felizinha"]);
          setNote(row.note ?? "");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const persistMoods = async (ids: string[]) => {
    const { error } = await supabase
      .from("mood_state")
      .update({ selected_ids: ids, updated_at: new Date().toISOString() })
      .eq("id", "current");
    if (error) toast.error("Não foi possível salvar o humor");
  };

  const toggle = (id: string) => {
    if (!isMavi) return;
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setSelectedIds(next);
    persistMoods(next);
  };

  // Debounced save for the note
  useEffect(() => {
    if (!isMavi) return;
    setSavingNote(true);
    const t = setTimeout(async () => {
      const { error } = await supabase
        .from("mood_state")
        .update({ note, updated_at: new Date().toISOString() })
        .eq("id", "current");
      setSavingNote(false);
      if (error) toast.error("Não foi possível salvar o recadinho");
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, isMavi]);

  const selected = moods.filter((m) => selectedIds.includes(m.id));
  const primary = selected[0] ?? moods[0];

  return (
    <section className="px-6 md:px-12 mb-12">
      <h2 className="font-display text-foreground text-2xl md:text-3xl mb-5 tracking-wide">
        Humor do Dia
      </h2>

      <div
        className="rounded-3xl p-5 md:p-8 transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${primary.color}33, hsl(var(--netflix-card)))`,
          border: `1px solid ${primary.ring}55`,
        }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          {selected.length === 0 ? (
            <p className="text-foreground/70 text-sm">
              {isMavi ? "Toca em um ou mais humores abaixo 🤍" : "Mavi ainda não escolheu o humor de hoje 🤍"}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                {selected.map((m) => (
                  <div key={m.id} className="flex flex-col items-center">
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden transition-all duration-500"
                      style={{ boxShadow: `0 0 0 4px ${m.ring}, 0 12px 30px ${m.ring}55` }}
                    >
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="mt-2 text-xs md:text-sm text-foreground/90 font-semibold">{m.name}</span>
                  </div>
                ))}
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
                {selected.map((m) => m.name).join(" + ")}
              </h3>
              <p className="text-foreground/80 text-sm md:text-base max-w-md mt-2 leading-relaxed">
                {primary.description}
              </p>
            </>
          )}

          <div
            className="mt-5 rounded-2xl p-4 max-w-xl w-full text-left"
            style={{ backgroundColor: `${primary.ring}1c`, border: `1px dashed ${primary.ring}77` }}
          >
            <span
              className="font-semibold uppercase tracking-widest text-[10px] block mb-1"
              style={{ color: primary.ring }}
            >
              Recadinho da Mavi pro Paulo
            </span>
            {isMavi ? (
              <>
                <p className="text-foreground/70 text-[11px] md:text-xs mb-2 leading-relaxed">
                  Mavi, escreve aqui pro Paulo como ele deve te tratar e falar com você hoje, o que esperar de você e sugestões do que ele pode fazer. Ele vai ler 🤍
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 3000))}
                  placeholder="Hoje eu tô assim... me trata com... pode fazer..."
                  maxLength={3000}
                  rows={5}
                  className="w-full bg-background/40 text-foreground text-sm rounded-xl p-3 outline-none resize-y border border-border focus:border-foreground/40 transition-colors"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{savingNote ? "Salvando..." : "Salvo automaticamente"}</span>
                  <span>{note.length}/3000</span>
                </div>
              </>
            ) : (
              <p className="text-foreground/90 text-sm whitespace-pre-wrap leading-relaxed min-h-[3rem]">
                {note?.trim() ? note : "A Mavi ainda não deixou recado por aqui hoje 🤍"}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3 md:gap-4 justify-items-center">
          {moods.map((m) => {
            const active = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                disabled={!isMavi}
                className={`flex flex-col items-center gap-1 group ${
                  !isMavi ? "cursor-default" : ""
                }`}
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110"
                  style={{
                    boxShadow: active
                      ? `0 0 0 3px ${m.ring}, 0 8px 20px ${m.ring}66`
                      : `0 4px 12px hsl(0 0% 0% / 0.4)`,
                    opacity: active ? 1 : isMavi ? 0.75 : 0.5,
                  }}
                >
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
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

        {!isMavi && (
          <p className="text-center text-[11px] text-muted-foreground mt-5">
            Só a Mavi pode mudar o humor e o recadinho 🤍
          </p>
        )}
      </div>
    </section>
  );
}
