/* ==================================================================
   NUESTRA ESTRELLA — script.js
   Todo el código está comentado para que sepas qué tocar.
================================================================== */

/* ------------------------------------------------------------------
   1. CIELO ANIMADO (canvas): estrellas parpadeantes, partículas
      doradas flotando, estrellas fugaces y parallax con el ratón.
------------------------------------------------------------------ */
(function initSky() {
  const canvas = document.getElementById('sky-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  let particles = [];
  let shootingStars = [];
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // CAMBIA AQUÍ LA CANTIDAD DE ESTRELLAS
  const STAR_COUNT_DESKTOP = 220;
  const STAR_COUNT_MOBILE = 110;

  // CAMBIA AQUÍ LA CANTIDAD DE PARTÍCULAS DORADAS
  const PARTICLE_COUNT = 40;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight * (document.body.scrollHeight > 0 ? 1 : 1);
    // aseguramos que el canvas cubra toda la altura de scroll del documento
    height = canvas.height = window.innerHeight;
  }

  function makeStars() {
    const count = window.innerWidth < 700 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.6 + 0.2, // para el parallax
        gold: Math.random() < 0.25 // algunas estrellas son doradas
      });
    }
  }

  function makeParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        // CAMBIA AQUÍ LA VELOCIDAD DE LAS PARTÍCULAS
        speedY: Math.random() * 0.15 + 0.03,
        speedX: (Math.random() - 0.5) * 0.08,
        alpha: Math.random() * 0.5 + 0.2,
        depth: Math.random() * 0.5 + 0.3
      });
    }
  }

  function maybeSpawnShootingStar() {
    // CAMBIA AQUÍ LA PROBABILIDAD DE ESTRELLAS FUGACES (más alto = más frecuentes)
    if (Math.random() < 0.0035 && shootingStars.length < 2) {
      const startX = Math.random() * width * 0.6 + width * 0.2;
      shootingStars.push({
        x: startX,
        y: -20,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 8 + 8,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // parallax suave: interpolamos hacia la posición objetivo del ratón
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // estrellas
    stars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));
      const px = s.x + mouseX * s.depth * 18;
      const py = s.y + mouseY * s.depth * 18;

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(243, 207, 124, ${alpha})`
        : `rgba(238, 241, 251, ${alpha})`;
      ctx.fill();

      // pequeño destello en cruz para las estrellas doradas más grandes
      if (s.gold && s.r > 1.1) {
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = 'rgba(243, 207, 124, 0.6)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(px - s.r * 3, py);
        ctx.lineTo(px + s.r * 3, py);
        ctx.moveTo(px, py - s.r * 3);
        ctx.lineTo(px, py + s.r * 3);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // partículas doradas flotando hacia arriba
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const px = p.x + mouseX * p.depth * 12;
      const py = p.y + mouseY * p.depth * 12;

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 207, 124, ${p.alpha})`;
      ctx.fill();
    });

    // estrellas fugaces
    maybeSpawnShootingStar();
    shootingStars.forEach((sh, i) => {
      const dx = Math.cos(sh.angle) * sh.speed;
      const dy = Math.sin(sh.angle) * sh.speed;
      sh.x += dx;
      sh.y += dy;
      sh.alpha -= 0.012;

      const tailX = sh.x - Math.cos(sh.angle) * sh.len;
      const tailY = sh.y - Math.sin(sh.angle) * sh.len;

      const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${sh.alpha})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      if (sh.alpha <= 0 || sh.y > height + 50 || sh.x > width + 50) {
        shootingStars.splice(i, 1);
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    makeStars();
    makeParticles();
  });

  window.addEventListener('mousemove', (e) => {
    // normalizamos entre -1 y 1 para el parallax
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  resize();
  makeStars();
  makeParticles();
  draw();
})();

/* ------------------------------------------------------------------
   2. PANTALLA DE INICIO → botón "Entrar"
------------------------------------------------------------------ */
(function initEnterFlow() {
  const enterBtn = document.getElementById('enter-btn');
  const introScreen = document.getElementById('intro-screen');
  const mainContent = document.getElementById('main-content');

  enterBtn.addEventListener('click', () => {
    // Bloqueamos el scroll del body mientras el intro se desvanece
    introScreen.style.transition = 'opacity 1s ease, transform 1s ease';
    introScreen.style.opacity = '0';
    introScreen.style.transform = 'translateY(-24px)';

    setTimeout(() => {
      introScreen.style.display = 'none';
      mainContent.classList.add('visible');
      document.body.style.overflow = 'auto';
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }, 950);
  });

  // Mientras esté visible la intro, evitamos scroll accidental
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    // por si el usuario nunca pulsa el botón, liberamos el scroll tras un tiempo largo
  }, 0);
})();

/* ------------------------------------------------------------------
   3. SCROLL REVEAL — capítulos, tarjetas NASA y la carta final
      aparecen suavemente al entrar en el viewport.
------------------------------------------------------------------ */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal-media, .reveal-copy, .nasa-card, .letter-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => observer.observe(t));
})();

/* ------------------------------------------------------------------
   4. LÍNEA DE CONSTELACIÓN — se dibuja progresivamente con el scroll
------------------------------------------------------------------ */
(function initConstellationLine() {
  const svg = document.getElementById('constellation-line');
  const path = document.getElementById('constellation-path');
  const mainContent = document.getElementById('main-content');
  if (!svg || !path) return;

  function updatePath() {
    const height = mainContent.scrollHeight;
    svg.setAttribute('viewBox', `0 0 2 ${height}`);
    svg.style.height = height + 'px';
    path.setAttribute('d', `M1,0 L1,${height}`);

    const total = path.getTotalLength();
    path.style.strokeDasharray = total;

    const scrolled = window.scrollY;
    const winH = window.innerHeight;
    const docH = document.documentElement.scrollHeight - winH;
    const progress = Math.min(Math.max(scrolled / docH, 0), 1);

    path.style.strokeDashoffset = total * (1 - progress);
  }

  window.addEventListener('scroll', updatePath, { passive: true });
  window.addEventListener('resize', updatePath);
  // recalculamos también cuando las imágenes cargan (cambia el alto del documento)
  window.addEventListener('load', updatePath);
  setTimeout(updatePath, 300);
})();

/* ------------------------------------------------------------------
   5. BOTÓN DE MÚSICA — nunca se reproduce en automático
------------------------------------------------------------------ */
(function initMusic() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-audio');
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // si el navegador bloquea la reproducción o no hay archivo mp3 aún, no pasa nada
      });
      btn.classList.add('playing');
      btn.querySelector('.music-label').textContent = 'Sonando...';
    } else {
      audio.pause();
      btn.classList.remove('playing');
      btn.querySelector('.music-label').textContent = 'Musiquita para ti';
    }
  });
})();

/* ------------------------------------------------------------------
   6. BOTÓN FINAL "Te amo"
      Lanza estrellas fugaces extra, confeti dorado, brillo y mensaje.
------------------------------------------------------------------ */
(function initFinale() {
  const btn = document.getElementById('finale-btn');
  const message = document.getElementById('finale-message');
  const fxLayer = document.getElementById('finale-fx-layer');
  if (!btn) return;

  function spawnConfetti() {
    // CAMBIA AQUÍ LA CANTIDAD DE CONFETI
    const count = 60;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const size = Math.random() * 6 + 3;
      piece.style.position = 'absolute';
      piece.style.top = '-20px';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.borderRadius = '50%';
      piece.style.background = Math.random() > 0.5 ? '#f3cf7c' : '#ffe9b8';
      piece.style.opacity = String(Math.random() * 0.6 + 0.4);
      piece.style.boxShadow = '0 0 6px rgba(243,207,124,0.6)';

      const duration = Math.random() * 2.5 + 2.5;
      const drift = (Math.random() - 0.5) * 200;

      piece.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: piece.style.opacity },
        { transform: `translate(${drift}px, 105vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(.22,.61,.36,1)',
        fill: 'forwards'
      });

      fxLayer.appendChild(piece);
      setTimeout(() => piece.remove(), duration * 1000 + 100);
    }
  }

  function spawnExtraShootingStars() {
    // CAMBIA AQUÍ CUÁNTAS ESTRELLAS FUGACES APARECEN AL PULSAR
    const count = 6;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        const startX = Math.random() * window.innerWidth;
        star.style.position = 'absolute';
        star.style.top = '-10px';
        star.style.left = startX + 'px';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = '#fff';
        star.style.boxShadow = '0 0 12px 4px rgba(255,255,255,0.8)';
        star.style.borderRadius = '50%';

        fxLayer.appendChild(star);

        const travel = Math.random() * 300 + 300;
        star.animate([
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: `translate(${travel}px, ${travel}px)`, opacity: 0 }
        ], { duration: 900, easing: 'ease-out', fill: 'forwards' });

        setTimeout(() => star.remove(), 950);
      }, i * 180);
    }
  }

  function glowBackground() {
    document.body.animate([
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.25)' },
      { filter: 'brightness(1)' }
    ], { duration: 1400, easing: 'ease-in-out' });
  }

  btn.addEventListener('click', () => {
    spawnConfetti();
    spawnExtraShootingStars();
    glowBackground();
    message.classList.add('show');
    btn.style.transform = 'scale(0.97)';
    setTimeout(() => { btn.style.transform = ''; }, 250);
  });
})();
