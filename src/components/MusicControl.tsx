import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import song from "@/assets/anniversary/one-year-song.mp3.asset.json";

export function MusicControl() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      toast.error("Não foi possível tocar a música");
    }
  };

  return (
    <>
      <audio ref={audioRef} src={song.url} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => void toggle()}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        aria-pressed={playing}
        title={playing ? "Pausar música" : "Tocar música"}
        className="shrink-0 text-foreground hover:text-primary"
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </Button>
    </>
  );
}