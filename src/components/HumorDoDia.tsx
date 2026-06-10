import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check } from "lucide-react";

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

type Mood = { id: string; name: string; image: string; ring: string };

const moods: Mood[] = [
  { id: "felizinha", name: "Felizinha", image: imgFelizinha, ring: "#F5B82E" },
  { id: "quero-dengo", name: "Quero Dengo", image: imgQueroDengo, ring: "#E84C7A" },
  { id: "esportista", name: "Esportista", image: imgEsportista, ring: "#2DBE7C" },
  { id: "brabinha", name: "Brabinha", image: imgBrabinha, ring: "#E84545" },
  { id: "soninho", name: "Soninho", image: imgSoninho, ring: "#4A90E2" },
  { id: "saudades", name: "Saudades", image: imgSaudades, ring: "#7B5BD9" },
  { id: "fominha", name: "Fominha", image: imgFominha, ring: "#F58A3F" },
  { id: "cansadinha", name: "Cansadinha", image: imgCansadinha, ring: "#3D5A80" },
  { id: "energetica", name: "Energética", image: imgEnergetica, ring: "#F2994A" },
  { id: "estudantinha", name: "Estudantinha", image: imgEstudantinha, ring: "#558B2F" },
  { id: "dramatica", name: "Dramática", image: imgDramatica, ring: "#9B5DE5" },
  { id: "surtada", name: "Surtada", image: imgSurtada, ring: "#FF4FA3" },
  { id: "tristinha", name: "Tristinha", image: imgTristinha, ring: "#6B8FB3" },
  { id: "emburrada", name: "Emburrada", image: imgEmburrada, ring: "#C45C7C" },
];

const moodById = (id: string) => moods.find((m) => m.id === id);

export function HumorDoDia() {
  const { username } = useAuth();
  const isMavi = username === "mavi";
  const isPaulo = username === "paulo";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [noteUpdatedAt, setNoteUpdatedAt] = useState<string | null>(null);
  const [noteReadAt, setNoteReadAt] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    supabase
      .from("mood_state")
      .select("selected_ids, note, note_updated_at, note_read_at")
      .eq("id", "current")
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setSelectedIds(data.selected_ids ?? []);
          setNote(data.note ?? "");
          setNoteUpdatedAt(data.note_updated_at ?? null);
          setNoteReadAt(data.note_read_at ?? null);
        }
      });

    const channel = supabase
      .channel("mood-state")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mood_state" },
        (payload: any) => {
          const row = payload.new;
          if (!row) return;
          setSelectedIds(row.selected_ids ?? []);
          setNoteUpdatedAt(row.note_updated_at ?? null);
          setNoteReadAt(row.note_read_at ?? null);
          // Do not overwrite the note text for Mavi while she is typing/editing,
          // to avoid mobile IME glitches (cursor jumps, swapped characters).
          if (!isMavi) {
            setNote(row.note ?? "");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMavi]);

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

  const markAsRead = async () => {
    const { error } = await supabase
      .from("mood_state")
      .update({ note_read_at: new Date().toISOString() } as any)
      .eq("id", "current");
    if (error) toast.error("Não foi possível marcar como lido");
    else toast.success("Marcado como lido 👍");
  };

  const selected = selectedIds.map(moodById).filter(Boolean) as Mood[];
  const primaryRing = selected[0]?.ring ?? "#E50914";
  const noteIsRead =
    !!noteReadAt && (!noteUpdatedAt || new Date(noteReadAt) >= new Date(noteUpdatedAt));

  return (
    <section className="px-6 md:px-12 mb-12">
      <h2 className="font-display text-foreground text-2xl md:text-3xl mb-5 tracking-wide">
        Humor do Dia
      </h2>

      <div
        className="rounded-3xl p-5 md:p-8 transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${primaryRing}22, hsl(var(--netflix-card)))`,
          border: `1px solid ${primaryRing}55`,
        }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          {selected.length === 0 ? (
            <p className="text-foreground/70 text-sm">
              {isMavi ? "Toca em um ou mais humores abaixo 🤍" : "Mavi ainda não escolheu o humor de hoje 🤍"}
            </p>
          ) : (
            <div className="flex flex-wrap items-start justify-center gap-3 md:gap-4 mb-2">
              {selected.map((m, idx) => (
                <div key={m.id} className="flex flex-col items-center">
                  <div className="relative">
                    <div
                      className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden"
                      style={{ boxShadow: `0 0 0 3px ${m.ring}, 0 10px 25px ${m.ring}55` }}
                    >
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span
                      className="absolute -top-2 -left-2 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-foreground"
                      style={{ backgroundColor: m.ring }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <span className="mt-2 text-xs md:text-sm text-foreground/90 font-semibold">{m.name}</span>
                </div>
              ))}
            </div>
          )}

          <div
            className="mt-5 rounded-2xl p-4 max-w-xl w-full text-left"
            style={{ backgroundColor: `${primaryRing}1c`, border: `1px dashed ${primaryRing}77` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="font-semibold uppercase tracking-widest text-[10px]"
                style={{ color: primaryRing }}
              >
                Recadinho da Mavi pro Paulo
              </span>
              {noteIsRead && (
                <span className="text-[11px] text-green-400 flex items-center gap-1">
                  👍 Paulo leu
                </span>
              )}
            </div>

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
                  autoCorrect="off"
                  autoCapitalize="sentences"
                  spellCheck={false}
                  inputMode="text"
                  className="w-full bg-background/40 text-foreground text-base md:text-sm rounded-xl p-3 outline-none resize-y border border-border focus:border-foreground/40 transition-colors"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>{savingNote ? "Salvando..." : "Salvo automaticamente"}</span>
                  <span>{note.length}/3000</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-foreground/90 text-sm whitespace-pre-wrap leading-relaxed min-h-[3rem]">
                  {note?.trim() ? note : "A Mavi ainda não deixou recado por aqui hoje 🤍"}
                </p>
                {isPaulo && note?.trim() && (
                  <button
                    onClick={markAsRead}
                    disabled={noteIsRead}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
                    style={{
                      backgroundColor: noteIsRead ? "transparent" : primaryRing,
                      color: noteIsRead ? "#4ade80" : "hsl(var(--foreground))",
                      border: noteIsRead ? "1px solid #4ade8055" : "none",
                    }}
                  >
                    {noteIsRead ? <><Check size={14} /> Você já leu</> : <>👍 Marcar como lido</>}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3 md:gap-4 justify-items-center">
          {moods.map((m) => {
            const order = selectedIds.indexOf(m.id);
            const active = order !== -1;
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                disabled={!isMavi}
                className={`flex flex-col items-center gap-1 group ${!isMavi ? "cursor-default" : ""}`}
              >
                <div
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-110"
                  style={{
                    boxShadow: active
                      ? `0 0 0 3px ${m.ring}, 0 8px 20px ${m.ring}66`
                      : `0 4px 12px hsl(0 0% 0% / 0.4)`,
                    opacity: active ? 1 : isMavi ? 0.7 : 0.45,
                  }}
                >
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                  {active && (
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-foreground"
                      style={{ backgroundColor: m.ring }}
                    >
                      {order + 1}
                    </span>
                  )}
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
