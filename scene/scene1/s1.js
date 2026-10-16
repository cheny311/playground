
/*
 CHEN'S PLAYGROUND — SCENE 1

 Eight bubbles
 Individual series galleries
 Previous / Next arrows
 Cursor-following hand
*/

(() => {

  const stage = document.querySelector('#scene-one');
  const hand = document.querySelector('#hand-cursor');

  const panel = document.querySelector('#bubble-panel');
  const title = document.querySelector('#panel-title');
  const note = document.querySelector('#panel-note');
  const picture = document.querySelector('#panel-image');
  const pictureLink = document.querySelector('#panel-link');

  const closeButton = document.querySelector('#close-panel');
  const prevButton = document.querySelector('#prev-artwork');
  const nextButton = document.querySelector('#next-artwork');
  const counter = document.querySelector('#series-count');

  const mobile = matchMedia('(max-width: 680px)');
  const reducedMotion = matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const clamp = (n, min, max) =>
    Math.max(min, Math.min(max, n));

  let selectedBubble = null;
  let gallery = [];
  let slideNotes = [];
  let currentIndex = 0;


  /* 01 — DISPLAY ARTWORK */

  function showArtwork(index) {

    if (!gallery.length) return;

    currentIndex = clamp(
      index,
      0,
      gallery.length - 1
    );

    const image = gallery[currentIndex];

    picture.src = image;
    pictureLink.href = image;

    picture.alt =
      `Artwork ${currentIndex + 1} of ${gallery.length}`;

    note.textContent =
      slideNotes[currentIndex] ||
      selectedBubble.dataset.note ||
      '';

    counter.textContent =
      `${String(currentIndex + 1).padStart(2, '0')} / ` +
      `${String(gallery.length).padStart(2, '0')}`;

    // Enable / disable arrows
    const multiple = gallery.length > 1;

    prevButton.hidden = !multiple;
    nextButton.hidden = !multiple;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled =
      currentIndex === gallery.length - 1;

    // Image transition
    picture.classList.remove('is-changing');

    if (!reducedMotion.matches) {
      void picture.offsetWidth;
      picture.classList.add('is-changing');
    }
  }


  /* 02 — OPEN BUBBLE */

  document.querySelectorAll('.bubble').forEach(bubble => {

    bubble.setAttribute(
      'aria-label',
      `Explore ${bubble.dataset.title || 'this bubble'}`
    );

    bubble.addEventListener('click', () => {

      if (
        !panel ||
        !title ||
        !note ||
        !picture ||
        !pictureLink ||
        !prevButton ||
        !nextButton ||
        !counter
      ) {
        console.error('Gallery elements missing in HTML.');
        return;
      }

      selectedBubble = bubble;

      const images =
        bubble.dataset.images ||
        bubble.dataset.image ||
        '../../drawing/2.png';

      gallery = images
        .split('|')
        .map(path => path.trim())
        .filter(Boolean);

      slideNotes = (bubble.dataset.slideNotes || '')
        .split('|')
        .map(text => text.trim());

      title.textContent = bubble.dataset.title || '';

      panel.hidden = false;

      showArtwork(0);

      closeButton?.focus({ preventScroll: true });
    });
  });


  /* 03 — NEXT / PREVIOUS */

  prevButton?.addEventListener('click', () => {
    showArtwork(currentIndex - 1);
  });

  nextButton?.addEventListener('click', () => {
    showArtwork(currentIndex + 1);
  });


  /* 04 — CLOSE PANEL */

  function closePanel() {
    if (!panel || panel.hidden) return;

    panel.hidden = true;

    selectedBubble?.focus({ preventScroll: true });
  }

  closeButton?.addEventListener('click', closePanel);

  panel?.addEventListener('click', event => {
    if (event.target === panel) {
      closePanel();
    }
  });


  /* 05 — KEYBOARD */

  document.addEventListener('keydown', event => {

    if (!panel || panel.hidden) return;

    if (event.key === 'Escape') {
      closePanel();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showArtwork(currentIndex + 1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showArtwork(currentIndex - 1);
    }
  });


  
/* ==========================================
   06 — INTERACTIVE HAND
   Desktop: follows mouse
   Mobile: follows finger
   ========================================== */

if (!hand || !stage) return;

const point = {
  x: stage.clientWidth * (mobile.matches ? 0.46 : 0.42),
  y: stage.clientHeight * (mobile.matches ? 0.95 : 0.83)
};

const goal = { ...point };

/* Update target position */

function updateHandTarget(event) {
  if (panel && !panel.hidden) return;

  const rect = stage.getBoundingClientRect();

  goal.x = clamp(
    event.clientX - rect.left,
    35,
    rect.width - 35
  );

  goal.y = clamp(
    event.clientY - rect.top,
    35,
    rect.height - 35
  );
}

/* Desktop — mouse tracking */

stage.addEventListener('pointermove', (event) => {

  if (!mobile.matches && event.pointerType === 'mouse') {
    updateHandTarget(event);
  }

  /* Mobile — finger movement */

  if (
    mobile.matches &&
    (event.pointerType === 'touch' ||
     event.pointerType === 'pen')
  ) {
    updateHandTarget(event);
  }

}, { passive: true });

/* Mobile — respond immediately to touch */

stage.addEventListener('pointerdown', (event) => {

  if (
    mobile.matches &&
    (event.pointerType === 'touch' ||
     event.pointerType === 'pen')
  ) {
    updateHandTarget(event);
  }

}, { passive: true });

/* Resize / orientation change */

window.addEventListener('resize', () => {

  point.x = goal.x =
    stage.clientWidth * (mobile.matches ? 0.46 : 0.42);

  point.y = goal.y =
    stage.clientHeight * (mobile.matches ? 0.95 : 0.83);

}, { passive: true });

/* Smooth animation */

function moveHand(time) {

  if (!panel || panel.hidden) {

    const easing = reducedMotion.matches
      ? 1
      : mobile.matches ? 0.20 : 0.13;

    point.x += (goal.x - point.x) * easing;
    point.y += (goal.y - point.y) * easing;

    const tilt = clamp(
      (goal.x - point.x) * -0.04,
      -10,
      10
    );

    const sway = reducedMotion.matches
      ? 0
      : Math.sin(time * 0.002) * 1.5;

    hand.style.left = `${point.x}px`;
    hand.style.top = `${point.y}px`;

    hand.style.transform =
      `translate(-50%, -25%) rotate(${tilt + sway}deg)`;
  }

  requestAnimationFrame(moveHand);
}

requestAnimationFrame(moveHand);


/* ==========================================
   INTERACTIVE FISH
   Hover on desktop / Tap on mobile
   ========================================== */

(() => {

  const fishButton = document.querySelector('#pet-fish');
  const fish = fishButton?.querySelector('.footer-fish');

  if (!fishButton || !fish) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  let fishAnimation = null;

  function wiggleFish() {

    if (reducedMotion.matches) return;

    // Restart the animation if touched again
    if (fishAnimation) {
      fishAnimation.cancel();
    }

    fishAnimation = fish.animate(
      [
        {
          transform: 'translateX(0) rotate(0deg)'
        },
        {
          transform: 'translateX(-14px) rotate(-10deg)'
        },
        {
          transform: 'translateX(11px) rotate(8deg)'
        },
        {
          transform: 'translateX(-6px) rotate(-4deg)'
        },
        {
          transform: 'translateX(0) rotate(0deg)'
        }
      ],
      {
        duration: 780,
        easing: 'ease-in-out',
        iterations: 1
      }
    );
  }

  // Desktop: mouse touches fish
  fishButton.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      wiggleFish();
    }
  });

  // Mobile: tap fish
  // Also supports mouse clicks and keyboard activation
  fishButton.addEventListener('click', wiggleFish);

})();
