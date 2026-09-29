import { FormEvent, useCallback, useEffect, useState } from "react";
import { Film, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Movie = { id: string; title: string; added_by: string; created_at: string };

export function ListaDeFilmes() {
  const { user, username } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    const { data, error } = await supabase
      .from("movie_list")
      .select("id, title, added_by, created_at")
      .order("created_at", { ascending: true });
    if (error) toast.error("Não foi possível carregar a lista de filmes");
    else setMovies(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadMovies();
    const channel = supabase
      .channel("shared-movie-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "movie_list" }, () => {
        void loadMovies();
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [loadMovies]);

  const addMovie = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !user || !username || working) return;
    setWorking(true);
    const { error } = await supabase.from("movie_list").insert({ title: trimmed, added_by: user.id });
    if (error) toast.error("Não foi possível adicionar o filme");
    else {
      setTitle("");
      await loadMovies();
    }
    setWorking(false);
  };

  const removeMovie = async (id: string) => {
    if (removingId) return;
    setRemovingId(id);
    const { error } = await supabase.from("movie_list").delete().eq("id", id);
    if (error) toast.error("Não foi possível remover o filme");
    else await loadMovies();
    setRemovingId(null);
  };

  return (
    <section className="px-6 md:px-12 mb-12 scroll-mt-28" aria-labelledby="movie-list-heading">
      <div className="flex items-center gap-3 mb-5">
        <h2 id="movie-list-heading" className="font-display text-foreground text-2xl md:text-3xl">Lista de Filmes</h2>
        <span className="text-muted-foreground text-sm">{movies.length}</span>
      </div>
      <form onSubmit={addMovie} className="flex flex-col sm:flex-row gap-2 max-w-2xl mb-6">
        <label htmlFor="movie-title" className="sr-only">Nome do filme</label>
        <input
          id="movie-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          placeholder="Qual filme vamos assistir?"
          className="h-11 w-full min-w-0 rounded bg-card border border-border px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={!title.trim() || working || !username} className="h-11 shrink-0">
          <Plus aria-hidden="true" /> Adicionar
        </Button>
      </form>

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando filmes...</p>
      ) : movies.length === 0 ? (
        <div className="flex items-center gap-3 border-t border-border py-6 text-muted-foreground text-sm">
          <Film size={20} aria-hidden="true" /> Nenhum filme na lista ainda.
        </div>
      ) : (
        <ul className="max-w-2xl divide-y divide-border border-t border-b border-border">
          {movies.map((movie, index) => (
            <li key={movie.id} className="flex items-center gap-4 py-3 min-h-14">
              <span className="w-6 shrink-0 text-sm text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 break-words text-foreground text-sm sm:text-base">{movie.title}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={`Remover ${movie.title}`}
                aria-label={`Remover ${movie.title}`}
                disabled={removingId === movie.id}
                onClick={() => void removeMovie(movie.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}