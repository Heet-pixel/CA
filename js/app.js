// Entry point: every page loads this file. It fills in whatever containers the page has.
import { mountLayout } from './layout.js';
import { renderServices } from './services.js';
import { renderTeam } from './team.js';
import { renderEvents, renderStories } from './events.js';
import { renderStats, renderValues } from './sections.js';
import { mountContactForm } from './forms.js';
import { mountCareerForm } from './careers.js';
import { mountChat } from './chat.js';
import { about, achievements, brand } from './data.js';

const on = (sel, fn) => document.querySelectorAll(sel).forEach(fn);

mountLayout();
on('#services', renderServices);
on('[data-team]', renderTeam);
on('#events', renderEvents);
on('#stories', renderStories);
on('[data-stats]', renderStats);
on('[data-values]', renderValues);
on('#contact-form', mountContactForm);
on('#career-form', mountCareerForm);
mountChat();

// text that lives in data.js
const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
document.querySelectorAll('.about-intro').forEach((el) => (el.textContent = about.intro));
set('ach-kicker', achievements.kicker);
set('ach-heading', achievements.heading);
set('ach-text', achievements.text);
const more = document.getElementById('about-more');
if (more) more.innerHTML = about.paragraphs.map(() => '<p></p>').join('');
if (more) more.querySelectorAll('p').forEach((el, i) => (el.textContent = about.paragraphs[i]));
const info = document.getElementById('contact-info');
if (info) info.innerHTML = [brand.address, brand.email && `<a href="mailto:${brand.email}">${brand.email}</a>`, brand.phone && `<a href="tel:${brand.phone.replace(/\s/g, '')}">${brand.phone}</a>`].filter(Boolean).map((c) => `<p>${c}</p>`).join('');

// jump to a section when the URL has #id (fixed nav needs a small delay)
if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 60);
