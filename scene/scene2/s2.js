
/*
  CHEN'S PLAYGROUND
  SCENE 02 — A LITTLE CHAT

  Desktop:
  Hover to rock.

  Mobile:
  Tap to rock.

  Each click reveals another little conversation.
*/

(() => {

  /* 01 — ELEMENTS */

  const chair = document.querySelector('#chair-button');
  const stage = document.querySelector('#chair-stage');
  const whisper = document.querySelector('#chair-whisper');

  if (!chair || !stage || !whisper) return;

  /* 02 — SETTINGS */

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  /* 03 — LITTLE CONVERSATIONS */

  const lines = [
    "psst... there's room for you, too.",
    "we can talk about nothing.",
    "some stories take their time.",
    "no rush. stay a while."
  ];

  let messageIndex = 0;
  let rockingTimer;

  /* 04 — INTERACTION */

  function interact(nextLine = false) {

    // Move to another sentence on click.
    if (nextLine) {
      messageIndex = (messageIndex + 1) % lines.length;
    }

    whisper.textContent = lines[messageIndex];

    // Show the little message.
    stage.classList.add('has-interacted');

    // Restart the rocking animation.
    window.clearTimeout(rockingTimer);

    stage.classList.remove('is-rocking');

    if (prefersReducedMotion.matches) return;

    // Force the animation to restart.
    void stage.offsetWidth;

    stage.classList.add('is-rocking');

    // End rocking after one gentle cycle.
    rockingTimer = window.setTimeout(() => {
      stage.classList.remove('is-rocking');
    }, 2450);
  }

  /* 05 — DESKTOP HOVER */

  chair.addEventListener('pointerenter', event => {

    if (event.pointerType === 'mouse') {
      interact(false);
    }

  });

  /* 06 — CLICK / TAP / KEYBOARD */

  chair.addEventListener('click', () => {
    interact(true);
  });

})();
