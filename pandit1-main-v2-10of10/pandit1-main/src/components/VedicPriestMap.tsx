import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

interface VedicPriestMapProps {
  className?: string;
  isHindi?: boolean;
}

export const VedicPriestMap: React.FC<VedicPriestMapProps> = ({
  className = '',
  isHindi = true,
}) => {
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);
  const [infoOpen, setInfoOpen] = useState<boolean>(true);

  const priestLocation = { lat: 25.7844, lng: 84.7274 };

  useEffect(() => {
    if (!apiKey) {
      fetch('/api/maps-key')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch(() => {
          // Graceful fallback card is shown when no Maps API key is configured
        });
    }

    const handleQuotaExceeded = () => {
      setIsQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, [apiKey]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[rgba(255,170,60,0.3)] bg-[#1d0b08] shadow-2xl flex flex-col ${className}`}>
      {isQuotaExceeded && (
        <div className="bg-amber-950/90 border-b border-amber-600/40 text-amber-200 px-4 py-2 text-xs text-center z-20">
          <span>
            {isHindi
              ? 'गूगल मैप्स लोड नहीं हो सका। कृपया नीचे दिए गए बटन से सीधे गूगल मैप्स में देखें।'
              : 'Google Maps could not load. Use the button below to open directly in Google Maps.'}
          </span>
        </div>
      )}

      <div className="p-4 bg-[#180806] border-b border-[rgba(255,170,60,0.18)] flex flex-wrap items-center justify-between gap-3 z-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold flex items-center gap-1.5">
            <span aria-hidden="true">📍</span>
            <span>{isHindi ? 'गूगल मैप्स लाइव लोकेशन' : 'Google Maps Live Location'}</span>
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

      <div className="w-full h-80 sm:h-96 relative">
        {apiKey ? (
          <APIProvider apiKey={apiKey} language={isHindi ? 'hi' : 'en'}>
            <Map
              defaultCenter={priestLocation}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              gestureHandling="cooperative"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              <AdvancedMarker
                position={priestLocation}
                title="Pandit Pradhuman Pathak – Vedic Priest"
                onClick={() => setInfoOpen(true)}
              >
                <div className="p-2.5 rounded-full bg-[#120706] border-2 border-[#f5b942] shadow-2xl flex items-center justify-center text-lg transform hover:scale-110 transition">
                  🪔
                </div>
              </AdvancedMarker>

              {infoOpen && (
                <InfoWindow position={priestLocation} onCloseClick={() => setInfoOpen(false)}>
                  <div className="p-2 max-w-xs text-[#120706]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b3261e] block">
                      {isHindi ? 'ॐ वैदिक पुरोहित' : 'Vedic Priest'}
                    </span>
                    <p className="font-bold text-sm text-[#120706] mt-0.5">
                      {isHindi ? 'पं. प्रद्युम्न पाठक' : 'Pt. Pradhuman Pathak'}
                    </p>
                    <p className="text-xs text-neutral-700 mt-1 leading-snug">
                      {isHindi
                        ? 'बिन टोली, बड़ा तेलपा, छपरा, बिहार – 841302'
                        : 'Bin Toli, Bara Telpa, Chapra, Bihar – 841302'}
                    </p>
                    <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-semibold">
                      <a href="tel:+919852938708" className="text-[#ff7a1a] hover:underline">
                        📞 +91 98529 38708
                      </a>
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Bin+Toli+Bara+Telpa+Chapra+Bihar+841302"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {isHindi ? 'दिशा निर्देश →' : 'Directions →'}
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#140604] text-center">
            <div className="w-12 h-12 rounded-full bg-[#f5b942]/10 border border-[#f5b942]/30 flex items-center justify-center text-2xl mb-3" aria-hidden="true">
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
              <span key={area} className="px-2.5 py-1 rounded bg-[#2a110b] border border-[#f5b942]/20 text-[#f6e9d5]">
                {area}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
