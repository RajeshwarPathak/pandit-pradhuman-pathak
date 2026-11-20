import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanPhoneNumber,
  formatWhatsAppMessage,
  buildWhatsAppUrl,
  buildTelUrl,
  buildSmsUrl,
  calculateAuditSummary,
  AuditCriterion,
} from './booking.ts';

test('cleanPhoneNumber strips spaces and special characters', () => {
  assert.equal(cleanPhoneNumber('+91 98529 38708'), '919852938708');
  assert.equal(cleanPhoneNumber('+91-98529-38708'), '919852938708');
  assert.equal(cleanPhoneNumber('9852938708'), '9852938708');
});

test('formatWhatsAppMessage formats Hindi message with Muhurat note', () => {
  const msg = formatWhatsAppMessage({
    serviceId: 'satyanarayan',
    serviceHindi: 'सत्यनारायण पूजा',
    serviceEnglish: 'Satyanarayan Puja',
    customerName: 'राजेश पाठक',
    needsMuhurat: true,
    locationMessage: 'बड़ा तेलपा, छपरा',
    language: 'hi',
  });

  assert.ok(msg.includes('प्रणाम पंडित जी'));
  assert.ok(msg.includes('सत्यनारायण पूजा'));
  assert.ok(msg.includes('राजेश पाठक'));
  assert.ok(msg.includes('शुभ मुहूर्त विचार कराना है'));
  assert.ok(msg.includes('बड़ा तेलपा, छपरा'));
});

test('formatWhatsAppMessage formats English message with specific date', () => {
  const msg = formatWhatsAppMessage({
    serviceId: 'grihapravesh',
    serviceHindi: 'गृह प्रवेश',
    serviceEnglish: 'Griha Pravesh',
    customerName: 'Amit Verma',
    date: '2026-11-20',
    needsMuhurat: false,
    locationMessage: 'Dak Bungalow Road, Chapra',
    language: 'en',
  });

  assert.ok(msg.includes('Namaste Pandit Pradhuman Pathak Ji'));
  assert.ok(msg.includes('Griha Pravesh'));
  assert.ok(msg.includes('Amit Verma'));
  assert.ok(msg.includes('2026-11-20'));
  assert.ok(msg.includes('Dak Bungalow Road, Chapra'));
});

test('buildWhatsAppUrl constructs valid wa.me URL', () => {
  const url = buildWhatsAppUrl('+91 98529 38708', 'Hello Pandit Ji');
  assert.ok(url.startsWith('https://wa.me/919852938708?text=Hello%20Pandit%20Ji'));
});

test('buildTelUrl and buildSmsUrl use full E.164 format', () => {
  assert.equal(buildTelUrl('+91 98529 38708'), 'tel:+919852938708');
  assert.equal(
    buildSmsUrl('+91 98529 38708', 'Namaste Pandit Ji'),
    'sms:+919852938708?body=Namaste%20Pandit%20Ji'
  );
});

test('calculateAuditSummary aggregates scores and severities correctly', () => {
  const sampleCriteria: AuditCriterion[] = [
    {
      id: '1',
      category: 'Conversion',
      title: 'CTA Contrast',
      severity: 'Critical',
      score: 4,
      originalState: 'Low contrast',
      recommendation: 'Increase contrast',
      benefit: 'Higher CTR',
    },
    {
      id: '2',
      category: 'Conversion',
      title: 'Form Validation',
      severity: 'High',
      score: 6,
      originalState: 'Basic check',
      recommendation: 'Add instant feedback',
      benefit: 'Fewer dropoffs',
    },
    {
      id: '3',
      category: 'Aesthetics',
      title: 'Typography Pairing',
      severity: 'Medium',
      score: 8,
      originalState: 'Cinzel + Mukta',
      recommendation: 'Refine scale',
      benefit: 'Better visual flow',
    },
  ];

  const summary = calculateAuditSummary(sampleCriteria);
  assert.equal(summary.criticalCount, 1);
  assert.equal(summary.highCount, 1);
  assert.equal(summary.overallScore, 60);
  assert.equal(summary.categoryScores['Conversion'], 50);
  assert.equal(summary.categoryScores['Aesthetics'], 80);
});
