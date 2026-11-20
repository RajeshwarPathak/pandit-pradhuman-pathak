import React, { useCallback, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { RedesignedWebsiteView } from './components/RedesignedWebsiteView.tsx';
import { SamagriPriceAdvisorChat } from './components/SamagriPriceAdvisorChat.tsx';
import { useFocusTrap } from './hooks/useFocusTrap.ts';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatDialogRef = useRef<HTMLElement | null>(null);

  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);
  useFocusTrap(isChatOpen, chatDialogRef, handleCloseChat);

  return (
    <div className="min-h-screen bg-[#120706] text-[#f6e9d5] flex flex-col">
      <div className="flex-1">
        <RedesignedWebsiteView onOpenChat={() => setIsChatOpen(true)} />
      </div>

      {/* Desktop-only floating Chat FAB; mobile uses the single consolidated bottom bar */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open puja materials and pricing chatbot"
        title="Ask the puja assistant"
        className="fixed bottom-6 right-6 z-40 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f5b942] to-[#ff7a1a] text-[#120706] shadow-xl shadow-black/40 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe3a3]"
      >
        <MessageCircle aria-hidden="true" size={26} strokeWidth={2.5} />
      </button>

      {isChatOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleCloseChat();
          }}
        >
          <section
            ref={chatDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Puja materials and pricing assistant"
            className="relative w-full max-w-4xl"
          >
            <button
              type="button"
              onClick={handleCloseChat}
              aria-label="Close chatbot"
              className="absolute top-2 right-2 sm:-top-3 sm:-right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#f5b942]/40 bg-[#1d0b08] text-[#f5b942] shadow-lg hover:bg-[#2a110b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe3a3]"
            >
              <X aria-hidden="true" size={21} />
            </button>
            <SamagriPriceAdvisorChat initialLanguage="hi" />
          </section>
        </div>
      )}
    </div>
  );
}
