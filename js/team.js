import { partners, experts } from './data.js';
import { esc, openDialog } from './ui.js';

const card = (m, group, i) => `
  <button class="member" type="button" data-group="${group}" data-i="${i}" aria-label="View details of ${esc(m.name)}">
    <img src="${m.photo}" alt="${esc(m.name)}" loading="lazy">
    <span class="info"><strong>${esc(m.name)}</strong>${m.role ? `<span>${esc(m.role)}</span>` : ''}<small>${esc(m.quals)}</small></span>
  </button>`;

function profile(m) {
  const msg = encodeURIComponent(`Hello, I would like to speak with ${m.name}.`);
  openDialog(`
    <article class="profile">
      <img src="${m.photo}" alt="${esc(m.name)}">
      <div>
        <h2>${esc(m.name)}</h2>
        ${m.role ? `<p class="role">${esc(m.role)}</p>` : ''}
        <p class="quals">${esc(m.quals)}</p>
        ${m.expertise ? `<p><strong>Expertise:</strong> ${esc(m.expertise)}</p>` : ''}
        ${m.bio ? `<p>${esc(m.bio)}</p>` : ''}
        <a class="btn small" href="/get-in-touch.html?msg=${msg}">Contact ${esc(m.name)}</a>
      </div>
    </article>`, 'wide');
}

export function renderTeam(el) {
  const list = el.dataset.group === 'experts' ? experts : partners;
  el.innerHTML = list.map((m, i) => card(m, el.dataset.group, i)).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.member');
    if (b) profile(list[+b.dataset.i]);
  });
}
