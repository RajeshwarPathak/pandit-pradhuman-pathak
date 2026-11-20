# पंडित प्रद्युम्न पाठक — Vedic Priest Website (Chapra, Bihar)

Official bilingual (Hindi / English) website for **Pandit Pradhuman Pathak**, Vedic Priest & Jyotish Acharya with **55+ years of Vedic tradition**, serving families across Chapra and Saran district, Bihar.

*Made by his grandson Raj Pathak.*

## Features

- **Bilingual Hindi & English UI:** Instant language toggle (`हिं | EN`) with automatic `<html lang>` updates.
- **Puja & Sanskar Catalog:** 10 Vedic services (Satyanarayan Katha, Griha Pravesh & Vastu Shanti, Vivah Sanskar, Namkaran & Annaprashan, Antim Sanskar, Navagraha & Kaal Sarp Shanti, Janm Kundali, Gemstone Advice, Business Naming, and Shubh Muhurat) with category filters and itemized Samagri checklists.
- **Structured WhatsApp Booking:** Pre-filled Hindi/English WhatsApp inquiry builder with live message preview and one-click copy.
- **AI Samagri & Dakshina Advisor (`/api/chat`):** Vercel Serverless Function powered by `gemini-2.5-flash` with per-IP rate limiting and payload validation.
- **Google Maps Location Card:** Displays Bin Toli, Bara Telpa, Chapra, Bihar (841302) with direct directions and graceful fallback.
- **Performance, SEO & Accessibility:** Cached offscreen canvas sprites for the hero havan animation, responsive WebP portraits (`srcSet`), `LocalBusiness` & `FAQPage` JSON-LD, Open Graph preview (`public/og-image.jpg`), `robots.txt`, `sitemap.xml`, WCAG 2.1 AA modal focus trapping, and 44×44px mobile tap targets.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Maps & AI:** `@vis.gl/react-google-maps`, `@google/genai`
- **Deployment:** Vercel (Static SPA + Serverless Function `api/chat.ts`)

## Local Development

The application source is located in `pandit1-main-v2-10of10/pandit1-main`.

```bash
cd pandit1-main-v2-10of10/pandit1-main
npm install
npm run dev
```

Build and type-check:

```bash
npm run lint
npm run build
```

## Environment Variables

Create a `.env` file locally (or configure in **Vercel → Project Settings → Environment Variables**):

| Variable | Purpose |
| :--- | :--- |
| `GEMINI_API_KEY` | Required for `/api/chat` (AI Puja Samagri & Dakshina Advisor) |
| `VITE_GOOGLE_MAPS_API_KEY` | Required for the embedded Google Map (restrict by HTTP referrer in Google Cloud Console) |

## Deploying on Vercel

1. Import `RajeshwarPathak/pandit-pradhuman-pathak` in Vercel.
2. Set **Root Directory** to `pandit1-main-v2-10of10/pandit1-main`.
3. Add `GEMINI_API_KEY` and `VITE_GOOGLE_MAPS_API_KEY` under **Environment Variables**.
4. Click **Deploy**.

## Contact

- **Phone / WhatsApp:** +91 98529 38708 (7:00 AM – 9:00 PM)
- **Address:** Bin Toli, Bara Telpa, Chapra, Bihar – 841302
- **Service Area:** Chapra, Bara Telpa, Dahiyawan, Bhagwan Bazar, Revelganj, Ekma, Marhaura, Dighwara, Sonepur & Saran District
