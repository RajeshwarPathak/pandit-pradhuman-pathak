import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import panditJiPhoto320 from '../assets/pandit-pradhuman-pathak-320.webp';
import panditJiPhoto575 from '../assets/pandit-pradhuman-pathak-575.webp';
import { HavanCanvas } from './HavanCanvas.tsx';
import { VedicPriestMap } from './VedicPriestMap.tsx';
import { DakshinaDonationSection } from './DakshinaDonationSection.tsx';
import { SERVICES_LIST, TESTIMONIALS_DATA, FAQS_DATA } from '../data/servicesData.ts';
import { VedicService, Language } from '../types/index.ts';
import {
  formatWhatsAppMessage,
  buildWhatsAppUrl,
  buildTelUrl,
  buildSmsUrl,
} from '../utils/booking.ts';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';

interface RedesignedWebsiteViewProps {
  onOpenChat?: () => void;
}

export const RedesignedWebsiteView: React.FC<RedesignedWebsiteViewProps> = ({
  onOpenChat,
}) => {
  const [lang, setLang] = useState<Language>('hi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<VedicService | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [selectedServiceId, setSelectedServiceId] = useState<string>('satyanarayan');
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [needsMuhurat, setNeedsMuhurat] = useState<boolean>(false);
  const [locationMessage, setLocationMessage] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const bookSectionRef = useRef<HTMLDivElement | null>(null);
  const serviceModalRef = useRef<HTMLDivElement | null>(null);
  const isHi = lang === 'hi';
  const phoneNumber = '+91 98529 38708';
  const cleanPhone = '919852938708';
  const telUrl = buildTelUrl(phoneNumber);

  const handleCloseServiceModal = useCallback(() => setActiveModalService(null), []);
  useFocusTrap(Boolean(activeModalService), serviceModalRef, handleCloseServiceModal);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const currentService = SERVICES_LIST.find((s) => s.id === selectedServiceId) || SERVICES_LIST[0];
  const formattedMessage = formatWhatsAppMessage({
    serviceId: currentService.id,
    serviceHindi: currentService.nameHi,
    serviceEnglish: currentService.nameEn,
    customerName,
    date: selectedDate,
    needsMuhurat,
    locationMessage,
    language: lang,
  });
  const whatsAppUrl = buildWhatsAppUrl(cleanPhone, formattedMessage);
  const quickGreeting = isHi
    ? '🙏 प्रणाम पंडित जी (Pandit Pradhuman Pathak Ji), मुझे वैदिक पूजा एवं मुहूर्त के संबंध में परामर्श चाहिए।'
    : '🙏 Namaste Pandit Pradhuman Pathak Ji, I would like to consult regarding Vedic Puja & Muhurat.';
  const quickWhatsAppUrl = buildWhatsAppUrl(cleanPhone, quickGreeting);
  const smsUrl = buildSmsUrl(
    phoneNumber,
    isHi
      ? 'प्रणाम पंडित जी, मुझे वैदिक पूजा एवं मुहूर्त के संबंध में जानकारी चाहिए।'
      : 'Namaste Pandit Ji, I would like to ask about puja services and availability.'
  );

  const handleSelectServiceFromCard = (service: VedicService) => {
    setSelectedServiceId(service.id);
    if (service.category === 'muhurat') setNeedsMuhurat(true);
    bookSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyMessage = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = formattedMessage;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError(
        isHi
          ? 'कृपया अपना नाम दर्ज करें ताकि पंडित जी आपको पहचान सकें।'
          : 'Please enter your name so Pandit Ji can address you properly.'
      );
      return;
    }
    setFormError('');
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const filteredServices = SERVICES_LIST.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  const navItems = [
    { href: '#services', hi: 'पूजा सेवाएं', en: 'Services' },
    { href: '#muhurat', hi: 'शुभ मुहूर्त', en: 'Muhurat' },
    { href: '#book', hi: 'बुकिंग व पूछताछ', en: 'Booking' },
    { href: '#testimonials', hi: 'यजमान अनुभव', en: 'Reviews' },
    { href: '#dakshina', hi: 'दक्षिणा / दान', en: 'Dakshina' },
    { href: '#contact', hi: 'संपर्क', en: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#120706] text-[#f6e9d5] font-body relative pb-24 md:pb-12">
      {/* WCAG Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:rounded-lg focus:bg-[#f5b942] focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-[#120706]"
      >
        {isHi ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>

      {/* Top Announcement Bar */}
      <div className="bg-[#1d0b08] border-b border-[rgba(255,170,60,0.18)] text-xs sm:text-[13px] py-1.5 px-4 text-center text-[#c9b196] flex items-center justify-center gap-2">
        <span className="text-[#f5b942]" aria-hidden="true">ॐ</span>
        <span>
          {isHi
            ? 'छपरा एवं संपूर्ण सारण जिले में 55+ वर्षों से प्रामाणिक वैदिक पूजा, गृह प्रवेश एवं विवाह अनुष्ठान'
            : '55+ Years of Authentic Vedic Pujas, Griha Pravesh & Wedding Rituals across Chapra & Saran District'}
        </span>
      </div>

      {/* Single Unified Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#120706]/95 backdrop-blur-md border-b border-[rgba(255,170,60,0.22)] px-4 lg:px-8 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <a href="#hero" className="flex items-center gap-2 min-h-[44px]">
            <span className="text-xl text-[#f5b942] font-devanagari font-bold" aria-hidden="true">ॐ</span>
            <div className="leading-tight">
              <span className="text-lg md:text-xl font-devanagari font-semibold text-[#f5b942] block">
                {isHi ? 'पं. प्रद्युम्न पाठक' : 'Pt. Pradhuman Pathak'}
              </span>
              <span className="text-xs text-[#c9b196] block">
                {isHi ? 'वैदिक पुरोहित · छपरा (बिहार)' : 'Vedic Priest · Chapra (Bihar)'}
              </span>
            </div>
          </a>

          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-[#c9b196]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="min-h-[44px] inline-flex items-center hover:text-[#f5b942] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3] rounded px-1"
              >
                {isHi ? item.hi : item.en}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLang(isHi ? 'en' : 'hi')}
              aria-label={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
              className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full border border-[#f5b942]/60 text-xs font-semibold text-[#f5b942] hover:bg-[#f5b942]/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
            >
              {isHi ? 'हिं | EN' : 'HI | EN'}
            </button>
            <a
              href={telUrl}
              className="hidden sm:inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] text-xs font-bold shadow-md hover:brightness-110 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
            >
              <span aria-hidden="true">📞</span>
              <span>{isHi ? 'कॉल करें' : 'Call Now'}</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#f5b942]/40 bg-[#1d0b08] text-[#f5b942] hover:bg-[#2a110b] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
            >
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden mt-3 pt-3 border-t border-[rgba(255,170,60,0.18)] flex flex-col gap-1 pb-2"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] px-3 flex items-center rounded-xl text-sm font-medium text-[#f6e9d5] hover:bg-[#1d0b08] hover:text-[#f5b942] transition"
              >
                {isHi ? item.hi : item.en}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-[radial-gradient(ellipse_at_50%_105%,#7a2208_0%,#2b0d07_45%,#120706_85%)]"
        >
          <div className="absolute inset-0 pointer-events-none opacity-80">
            <HavanCanvas />
          </div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d0b08]/80 border border-[#f5b942]/30 text-xs text-[#f5b942]">
                    ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5b942]/15 border border-[#f5b942]/50 text-xs font-bold text-[#ffe3a3]">
                    <span aria-hidden="true">🪔</span>
                    <span>{isHi ? '55+ वर्षों का वैदिक अनुभव' : '55+ Years Vedic Experience'}</span>
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-devanagari font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffe3a3] via-[#f5b942] to-[#ff9a3c]">
                  {isHi ? 'पंडित प्रद्युम्न पाठक' : 'Pandit Pradhuman Pathak'}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#f6e9d5] font-medium mt-3 max-w-xl mx-auto lg:mx-0">
                  {isHi
                    ? 'वैदिक विधि से पूजा, गृह प्रवेश, विवाह संस्कार एवं ज्योतिष मार्गदर्शन'
                    : 'Authentic Vedic Pujas, Griha Pravesh, Wedding Rituals & Astrological Guidance'}
                </p>
                <p className="text-sm sm:text-base text-[#c9b196] mt-2.5 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {isHi
                    ? '55+ वर्षों की वैदिक परंपरा, शुद्ध संस्कृत मंत्रोच्चारण तथा संपूर्ण शास्त्रसम्मत विधि-विधान के साथ छपरा एवं संपूर्ण सारण जिले में शांति एवं समृद्धि का मार्गदर्शन।'
                    : '55+ years of Vedic tradition, pure Sanskrit chanting, and complete Shastra-compliant rituals to usher peace and prosperity into your home — Chapra & entire Saran district.'}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-8">
                  <a
                    href={telUrl}
                    className="inline-flex min-h-[48px] items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] font-bold text-sm md:text-base shadow-lg shadow-[#ff7a1a]/20 hover:brightness-105 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
                  >
                    <span aria-hidden="true">📞</span>
                    <span>{isHi ? 'अभी कॉल करें (+91 98529 38708)' : 'Call Now (+91 98529 38708)'}</span>
                  </a>
                  <a
                    href={quickWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25d366] text-[#04200e] font-bold text-sm md:text-base shadow-lg shadow-[#25d366]/25 hover:brightness-105 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
                  >
                    <span aria-hidden="true">💬</span>
                    <span>{isHi ? 'व्हाट्सएप पर बात करें' : 'Chat on WhatsApp'}</span>
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs text-[#c9b196]">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
                    <span>
                      {isHi
                        ? 'संपर्क समय: प्रातः 7:00 से रात्रि 9:00 बजे तक'
                        : 'Calling hours: 7:00 AM – 9:00 PM'}
                    </span>
                  </span>
                  <span className="text-[#f5b942]">
                    {isHi ? '• 55+ वर्षों से छपरा व सारण में सेवारत' : '• Serving Chapra & Saran for 55+ years'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-t-full rounded-b-2xl p-1 bg-gradient-to-b from-[#f5b942] via-[#ff7a1a] to-[#7a2208] shadow-2xl shadow-[#ff7a1a]/30">
                  <div className="w-full h-full rounded-t-full rounded-b-2xl overflow-hidden bg-[#2a110b] relative">
                    <img
                      src={panditJiPhoto575}
                      srcSet={`${panditJiPhoto320} 320w, ${panditJiPhoto575} 575w`}
                      sizes="(max-width: 640px) 256px, 288px"
                      alt={
                        isHi
                          ? 'पंडित प्रद्युम्न पाठक – वैदिक पुरोहित, छपरा (बिहार)'
                          : 'Pandit Pradhuman Pathak – Vedic Priest, Chapra (Bihar)'
                      }
                      width={575}
                      height={916}
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-full object-cover object-top contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120706] via-transparent to-transparent opacity-80 pointer-events-none" />
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-[#1d0b08]/90 border border-[rgba(255,170,60,0.25)] text-center max-w-xs shadow-xl">
                  <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold block">
                    {isHi ? 'वेद-शास्त्र ज्ञाता · 55+ वर्ष अनुभव' : 'Vedic Acharya · 55+ Years Experience'}
                  </span>
                  <span className="text-sm font-semibold text-[#f6e9d5] block mt-0.5">
                    {isHi ? 'पं. प्रद्युम्न पाठक' : 'Pt. Pradhuman Pathak'}
                  </span>
                  <span className="text-xs text-[#c9b196] block mt-1">
                    <span aria-hidden="true">📍 </span>
                    {isHi ? 'बिन टोली, बड़ा तेलपा, छपरा (बिहार)' : 'Bin Toli, Bara Telpa, Chapra (Bihar)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-[rgba(255,170,60,0.18)]">
              {[
                {
                  icon: '🪔',
                  titleHi: '55+ वर्ष अनुभव',
                  titleEn: '55+ Years Experience',
                  detailHi: 'वैदिक कुल परंपरा',
                  detailEn: 'Ancient Vedic Lineage',
                },
                {
                  icon: '📜',
                  titleHi: 'शुद्ध मंत्रोच्चार',
                  titleEn: 'Pure Chanting',
                  detailHi: 'शास्त्र सम्मत विधि',
                  detailEn: 'Strict Shastra Vidhi',
                },
                {
                  icon: '📝',
                  titleHi: 'सामग्री सूची मार्गदर्शन',
                  titleEn: 'Samagri List Given',
                  detailHi: 'व्हाट्सएप पर संपूर्ण विवरण',
                  detailEn: 'Detailed on WhatsApp',
                },
                {
                  icon: '🙏',
                  titleHi: 'श्रद्धा अनुसार दक्षिणा',
                  titleEn: 'Voluntary Dakshina',
                  detailHi: 'पारदर्शी व सौहार्दपूर्ण',
                  detailEn: 'Zero Hidden Pressure',
                },
              ].map((item) => (
                <div
                  key={item.icon}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#1d0b08]/60 border border-[rgba(255,170,60,0.15)] text-center"
                >
                  <span className="text-xl sm:text-2xl block mb-1" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#f5b942] block">
                    {isHi ? item.titleHi : item.titleEn}
                  </span>
                  <span className="text-xs text-[#c9b196]">
                    {isHi ? item.detailHi : item.detailEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold">
              {isHi ? 'शास्त्र सम्मत अनुष्ठान' : 'Vedic Rituals & Ceremonies'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-devanagari font-bold text-[#f5b942] mt-1.5">
              {isHi ? 'हमारी प्रमुख पूजा एवं संस्कार सेवाएं' : 'Our Sacred Puja & Sanskar Services'}
            </h2>
            <p className="text-sm text-[#c9b196] max-w-xl mx-auto mt-2">
              {isHi
                ? 'किसी भी सेवा का विवरण अथवा आवश्यक सामग्री सूची देखने हेतु कार्ड पर क्लिक करें।'
                : 'Click any service card to view ritual significance, estimated duration, and required items list.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'all', hi: 'सभी सेवाएं', en: 'All Services' },
                { id: 'sanskar', hi: 'संस्कार (गृहप्रवेश/विवाह)', en: 'Sanskars' },
                { id: 'puja', hi: 'पूजा व हवन', en: 'Pujas & Havan' },
                { id: 'astrology', hi: 'कुंडली व रत्न', en: 'Astrology & Gems' },
                { id: 'muhurat', hi: 'मुहूर्त विचार', en: 'Muhurat Consultation' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  aria-pressed={selectedCategory === tab.id}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3] ${
                    selectedCategory === tab.id
                      ? 'bg-[#f5b942] text-[#120706] shadow-md'
                      : 'bg-[#1d0b08] text-[#c9b196] hover:text-[#f6e9d5] border border-[rgba(255,170,60,0.18)]'
                  }`}
                >
                  {isHi ? tab.hi : tab.en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group p-5 rounded-2xl bg-[#1d0b08]/80 border border-[rgba(255,170,60,0.22)] hover:border-[#f5b942] transition duration-300 flex flex-col justify-between hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-3xl p-2.5 rounded-xl bg-[#2a110b] border border-[#f5b942]/20"
                      aria-hidden="true"
                    >
                      {service.icon}
                    </span>
                    <span className="text-xs text-[#f5b942] bg-[#f5b942]/10 px-2.5 py-1 rounded border border-[#f5b942]/20 font-medium">
                      {isHi ? service.durationHi : service.durationEn}
                    </span>
                  </div>
                  <h3 className="text-lg font-devanagari font-semibold text-[#f5b942] group-hover:text-[#ffe3a3] transition">
                    {isHi ? service.nameHi : service.nameEn}
                  </h3>
                  <span className="text-xs text-[#c9b196] block mb-2">
                    {isHi ? service.nameEn : service.nameHi}
                  </span>
                  <p className="text-sm text-[#d9c4ad] leading-relaxed line-clamp-3">
                    {isHi ? service.shortDescHi : service.shortDescEn}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[rgba(255,170,60,0.12)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalService(service)}
                    className="min-h-[44px] px-2 text-xs text-[#f5b942] font-semibold hover:underline flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3] rounded"
                  >
                    <span>{isHi ? 'विवरण व सामग्री सूची' : 'Details & Samagri'}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectServiceFromCard(service)}
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-[#f5b942]/15 hover:bg-[#f5b942] hover:text-[#120706] text-[#f5b942] text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
                  >
                    {isHi ? 'बुक करें' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Samagri Advisor Banner */}
        <section className="py-12 max-w-5xl mx-auto px-4">
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#200c08] via-[#1d0b08] to-[#250e0a] border border-[#f5b942]/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#120706] border border-[#f5b942]/30 text-xs text-[#f5b942] mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
                  <span>
                    {isHi ? 'नया: वैदिक सामग्री व दक्षिणा परामर्शदाता' : 'New: Vedic Samagri & Dakshina Advisor'}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-devanagari font-bold text-[#f5b942]">
                  {isHi
                    ? 'पूजा सामग्री सूची, बाजार मूल्य एवं दक्षिणा परामर्श'
                    : 'Puja Samagri Checklist, Market Rates & Dakshina Advisor'}
                </h2>
                <p className="text-sm text-[#c9b196] mt-2 leading-relaxed">
                  {isHi
                    ? 'पूजा सामग्री, स्थानीय बाजार भाव और दक्षिणा के बारे में तुरंत पूछें।'
                    : 'Ask for itemized Samagri quantities, estimated local Chapra prices, and Dakshina guidance.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                {onOpenChat && (
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="min-h-[48px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] font-bold text-sm shadow-xl hover:brightness-110 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
                  >
                    <span aria-hidden="true">💬 </span>
                    <span>{isHi ? 'सामग्री व दर पूछें (AI Chat)' : 'Ask Samagri & Price'}</span>
                  </button>
                )}
                <a
                  href={buildWhatsAppUrl(
                    cleanPhone,
                    isHi
                      ? '🙏 प्रणाम पंडित जी, मुझे आगामी पूजा की सामग्री सूची एवं दक्षिणा के बारे में पूछना है।'
                      : '🙏 Namaste Pandit Ji, I would like to inquire regarding Puja Samagri & Dakshina.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-5 py-3.5 rounded-2xl bg-[#25d366] text-[#04200e] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 transition"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Muhurat Banner */}
        <section
          id="muhurat"
          className="py-14 bg-gradient-to-b from-[#120706] via-[#1d0b08] to-[#120706] border-y border-[rgba(255,170,60,0.18)]"
        >
          <div className="max-w-5xl mx-auto px-4">
            <div className="p-6 md:p-8 rounded-3xl bg-[#120706]/90 border border-[#f5b942]/30 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8">
                  <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold block mb-1">
                    {isHi ? 'पंचांग शोधन एवं लग्न निर्धारण' : 'Panchang Shuddhi & Lagna Timings'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-devanagari font-bold text-[#f6e9d5]">
                    {isHi
                      ? 'विवाह, गृह प्रवेश अथवा नवीन व्यापार का शुभ मुहूर्त जानें'
                      : 'Discover Auspicious Muhurat for Wedding, Griha Pravesh or Business Opening'}
                  </h2>
                  <p className="text-sm text-[#c9b196] mt-2 leading-relaxed">
                    {isHi
                      ? 'सही तिथि, लग्न एवं नक्षत्र देखकर विधि से आयोजन हेतु मार्गदर्शन प्राप्त करें।'
                      : 'Get guidance on auspicious dates and timings for your ceremony.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <a
                      href={buildWhatsAppUrl(
                        cleanPhone,
                        isHi
                          ? '🙏 प्रणाम पंडित जी, मुझे शुभ मुहूर्त विचार चाहिए।'
                          : '🙏 Namaste Pandit Ji, I need guidance for an auspicious Muhurat.'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-full bg-[#25d366] text-[#04200e] text-xs md:text-sm font-bold hover:brightness-105 transition"
                    >
                      <span aria-hidden="true">💬</span>
                      <span>{isHi ? 'मुहूर्त हेतु व्हाट्सएप करें' : 'Ask Muhurat on WhatsApp'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedServiceId('muhurat');
                        setNeedsMuhurat(true);
                        bookSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="min-h-[44px] px-5 py-2.5 rounded-full border border-[#f5b942] text-[#f5b942] hover:bg-[#f5b942]/10 text-xs md:text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
                    >
                      {isHi ? 'फॉर्म में विवरण भरें' : 'Fill Muhurat Inquiry'}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l border-[rgba(255,170,60,0.18)] pt-4 md:pt-0 md:pl-6">
                  <span className="text-3xl block mb-2" aria-hidden="true">⏳</span>
                  <span className="text-sm font-semibold text-[#f5b942] block">
                    {isHi ? 'त्वरित विचार' : 'Fast Response'}
                  </span>
                  <span className="text-xs text-[#c9b196] block mt-1">
                    {isHi ? 'कॉल अथवा व्हाट्सएप द्वारा सहायता' : 'Direct consultation via Phone or WhatsApp'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="book" ref={bookSectionRef} className="py-16 md:py-24 max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold">
              {isHi ? 'पूजा एवं परामर्श पूछताछ' : 'Booking & Inquiry Form'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-devanagari font-bold text-[#f5b942] mt-1.5">
              {isHi ? 'सीधे व्हाट्सएप पर संदेश भेजें' : 'Send Structured Details to WhatsApp'}
            </h2>
            <p className="text-sm text-[#c9b196] max-w-lg mx-auto mt-2">
              {isHi
                ? 'अपना विवरण भरें; पंडित जी उपलब्धता एवं सामग्री सूची की पुष्टि हेतु संपर्क करेंगे।'
                : 'Fill in your details below; Pandit Ji will review availability and share the Samagri list.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#1d0b08]/90 border border-[rgba(255,170,60,0.25)] shadow-2xl">
            <form onSubmit={handleSendWhatsApp} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="serviceSelect"
                  className="block text-xs font-semibold text-[#f5b942] uppercase tracking-wider mb-2"
                >
                  {isHi ? '1. पूजा / संस्कार सेवा चुनें *' : '1. Select Vedic Service *'}
                </label>
                <select
                  id="serviceSelect"
                  value={selectedServiceId}
                  onChange={(e) => {
                    setSelectedServiceId(e.target.value);
                    if (e.target.value === 'muhurat') setNeedsMuhurat(true);
                  }}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#120706] border border-[rgba(255,170,60,0.25)] text-[#f6e9d5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a3] focus-visible:border-[#f5b942] text-sm"
                >
                  {SERVICES_LIST.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameHi} — {s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="customerName"
                  className="block text-xs font-semibold text-[#f5b942] uppercase tracking-wider mb-2"
                >
                  {isHi ? '2. आपका शुभ नाम (यजमान) *' : '2. Devotee Name *'}
                </label>
                <input
                  id="customerName"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? 'name-error' : undefined}
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder={isHi ? 'अपना नाम लिखें (उदा. राजेश कुमार)' : 'Enter your name (e.g. Rajesh Kumar)'}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#120706] border border-[rgba(255,170,60,0.25)] text-[#f6e9d5] placeholder-[#c9b196]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a3] focus-visible:border-[#f5b942] text-sm"
                />
                {formError && (
                  <p id="name-error" className="text-xs text-rose-400 mt-1.5" role="alert">
                    <span aria-hidden="true">⚠ </span>
                    {formError}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#120706]/60 border border-[rgba(255,170,60,0.15)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="pujaDate"
                    className="text-xs font-semibold text-[#f5b942] uppercase tracking-wider"
                  >
                    {isHi ? '3. पूजा की तिथि अथवा मुहूर्त' : '3. Date or Auspicious Muhurat'}
                  </label>
                  <label className="inline-flex min-h-[44px] items-center gap-2 cursor-pointer text-xs text-[#f6e9d5]">
                    <input
                      type="checkbox"
                      checked={needsMuhurat}
                      onChange={(e) => setNeedsMuhurat(e.target.checked)}
                      className="w-5 h-5 accent-[#f5b942] rounded cursor-pointer"
                    />
                    <span>{isHi ? 'तिथि तय नहीं है / मुहूर्त पूछना है' : 'Date not decided / need Muhurat'}</span>
                  </label>
                </div>
                {!needsMuhurat ? (
                  <div>
                    <input
                      id="pujaDate"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="w-full min-h-[48px] px-4 py-2 rounded-lg bg-[#120706] border border-[rgba(255,170,60,0.25)] text-[#f6e9d5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a3] focus-visible:border-[#f5b942] text-sm"
                    />
                    <span className="text-xs text-[#c9b196] block mt-1.5">
                      {isHi ? 'यदि तिथि निर्धारित हो तो चुनें।' : 'Select if you have a fixed date in mind.'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#f5b942]/10 border border-[#f5b942]/30 text-xs text-[#f5b942]">
                    {isHi
                      ? '✓ पंडित जी पंचांग देखकर शुभ मुहूर्त सुझाएंगे।'
                      : '✓ Pandit Ji will consult the Panchang & Nakshatras to recommend the most auspicious Muhurat.'}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="locationMessage"
                  className="block text-xs font-semibold text-[#f5b942] uppercase tracking-wider mb-2"
                >
                  {isHi ? '4. आपका स्थान / मोहल्ला / विशेष संदेश' : '4. Location / Locality / Note'}
                </label>
                <textarea
                  id="locationMessage"
                  rows={3}
                  value={locationMessage}
                  onChange={(e) => setLocationMessage(e.target.value)}
                  placeholder={
                    isHi
                      ? 'छपरा नगर, बड़ा तेलपा, दहियावां, भगवान बाजार, रिविलगंज अथवा कोई विशेष आवश्यकता'
                      : 'Chapra area, Bara Telpa, Dahiyawan, Revelganj or any specific requirements'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#120706] border border-[rgba(255,170,60,0.25)] text-[#f6e9d5] placeholder-[#c9b196]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3a3] focus-visible:border-[#f5b942] text-sm"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#0e0403] border border-[rgba(255,170,60,0.15)] text-xs">
                <div className="flex items-center justify-between text-[#c9b196] mb-2">
                  <span className="font-semibold text-[#f5b942]">
                    {isHi ? 'व्हाट्सएप संदेश पूर्वावलोकन:' : 'WhatsApp Message Preview:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="min-h-[44px] px-3 text-xs text-[#f5b942] underline hover:text-[#ff9a3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3] rounded"
                  >
                    {isCopied
                      ? isHi ? '✓ कॉपी हुआ' : '✓ Copied'
                      : isHi ? 'संदेश कॉपी करें' : 'Copy Text'}
                  </button>
                </div>
                <pre className="font-sans whitespace-pre-wrap text-[#d9c4ad] text-xs sm:text-sm leading-relaxed bg-[#150604] p-3 rounded-lg border border-neutral-800">
                  {formattedMessage}
                </pre>
              </div>

              <button
                type="submit"
                className="w-full min-h-[52px] py-4 rounded-2xl bg-[#25d366] text-[#04200e] font-bold text-base md:text-lg shadow-xl hover:brightness-105 transition flex items-center justify-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
              >
                <span aria-hidden="true">💬</span>
                <span>{isHi ? 'व्हाट्सएप पर संदेश भेजें' : 'Send to Pandit Ji on WhatsApp'}</span>
              </button>

              <div className="text-center space-y-1">
                <a
                  href={quickWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center px-3 text-xs text-[#f5b942] hover:underline"
                >
                  {isHi
                    ? 'फॉर्म नहीं भरना? सीधे सामान्य चैट करें →'
                    : 'Prefer direct chat without filling form? Click here →'}
                </a>
                <span className="text-xs text-[#c9b196] block">
                  {isHi
                    ? 'पंडित जी उपलब्धता एवं सामग्री सूची की जानकारी देंगे।'
                    : 'Pandit Ji will personally reply to confirm auspicious timing and Puja Samagri.'}
                </span>
              </div>
            </form>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="py-16 bg-[#180a08]/50 border-t border-[rgba(255,170,60,0.18)]"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold">
                {isHi ? 'यजमानों के अनुभव' : 'Devotee Testimonials'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-devanagari font-bold text-[#f5b942] mt-1.5">
                {isHi ? 'छपरा एवं सारण के परिवारों का विश्वास' : 'Trusted by Families across Chapra & Saran'}
              </h2>
              <p className="text-sm text-[#c9b196] max-w-xl mx-auto mt-2">
                {isHi
                  ? 'विभिन्न संस्कारों के प्रति यजमानों के अनुभव।'
                  : 'Feedback from families for Griha Pravesh, Satyanarayan Katha, and Weddings.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS_DATA.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl bg-[#1d0b08]/80 border border-[rgba(255,170,60,0.2)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-[#f5b942] text-sm" aria-label="5 out of 5 stars">
                        {'★'.repeat(5)}
                      </div>
                      {t.date && <span className="text-xs text-[#c9b196]">{t.date}</span>}
                    </div>
                    <p className="text-sm text-[#f6e9d5] leading-relaxed italic">
                      &ldquo;{isHi ? t.quoteHi : t.quoteEn}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[rgba(255,170,60,0.12)]">
                    <span className="text-sm font-semibold text-[#f5b942] block">
                      {isHi ? t.authorHi : t.authorEn}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-[#c9b196] mt-1">
                      <span>
                        <span aria-hidden="true">📍 </span>
                        {isHi ? t.locationHi : t.locationEn}
                      </span>
                      <span className="text-[#f5b942]/80">{isHi ? t.serviceHi : t.serviceEn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-14 max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold">
              {isHi ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-devanagari font-bold text-[#f5b942] mt-1">
              {isHi ? 'पूजा एवं विधि संबंधित जिज्ञासाएं' : 'Common Inquiries Regarding Rituals'}
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS_DATA.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#1d0b08]/80 border border-[rgba(255,170,60,0.2)]"
              >
                <h3 className="text-sm sm:text-base font-semibold text-[#f5b942] flex items-center gap-2">
                  <span aria-hidden="true">❖</span>
                  <span>{isHi ? faq.questionHi : faq.questionEn}</span>
                </h3>
                <p className="text-sm text-[#c9b196] mt-2.5 leading-relaxed pl-5">
                  {isHi ? faq.answerHi : faq.answerEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Voluntary Dakshina & Seva Donation */}
        <DakshinaDonationSection isHi={isHi} cleanPhone={cleanPhone} />

        {/* Contact & Location */}
        <section id="contact" className="py-16 bg-[#160705] border-t border-[rgba(255,170,60,0.22)]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest text-[#f5b942] font-semibold">
                {isHi ? 'सीधा संपर्क' : 'Contact & Location'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-devanagari font-bold text-[#f5b942] mt-1.5">
                {isHi ? 'निवास स्थान एवं संपर्क विवरण' : 'Residence & Direct Contact'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#1d0b08]/90 border border-[rgba(255,170,60,0.22)] flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2" aria-hidden="true">📍</span>
                  <h3 className="text-lg font-semibold text-[#f5b942] mb-1">
                    {isHi ? 'आवास एवं पूजा स्थल' : 'Address'}
                  </h3>
                  <p className="text-sm text-[#f6e9d5] leading-relaxed">
                    {isHi
                      ? 'बिन टोली, बड़ा तेलपा (बारा तेलपा), छपरा, बिहार – 841302'
                      : 'Bin Toli, Bara Telpa, Chapra, Bihar – 841302'}
                  </p>
                  <p className="text-xs text-[#c9b196] mt-2">
                    {isHi
                      ? 'सेवा क्षेत्र: छपरा नगर, रिविलगंज, एकमा, मढ़ौरा, दिघवारा, सोनपुर एवं सारण जिला।'
                      : 'Service Area: Chapra City, Revelganj, Ekma, Marhaura, Dighwara, Sonepur & Saran.'}
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Bin+Toli+Bara+Telpa+Chapra+Bihar+841302"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-xl border border-[#f5b942] text-[#f5b942] hover:bg-[#f5b942]/10 transition text-xs font-semibold"
                  >
                    <span aria-hidden="true">📍</span>
                    <span>{isHi ? 'गूगल मैप्स पर मार्ग देखें' : 'Open in Google Maps'}</span>
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#1d0b08]/90 border border-[rgba(255,170,60,0.22)] flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-2" aria-hidden="true">📞</span>
                  <h3 className="text-lg font-semibold text-[#f5b942] mb-1">
                    {isHi ? 'सीधा दूरभाष (फोन)' : 'Phone & WhatsApp'}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold font-sans-ui text-[#ffe3a3] mt-2">
                    {phoneNumber}
                  </p>
                  <p className="text-xs text-[#c9b196] mt-2">
                    {isHi
                      ? 'पंडित प्रद्युम्न पाठक से सीधे बात करें (प्रातः 7:00 – रात्रि 9:00)।'
                      : 'Direct conversation with Pandit Pradhuman Pathak (7:00 AM – 9:00 PM).'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <a
                    href={telUrl}
                    className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] text-xs font-bold shadow-md hover:brightness-105 transition"
                  >
                    <span aria-hidden="true">📞</span>
                    <span>{isHi ? 'कॉल करें' : 'Call Now'}</span>
                  </a>
                  <a
                    href={quickWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] text-[#04200e] text-xs font-bold shadow-md hover:brightness-105 transition"
                  >
                    <span aria-hidden="true">💬</span>
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={smsUrl}
                    className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-xl border border-[#f5b942]/50 text-[#f5b942] hover:bg-[#f5b942]/10 text-xs font-bold transition"
                  >
                    <span aria-hidden="true">✉️</span>
                    <span>{isHi ? 'SMS भेजें' : 'Text Pandit Ji'}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-4xl mx-auto">
              <VedicPriestMap isHindi={isHi} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Grandson Attribution */}
      <footer className="py-8 px-4 text-center text-xs text-[#c9b196] border-t border-[rgba(255,170,60,0.18)] space-y-1.5">
        <p className="text-sm font-devanagari text-[#f5b942]">
          ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॐ
        </p>
        <p>
          © 2026{' '}
          {isHi
            ? 'पंडित प्रद्युम्न पाठक · छपरा, बिहार (841302)'
            : 'Pandit Pradhuman Pathak · Chapra, Bihar (841302)'}
        </p>
        <p className="text-xs text-[#f5b942]/90">
          {isHi
            ? 'उनके पोते राज पाठक द्वारा निर्मित · Made by his grandson Raj Pathak'
            : 'Made by his grandson Raj Pathak'}
        </p>
      </footer>

      {/* Single Consolidated Mobile Sticky Bottom Bar (Call | WhatsApp | AI Chat) */}
      <div
        role="region"
        aria-label={isHi ? 'त्वरित संपर्क विकल्प' : 'Quick Contact Actions'}
        className="fixed md:hidden bottom-0 left-0 right-0 z-40 p-2 bg-[#120706]/95 backdrop-blur-md border-t border-[rgba(255,170,60,0.25)] grid grid-cols-3 gap-2"
      >
        <a
          href={telUrl}
          className="min-h-[48px] px-2 py-2.5 rounded-xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <span aria-hidden="true">📞</span>
          <span>{isHi ? 'कॉल' : 'Call'}</span>
        </a>
        <a
          href={quickWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-2 py-2.5 rounded-xl bg-[#25d366] text-[#04200e] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <span aria-hidden="true">💬</span>
          <span>WhatsApp</span>
        </a>
        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="min-h-[48px] px-2 py-2.5 rounded-xl border border-[#f5b942]/60 bg-[#1d0b08] text-[#f5b942] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <span aria-hidden="true">🪔</span>
            <span>{isHi ? 'सामग्री Chat' : 'AI Chat'}</span>
          </button>
        )}
      </div>

      {/* Accessible Service Details Modal with Focus Trap */}
      {activeModalService && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleCloseServiceModal();
          }}
        >
          <div
            ref={serviceModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            className="bg-[#1d0b08] border border-[#f5b942]/40 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={handleCloseServiceModal}
              aria-label="Close service details"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#120706] text-[#c9b196] hover:text-[#f5b942] flex items-center justify-center text-base font-bold border border-[rgba(255,170,60,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffe3a3]"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4 pr-12">
              <span
                className="text-3xl p-2 rounded-xl bg-[#2a110b] border border-[#f5b942]/30"
                aria-hidden="true"
              >
                {activeModalService.icon}
              </span>
              <div>
                <h3
                  id="service-modal-title"
                  className="text-xl font-devanagari font-bold text-[#f5b942]"
                >
                  {isHi ? activeModalService.nameHi : activeModalService.nameEn}
                </h3>
                <span className="text-xs text-[#c9b196]">
                  {isHi ? activeModalService.nameEn : activeModalService.nameHi}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#d9c4ad]">
              <div className="p-3 rounded-xl bg-[#120706]/70 border border-[rgba(255,170,60,0.15)]">
                <span className="text-[#f5b942] font-semibold block mb-1">
                  <span aria-hidden="true">⏱ </span>
                  {isHi ? 'अनुष्ठान अवधि:' : 'Ceremony Duration:'}
                </span>
                <p>{isHi ? activeModalService.durationHi : activeModalService.durationEn}</p>
              </div>
              <div>
                <span className="text-[#f5b942] font-semibold text-sm block mb-1">
                  {isHi ? 'धार्मिक एवं आध्यात्मिक महत्व:' : 'Spiritual Significance:'}
                </span>
                <p className="leading-relaxed">
                  {isHi ? activeModalService.significanceHi : activeModalService.significanceEn}
                </p>
              </div>
              <div>
                <span className="text-[#f5b942] font-semibold text-sm block mb-2">
                  {isHi ? 'पूजा की आवश्यक सामग्री (संक्षिप्त सूची):' : 'Key Puja Samagri Checklist:'}
                </span>
                <ul className="grid grid-cols-1 gap-1.5 pl-2">
                  {(isHi ? activeModalService.samagriHi : activeModalService.samagriEn).map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#f5b942] text-xs" aria-hidden="true">❖</span>
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
                <p className="text-xs text-[#c9b196] mt-2 italic">
                  {isHi
                    ? '* बुकिंग के उपरांत संपूर्ण विस्तृत सामग्री सूची व्हाट्सएप पर साझा की जाएगी।'
                    : '* The complete itemized list will be shared on WhatsApp upon booking.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(255,170,60,0.2)] flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleSelectServiceFromCard(activeModalService);
                  handleCloseServiceModal();
                }}
                className="flex-1 min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-[#f5b942] to-[#ff7a1a] text-[#120706] font-bold text-xs sm:text-sm"
              >
                {isHi ? 'यह पूजा बुक करें' : 'Book This Puja'}
              </button>
              <a
                href={buildWhatsAppUrl(
                  cleanPhone,
                  isHi
                    ? `🙏 प्रणाम पंडित जी, मुझे ${activeModalService.nameHi} के संबंध में सामग्री सूची एवं मुहूर्त जानकारी चाहिए।`
                    : `🙏 Namaste Pandit Ji, I want to inquire about Samagri & Muhurat for ${activeModalService.nameEn}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] py-3 px-4 rounded-xl bg-[#25d366] text-[#04200e] font-bold text-xs sm:text-sm flex items-center justify-center"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
