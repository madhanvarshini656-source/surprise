/* ==========================================================================
   HALIMA'S BIRTHDAY SURPRISE - APPLICATION SCRIPT
   Interactive features: Language Morphing, Floating Canvas Particles,
   Polaroid Scrapbook Tilt, Letter Reveal, Gift Unboxing & Audio Synth.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SURPRISE_CONFIG || {};

  // Initialize all components
  initContentFromConfig();
  initLanguageMorphing();
  initParticleCanvas();
  initCursorGlow();
  initScrollObservers();
  initPolaroidTilt();
  initSurpriseBox();
  initMusicPlayer();
  initNavigation();
  initLightbox();
});

/* ==========================================================================
   1. POPULATE DYNAMIC CONTENT FROM CONFIG
   ========================================================================== */
function initContentFromConfig() {
  const config = window.SURPRISE_CONFIG;
  if (!config) return;

  // Hero Text
  if (config.heroTagline) document.getElementById('hero-tagline-text').innerText = config.heroTagline;
  if (config.heroSubtitle) document.getElementById('hero-subtitle').innerText = config.heroSubtitle;
  if (config.heroStickyNote) document.getElementById('sticky-note-text').innerText = config.heroStickyNote;
  if (config.heroPolaroidCaption) document.getElementById('hero-polaroid-caption').innerText = config.heroPolaroidCaption;
  if (config.heroSideNote) document.getElementById('side-doodle-text').innerText = config.heroSideNote;
  if (config.heroTitleSuffix) document.getElementById('hero-title-final').innerText = config.heroTitleSuffix;

  // Memories Section
  if (config.memoriesTitle) document.getElementById('memories-title').innerText = config.memoriesTitle;
  if (config.memoriesSubtitle) document.getElementById('memories-subtitle').innerText = config.memoriesSubtitle;

  const memoriesGrid = document.getElementById('memories-grid');
  if (memoriesGrid && config.memories) {
    memoriesGrid.innerHTML = '';
    config.memories.forEach((item, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      
      const rot = item.rotation || (index % 2 === 0 ? '-3deg' : '3deg');
      
      cardEl.innerHTML = `
        <div class="polaroid-card" style="transform: rotate(${rot})" data-img="${item.image}" data-caption="${item.title}">
          <div class="sticky-tape"></div>
          <div class="polaroid-img-wrapper">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="polaroid-caption">${item.title}</div>
          ${item.date ? `<div class="memory-date">${item.date}</div>` : ''}
          ${item.description ? `<p class="memory-desc">${item.description}</p>` : ''}
        </div>
      `;
      memoriesGrid.appendChild(cardEl);
    });
  }

  // Handwritten Letter
  if (config.letterTitle) document.getElementById('letter-header').innerText = config.letterTitle;
  if (config.letterSignoff) document.getElementById('letter-signoff').innerText = config.letterSignoff;
  if (config.letterSideNote) document.getElementById('letter-side-note').innerText = config.letterSideNote;

  if (config.letterParagraphs && config.letterParagraphs.length > 0) {
    const letterBody = document.getElementById('letter-body');
    if (letterBody) {
      letterBody.innerHTML = config.letterParagraphs.map(p => `<p>"${p}"</p>`).join('');
    }
  }

  // Surprise Section
  if (config.surpriseTitle) document.getElementById('surprise-section-title').innerText = config.surpriseTitle;
  if (config.surpriseBoxLabel) document.getElementById('open-surprise-btn').innerText = config.surpriseBoxLabel;
  if (config.surprisePopupTitle) document.getElementById('surprise-popup-title').innerText = config.surprisePopupTitle;
  if (config.surpriseFinalMessage) {
    document.getElementById('surprise-final-message').innerHTML = config.surpriseFinalMessage.replace(/\n/g, '<br>');
  }

  // Music Widget Info
  if (config.music) {
    if (config.music.title) document.getElementById('song-title').innerText = config.music.title;
    if (config.music.subtitle) document.getElementById('song-artist').innerText = config.music.subtitle;
  }
}

/* ==========================================================================
   2. LANGUAGE MORPHING ENGINE (HERO NAME)
   ========================================================================== */
function initLanguageMorphing() {
  const config = window.SURPRISE_CONFIG;
  if (!config || !config.nameLanguages || config.nameLanguages.length === 0) return;

  const morphingName = document.getElementById('morphing-name');
  const scriptBadge = document.getElementById('script-badge');
  const heroTitleFinal = document.getElementById('hero-title-final');
  
  let currentIndex = 0;
  let loopCount = 0;
  const maxLoops = 2; // Cycle twice through all scripts, then settle on final title

  function morphToNextLanguage() {
    if (!morphingName) return;

    // Fade out
    morphingName.style.opacity = '0';
    morphingName.style.transform = 'scale(0.92) translateY(-10px)';
    if (scriptBadge) scriptBadge.style.opacity = '0';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % config.nameLanguages.length;
      const currentObj = config.nameLanguages[currentIndex];

      morphingName.innerText = currentObj.text;
      if (scriptBadge) scriptBadge.innerText = currentObj.lang;

      // Adjust font-size for longer scripts if needed
      if (currentObj.text.length > 8) {
        morphingName.style.fontSize = '3.5rem';
      } else {
        morphingName.style.fontSize = '';
      }

      // Fade in
      morphingName.style.opacity = '1';
      morphingName.style.transform = 'scale(1) translateY(0)';
      if (scriptBadge) scriptBadge.style.opacity = '1';

      if (currentIndex === config.nameLanguages.length - 1) {
        loopCount++;
      }

      // Show final full birthday greeting title after loops
      if (loopCount >= maxLoops && currentIndex === 0) {
        setTimeout(() => {
          if (heroTitleFinal && morphingName.parentElement) {
            morphingName.style.display = 'none';
            if (scriptBadge) scriptBadge.style.display = 'none';
            heroTitleFinal.style.display = 'block';
            heroTitleFinal.style.animation = 'pulse-heart 1.5s ease-out';
          }
        }, 1200);
      }
    }, 350);
  }

  // Morph every 1.3 seconds
  setInterval(morphToNextLanguage, 1300);
}

/* ==========================================================================
   3. CANVAS FLOATING PARTICLES (PETALS, HEARTS, SPARKLES)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45; // Smooth lightweight 60fps performance

  const types = ['petal', 'heart', 'sparkle'];
  const colors = ['#ff758c', '#ffb8c6', '#ffe4e9', '#d49a6a', '#ffffff'];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.oscillation = Math.random() * Math.PI * 2;
    }

    update() {
      this.oscillation += 0.02;
      this.x += this.speedX + Math.sin(this.oscillation) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // Soft sakura flower petal shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size, -this.size / 2, this.size, this.size, 0, this.size * 1.3);
        ctx.bezierCurveTo(-this.size, this.size, -this.size, -this.size / 2, 0, 0);
        ctx.fill();
      } else if (this.type === 'heart') {
        // Floating heart
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size * 1.2);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      } else {
        // Glowing star sparkle
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 0.6, Math.sin((i * Math.PI) / 2) * this.size * 0.6);
          ctx.lineTo(Math.cos(((i + 0.5) * Math.PI) / 2) * this.size * 0.2, Math.sin(((i + 0.5) * Math.PI) / 2) * this.size * 0.2);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. CURSOR GLOW FOLLOWER
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ==========================================================================
   5. SCROLL REVEAL OBSERVERS
   ========================================================================== */
function initScrollObservers() {
  // Reveal Memory Photo Cards on scroll
  const memoryCards = document.querySelectorAll('.memory-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 120);
      }
    });
  }, { threshold: 0.15 });

  memoryCards.forEach(card => cardObserver.observe(card));

  // Reveal Handwritten Birthday Letter with paper unfold effect
  const letterCard = document.getElementById('letter-card');
  if (letterCard) {
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('unfolded');
        }
      });
    }, { threshold: 0.2 });
    letterObserver.observe(letterCard);
  }

  // Active Navbar link on scroll
  const sections = document.querySelectorAll('header, section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. POLAROID SCRAPBOOK TILT & HOVER
   ========================================================================== */
function initPolaroidTilt() {
  document.addEventListener('mousemove', (e) => {
    const polaroids = document.querySelectorAll('.polaroid-card');
    polaroids.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Only tilt if cursor is within 250px of card
      if (Math.abs(x) < 250 && Math.abs(y) < 250) {
        const tiltX = (y / rect.height) * -12;
        const tiltY = (x / rect.width) * 12;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
      } else {
        const defaultRot = card.getAttribute('data-rotation') || '0deg';
        card.style.transform = '';
      }
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE GIFT BOX & CONFETTI EXPLOSION
   ========================================================================== */
function initSurpriseBox() {
  const giftBox = document.getElementById('gift-box');
  const triggerBtn = document.getElementById('open-surprise-btn');
  const modal = document.getElementById('surprise-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const celebrateBtn = document.getElementById('modal-celebrate-btn');

  function openGiftSurprise() {
    if (giftBox) giftBox.classList.add('open');

    // Trigger Canvas Confetti Explosion
    fireConfettiBurst();

    // Play birthday chime sound
    playSurpriseChime();

    // Show Surprise Lightbox Modal
    setTimeout(() => {
      if (modal) modal.classList.add('active');
    }, 600);
  }

  if (giftBox) giftBox.addEventListener('click', openGiftSurprise);
  if (triggerBtn) triggerBtn.addEventListener('click', openGiftSurprise);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      fireConfettiBurst();
    });
  }
}

// Confetti burst cannon
function fireConfettiBurst() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const confettiParticles = [];
  const confettiCount = 120;
  const colors = ['#ff758c', '#ffd700', '#ffb8c6', '#ffffff', '#e0a96d', '#ff5277'];

  for (let i = 0; i < confettiCount; i++) {
    confettiParticles.push({
      x: width / 2,
      y: height / 2 + 100,
      vx: (Math.random() - 0.5) * 18,
      vy: Math.random() * -18 - 6,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  function renderConfetti() {
    let activeCount = 0;
    confettiParticles.forEach(p => {
      if (p.opacity > 0) {
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // Gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(renderConfetti);
    }
  }

  renderConfetti();
}

/* ==========================================================================
   8. MUSIC PLAYER ENGINE (WEB AUDIO API SYNTH FALLBACK)
   ========================================================================== */
function initMusicPlayer() {
  const playBtn = document.getElementById('player-play-btn');
  const navBtn = document.getElementById('nav-music-btn');
  const iconSpan = document.getElementById('player-icon');
  const navIconSpan = document.getElementById('nav-music-icon');
  const soundWave = document.getElementById('sound-wave');

  let isPlaying = false;
  let audioContext = null;
  let melodyInterval = null;

  // Soothing Ambient Birthday Melody Frequencies (C Major Chords/Notes)
  const notes = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, // C4 to C5
    392.00, 392.00, 440.00, 392.00, 523.25, 493.88, // Happy birthday melody notes
  ];

  function startSynthMelody() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    let noteIdx = 0;
    melodyInterval = setInterval(() => {
      if (!isPlaying || !audioContext) return;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine'; // Soft gentle sine wave
      osc.frequency.value = notes[noteIdx % notes.length];
      
      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 1.2);

      noteIdx++;
    }, 600);
  }

  function stopSynthMelody() {
    if (melodyInterval) {
      clearInterval(melodyInterval);
      melodyInterval = null;
    }
  }

  function toggleMusic() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      if (iconSpan) iconSpan.innerText = '❚❚';
      if (navIconSpan) navIconSpan.innerText = '⏸';
      if (soundWave) soundWave.classList.remove('paused');
      startSynthMelody();
    } else {
      if (iconSpan) iconSpan.innerText = '▶';
      if (navIconSpan) navIconSpan.innerText = '🎵';
      if (soundWave) soundWave.classList.add('paused');
      stopSynthMelody();
    }
  }

  if (playBtn) playBtn.addEventListener('click', toggleMusic);
  if (navBtn) navBtn.addEventListener('click', toggleMusic);
}

// Sound effect for unboxing chime
function playSurpriseChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      }, idx * 120);
    });
  } catch (e) {
    // Ignore audio context errors if muted
  }
}

/* ==========================================================================
   9. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeNav = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
    });
  }

  if (closeNav && mobileNav) {
    closeNav.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   10. LIGHTBOX FOR POLAROID PHOTO CARDS
   ========================================================================== */
function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.polaroid-card');
    if (card && !card.classList.contains('hero-polaroid')) {
      const imgSrc = card.getAttribute('data-img') || card.querySelector('img')?.src;
      const captionText = card.getAttribute('data-caption') || card.querySelector('.polaroid-caption')?.innerText;

      if (img && imgSrc) img.src = imgSrc;
      if (caption && captionText) caption.innerText = captionText;
      if (overlay) overlay.classList.add('active');
    }
  });

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  }
}
