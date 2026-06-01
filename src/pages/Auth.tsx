import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";
import { toast } from "sonner";

type Username = "mavi" | "paulo";
const emailFor = (u: Username) => `${u}@loveflix.app`;

export default function Auth() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState<Username>("mavi");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);

  if (loading) return null;
  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres");
      return;
    }
    setBusy(true);
    const email = emailFor(username);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        const uid = data.user?.id;
        if (uid) {
          const { error: pErr } = await supabase
            .from("profiles")
            .insert({ id: uid, username });
          if (pErr && !pErr.message.includes("duplicate")) throw pErr;
        }
        toast.success(`Conta criada para ${username === "mavi" ? "Mavi" : "Paulo"} 🤍`);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(`Bem-vindo(a), ${username === "mavi" ? "Mavi" : "Paulo"} 🤍`);
      }
    } catch (err: any) {
      const msg = err?.message ?? "Erro inesperado";
      if (msg.toLowerCase().includes("already")) {
        toast.error("Esse usuário já existe. Use 'Entrar' no lugar.");
      } else if (msg.toLowerCase().includes("invalid")) {
        toast.error("Usuário ou senha incorretos");
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-dark text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-netflix-card border border-border rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <span className="font-display text-netflix-red text-4xl tracking-wider">LOVEFLIX</span>
          <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
            <Heart size={12} className="text-netflix-red fill-netflix-red" /> Só pra Mavi e Paulo
          </p>
        </div>

        <div className="flex bg-background/40 rounded-lg p-1 mb-5">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm rounded-md transition-colors ${
              mode === "login" ? "bg-netflix-red text-foreground" : "text-muted-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm rounded-md transition-colors ${
              mode === "signup" ? "bg-netflix-red text-foreground" : "text-muted-foreground"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Quem é você?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["mavi", "paulo"] as Username[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUsername(u)}
                  className={`py-3 rounded-lg border transition-all ${
                    username === u
                      ? "border-netflix-red bg-netflix-red/10 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {u === "mavi" ? "Mavi" : "Paulo"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-background/60 text-foreground rounded-lg px-3 py-2.5 outline-none border border-border focus:border-netflix-red transition-colors"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-netflix-red hover:bg-netflix-red/90 disabled:opacity-60 text-foreground font-semibold py-2.5 rounded-lg transition-colors"
          >
            {busy ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-[10px] text-muted-foreground text-center mt-5">
          Paulo Victor
        </p>
      </div>
    </div>
  );
}
