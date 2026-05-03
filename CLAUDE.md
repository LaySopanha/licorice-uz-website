# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (0 warnings allowed)
```

## Environment setup

Copy `.env.example` to `.env` and fill in Firebase + EmailJS values before running locally.

## Architecture

Multi-page React app (Vite + React 18 + react-router-dom v6). Routes:

| Path | Page |
|------|------|
| `/` | Home — Hero, 4 featured products, About snippet, Certificates, Partners, Gallery |
| `/products` | Full product grid |
| `/products/:slug` | Individual product detail + related products |
| `/about` | About + Certificates |
| `/contact` | Contact form |
| `/admin/login` | Firebase Auth login |
| `/admin` | Admin dashboard (protected) |

Admin pages are lazy-loaded (`React.lazy`).

## Data flow

**Two contexts wrap the app** (`src/main.jsx`):

1. **`LanguageContext`** (`src/context/LanguageContext.jsx`) — static UI strings (nav, buttons, form labels, error messages). Supports `ru` (default) and `en`. Use `const { t, language } = useLanguage()`.

2. **`ContentContext`** (`src/context/ContentContext.jsx`) — dynamic content from Firestore (products, hero text, contact info). Falls back to seed data if Firestore is unavailable. Use `const { products, featuredProducts, settings } = useContent()`. The context re-maps product `title`/`description` fields to the current language automatically.

**Adding new UI strings**: add keys to both `ru` and `en` objects in `LanguageContext`.

**Editing dynamic content**: use the admin panel at `/admin` — changes write to Firestore and are live immediately.

## Firebase

- `src/firebase/config.js` — initializes app, exports `db`, `storage`, `auth`
- `src/firebase/firestore.js` — all Firestore helpers + `SEED_PRODUCTS` / `SEED_SETTINGS` defaults

**Firestore collections:**
- `/products/{slug}` — product documents (title_ru, title_en, desc_ru, desc_en, image, order, featured)
- `/settings/main` — hero text, contact info, social handles

**Firebase project setup** (one-time):
1. Create project at console.firebase.google.com
2. Enable Firestore, Storage, and Authentication (Email/Password)
3. Create one admin user in Firebase Console → Authentication
4. Copy SDK config to `.env`
5. Go to `/admin`, log in, go to Database tab → "Seed from defaults"

## Email (EmailJS)

`src/services/emailService.js` handles two flows:
- `sendContactEmail(formData, language)` — sends to business + auto-reply to user
- `sendPriceInquiryEmail(formData, language)` — same

**Auto-reply setup**: create a second template in EmailJS dashboard where `To Email = {{to_email}}`. Add its ID to `.env` as `VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID`.

## Config file

`src/config.js` — EmailJS credentials and fallback contact info. Firestore settings override these at runtime; config.js is the last-resort default.

## Design tokens

- Primary: `#515E3B` (olive green)
- Secondary: `#F5F4F0` (beige)
- Font: Poppins
- Each component has its own `.css` file co-located in `src/components/`
- Page-level styles in `src/pages/*.css`
- Global variables and resets in `src/index.css`
