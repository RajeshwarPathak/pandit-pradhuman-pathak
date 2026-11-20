export type Language = 'hi' | 'en';

export interface VedicService {
  id: string;
  icon: string;
  nameHi: string;
  nameEn: string;
  category: 'sanskar' | 'puja' | 'astrology' | 'muhurat';
  shortDescHi: string;
  shortDescEn: string;
  durationHi: string;
  durationEn: string;
  significanceHi: string;
  significanceEn: string;
  samagriHi: string[];
  samagriEn: string[];
}

export interface Testimonial {
  id: string;
  authorHi: string;
  authorEn: string;
  locationHi: string;
  locationEn: string;
  serviceHi: string;
  serviceEn: string;
  quoteHi: string;
  quoteEn: string;
  date: string;
}

export interface FaqItem {
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
}
