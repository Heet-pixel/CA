import { services } from './data.js';
import { esc, icon } from './ui.js';

export function renderServices(el) {
  const limit = +el.dataset.limit || services.length;
  el.innerHTML = services.slice(0, limit).map((s) => `
    <article class="service" id="${s.id}">
      <span class="ico">${icon('grid', 22)}</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.blurb)}</p>
      <a href="/get-in-touch.html?msg=${encodeURIComponent('I would like to know more about: ' + s.title)}">Enquire about this service</a>
    </article>`).join('');
}
