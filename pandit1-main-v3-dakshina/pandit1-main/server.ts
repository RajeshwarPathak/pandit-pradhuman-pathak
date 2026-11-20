import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '32kb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const rateBuckets = new Map<string, number[]>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const timestamps = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    const oldest = timestamps[0];
    return { allowed: false, retryAfterSec: Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000) };
  }
  timestamps.push(now);
  rateBuckets.set(ip, timestamps);
  return { allowed: true, retryAfterSec: 0 };
}

const SYSTEM_INSTRUCTION = `You are the revered Vedic Puja Samagri, Dakshina & Budget Advisor for Pandit Pradhuman Pathak (पंडित प्रद्युम्न पाठक), a Vedic Priest with 55+ years of experience based in Bin Toli, Bara Telpa, Chapra, Bihar (Pin: 841302). Contact: +91 98529 38708.

Your Sacred Responsibility:
1. PUJA SAMAGRI INQUIRIES: Provide accurate, itemized lists of Puja Samagri (पूजा सामग्री) with precise quantities for any Hindu ceremony requested (Satyanarayan Katha, Griha Pravesh & Vastu, Vivah Sanskar, Rudrabhishek, Kaal Sarp Shanti, Namkaran, Antim Sanskar, Mahalakshmi Pujan, etc.).
2. PUJA SAMAGRI AMOUNT & PRICE: Give realistic approximate price ranges in Indian Rupees (₹) for buying Samagri in Chapra local markets (Bara Telpa bazaar, Bhagwan Bazar, Sahebganj):
   - Satyanarayan Puja Samagri: Approx ₹400 - ₹900
   - Griha Pravesh & Vastu Shanti Samagri: Approx ₹1,800 - ₹3,500
   - Vivah Sanskar (Wedding) Samagri: Approx ₹3,500 - ₹7,000
   - Rudrabhishek Samagri: Approx ₹800 - ₹1,500
   - Navagraha / Shanti Havan: Approx ₹1,200 - ₹2,500
3. DAKSHINA GUIDANCE (दक्षिणा व्यवस्था): Explain with dignity that Vedic tradition honors the devotee's devotion and means ("यजमान की श्रद्धा एवं सामर्थ्य अनुसार दक्षिणा") with zero hidden demands.
4. LOCAL REGIONAL ACCESSIBILITY: Pandit Ji visits homes in Chapra city (Bara Telpa, Dahiyawan, Bhagwan Bazar, Rajendra Sarovar) as well as across Saran district (Revelganj, Ekma, Marhaura, Dighwara, Sonepur).
5. TONE & MANNER: Respectful, scholarly, pious, and encouraging. Begin with "प्रणाम यजमान" or "ॐ नमः शिवाय / जय श्री राम". Offer to connect directly via WhatsApp or Phone (+91 98529 38708) to finalize dates and Muhurat.`;

app.post('/api/chat', async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const rate = checkRateLimit(clientIp);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSec));
    return res.status(429).json({
      error: 'Too many requests. Please wait a few minutes or contact Pandit Ji at +91 98529 38708.',
    });
  }

  try {
    const { messages, language = 'hi' } = req.body ?? {};
    const safeLang = language === 'en' ? 'en' : 'hi';

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chat service is temporarily unavailable.',
      });
    }

    const formattedContents = messages
      .slice(-20)
      .filter(
        (m: unknown): m is { role: string; content: string } =>
          Boolean(m && typeof (m as { content?: unknown }).content === 'string')
      )
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content.trim().slice(0, 1000) }],
      }))
      .filter((m) => m.parts[0].text.length > 0);

    if (formattedContents.length === 0) {
      return res.status(400).json({ error: 'No valid messages provided.' });
    }

    const langInstruction =
      safeLang === 'hi'
        ? 'Please reply in pure, polite Hindi (Devanagari script) with clear formatting.'
        : 'Please reply in polite English with Sanskrit/Hindi ritual terms explained clearly.';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nLanguage Preference: ${langInstruction}`,
      },
    });

    const reply =
      response.text || 'क्षमा करें, उत्तर प्राप्त नहीं हो सका। कृपया पुनः प्रयास करें।';
    return res.json({ reply });
  } catch (error) {
    console.error('Gemini Chat API Error:', error);
    return res.status(500).json({
      error: 'Unable to generate a response right now. Please try again shortly.',
    });
  }
});

app.get('/api/maps-key', (_req, res) => {
  const apiKey =
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GMP_KEY ||
    '';
  res.json({ apiKey });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
