// ----- Année du copyright -----
  var yearEl = document.getElementById('copyrightYear');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ----- "Aries Ravn" ramène en haut de page -----
  var sigLink = document.getElementById('signatureLink');
  if (sigLink) {
    sigLink.addEventListener('click', function(e){
      e.preventDefault();
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ----- Compte à rebours -----
  var target = new Date('2026-12-25T00:00:00');
  var cdEl = document.getElementById('countdownNum');
  if (cdEl) {
    (function updateCountdown(){
      var diff = target - new Date();
      cdEl.textContent = Math.max(0, Math.ceil(diff / 86400000));
    })();
  }

  // ----- Curseur personnalisé (uniquement souris/trackpad) -----
  (function(){
    if(!window.matchMedia('(pointer:fine)').matches) return;
    var dot = document.getElementById('cursorDot');
    var mx = window.innerWidth/2, my = window.innerHeight/2, x = mx, y = my;
    window.addEventListener('mousemove', function(e){ mx = e.clientX; my = e.clientY; });
    (function raf(){
      x += (mx - x) * 0.18;
      y += (my - y) * 0.18;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    })();
    document.querySelectorAll('a:not(.cta), button').forEach(function(el){
      el.addEventListener('mouseenter', function(){ dot.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function(){ dot.classList.remove('is-hover'); });
    });
    document.querySelectorAll('.sun-wrap, .cta').forEach(function(el){
      el.addEventListener('mouseenter', function(){ dot.classList.add('is-sun'); });
      el.addEventListener('mouseleave', function(){ dot.classList.remove('is-sun'); });
    });
  })();

  // ----- Scroll fluide (Lenis) + parallaxe (GSAP ScrollTrigger) -----
  try {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    function raf2(time){ lenis.raf(time); requestAnimationFrame(raf2); }
    requestAnimationFrame(raf2);

    // le soleil/eau descend un peu plus lentement que le reste au scroll
    gsap.to('#illuFrame', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // entrée orchestrée unique du bloc hero, rien d'autre ne "fade" au scroll
    gsap.from('.hero-inner > *:not(.hero-sub)', {
      opacity: 0, y: 20, duration: 1, stagger: 0.12, ease: 'power2.out', delay: 0.15
    });

    // ----- Le pitch se révèle mot par mot, au scroll -----
    var pitchEl = document.querySelector('.hero-sub');
    if (pitchEl) {
      var words = pitchEl.textContent.trim().split(/\s+/);
      pitchEl.innerHTML = words.map(function(w){ return '<span class="pitch-word">' + w + '</span>'; }).join(' ');
      gsap.set('.pitch-word', { opacity: 0, y: 8 });
      gsap.to('.pitch-word', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power1.out',
        stagger: 0.018,
        scrollTrigger: {
          trigger: pitchEl,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    }

    // ----- Scroll-reveal des sections (hors hero) -----
    gsap.utils.toArray('section:not(.hero)').forEach(function(sec){
      gsap.from(sec, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ----- Tilt 3D sur les cases de précommande (souris/trackpad uniquement) -----
    if (window.matchMedia('(pointer:fine)').matches) {
      document.querySelectorAll('.edition').forEach(function(card){
        var qx = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
        var qy = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
        card.addEventListener('mousemove', function(e){
          var rect = card.getBoundingClientRect();
          var px = (e.clientX - rect.left) / rect.width - 0.5;
          var py = (e.clientY - rect.top) / rect.height - 0.5;
          qx(px * 10);
          qy(-py * 10);
        });
        card.addEventListener('mouseleave', function(){
          qx(0);
          qy(0);
        });
      });
    }

    // ----- Le chemin de lumière sur l'eau scintille doucement -----
    document.querySelectorAll('.illu-frame svg g[stroke-linecap="round"] line').forEach(function(line){
      gsap.to(line, {
        attr: { 'stroke-opacity': gsap.utils.random(0.02, 0.55) },
        duration: gsap.utils.random(0.9, 2.2),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 2)
      });
    });
  } catch(e) { /* si les libs externes ne chargent pas, la page reste fonctionnelle sans smooth scroll */ }

  // ----- TANAKA s'écrit lettre par lettre à l'arrivée sur la page -----
  (function revealTitle(){
    var letters = document.querySelectorAll('.title-letter');
    if (!letters.length) return;

    function play(){
      if (typeof gsap === 'undefined') {
        letters.forEach(function(el){ el.style.opacity = 1; });
        return;
      }
      gsap.set(letters, { opacity: 0, y: 30, rotate: function(){ return gsap.utils.random(-9, 9); } });
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.2,
        ease: 'power2.out',
        stagger: 0.35,
        delay: 0.50
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(play).catch(play);
    } else {
      play();
    }
  })();

  // ----- Formulaire newsletter -> Brevo (sans quitter la page) -----
  (function(){
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      fetch(form.action, { method: 'POST', body: data, mode: 'no-cors' })
        .then(function(){
          form.hidden = true;
          document.getElementById('newsletterSuccess').hidden = false;
        })
        .catch(function(){
          // si la requête échoue (réseau, bloqueur...), on retombe sur l'envoi natif du formulaire
          form.submit();
        });
    });
  })();

  // ----- Bouton musique (lecture manuelle uniquement, jamais automatique) -----
  (function(){
    var btn = document.getElementById('musicToggle');
    var audio = document.getElementById('bgMusic');
    if (!btn || !audio) return;
    var playing = false;
    btn.addEventListener('click', function(){
      if (playing) {
        audio.pause();
      } else {
        audio.play().catch(function(){ /* lecture bloquée par le navigateur, on ignore */ });
      }
      playing = !playing;
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Couper la musique' : 'Activer la musique');
    });
  })();
