import { prepare, save } from './store.js';
import { toast } from './ui.js';
import { SAVE_TO_FILE } from './config.js';

export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const phoneOk = (v) => { const d = v.replace(/\D/g, ''); return d.length >= 8 && d.length <= 15; };

// Shared submit handler: validate(), then save to the .txt file, then show the result.
export function wire(form, { success, validate, build }) {
  const msg = form.querySelector('.msg-line');
  const btn = form.querySelector('button[type=submit]');
  const label = btn.textContent;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'msg-line';
    msg.textContent = '';
    const problem = validate(form);
    if (problem) { msg.classList.add('bad'); msg.textContent = problem; return; }
    btn.disabled = true;
    btn.textContent = 'Sending...';
    if (SAVE_TO_FILE) prepare(); // lets the browser ask for file access while the click still counts
    try {
      await save(await build(form));
      form.reset();
      msg.classList.add('good');
      msg.textContent = success;
      toast(success);
    } catch (ex) {
      msg.classList.add('bad');
      msg.textContent = ex.message;
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}

// Get in Touch page (email is optional, mobile number is required)
export function mountContactForm(el) {
  el.innerHTML = `
    <form class="form" novalidate>
      <label>Full Name<input name="name" autocomplete="name" required></label>
      <label>Your Mobile Number<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
      <label>Your Email (optional)<input name="email" type="email" autocomplete="email" inputmode="email"></label>
      <label>Your Message<textarea name="message" rows="6" required></textarea></label>
      <p class="msg-line" role="alert" aria-live="polite"></p>
      <button class="btn block" type="submit">Send Message</button>
    </form>`;
  const form = el.querySelector('form');
  const pre = new URLSearchParams(location.search).get('msg');
  if (pre) form.elements.message.value = pre.slice(0, 500);
  wire(form, {
    success: 'Thank you — your message has been sent. We will get back to you shortly.',
    validate: (f) => {
      const v = (n) => f.elements[n].value.trim();
      if (v('name').length < 2) return 'Enter your name.';
      if (!phoneOk(v('phone'))) return 'Enter a valid mobile number so we can contact you.';
      if (v('email') && !emailOk(v('email'))) return 'Enter a valid email address or leave it empty.';
      if (v('message').length < 10) return 'Write at least 10 characters in your message.';
    },
    build: (f) => {
      const v = (n) => f.elements[n].value.trim();
      return { type: 'contact', name: v('name'), email: v('email').toLowerCase(), phone: v('phone'), message: v('message') };
    },
  });
}
