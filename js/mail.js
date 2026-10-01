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
  if (!MAIL_ENABLED || !MAIL_TO) return false;
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
    const ok = res.ok && String(data.success) !== 'false';
    if (!ok) console.warn('[mail] FormSubmit did not accept the email:', data.message || res.status);
    return ok;
  } catch (err) {
    console.warn('[mail] email not sent:', err.message);
    return false;
  }
}
