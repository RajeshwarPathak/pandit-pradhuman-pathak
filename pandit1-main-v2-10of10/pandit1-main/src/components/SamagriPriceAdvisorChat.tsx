import React, { useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, Send } from 'lucide-react';
import { buildWhatsAppUrl, buildTelUrl } from '../utils/booking.ts';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SamagriPriceAdvisorChatProps {
  initialLanguage?: 'hi' | 'en';
}

const CHAT_STORAGE_KEY = 'pandit1-samagri-chat-v1';
const SAVED_FAQ_STORAGE_KEY = 'pandit1-saved-puja-faqs-v1';

const COMMON_FAQS = [
  {
    id: 'list',
    questionHi: 'पूजा की सामग्री सूची कौन देगा?',
    questionEn: 'Who provides the puja materials list?',
    answerHi: 'पूजा के प्रकार और आपकी व्यवस्था के अनुसार सामग्री सूची साझा की जा सकती है। पहले पूजा और तारीख बताकर पंडित जी से आवश्यक सामग्री की पुष्टि करें।',
    answerEn: 'A materials checklist can be shared based on the ritual and your arrangements. Tell Pandit Ji which puja and date you have in mind so you can confirm the required items.',
  },
  {
    id: 'arrange',
    questionHi: 'क्या सामग्री खुद खरीदनी होगी?',
    questionEn: 'Do I need to buy the puja materials myself?',
    answerHi: 'यह पूजा और आपकी सुविधा पर निर्भर करता है। बुकिंग से पहले पूछ लें कि कौन-सी सामग्री आपको जुटानी है और क्या किसी वस्तु की व्यवस्था पंडित जी करेंगे।',
    answerEn: 'It depends on the ritual and your preference. Before booking, confirm which items you should arrange and whether Pandit Ji can provide any of them.',
  },
  {
    id: 'cost',
    questionHi: 'पूजा सामग्री का खर्च कितना होगा?',
    questionEn: 'How much do puja materials cost?',
    answerHi: 'खर्च पूजा, मात्रा, गुणवत्ता और स्थानीय बाजार भाव के अनुसार बदलता है। कोई भी ऑनलाइन राशि अनुमान मात्र समझें; खरीदने से पहले छपरा के बाजार में कीमत और सामग्री सूची की पुष्टि करें।',
    answerEn: 'Costs vary by ritual, quantities, quality, and current local prices. Treat any online amount as an estimate and confirm the checklist and Chapra market prices before purchasing.',
  },
  {
    id: 'booking',
    questionHi: 'पूजा की बुकिंग के लिए क्या जानकारी दें?',
    questionEn: 'What details are needed to book a puja?',
    answerHi: 'पूजा का नाम, पसंदीदा तारीख या मुहूर्त की आवश्यकता, आपका नाम और पूजा का स्थान बताएं। तारीख तय न हो तो मुहूर्त परामर्श मांग सकते हैं।',
    answerEn: 'Share the puja name, preferred date or whether you need muhurat guidance, your name, and the ceremony location. If your date is undecided, ask for a muhurat consultation.',
  },
  {
    id: 'dakshina',
    questionHi: 'दक्षिणा कैसे तय होती है?',
    questionEn: 'How is dakshina decided?',
    answerHi: 'दक्षिणा पूजा की अवधि, कार्य-क्षेत्र और आपकी श्रद्धा/सामर्थ्य के अनुसार चर्चा से तय करें। बुकिंग से पहले सीधे पंडित जी से स्पष्ट जानकारी लें।',
    answerEn: 'Discuss dakshina directly with Pandit Ji based on the ritual duration, scope, and your means. Please confirm the arrangement before booking.',
  },
];

const timestampNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function readStoredMessages(language: 'hi' | 'en'): ChatMessage[] {
  const welcome: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: language === 'hi'
      ? '🙏 प्रणाम यजमान! मैं पंडित प्रद्युम्न पाठक जी का पूजा सामग्री एवं दक्षिणा परामर्श सहायक हूँ। नीचे सामान्य प्रश्नों पर क्लिक करें या अपना प्रश्न पूछें।'
      : '🙏 Namaste! I’m the puja materials and dakshina assistant for Pandit Pradhuman Pathak. Tap a quick question below or ask your own.',
    timestamp: timestampNow(),
  };
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return [welcome];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [welcome];
    const validMessages = parsed.filter((item): item is ChatMessage =>
      item && typeof item.id === 'string' &&
      (item.role === 'user' || item.role === 'assistant') &&
      typeof item.content === 'string' && typeof item.timestamp === 'string'
    );
    return validMessages.length ? validMessages.slice(-40) : [welcome];
  } catch {
    return [welcome];
  }
}

function readSavedFaqs(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_FAQ_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export const SamagriPriceAdvisorChat: React.FC<SamagriPriceAdvisorChatProps> = ({ initialLanguage = 'hi' }) => {
  const [language, setLanguage] = useState<'hi' | 'en'>(initialLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredMessages(initialLanguage));
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedFaqs, setSavedFaqs] = useState<string[]>(readSavedFaqs);
  const [showFaqCards, setShowFaqCards] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cleanPhone = '919852938708';
  const telUrl = buildTelUrl('+91 98529 38708');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // Ignore storage quota issues
    }
  }, [messages]);

  const toggleSavedFaq = (id: string) => {
    setSavedFaqs((current) => {
      const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id];
      try {
        localStorage.setItem(SAVED_FAQ_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota issues
      }
      return next;
    });
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timestampNow(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            content: message.content,
          })),
          language,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch reply');
      }
      const data = await response.json();
      setMessages((previous) => [...previous, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: timestampNow(),
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setErrorMessage(
        language === 'hi'
          ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। पुनः प्रयास करें या पंडित जी को कॉल करें (+91 98529 38708)।'
          : 'Sorry, I could not get a reply. Please retry or call Pandit Ji at +91 98529 38708.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const languageFaqs = COMMON_FAQS.map((faq) => ({
    id: faq.id,
    question: language === 'hi' ? faq.questionHi : faq.questionEn,
    answer: language === 'hi' ? faq.answerHi : faq.answerEn,
  }));

  return (
    <div className="mx-auto w-full max-w-4xl px-0 sm:px-4 sm:py-4">
      <div className="flex h-[min(750px,calc(100dvh-5rem))] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-[rgba(255,170,60,0.25)] bg-[#1d0b08] shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-[rgba(255,170,60,0.2)] bg-[#140604] p-3 pr-14 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f5b942] to-[#ff7a1a] p-0.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#120706] text-lg" aria-hidden="true">🪔</div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-devanagari text-sm font-bold text-[#f5b942] sm:text-base">
                  {language === 'hi' ? 'पूजा सामग्री, दर एवं दक्षिणा परामर्श' : 'Puja Samagri, Budget & Dakshina Advisor'}
                </h2>
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              </div>
              <p className="truncate text-xs text-[#c9b196]">
                {language === 'hi' ? 'पंडित प्रद्युम्न पाठक · छपरा' : 'Pandit Pradhuman Pathak · Chapra'}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="min-h-[44px] min-w-[44px] rounded-full border border-[#f5b942]/50 px-3 py-2 text-xs font-semibold text-[#f5b942] transition hover:bg-[#f5b942]/10"
            >
              {language === 'hi' ? 'हिं | EN' : 'HI | EN'}
            </button>
            <a
              href={telUrl}
              className="hidden min-h-[44px] items-center gap-1.5 rounded-full bg-[#f5b942] px-4 py-2 text-xs font-bold text-[#120706] transition hover:brightness-110 sm:inline-flex"
            >
              <span aria-hidden="true">📞</span>
              <span>{language === 'hi' ? 'कॉल करें' : 'Call'}</span>
            </a>
          </div>
        </div>

        <div className="shrink-0 border-b border-[rgba(255,170,60,0.15)] bg-[#170705] px-3 py-2 sm:px-4">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#f5b942]">
              {language === 'hi' ? 'त्वरित प्रश्न' : 'Quick Questions'}
            </span>
            <button
              type="button"
              onClick={() => setShowFaqCards((prev) => !prev)}
              aria-expanded={showFaqCards}
              className="min-h-[44px] px-2 text-xs font-semibold text-[#c9b196] underline hover:text-[#f5b942]"
            >
              {showFaqCards
                ? language === 'hi' ? 'उत्तर छिपाएं' : 'Hide answers'
                : language === 'hi' ? 'सामान्य उत्तर देखें' : 'Browse FAQ answers'}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {languageFaqs.map((faq) => (
              <button
                key={faq.id}
                type="button"
                onClick={() => handleSend(faq.question)}
                disabled={isLoading}
                className="shrink-0 min-h-[44px] rounded-full border border-[rgba(255,170,60,0.25)] bg-[#2a110b] px-3.5 py-2 text-left text-xs text-[#f6e9d5] hover:border-[#f5b942] hover:text-[#f5b942] disabled:opacity-50"
              >
                {faq.question}
              </button>
            ))}
          </div>
          {showFaqCards && (
            <div className="mt-2 grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
              {languageFaqs.map((faq) => (
                <article key={faq.id} className="rounded-lg border border-[rgba(255,170,60,0.14)] bg-[#120706]/60 p-2.5">
                  <p className="text-xs font-semibold text-[#f5b942]">{faq.question}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#d9c4ad]">{faq.answer}</p>
                  <button
                    type="button"
                    onClick={() => toggleSavedFaq(faq.id)}
                    className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-xs text-[#c9b196] hover:text-[#f5b942]"
                    aria-pressed={savedFaqs.includes(faq.id)}
                  >
                    {savedFaqs.includes(faq.id) ? <BookmarkCheck size={14} aria-hidden="true" /> : <Bookmark size={14} aria-hidden="true" />}
                    {savedFaqs.includes(faq.id) ? (language === 'hi' ? 'सहेजा गया' : 'Saved') : (language === 'hi' ? 'उत्तर सहेजें' : 'Save answer')}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-[#120706]/70 p-3 sm:p-4">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] rounded-2xl p-3 shadow-md sm:max-w-[78%] sm:p-4 ${
                    isUser
                      ? 'rounded-tr-none bg-gradient-to-r from-[#ff7a1a] to-[#d95d08] font-medium text-[#120706]'
                      : 'rounded-tl-none border border-[rgba(255,170,60,0.2)] bg-[#1e0d0a] text-[#f6e9d5]'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isUser ? 'text-[#3b1506]' : 'text-[#f5b942]'}`}>
                      {isUser ? (language === 'hi' ? 'यजमान (आप)' : 'Devotee (You)') : (language === 'hi' ? 'ॐ वैदिक सामग्री परामर्श' : 'Vedic Samagri Advisor')}
                    </span>
                    <span className={`text-[11px] ${isUser ? 'text-[#3b1506]' : 'text-[#c9b196]'}`}>{message.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-xs leading-relaxed sm:text-sm">{message.content}</div>
                  {!isUser && message.id !== 'welcome' && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(255,170,60,0.18)] pt-2.5">
                      <span className="text-xs text-[#c9b196]">
                        {language === 'hi' ? 'यह विवरण पंडित जी को भेजें:' : 'Send this to Pandit Ji:'}
                      </span>
                      <a
                        href={buildWhatsAppUrl(
                          cleanPhone,
                          `🙏 प्रणाम पंडित जी, मुझे इस पूजा सामग्री पर मार्गदर्शन चाहिए:\n\n${message.content.slice(0, 800)}\n\nकृपया अपनी उपलब्धता एवं मार्गदर्शन प्रदान करें।`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#25d366] px-3.5 py-2 text-xs font-bold text-[#04200e] transition hover:brightness-105"
                      >
                        <span aria-hidden="true">💬</span>
                        <span>WhatsApp पर पुष्टि करें</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-[rgba(255,170,60,0.2)] bg-[#1e0d0a] p-3.5 text-xs text-[#f5b942] shadow">
                <span className="h-2 w-2 animate-ping rounded-full bg-[#f5b942]" aria-hidden="true" />
                <span>
                  {language === 'hi'
                    ? 'सामग्री सूची व बाजार दर तैयार की जा रही है...'
                    : 'Calculating Samagri quantities and Chapra market rates...'}
                </span>
              </div>
            </div>
          )}
          {errorMessage && (
            <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/70 p-3 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 border-t border-[rgba(255,170,60,0.2)] bg-[#140604] p-3 sm:p-3.5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              aria-label={language === 'hi' ? 'अपना प्रश्न लिखें' : 'Type your question'}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                language === 'hi'
                  ? 'पूजा सामग्री, कीमत अथवा दक्षिणा पूछें...'
                  : 'Ask about Puja Samagri, prices, or Dakshina...'
              }
              disabled={isLoading}
              className="min-h-[48px] flex-1 rounded-2xl border border-[rgba(255,170,60,0.25)] bg-[#0c0403] px-4 py-2.5 text-sm text-[#f6e9d5] placeholder-[#c9b196]/80 focus-visible:border-[#f5b942] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a3]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] px-4 py-2.5 text-xs font-bold text-[#120706] transition hover:brightness-110 disabled:opacity-50 sm:px-5 sm:text-sm"
            >
              <Send size={14} aria-hidden="true" />
              {language === 'hi' ? 'पूछें' : 'Send'}
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-[#c9b196]">
            {language === 'hi'
              ? 'नोट: सामग्री मूल्य स्थानीय बाजार के अनुमान हैं।'
              : 'Note: Samagri prices are local market estimates.'}
          </p>
        </div>
      </div>
    </div>
  );
};
