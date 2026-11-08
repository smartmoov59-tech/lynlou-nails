/* =====================================================================
   Lynlou Nails — interactions & animations (GSAP + ScrollTrigger + Lenis)
   Les données (prix, avis, horaires) viennent de assets/js/data.js
   ===================================================================== */
(() => {
  'use strict';

  const D = window.LYNLOU;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const NBSP = ' ';
  const money = (n) => n + NBSP + '€';
  const fmt = (n, dec = 0) => n.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const lerp = (a, b, t) => a + (b - a) * t;

  let lenis = null;

  /* ------------------------------------------------------------------
     1. RENDU DES DONNÉES
     ------------------------------------------------------------------ */
  const PICKS = { semi: [5, 7, 1], pieds: [0, 7, 8], resine: [0, 1, 9], gel: [0, 1, 7], gelx: [0, 1, 3] };

  function renderServices() {
    const track = $('#servTrack');
    D.menu.forEach((cat, i) => {
      const picks = (PICKS[cat.id] || [0, 1, 2]).map((k) => cat.items[k]).filter(Boolean);
      const lis = picks.map((it) => `<li><span>${it.n}</span><b>${it.p ? (it.from ? 'dès ' : '') + money(it.p) : it.label}</b></li>`).join('');
      track.insertAdjacentHTML('beforeend', `
        <article class="card tilt" data-cat="${cat.id}">
          <div class="card__img"><img src="${cat.img}" alt="" loading="lazy" width="800" height="800"><span class="card__price">dès ${money(cat.from)}</span></div>
          <div class="card__body">
            <span class="card__n">0${i + 1}</span>
            <h3>${cat.title}</h3>
            <p class="card__short">${cat.short}</p>
            <ul>${lis}</ul>
            <button class="link" type="button" data-open="${cat.id}">Voir toute la catégorie <svg><use href="#i-arrow"/></svg></button>
          </div>
        </article>`);
    });
  }

  let activeCat = D.menu[0].id;
  function renderTabs() {
    const tabs = $('#tabs');
    tabs.innerHTML = D.menu.map((c) => `<button class="tab" role="tab" id="tab-${c.id}" data-tab="${c.id}" aria-selected="${c.id === activeCat}" aria-controls="priceList">${c.title}</button>`).join('');
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]');
      if (b) setCategory(b.dataset.tab, true);
    });
    tabs.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const ids = D.menu.map((c) => c.id);
      const i = ids.indexOf(activeCat);
      const n = ids[(i + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length];
      setCategory(n, true);
      $('#tab-' + n).focus();
    });
  }

  function renderList(animate) {
    const cat = D.menu.find((c) => c.id === activeCat);
    const list = $('#priceList');
    list.setAttribute('aria-labelledby', 'tab-' + activeCat);
    list.innerHTML = cat.items.map((it, i) => `
      <li class="pl">
        <div><h4>${it.n}</h4>${it.note ? `<p>${it.note}</p>` : ''}</div>
        <span class="pl__dur">${it.d}</span>
        <span class="pl__price">${it.p ? (it.from ? '<small>dès</small>' : '') + money(it.p) : it.label}</span>
        <button class="pl__book" type="button" data-book="${cat.id}|${i}" aria-label="Demander un rendez-vous : ${it.n}">Choisir</button>
      </li>`).join('');
    if (animate && !reduce && window.gsap) {
      gsap.from('#priceList .pl', { y: 24, opacity: 0, duration: .8, stagger: .035, ease: 'power3.out', clearProps: 'all' });
    }
  }

  function setCategory(id, animate) {
    activeCat = id;
    $$('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    renderList(animate);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function renderSelect() {
    const sel = $('#f-service');
    let html = '<option value="" data-label="Je ne sais pas encore, conseillez-moi">Je ne sais pas encore — conseillez-moi</option>';
    D.menu.forEach((c) => {
      html += `<optgroup label="${c.title}">`;
      c.items.forEach((it, i) => {
        const price = it.p ? (it.from ? 'dès ' : '') + money(it.p) : it.label;
        html += `<option value="${c.id}|${i}" data-label="${it.n} (${c.title})">${it.n} — ${price}</option>`;
      });
      html += '</optgroup>';
    });
    sel.innerHTML = html;
  }

  function renderReviews() {
    const track = $('#revTrack');
    const dots = $('#revDots');
    const star = (on) => `<svg style="${on ? '' : 'opacity:.25'}"><use href="#i-star"/></svg>`;
    D.reviews.forEach((r, i) => {
      track.insertAdjacentHTML('beforeend', `
        <article class="rev" role="group" aria-roledescription="diapositive" aria-label="${i + 1} sur ${D.reviews.length}">
          <div class="rev__mark" aria-hidden="true">“</div>
          <blockquote>${r.t}</blockquote>
          <footer>
            <div><b>${r.w}</b><span>${r.d}</span></div>
            <div style="display:grid;gap:.5rem;justify-items:end"><span class="stars" role="img" aria-label="${r.r} étoiles sur 5">${[1, 2, 3, 4, 5].map((n) => star(n <= r.r)).join('')}</span><span class="src">${r.s}</span></div>
          </footer>
        </article>`);
      dots.insertAdjacentHTML('beforeend', `<button type="button" aria-label="Voir l'avis ${i + 1}"></button>`);
    });
    $('#criteria').innerHTML = D.criteria.map(([l, v]) => `<li><span>${l}</span><span>${fmt(v, 1)} / 5</span><div class="bar"><i data-v="${v / 5}"></i></div></li>`).join('');
  }

  function parisNow() {
    const parts = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const map = { 'dim.': 0, 'lun.': 1, 'mar.': 2, 'mer.': 3, 'jeu.': 4, 'ven.': 5, 'sam.': 6 };
    return { day: map[get('weekday')], min: parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10) };
  }
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const hLabel = (s) => { const [h, m] = s.split(':'); return h.replace(/^0/, '') + 'h' + (m === '00' ? '' : m); };

  function renderHours() {
    const names = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const order = [1, 2, 3, 4, 5, 6, 0];
    const { day, min } = parisNow();
    $('#hours tbody').innerHTML = order.map((d) => {
      const h = D.hours[d];
      return `<tr class="${d === day ? 'is-today' : ''}"><td>${names[d]}</td><td>${h ? hLabel(h[0]) + ' – ' + hLabel(h[1]) : 'Fermé'}</td></tr>`;
    }).join('');
    const el = $('#openNow');
    const today = D.hours[day];
    if (today && min >= toMin(today[0]) && min < toMin(today[1])) {
      el.classList.add('is-open');
      el.textContent = 'Ouvert maintenant · ferme à ' + hLabel(today[1]);
      return;
    }
    let next = null;
    for (let i = 0; i < 7 && !next; i++) {
      const d = (day + i) % 7;
      const h = D.hours[d];
      if (!h) continue;
      if (i === 0 && min >= toMin(h[0])) continue;
      next = { d, h, i };
    }
    el.classList.remove('is-open');
    el.textContent = next ? 'Fermé · ouvre ' + (next.i === 0 ? "aujourd'hui" : next.i === 1 ? 'demain' : names[next.d].toLowerCase()) + ' à ' + hLabel(next.h[0]) : 'Fermé';
  }

  /* ------------------------------------------------------------------
     2. RÉSERVATION PAR SMS (aucun back-end, aucune donnée stockée)
     ------------------------------------------------------------------ */
  function initSms() {
    const form = $('#smsForm');
    const status = $('#smsStatus');
    const date = $('#f-date');
    const today = new Date();
    date.min = new Date(today.getTime() - today.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

    const message = () => {
      const name = form.name.value.trim();
      const opt = form.service.selectedOptions[0];
      const svc = opt.dataset.label;
      const slot = form.slot.value;
      let msg = `Bonjour, c'est ${name || '…'}. Je souhaiterais un rendez-vous pour : ${svc}.`;
      if (form.date.value) {
        const d = new Date(form.date.value + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        msg += ` Jour souhaité : ${d}${slot ? ' (' + slot + ')' : ''}.`;
      } else if (slot) {
        msg += ` De préférence ${slot}.`;
      }
      const extra = form.msg.value.trim();
      if (extra) msg += ' ' + extra + (/[.!?…]$/.test(extra) ? '' : '.');
      return msg + ' Merci !';
    };
    const valid = () => {
      const ok = form.name.value.trim().length > 0;
      form.name.classList.toggle('is-invalid', !ok);
      if (!ok) { status.textContent = 'Indiquez votre prénom pour que le salon sache à qui répondre.'; form.name.focus(); }
      return ok;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!valid()) return;
      status.textContent = 'Votre messagerie s\'ouvre… envoyez le SMS pour finaliser la demande.';
      window.location.href = 'sms:' + D.phoneTel + '?&body=' + encodeURIComponent(message());
    });
    form.name.addEventListener('input', () => form.name.classList.remove('is-invalid'));

    $('#smsCopy').addEventListener('click', async () => {
      if (!valid()) return;
      const msg = message();
      let ok = false;
      try {
        ok = await Promise.race([
          navigator.clipboard.writeText(msg).then(() => true),
          new Promise((r) => setTimeout(() => r(false), 1200))
        ]);
      } catch (err) {
        ok = false;
      }
      status.textContent = ok
        ? 'Message copié ! Envoyez-le par SMS ou WhatsApp au ' + D.phone + '.'
        : 'Copiez ce message et envoyez-le au ' + D.phone + ' : ' + msg;
    });
  }

  function pickService(value) {
    const sel = $('#f-service');
    sel.value = value;
    scrollToTarget('#reserver');
    setTimeout(() => {
      sel.focus({ preventScroll: true });
      if (window.gsap && !reduce) gsap.fromTo('#smsForm', { boxShadow: '0 0 0 0 rgba(255,245,241,.9)' }, { boxShadow: '0 0 0 14px rgba(255,245,241,0)', duration: 1.4, ease: 'power2.out' });
    }, 1300);
  }

  /* ------------------------------------------------------------------
     3. NAVIGATION, ANCRES, MENU MOBILE
     ------------------------------------------------------------------ */
  function scrollToTarget(hash) {
    const el = hash === '#top' ? document.body : $(hash);
    if (!el) return;
    if (lenis) lenis.scrollTo(hash === '#top' ? 0 : el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  function initNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const menu = $('#menu');
    let open = false;

    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const h = a.getAttribute('href');
      if (h.length < 2) return;
      e.preventDefault();
      if (open) toggleMenu(false);
      scrollToTarget(h);
      history.replaceState(null, '', h);
    }));

    document.addEventListener('click', (e) => {
      const o = e.target.closest('[data-open]');
      if (o) { setCategory(o.dataset.open, false); scrollToTarget('#carte'); return; }
      const b = e.target.closest('[data-book]');
      if (b) pickService(b.dataset.book);
    });

    if (!window.gsap) return;
    $$('a[data-menu]').forEach((a) => { a.innerHTML = `<span>${a.textContent}</span>`; });
    gsap.set(menu, { yPercent: -100 });
    gsap.set('a[data-menu] span', { yPercent: 110 });

    function toggleMenu(state) {
      open = state;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.setAttribute('aria-hidden', String(!open));
      if (open) {
        lenis && lenis.stop();
        nav.classList.remove('is-hidden');
        gsap.set(menu, { visibility: 'visible' });
        gsap.to(menu, { yPercent: 0, duration: .9, ease: 'expo.inOut' });
        gsap.to('a[data-menu] span', { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .06, delay: .35 });
      } else {
        lenis && lenis.start();
        gsap.to(menu, { yPercent: -100, duration: .8, ease: 'expo.inOut', onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); gsap.set('a[data-menu] span', { yPercent: 110 }); } });
      }
    }
    burger.addEventListener('click', () => toggleMenu(!open));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) toggleMenu(false); });

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          nav.classList.toggle('is-solid', y > 80);
          nav.classList.toggle('is-hidden', self.direction === 1 && y > 500 && !open);
          if (self.direction === -1) nav.classList.remove('is-hidden');
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     4. TEXTE ANIMÉ (découpe lettre par lettre, masque qui monte)
     ------------------------------------------------------------------ */
  function splitEl(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const chars = [];
    const walk = (node, parent) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { parent.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            Array.from(tok).forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'c';
              c.textContent = ch;
              w.appendChild(c);
              chars.push(c);
            });
            parent.appendChild(w);
          });
        } else if (n.nodeType === 1) {
          const clone = n.cloneNode(false);
          parent.appendChild(clone);
          walk(n, clone);
        }
      });
    };
    const frag = document.createDocumentFragment();
    walk(el, frag);
    el.innerHTML = '';
    el.appendChild(frag);
    return chars;
  }

  /* ------------------------------------------------------------------
     5. SCÈNES SCROLL (GSAP + ScrollTrigger)
     ------------------------------------------------------------------ */
  let heroChars = [];

  function initMotion() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // barre de progression de lecture
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

    // titres : masque qui monte, lettre par lettre
    $$('[data-split]').forEach((h) => {
      const chars = splitEl(h);
      gsap.set(chars, { yPercent: 115 });
      gsap.to(chars, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: { each: .018, from: 'start' }, scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    });

    // hero : titre géant (préparé, joué à la fin du loader)
    heroChars = $$('[data-hero-line]').flatMap(splitEl);
    gsap.set(heroChars, { yPercent: 125 });
    gsap.set(['.hero__eyebrow', '.hero__lead', '.hero__cta', '.hero__badge'], { opacity: 0, y: 36 });
    gsap.set('.nav', { opacity: 0 });

    // hero : parallax multicouche (fond / formes / contenu)
    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__media', { yPercent: 16, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero__content', { yPercent: -14, opacity: .15, ease: 'none', scrollTrigger: heroST });
    $$('.shape').forEach((s) => gsap.to(s, { y: -parseFloat(s.dataset.depth) * 190, rotation: '+=' + (parseFloat(s.dataset.depth) * 25), ease: 'none', scrollTrigger: heroST }));
    if (finePointer) {
      const shapes = $$('.shape');
      const setters = shapes.map((s) => ({ x: gsap.quickTo(s, 'xPercent', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(s, 'yPercent', { duration: 1.2, ease: 'power3' }), d: parseFloat(s.dataset.depth) }));
      $('.hero').addEventListener('pointermove', (e) => {
        const nx = e.clientX / innerWidth - .5;
        const ny = e.clientY / innerHeight - .5;
        setters.forEach((s) => { s.x(nx * s.d * 60); s.y(ny * s.d * 60); });
      });
    }

    initMarquee();

    const mm = gsap.matchMedia();

    // ---- Rituel : section pinnée, 4 temps ----
    mm.add('(min-width: 900px)', () => {
      const frames = $$('.frame');
      const N = frames.length;
      const steps = $$('#storySteps li');
      const bar = $('#storyBar');
      frames.forEach((f, i) => {
        if (!i) return;
        gsap.set(f, { yPercent: 100 });
        gsap.set($('.frame__in', f), { yPercent: -100 });
      });
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.story__pin', start: 'top top', end: '+=' + (N * 95) + '%', pin: true, scrub: .8, anticipatePin: 1,
          onUpdate: (self) => {
            const t = self.progress * (N - 1 + .5);
            const idx = Math.max(0, Math.min(N - 1, Math.floor(t + .5)));
            steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
            bar.style.transform = 'scaleX(' + self.progress + ')';
          }
        }
      });
      frames.forEach((f, i) => {
        if (!i) return;
        tl.to(f, { yPercent: 0, duration: 1 }, i - 1)
          .to($('.frame__in', f), { yPercent: 0, duration: 1 }, i - 1)
          .to($('.frame__in', frames[i - 1]), { scale: 1.18, duration: 1 }, i - 1);
      });
      tl.to({}, { duration: .5 });
      return () => { steps.forEach((s, i) => s.classList.toggle('is-active', i === 0)); };
    });

    // ---- Prestations : défilement horizontal piloté par le scroll vertical ----
    mm.add('(min-width: 900px)', () => {
      const track = $('#servTrack');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tw = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.services__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => { $('#servBar').style.transform = 'scaleX(' + self.progress + ')'; }
        }
      });
      $$('.card__img img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: img.closest('.card'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      });
    });

    // ---- Galerie : 3 colonnes à vitesses différentes ----
    mm.add('(min-width: 900px)', () => {
      $$('.gcol').forEach((c) => {
        gsap.to(c, { y: parseFloat(c.dataset.speed), ease: 'none', scrollTrigger: { trigger: '.gallery__cols', start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });

    // rideau + zoom à l'apparition des photos de la galerie
    $$('.tile').forEach((t) => {
      const curtain = document.createElement('span');
      curtain.className = 'curtain';
      t.appendChild(curtain);
      const img = $('img', t);
      gsap.set(img, { scale: 1.35 });
      ScrollTrigger.create({
        trigger: t, start: 'top 90%', once: true,
        onEnter: () => {
          gsap.to(curtain, { scaleY: 0, duration: 1.3, ease: 'expo.inOut' });
          gsap.to(img, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' });
        }
      });
    });

    // ---- Salon : arches, cercle qui s'agrandit, Ken Burns ----
    $$('.arch--tall').forEach((a) => {
      gsap.from(a, { y: 90, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: a, start: 'top 85%', once: true } });
    });
    const small = $('.arch--small');
    if (small) {
      gsap.fromTo(small, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: small, start: 'top 88%', once: true } });
    }
    $$('[data-kenburns]').forEach((img) => {
      gsap.fromTo(img, { scale: 1.22 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.to('.salon__sticker', { y: -50, ease: 'none', scrollTrigger: { trigger: '.salon', start: 'top bottom', end: 'bottom top', scrub: true } });

    // ---- Chiffres : compteurs ----
    $$('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || '0', 10);
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(o, { v: target, duration: 2.4, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v, dec); } })
      });
    });

    // ---- Avis : barres de critères ----
    $$('#criteria .bar i').forEach((b) => {
      gsap.to(b, { scaleX: parseFloat(b.dataset.v), duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 92%', once: true } });
    });

    // ---- Apparitions douces des blocs de texte ----
    const fades = ['.salon__text > p', '.ticks li', '.menu-full__note', '.reviews__side > *:not(.title)', '.book__copy > p', '.book__actions', '.sms', '.find__info > *:not(.title)', '.find__map', '.footer__grid > *', '.gallery__head .link'];
    fades.forEach((sel) => {
      const els = $$(sel);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 40 });
      ScrollTrigger.batch(els, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: .09, ease: 'power3.out', clearProps: 'transform' }) });
    });
    gsap.from('.reviews .carousel', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.reviews .carousel', start: 'top 90%', once: true } });

    // flottement des formes de la section réserver
    gsap.to('.book__bg .b1', { y: -90, rotation: 28, ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.book__bg .b2', { y: 70, rotation: -30, ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.book__bg .b3', { y: -40, rotation: 90, ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } });

    // footer : gros nom qui se lève
    const fchars = $$('#footBig span').flatMap(splitEl);
    gsap.set(fchars, { yPercent: 105 });
    gsap.to(fchars, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: '#footBig', start: 'top 92%', once: true } });

    // barre d'actions mobile
    const fab = $('#fab');
    ScrollTrigger.create({ trigger: '.hero', start: 'bottom 70%', onEnter: () => fab.classList.add('is-on'), onLeaveBack: () => fab.classList.remove('is-on') });
    ScrollTrigger.create({ trigger: '.book', start: 'top 70%', end: 'bottom 30%', onToggle: (s) => fab.classList.toggle('is-on', !s.isActive && window.scrollY > innerHeight * .6) });
  }

  /* ---------- marquee : vitesse et sens réagissent au scroll ---------- */
  function initMarquee() {
    const tweens = [];
    $$('[data-marquee]').forEach((row) => {
      const dir = parseFloat(row.dataset.marquee);
      const track = $('.marquee__track', row);
      const belt = document.createElement('div');
      belt.style.cssText = 'display:inline-flex;will-change:transform';
      row.insertBefore(belt, track);
      belt.appendChild(track);
      belt.appendChild(track.cloneNode(true));
      const t = dir < 0
        ? gsap.to(belt, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 })
        : gsap.fromTo(belt, { xPercent: -50 }, { xPercent: 0, duration: 40, ease: 'none', repeat: -1 });
      tweens.push(t);
    });
    let vel = 0;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { vel = s.getVelocity(); } });
    gsap.ticker.add(() => {
      vel *= .93;
      const boost = 1 + Math.min(Math.abs(vel) / 240, 7);
      const sgn = vel < -25 ? -1 : 1;
      tweens.forEach((t) => t.timeScale(lerp(t.timeScale(), sgn * boost, .08)));
    });
  }

  /* ------------------------------------------------------------------
     6. MICRO-INTERACTIONS
     ------------------------------------------------------------------ */
  function initMagnetic() {
    if (!finePointer || reduce) return;
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.5)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.5)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .35);
        yTo((e.clientY - (r.top + r.height / 2)) * .45);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  function initTilt() {
    if (!finePointer || reduce) return;
    $$('.tilt').forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 14);
        rx(-(py - .5) * 14);
        el.style.setProperty('--mx', px * 100 + '%');
        el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  function initCursor() {
    if (!finePointer || reduce) return;
    const cur = $('#cursor');
    const dot = $('span', cur);
    root.classList.add('has-cursor');
    const xTo = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' });
    const yTo = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const link = e.target.closest('a,button,[data-lb],input,select,textarea,.carousel');
      cur.classList.toggle('has-label', !!lab);
      cur.classList.toggle('is-link', !!link && !lab);
      if (lab) dot.dataset.label = lab.dataset.cursor;
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-link', 'has-label'));
  }

  function initLightbox() {
    const lb = $('#lightbox');
    const img = $('#lbImg');
    const cap = $('#lbCap');
    let last = null;
    const close = () => {
      if (lb.hidden) return;
      const done = () => { lb.hidden = true; lenis && lenis.start(); last && last.focus(); };
      if (window.gsap && !reduce) gsap.to(lb, { opacity: 0, duration: .35, onComplete: done }); else done();
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-lb]');
      if (t) {
        const src = $('img', t);
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        cap.textContent = ($('figcaption', t) || {}).textContent || '';
        last = t;
        lb.hidden = false;
        lenis && lenis.stop();
        if (window.gsap && !reduce) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: .5 });
        $('#lbClose').focus();
        return;
      }
      if (e.target === lb || e.target.closest('#lbClose')) close();
    });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    $$('[data-lb]').forEach((t) => { t.tabIndex = 0; t.setAttribute('role', 'button'); t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } }); });
  }

  /* ---------- carrousel d'avis ---------- */
  function initCarousel() {
    const carousel = $('#carousel');
    const track = $('#revTrack');
    const dots = $$('#revDots button');
    const n = dots.length;
    let idx = 0;
    let timer = null;

    const go = (i, instant) => {
      idx = (i + n) % n;
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === idx)));
      if (window.gsap && !instant && !reduce) gsap.to(track, { xPercent: -100 * idx, duration: 1.1, ease: 'expo.out' });
      else track.style.transform = `translateX(${-100 * idx}%)`;
    };
    const play = () => { if (reduce) return; stop(); timer = setInterval(() => go(idx + 1), 6500); };
    const stop = () => { clearInterval(timer); timer = null; };

    $('#revNext').addEventListener('click', () => { go(idx + 1); play(); });
    $('#revPrev').addEventListener('click', () => { go(idx - 1); play(); });
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { go(idx + 1); play(); }
      if (e.key === 'ArrowLeft') { go(idx - 1); play(); }
    });
    carousel.addEventListener('pointerenter', stop);
    carousel.addEventListener('pointerleave', play);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', play);

    let x0 = null;
    carousel.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    window.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) { go(idx + (dx < 0 ? 1 : -1)); play(); }
    });
    go(0, true);
    play();
  }

  /* ------------------------------------------------------------------
     7. LOADER + ENTRÉE SPECTACULAIRE
     ------------------------------------------------------------------ */
  function loader() {
    return new Promise((resolve) => {
      const el = $('#loader');
      const finish = () => { el && el.remove(); root.classList.remove('is-loading'); resolve(); };
      if (reduce || !el || !window.gsap) { finish(); return; }

      const num = $('#loaderNum');
      const lips = $('.loader__lips', el);
      const state = { v: 0 };
      lenis && lenis.stop();

      const ready = new Promise((r) => {
        let done = false;
        const fin = () => { if (!done) { done = true; r(); } };
        if (document.readyState === 'complete') fin(); else window.addEventListener('load', fin);
        setTimeout(fin, 4500);
      });

      const tl = gsap.timeline();
      tl.to(state, { v: 90, duration: 1.8, ease: 'power2.out', onUpdate: () => { num.textContent = Math.round(state.v); } }, 0)
        .to(lips, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0)
        .to(lips, { '--fo': 1, duration: .9, ease: 'power1.in' }, 1.1)
        .add(() => {
          ready.then(() => {
            gsap.to(state, { v: 100, duration: .5, ease: 'power1.out', onUpdate: () => { num.textContent = Math.round(state.v); }, onComplete: exit });
          });
        });

      function exit() {
        const out = gsap.timeline({ onComplete: () => { el.remove(); root.classList.remove('is-loading'); lenis && lenis.start(); } });
        out.to(lips, { scale: 1.2, duration: .35, ease: 'power2.out' })
          .to(lips, { scale: 1, duration: .3, ease: 'power2.in' })
          .to('.loader__center', { opacity: 0, y: -24, duration: .45, ease: 'power2.in' }, '-=.15')
          .to('.loader__panel--top', { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, '>-.05')
          .to('.loader__panel--bottom', { yPercent: 100, duration: 1.25, ease: 'expo.inOut' }, '<')
          .add(resolve, '<+.45');
      }
    });
  }

  function intro() {
    const v = $('.hero__video');
    if (v) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    if (reduce || !window.gsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__media', { scale: 1.3 }, { scale: 1, duration: 2.8 }, 0)
      .to(heroChars, { yPercent: 0, duration: 1.7, stagger: .07 }, .05)
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1.2 }, .35)
      .to('.hero__lead', { opacity: 1, y: 0, duration: 1.3 }, .75)
      .to('.hero__cta', { opacity: 1, y: 0, duration: 1.3 }, .9)
      .to('.hero__badge', { opacity: 1, y: 0, duration: 1.3 }, 1.1)
      .to('.nav', { opacity: 1, duration: 1.2, ease: 'power2.out' }, .8);
  }

  function initVideos() {
    const care = $('.frame video');
    if (care && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting && !reduce) { const p = care.play(); p && p.catch && p.catch(() => {}); } else care.pause();
      }), { threshold: .1 }).observe(care);
    }
    const hero = $('.hero__video');
    if (hero && reduce) { hero.removeAttribute('autoplay'); hero.pause(); }
    document.addEventListener('visibilitychange', () => {
      if (!hero || reduce) return;
      if (document.hidden) hero.pause(); else { const p = hero.play(); p && p.catch && p.catch(() => {}); }
    });
  }

  /* ------------------------------------------------------------------
     DÉMARRAGE
     ------------------------------------------------------------------ */
  renderServices();
  renderTabs();
  renderList(false);
  renderSelect();
  renderReviews();
  renderHours();
  setInterval(renderHours, 60000);

  const total = D.menu.reduce((s, c) => s + c.items.length, 0);
  $('#statServices').dataset.count = total;
  $('#statFollowers').dataset.count = D.stats.followers;
  $('#year') && ($('#year').textContent = new Date().getFullYear());

  initSms();
  initCarousel();
  initLightbox();
  initVideos();

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('is-loading');
    $('#loader') && $('#loader').remove();
    initNav();
    $$('[data-count]').forEach((el) => { el.textContent = fmt(parseFloat(el.dataset.count), parseInt(el.dataset.dec || '0', 10)); });
    return;
  }

  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: .085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (reduce) {
    gsap.registerPlugin(ScrollTrigger);
    $$('[data-count]').forEach((el) => { el.textContent = fmt(parseFloat(el.dataset.count), parseInt(el.dataset.dec || '0', 10)); });
    $$('#criteria .bar i').forEach((b) => { b.style.transform = 'scaleX(' + b.dataset.v + ')'; });
    initNav();
    loader();
    return;
  }

  initMotion();
  initNav();
  initMagnetic();
  initTilt();
  initCursor();
  loader().then(intro);

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();
