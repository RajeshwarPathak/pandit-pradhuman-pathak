import React, { useState } from 'react';

interface VedicPriestMapProps {
  className?: string;
  isHindi?: boolean;
}

export const VedicPriestMap: React.FC<VedicPriestMapProps> = ({
  className = '',
  isHindi = true,
}) => {
  const [mapFailed, setMapFailed] = useState(false);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-[rgba(255,170,60,0.3)] bg-[#1d0b08] shadow-2xl flex flex-col ${className}`}
    >
      <div className="p-4 bg-[#180806] border-b border-[rgba(255,170,60,0.18)] flex flex-wrap items-center justify-between gap-3 z-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold flex items-center gap-1.5">
            <span aria-hidden="true">📍</span>
            <span>{isHindi ? 'लाइव लोकेशन मैप' : 'Live Location Map'}</span>
          </span>
          <h3 className="text-sm md:text-base font-devanagari font-bold text-[#f6e9d5] mt-0.5">
            {isHindi
              ? 'पं. प्रद्युम्न पाठक · बिन टोली, बड़ा तेलपा, छपरा'
              : 'Pt. Pradhuman Pathak · Bin Toli, Bara Telpa, Chapra'}
          </h3>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Bin+Toli+Bara+Telpa+Chapra+Bihar+841302"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] font-bold text-xs hover:brightness-110 transition shadow flex items-center gap-1.5"
        >
          <span aria-hidden="true">🗺️</span>
          <span>{isHindi ? 'गूगल मैप्स में खोलें' : 'Open in Maps'}</span>
        </a>
      </div>

      <div className="w-full h-80 sm:h-96 relative bg-[#140604]">
        {!mapFailed ? (
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Bin+Toli+Bara+Telpa+Chapra+Bihar+841302"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              isHindi
                ? 'बिन टोली, बड़ा तेलपा, छपरा के लिए गूगल मैप्स पर दिशा-निर्देश खोलें'
                : 'Open Google Maps directions to Bin Toli, Bara Telpa, Chapra'
            }
            className="block w-full h-full relative group"
          >
            <img
              src="/api/map-image"
              alt={
                isHindi
                  ? 'बिन टोली, बड़ा तेलपा, छपरा, बिहार का नक्शा'
                  : 'Map of Bin Toli, Bara Telpa, Chapra, Bihar'
              }
              width={900}
              height={420}
              loading="lazy"
              decoding="async"
              onError={() => setMapFailed(true)}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm rounded-2xl bg-[#120706]/90 backdrop-blur-md border border-[#f5b942]/40 p-3.5 shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5b942] block">
                {isHindi ? 'ॐ वैदिक पुरोहित · सेवा स्थल' : 'Vedic Priest · Residence'}
              </span>
              <p className="text-xs text-[#f6e9d5] mt-0.5 leading-snug">
                {isHindi
                  ? 'बिन टोली, बड़ा तेलपा, छपरा, बिहार – 841302'
                  : 'Bin Toli, Bara Telpa, Chapra, Bihar – 841302'}
              </p>
              <span className="inline-block mt-1.5 text-xs font-semibold text-[#ffe3a3] underline">
                {isHindi ? 'दिशा-निर्देश देखें →' : 'Get Directions →'}
              </span>
            </div>
          </a>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#140604] text-center">
            <div
              className="w-12 h-12 rounded-full bg-[#f5b942]/10 border border-[#f5b942]/30 flex items-center justify-center text-2xl mb-3"
              aria-hidden="true"
            >
              📍
            </div>
            <p className="text-sm font-semibold text-[#f5b942]">
              {isHindi ? 'पंडित प्रद्युम्न पाठक का सेवा स्थल' : 'Pandit Pradhuman Pathak Residence'}
            </p>
            <p className="text-xs text-[#c9b196] mt-1 max-w-sm">
              {isHindi
                ? 'बिन टोली, बड़ा तेलपा, छपरा, बिहार (841302) · समस्त छपरा, रिविलगंज, एकमा, मढ़ौरा, दिघवारा व सोनपुर।'
                : 'Bin Toli, Bara Telpa, Chapra, Bihar (841302) · Serving Chapra, Revelganj, Ekma, Marhaura, Dighwara & Sonepur.'}
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Bin+Toli+Bara+Telpa+Chapra+Bihar+841302"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center px-5 py-2.5 rounded-xl bg-[#f5b942] text-[#120706] font-semibold text-xs hover:brightness-110 transition"
            >
              {isHindi ? 'गूगल मैप्स पर देखें' : 'View on Google Maps'}
            </a>
          </div>
        )}
      </div>

      <div className="p-3.5 bg-[#180806] border-t border-[rgba(255,170,60,0.18)] text-xs text-[#c9b196] flex flex-wrap items-center justify-between gap-2">
        <span className="text-[#f5b942] font-semibold">
          {isHindi ? 'घरेलू पूजा सेवा क्षेत्र:' : 'Home Visit Service Areas:'}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {['छपरा नगर', 'बड़ा तेलपा', 'दहियावां', 'भगवान बाजार', 'रिविलगंज', 'एकमा', 'मढ़ौरा', 'सोनपुर'].map(
            (area) => (
              <span
                key={area}
                className="px-2.5 py-1 rounded bg-[#2a110b] border border-[#f5b942]/20 text-[#f6e9d5]"
              >
                {area}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
