/**
 * Utility functions for Vedic Priest booking, WhatsApp/SMS/Tel formatting, and audit calculation.
 */

export interface BookingData {
  serviceId: string;
  serviceHindi: string;
  serviceEnglish: string;
  customerName: string;
  date?: string;
  needsMuhurat: boolean;
  locationMessage?: string;
  language: 'hi' | 'en';
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function formatWhatsAppMessage(data: BookingData): string {
  const isHi = data.language === 'hi';
  const greeting = isHi
    ? '🙏 प्रणाम पंडित जी (Pandit Pradhuman Pathak Ji),'
    : '🙏 Namaste Pandit Pradhuman Pathak Ji,';

  const serviceLine = isHi
    ? `• पूजा / सेवा: ${data.serviceHindi} (${data.serviceEnglish})`
    : `• Vedic Service: ${data.serviceEnglish} (${data.serviceHindi})`;

  const nameLine = data.customerName.trim()
    ? isHi
      ? `• यजमान का नाम: ${data.customerName.trim()}`
      : `• Devotee Name: ${data.customerName.trim()}`
    : '';

  let dateLine = '';
  if (data.needsMuhurat) {
    dateLine = isHi
      ? '• तिथि: शुभ मुहूर्त विचार कराना है (Date: Need Muhurat consultation)'
      : '• Date: Auspicious Muhurat consultation requested';
  } else if (data.date) {
    dateLine = isHi ? `• पसंदीदा तिथि: ${data.date}` : `• Preferred Date: ${data.date}`;
  }

  const locationLine = data.locationMessage?.trim()
    ? isHi
      ? `• स्थान / विवरण: ${data.locationMessage.trim()}`
      : `• Location / Details: ${data.locationMessage.trim()}`
    : '';

  const closing = isHi
    ? 'कृपया पूजा सामग्री सूची एवं अपनी उपलब्धता बताएं। सादर प्रणाम।'
    : 'Please let me know your availability and the required Puja Samagri list. Thank you.';

  const lines = [greeting, '', serviceLine];
  if (nameLine) lines.push(nameLine);
  if (dateLine) lines.push(dateLine);
  if (locationLine) lines.push(locationLine);
  lines.push('', closing);

  return lines.join('\n');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = cleanPhoneNumber(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(phone: string): string {
  const clean = cleanPhoneNumber(phone);
  return `tel:+${clean}`;
}

export function buildSmsUrl(phone: string, message: string): string {
  const clean = cleanPhoneNumber(phone);
  return `sms:+${clean}?body=${encodeURIComponent(message)}`;
}

export interface AuditCriterion {
  id: string;
  category: 'Aesthetics' | 'Usability' | 'Copywriting' | 'Conversion' | 'Technical';
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Quick Win';
  score: number; // 0 - 10
  originalState: string;
  recommendation: string;
  benefit: string;
  codeSnippet?: string;
}

export function calculateAuditSummary(criteria: AuditCriterion[]): {
  overallScore: number;
  categoryScores: Record<string, number>;
  criticalCount: number;
  highCount: number;
} {
  if (criteria.length === 0) {
    return { overallScore: 0, categoryScores: {}, criticalCount: 0, highCount: 0 };
  }

  const categoryTotals: Record<string, { total: number; count: number }> = {};
  let totalScore = 0;
  let criticalCount = 0;
  let highCount = 0;

  for (const c of criteria) {
    totalScore += c.score;
    if (c.severity === 'Critical') criticalCount++;
    if (c.severity === 'High') highCount++;

    if (!categoryTotals[c.category]) {
      categoryTotals[c.category] = { total: 0, count: 0 };
    }
    categoryTotals[c.category].total += c.score;
    categoryTotals[c.category].count += 1;
  }

  const categoryScores: Record<string, number> = {};
  for (const [cat, data] of Object.entries(categoryTotals)) {
    categoryScores[cat] = Math.round((data.total / (data.count * 10)) * 100);
  }

  const overallScore = Math.round((totalScore / (criteria.length * 10)) * 100);

  return {
    overallScore,
    categoryScores,
    criticalCount,
    highCount,
  };
}
