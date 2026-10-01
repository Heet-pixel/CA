// Emails every submission (resume attached for job applications) via FormSubmit.co.
// Best effort: if the internet is down or the email fails, the entry is still saved in the .txt file.
import { MAIL_ENABLED, MAIL_TO, FIRM_NAME } from './config.js';

function toBlob(rec) {
  const bin = atob(rec.resumeData);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: rec.resumeType || 'application/octet-stream' });
}

export async function notify(rec) {
  if (!MAIL_ENABLED || !MAIL_TO) return { ok: false, reason: 'off' };
  const career = rec.type === 'career';
  const fd = new FormData();
  fd.append('_subject', career ? `New job application: ${rec.position} — ${rec.name}` : `New website enquiry: ${rec.name}`);
  fd.append('_template', 'table');
  fd.append('_captcha', 'false');
  if (rec.email) fd.append('_replyto', rec.email);
  fd.append('Type', career ? 'Career application' : 'Contact form');
  fd.append('Name', rec.name);
  fd.append('Mobile', rec.phone);
  fd.append('Email', rec.email || '-');
  if (career) fd.append('Position', rec.position);
  fd.append('Message', rec.message || '-');
  fd.append('Received', new Date(rec.createdAt).toLocaleString());
  fd.append('Website', FIRM_NAME);
  if (career && rec.resumeData) fd.append('attachment', toBlob(rec), rec.resumeName || 'resume');

  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20000);
    const res = await fetch(`https://formsubmit.co/ajax/${MAIL_TO}`, { method: 'POST', headers: { Accept: 'application/json' }, body: fd, signal: ctl.signal });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    if (res.ok && String(data.success) !== 'false') return { ok: true };
    console.warn('[mail] FormSubmit did not accept the email:', data.message || res.status);
    return { ok: false, reason: /activat/i.test(data.message || '') ? 'activation' : 'service', detail: data.message || `HTTP ${res.status}` };
  } catch (err) {
    console.warn('[mail] email not sent:', err.message);
    return { ok: false, reason: 'network', detail: err.message };
  }
}

/** Plain-language explanation shown to the person who pressed Send. */
export function explain(r) {
  if (r.reason === 'activation') return 'The email service needs a one-time activation. Open the activation email from FormSubmit in your inbox (check Spam), click Activate, then send again.';
  if (r.reason === 'network') return 'Could not reach the email service. Please check your internet connection and try again.';
  return `The email service did not accept the message${r.detail ? ' (' + r.detail + ')' : ''}. Please try again.`;
}
