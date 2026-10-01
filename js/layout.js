import { brand, services } from './data.js';
import { icon } from './ui.js';

const links = [['/', 'Home'], ['/about.html', 'About'], ['/services.html', 'Services'], ['/events.html', 'Events'], ['/careers.html', 'Careers']];

export function mountLayout() {
  let path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (path === '/index') path = '/';
  const cur = (h) => (path === h.replace(/\.html$/, '') ? ' aria-current="page"' : '');

  const items = links.map(([h, t]) => {
    if (h !== '/services.html') return `<a class="link" href="${h}"${cur(h)}>${t}</a>`;
    return `<div class="dd">
      <a class="link" href="${h}"${cur(h)}>${t}</a>
      <button class="caret" type="button" aria-expanded="false" aria-label="Show all services">${icon('down', 14)}</button>
      <div class="mega"><div class="mega-in">${services.map((s) => `<a href="/services.html#${s.id}">${s.title}</a>`).join('')}</div></div>
    </div>`;
  }).join('');

  document.getElementById('nav').innerHTML = `
    <div class="nav"><div class="nav-in">
      <a class="brand" href="/" aria-label="${brand.name} home">
        <img src="/images/logo-96.png" alt="" width="52" height="52">
        <span><b>${brand.name}</b><small>${brand.tagline}</small></span>
      </a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="links">Menu</button>
      <nav id="links" class="links" aria-label="Main">${items}<a class="cta" href="/get-in-touch.html"${cur('/get-in-touch.html')}>Get in Touch ${icon('arrow', 18)}</a></nav>
    </div></div>`;

  const contact = [brand.address, brand.email && `<a href="mailto:${brand.email}">${brand.email}</a>`, brand.phone && `<a href="tel:${brand.phone.replace(/\s/g, '')}">${brand.phone}</a>`].filter(Boolean);
  document.getElementById('footer').innerHTML = `
    <div class="wrap foot">
      <div><a class="brand light" href="/"><img src="/images/logo-96.png" alt="" width="46" height="46"><span><b>${brand.name}</b><small>${brand.tagline}</small></span></a></div>
      <div>${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="/get-in-touch.html">Get in Touch</a></div>
      <div>${contact.map((c) => `<p>${c}</p>`).join('')}</div>
    </div>
    <p class="copy">&copy; ${new Date().getFullYear()} ${brand.name} ${brand.tagline}</p>`;

  const nav = document.querySelector('.nav');
  const menuBtn = nav.querySelector('.menu-btn');
  const list = nav.querySelector('.links');
  const dd = nav.querySelector('.dd');
  const caret = nav.querySelector('.caret');
  menuBtn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  caret.addEventListener('click', () => {
    const open = dd.classList.toggle('open');
    caret.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) { dd.classList.remove('open'); list.classList.remove('open'); } });
  nav.addEventListener('click', (e) => { if (e.target.closest('.mega a, .links > a')) { list.classList.remove('open'); dd.classList.remove('open'); } });
}
