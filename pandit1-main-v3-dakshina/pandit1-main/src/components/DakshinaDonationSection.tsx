import React, { useState } from 'react';
import upiQrImage from '../assets/upi-qr-dakshina.webp';
import { buildWhatsAppUrl } from '../utils/booking.ts';

interface DakshinaDonationSectionProps {
  isHi: boolean;
  cleanPhone: string;
}

const UPI_ID = '6296070652@upi';
const PAYEE_NAME = 'Pandit Pradhuman Pathak';
const PRESET_AMOUNTS = [101, 251, 501, 1100, 2100];

const SEVA_PURPOSES = [
  {
    id: 'dakshina',
    hi: 'वैदिक दक्षिणा',
    en: 'Vedic Dakshina',
  },
  {
    id: 'gauseva',
    hi: 'गौ सेवा एवं अन्न दान',
    en: 'Gau Seva & Annadaan',
  },
  {
    id: 'samagri',
    hi: 'पूजा सामग्री सहयोग',
    en: 'Puja Samagri Seva',
  },
];

export const DakshinaDonationSection: React.FC<DakshinaDonationSectionProps> = ({
  isHi,
  cleanPhone,
}) => {
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>('dakshina');
  const [amount, setAmount] = useState<string>('501');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  const selectedPurpose =
    SEVA_PURPOSES.find((p) => p.id === selectedPurposeId) || SEVA_PURPOSES[0];
  const numericAmount = Number(amount);
  const validAmount = Number.isFinite(numericAmount) && numericAmount > 0 ? Math.floor(numericAmount) : null;

  const upiNote = `${selectedPurpose.en} - Pandit Pradhuman Pathak`;
  const upiParams = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    cu: 'INR',
    tn: upiNote,
  });
  if (validAmount) {
    upiParams.set('am', String(validAmount));
  }
  const upiPayUrl = `upi://pay?${upiParams.toString()}`;

  const whatsAppConfirmText = isHi
    ? `🙏 प्रणाम पंडित जी, मैंने ${validAmount ? `₹${validAmount}` : 'श्रद्धा अनुसार'} की राशि (${selectedPurpose.hi}) UPI (${UPI_ID}) द्वारा समर्पित की है। कृपया आशीर्वाद प्रदान करें।`
    : `🙏 Namaste Pandit Ji, I have offered ${validAmount ? `₹${validAmount}` : 'a voluntary offering'} towards ${selectedPurpose.en} via UPI (${UPI_ID}). Please bless our family.`;
  const whatsAppConfirmUrl = buildWhatsAppUrl(cleanPhone, whatsAppConfirmText);

  const handleCopyUpi = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(UPI_ID);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = UPI_ID;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      setCopiedUpi(false);
    }
  };

  return (
    <section
      id="dakshina"
      className="py-16 md:py-20 bg-gradient-to-b from-[#120706] via-[#1c0a07] to-[#120706] border-t border-[rgba(255,170,60,0.2)]"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold">
            {isHi ? 'श्रद्धा एवं सेवा समर्पण' : 'Voluntary Dakshina & Seva'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-devanagari font-bold text-[#f5b942] mt-1.5">
            {isHi ? 'दक्षिणा एवं पुण्य दान समर्पित करें' : 'Offer Dakshina or Seva Donation'}
          </h2>
          <p className="text-sm text-[#c9b196] max-w-xl mx-auto mt-2">
            {isHi
              ? 'आप अपनी श्रद्धा एवं सामर्थ्य अनुसार वैदिक दक्षिणा, गौ सेवा अथवा पूजा सहयोग सीधे UPI द्वारा समर्पित कर सकते हैं।'
              : 'Offer voluntary Vedic Dakshina, Gau Seva, or Puja support directly via any UPI app (PhonePe, Google Pay, Paytm, BHIM).'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Amount & Seva Selection */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#1d0b08]/90 border border-[rgba(255,170,60,0.25)] shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="block text-xs font-semibold text-[#f5b942] uppercase tracking-wider mb-3">
                  {isHi ? '1. सेवा का उद्देश्य चुनें' : '1. Choose Seva Purpose'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {SEVA_PURPOSES.map((purpose) => (
                    <button
                      key={purpose.id}
                      type="button"
                      onClick={() => setSelectedPurposeId(purpose.id)}
                      aria-pressed={selectedPurposeId === purpose.id}
                      className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3] ${
                        selectedPurposeId === purpose.id
                          ? 'bg-[#f5b942] text-[#120706] shadow-md'
                          : 'bg-[#120706] text-[#c9b196] hover:text-[#f6e9d5] border border-[rgba(255,170,60,0.2)]'
                      }`}
                    >
                      {isHi ? purpose.hi : purpose.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#f5b942] uppercase tracking-wider mb-3">
                  {isHi ? '2. शुभ राशि चुनें या लिखें (₹)' : '2. Select or Enter Amount (₹)'}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {PRESET_AMOUNTS.map((preset) => {
                    const isSelected = Number(amount) === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(String(preset))}
                        aria-pressed={isSelected}
                        className={`min-h-[46px] px-3 py-2 rounded-xl text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3] ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] shadow-md'
                            : 'bg-[#120706] text-[#f6e9d5] border border-[rgba(255,170,60,0.22)] hover:border-[#f5b942]'
                        }`}
                      >
                        ₹{preset.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <label htmlFor="customDakshinaAmount" className="sr-only">
                    {isHi ? 'अपनी इच्छित राशि दर्ज करें (रुपये में)' : 'Enter custom amount in Rupees'}
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-[#f5b942]"
                      aria-hidden="true"
                    >
                      ₹
                    </span>
                    <input
                      id="customDakshinaAmount"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={100000}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={isHi ? 'अन्य राशि लिखें (उदा. 501)' : 'Enter custom amount (e.g. 501)'}
                      className="w-full min-h-[48px] pl-9 pr-4 py-2.5 rounded-xl bg-[#120706] border border-[rgba(255,170,60,0.25)] text-[#f6e9d5] placeholder-[#c9b196]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a3] focus-visible:border-[#f5b942] text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={upiPayUrl}
                className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] font-bold text-sm sm:text-base shadow-xl hover:brightness-105 transition flex items-center justify-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
              >
                <span aria-hidden="true">🙏</span>
                <span>
                  {isHi
                    ? `UPI ऐप से दक्षिणा भेजें${validAmount ? ` (₹${validAmount.toLocaleString('en-IN')})` : ''}`
                    : `Pay via UPI App${validAmount ? ` (₹${validAmount.toLocaleString('en-IN')})` : ''}`}
                </span>
              </a>

              <a
                href={whatsAppConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] py-3 px-5 rounded-xl bg-[#25d366]/15 border border-[#25d366]/50 text-[#6ee79c] hover:bg-[#25d366] hover:text-[#04200e] font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <span aria-hidden="true">💬</span>
                <span>
                  {isHi
                    ? 'भुगतान के बाद व्हाट्सएप पर सूचना भेजें'
                    : 'Share Confirmation on WhatsApp After Payment'}
                </span>
              </a>

              <p className="text-xs text-[#c9b196] text-center">
                {isHi
                  ? 'PhonePe, Google Pay, Paytm, BHIM एवं सभी UPI ऐप्स द्वारा सुरक्षित भुगतान।'
                  : 'Works with PhonePe, Google Pay, Paytm, BHIM, and all Indian UPI apps.'}
              </p>
            </div>
          </div>

          {/* Right: Scannable QR Code & Copyable UPI ID */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#1d0b08]/90 border border-[rgba(255,170,60,0.25)] shadow-2xl flex flex-col items-center justify-between text-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold block">
                {isHi ? 'QR कोड स्कैन करें' : 'Scan UPI QR Code'}
              </span>
              <p className="text-xs text-[#c9b196] mt-1">
                {isHi ? 'किसी भी UPI ऐप से सीधे स्कैन करें' : 'Scan directly with any UPI app'}
              </p>
            </div>

            <div className="my-5 p-3.5 rounded-2xl bg-white shadow-xl border-2 border-[#f5b942]/70 max-w-[240px] w-full">
              <img
                src={upiQrImage}
                alt={
                  isHi
                    ? 'पंडित प्रद्युम्न पाठक दक्षिणा UPI QR कोड (6296070652@upi)'
                    : 'Pandit Pradhuman Pathak Dakshina UPI QR Code (6296070652@upi)'
                }
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-lg"
              />
            </div>

            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#120706] border border-[rgba(255,170,60,0.25)]">
                <div className="text-left min-w-0">
                  <span className="text-[11px] text-[#c9b196] block">UPI ID</span>
                  <span className="text-sm font-bold text-[#ffe3a3] truncate block select-all">
                    {UPI_ID}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#f5b942]/15 hover:bg-[#f5b942] hover:text-[#120706] text-[#f5b942] text-xs font-bold transition shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
                >
                  {copiedUpi
                    ? isHi ? '✓ कॉपी हुआ' : '✓ Copied'
                    : isHi ? 'कॉपी करें' : 'Copy UPI'}
                </button>
              </div>
              <p className="text-xs text-[#c9b196]">
                {isHi
                  ? 'पूर्णतः स्वैच्छिक · यजमान की श्रद्धा अनुसार'
                  : '100% voluntary offering as per devotee devotion'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
