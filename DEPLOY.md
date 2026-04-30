# TradeMaster Pro — Kostenlos veröffentlichen

## Schritt 1: GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Repository-Name: `trademaster-pro` (oder beliebig)
3. Klicke "Create repository"
4. In diesem Ordner ausführen:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN_NAME/trademaster-pro.git
git push -u origin main
```

> ⚠️ `.env.local` wird NICHT hochgeladen (steht in `.gitignore`) — das ist gut, Passwörter bleiben lokal!

---

## Schritt 2: Supabase einrichten (Datenbank + Auth)

1. Gehe zu https://supabase.com → "Start your project" → Kostenloses Konto
2. Neues Projekt erstellen (Name: `trademaster`, Region: Europe West)
3. Warte 1-2 Minuten bis das Projekt bereit ist
4. Gehe zu: **SQL Editor** → "New query"
5. Kopiere den Inhalt aus `supabase/schema.sql` und führe ihn aus (Run)
6. Gehe zu: **Settings → API**
7. Kopiere:
   - `URL` → das ist dein `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` Key → das ist dein `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Schritt 3: Vercel deployen (kostenlos, automatisch)

1. Gehe zu https://vercel.com → "Sign up" mit GitHub
2. Klicke "New Project" → Wähle dein `trademaster-pro` Repository
3. Klicke **"Environment Variables"** und füge hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL` = (dein Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (dein Supabase Anon Key)
4. Klicke "Deploy"
5. In ~2 Minuten ist deine App live unter: `https://trademaster-pro.vercel.app`

---

## Fertig! 🚀

Deine App ist jetzt:
- ✅ Online erreichbar für alle
- ✅ Kostenlos (Vercel Free + Supabase Free Tier)
- ✅ Mit echten Benutzerkonten
- ✅ Mit Bestenliste
- ✅ Mit Freundessystem
- ✅ Optimiert für iPad & Desktop

---

## Ohne Supabase (Offline-Modus)

Die App funktioniert auch ohne Supabase konfiguriert:
- Trading, Portfolio, Lernen → alles lokal gespeichert
- Registrierung/Login zeigt Fehler, aber man kann ohne Account spielen
- Bestenliste und Freunde zeigen dann nur lokale Daten

---

## Updates deployen

Einfach committen und pushen:
```bash
git add .
git commit -m "Neue Funktion"
git push
```
Vercel deployed automatisch binnen 1-2 Minuten.
