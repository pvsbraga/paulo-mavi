import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { Readable } from "node:stream";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && ({
      name: "preview-lovable-assets",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url || !/^\/__l5e\/assets-v1\/[a-f0-9-]+\/[\w.-]+(?:\?.*)?$/.test(req.url)) return next();
          try {
            const response = await fetch(`https://paulo-mavi.lovable.app${req.url}`, {
              headers: req.headers.range ? { range: req.headers.range } : {},
            });
            if (!response.ok || !response.body) return next();
            res.statusCode = response.status;
            for (const header of ["content-type", "content-length", "content-range", "accept-ranges"]) {
              const value = response.headers.get(header);
              if (value) res.setHeader(header, value);
            }
            Readable.fromWeb(response.body as import("node:stream/web").ReadableStream).pipe(res);
          } catch {
            next();
          }
        });
      },
    } satisfies Plugin),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
