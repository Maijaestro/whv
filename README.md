# WHV — Wallbrechts Haus Visualisierung

Kurzes Starter-Repository mit Vue 3 + TypeScript, Vite und Basis-Stubs.

Schnellstart:

1. Node.js installieren (≥18 empfohlen)
2. Im Projektverzeichnis:

```bash
npm install
npm run dev
```
Oder kombiniert (Frontend + Server):

```bash
# startet Vite (Frontend) im Dev-Modus
npm run dev
```

Was ich erstellt habe (erste Stubs):
- Router mit Tabs: Start, Erdgeschoss, Obergeschoss, Kameras, Links, Einstellungen
- Basis-Komponenten in `src/components`
- `src/services/iobrokerService.ts` als Komfort-Wrapper (read/write)
- Pinia-Store `src/store/notifications.ts` mit Beispielstrukturen
- Basis-Styles in `src/styles/variables.css`

Noch vom Nutzer lokal auszuführen / zu konfigurieren:
- `npm install` (abhängigkeiten)
- Fonts ggf. lokal hinzufügen (Empfehlung: `Inter` von Google Fonts oder System-Fallbacks)
- Server für Einstellungen starten: `node server/index.js` (oder Prozessmanager, Port 3001)

Deployment:
- `scripts/deploy.sh` ist ein einfaches Pull/Restart-Skript (muss evtl. angepasst werden)
