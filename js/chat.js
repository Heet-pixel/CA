// "Ask AVKAS AI": a click-only helper. Visitors tap ready-made questions; nothing is typed.
// Answers are written here (and pulled from data.js), so they always match the website.
import { brand, services, partners, values, stats } from './data.js';
import { icon, esc } from './ui.js';
import { prepare, save } from './store.js';
import { SAVE_TO_FILE } from './config.js';
import { phoneOk } from './forms.js';

const svc = (id) => services.find((s) => s.id === id);
const withBlurb = (ids) => ids.map((id) => `${svc(id).title}: ${svc(id).blurb}`);
const contactLines = [brand.address, brand.email, brand.phone].filter(Boolean);

// Add or edit questions here. next = follow-up questions shown after the answer.
const T = {
  services: { q: 'What services do you offer?', icon: 'grid', text: `We offer ${services.length} services across audit, tax, advisory and compliance. A few of them:`, points: services.slice(0, 6).map((s) => s.title), links: [['See all services', '/services.html']], next: ['audit', 'tax', 'startup'] },
  why: { q: `Why choose ${brand.name}?`, icon: 'shield', text: `We are future-ready advisors, strategic finance partners and trusted governance stewards. What guides us:`, points: values.map((v) => `${v.title}: ${v.text}`), next: ['numbers', 'partners', 'consult'] },
  careers: { q: 'Are there career opportunities?', icon: 'briefcase', text: 'You can apply any time. Fill in the form on our Careers page and attach your resume (PDF, DOC or DOCX, up to 5 MB).', links: [['Apply now', '/careers.html']], next: ['consult', 'why', 'contact'] },
  consult: { q: 'How do I book a consultation?', icon: 'calendar', text: 'Send us a short message on the Get in Touch page and tell us what you need help with. We will contact you within 2 working days.', links: [['Book a consultation', '/get-in-touch.html?msg=' + encodeURIComponent('I would like to book a consultation.')]], next: ['services', 'contact', 'partners'] },
  partners: { q: 'Who are the partners?', icon: 'users', text: 'Our partners are:', points: partners.map((p) => `${p.name}, ${p.role}`), links: [['Meet the team', '/about.html#partners']], next: ['why', 'consult'] },
  audit: { q: 'Do you handle audits?', icon: 'shield', text: 'Yes. Our audit-related services include:', points: withBlurb(['auditing-and-assurance', 'bank-audit-government-audit', 'forensic-audit-dispute']), links: [['All services', '/services.html']], next: ['tax', 'consult'] },
  tax: { q: 'Can you help with tax and compliance?', icon: 'chart', text: 'Yes. Relevant services:', points: withBlurb(['strategic-tax-regulatory', 'registration-certification-compliance', 'corporate-law-governance']), next: ['audit', 'consult'] },
  startup: { q: 'Do you help startups?', icon: 'bulb', text: 'Yes. Startups usually start with these services:', points: withBlurb(['startup-advisory', 'registration-certification-compliance', 'virtual-cfo']), next: ['cfo', 'consult'] },
  cfo: { q: 'What is a Virtual CFO?', icon: 'target', text: svc('virtual-cfo').blurb, links: [['Ask about Virtual CFO', '/get-in-touch.html?msg=' + encodeURIComponent('I would like to know more about: Virtual CFO')]], next: ['startup', 'consult'] },
  numbers: { q: 'What is your experience?', icon: 'trophy', text: 'In numbers:', points: stats.map((s) => `${s.value} ${s.label}`), next: ['partners', 'why'] },
  contact: { q: 'How can I contact you?', icon: 'mail', text: 'Please enter your mobile number below and our team will call you back shortly.', next: ['consult', 'careers'] },
};
const ROOT = Object.keys(T);

export function mountChat() {
  const root = document.createElement('div');
  root.id = 'chat';
  root.innerHTML = `
    <section id="chat-panel" class="panel-chat" role="dialog" aria-label="Ask ${brand.short} AI" hidden>
      <header>
        <span class="avatar">${icon('spark', 22)}</span>
        <div><strong>Ask ${brand.short} AI</strong><small><i></i> Online</small></div>
        <button class="min" type="button" aria-label="Close chat">${icon('minus', 20)}</button>
      </header>
      <div class="chat-body" aria-live="polite"></div>
    </section>
    <span class="tip">Ask ${brand.short} AI</span>
    <button class="fab" type="button" aria-expanded="false" aria-controls="chat-panel" aria-label="Open Ask ${brand.short} AI chat">${icon('robot', 34)}</button>`;
  document.body.append(root);

  const panel = root.querySelector('#chat-panel');
  const body = root.querySelector('.chat-body');
  const fab = root.querySelector('.fab');
  const tip = root.querySelector('.tip');
  let started = false;

  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const bubble = (cls, html) => { const d = document.createElement('div'); d.className = 'bub ' + cls; d.innerHTML = html; body.append(d); scroll(); return d; };
  const opts = (keys) => {
    const w = document.createElement('div');
    w.className = 'opts';
    w.innerHTML = keys.map((k) => `<button type="button" class="opt" data-k="${k}">${icon(T[k].icon, 20)}<span>${esc(T[k].q)}</span>${icon('chevron', 16)}</button>`).join('')
      + (keys === ROOT ? '' : `<button type="button" class="opt menu" data-k="_menu">${icon('grid', 20)}<span>Show all questions</span>${icon('chevron', 16)}</button>`);
    body.append(w);
    scroll();
  };

  function answer(k) {
    const t = T[k];
    const html = `${t.text.split('\n').map((l) => `<p>${esc(l)}</p>`).join('')}${t.points ? `<ul>${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${(t.links || []).map(([l, h]) => `<a class="go" href="${h}">${esc(l)} ${icon('arrow', 16)}</a>`).join('')}`;
    const typing = bubble('bot typing', '<span></span><span></span><span></span>');
    setTimeout(() => {
      typing.remove();
      bubble('bot', html);
      if (k === 'contact') callbackForm();
      opts(t.next);
    }, 550);
  }

  // "How can I contact you?" asks for the visitor's mobile number and sends it
  // straight to the admin: it is saved as an enquiry (Communication > Website messages)
  // exactly like a contact-form submission.
  function callbackForm() {
    const wrap = document.createElement('div');
    wrap.className = 'bub bot callback';
    wrap.innerHTML = `<form class="cb-form">
        <input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="Enter your mobile number" required>
        <button type="submit" aria-label="Request a callback">${icon('arrow', 16)}</button>
      </form>
      <p class="cb-msg" hidden></p>`;
    body.append(wrap);
    scroll();
  }

  body.addEventListener('submit', async (e) => {
    const form = e.target.closest('.cb-form');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input[name=phone]');
    const msgEl = form.nextElementSibling;
    const phone = input.value.trim();
    if (!phoneOk(phone)) {
      msgEl.hidden = false; msgEl.textContent = 'Enter a valid mobile number.'; msgEl.className = 'cb-msg error';
      return;
    }
    const btn = form.querySelector('button');
    btn.disabled = true;
    if (SAVE_TO_FILE) prepare();
    try {
      await save({ type: 'contact', name: 'Website Chat Visitor', email: '', phone, message: 'Callback request from the website chat. Please call this visitor on the mobile number provided.' });
      form.outerHTML = '<p class="cb-msg ok">Thank you! Your number has been sent to our team. We will call you soon.</p>';
    } catch (err) {
      msgEl.hidden = false; msgEl.textContent = err.message || 'Could not send. Please try again.'; msgEl.className = 'cb-msg error';
      btn.disabled = false;
    }
    scroll();
  });

  body.addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b) return;
    const k = b.dataset.k;
    body.querySelectorAll('.opts').forEach((o) => o.remove());
    if (k === '_menu') {
      bubble('user', 'Show all questions');
      bubble('bot', '<p>What would you like to know?</p>');
      opts(ROOT);
    } else {
      bubble('user', esc(T[k].q));
      answer(k);
    }
  });

  function toggle(open) {
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', open);
    tip.hidden = open;
    if (open) {
      if (!started) {
        started = true;
        bubble('bot', `<p>Hi! I'm ${brand.short} AI, your assistant.</p><p>Tap any question below to learn about our services, team, career opportunities or how we can help you.</p>`);
        opts(ROOT);
      }
      panel.querySelector('.opt')?.focus({ preventScroll: true });
    } else fab.focus();
  }
  fab.addEventListener('click', () => toggle(panel.hidden));
  root.querySelector('.min').addEventListener('click', () => toggle(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) toggle(false); });
}
