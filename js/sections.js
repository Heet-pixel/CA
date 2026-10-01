import { stats, values } from './data.js';
import { icon, esc } from './ui.js';

// Numbers count up from 0 to their final value every time the page opens or refreshes.
export function renderStats(el) {
  el.innerHTML = stats.map((s) => {
    const m = String(s.value).match(/^(\d+)(.*)$/);
    return `<div class="stat"><b><span class="num" data-to="${m[1]}" data-suffix="${esc(m[2])}" aria-hidden="true">0${esc(m[2])}</span><span class="sr">${esc(s.value)}</span></b><span>${esc(s.label)}</span></div>`;
  }).join('');
  countUp(el);
}

function countUp(el) {
  const nums = [...el.querySelectorAll('.num')];
  const finish = () => nums.forEach((n) => (n.textContent = n.dataset.to + n.dataset.suffix));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
  const run = () => {
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      nums.forEach((n) => (n.textContent = Math.round(+n.dataset.to * ease) + n.dataset.suffix));
      if (p < 1) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
  };
  // wait for the logo splash to finish, then start when the numbers scroll into view
  const wait = document.documentElement.classList.contains('splashing') ? 1900 : 0;
  setTimeout(() => {
    if (!('IntersectionObserver' in window)) return run();
    const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.4 });
    io.observe(el);
  }, wait);
}

export function renderValues(el) {
  el.innerHTML = values.map((v, i) => `<div class="value v${i % 4}"><span class="vi">${icon(v.icon, 24)}</span><b>${esc(v.title)}</b><span class="vt">${esc(v.text)}</span></div>`).join('');
}
