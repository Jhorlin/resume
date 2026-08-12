import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

// Dev serves HTTPS (the chat widget wants a secure context). Certs are
// self-signed, local-only, gitignored; regenerate with:
//   openssl req -x509 -newkey rsa:2048 -sha256 -days 825 -nodes \
//     -keyout .certs/localhost-key.pem -out .certs/localhost-cert.pem \
//     -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
// Falls back to plain HTTP when the certs are absent (CI, fresh clones).
const certDir = path.resolve(import.meta.dirname, ".certs");
const key = path.join(certDir, "localhost-key.pem");
const cert = path.join(certDir, "localhost-cert.pem");
const https =
  fs.existsSync(key) && fs.existsSync(cert)
    ? { key: fs.readFileSync(key), cert: fs.readFileSync(cert) }
    : undefined;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: { port: 5174, strictPort: true, https },
});
