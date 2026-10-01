import { events, achievements } from './data.js';
import { esc, openDialog } from './ui.js';

export function renderEvents(el) {
  el.innerHTML = events.length
    ? events.map((e) => `<article class="service"><h3>${esc(e.title)}</h3><p class="muted">${esc(e.date)}${e.place ? ', ' + esc(e.place) : ''}</p><p>${esc(e.text)}</p></article>`).join('')
    : '<p class="empty">No events are listed right now. Please check back soon.</p>';
}

// Success stories (images) shown on the About page; click to view larger
export function renderStories(el) {
  el.innerHTML = achievements.stories.map((s, i) => `
    <button class="story" type="button" data-i="${i}" aria-label="Open story: ${esc(s.title)}"><img src="${s.image}" alt="${esc(s.title)}" loading="lazy"></button>`).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.story');
    if (b) { const s = achievements.stories[+b.dataset.i]; openDialog(`<img class="zoom" src="${s.image}" alt="${esc(s.title)}">`, 'wide'); }
  });
}
