/* CHEN'S PLAYGROUND — homepage only */
(() => {
  function init() {
    const stage = document.querySelector('#scene-one');
    const button = document.querySelector('#enter-button');
    const fish = document.querySelector('#fish');
    if (!stage || !button) { console.error('Missing #scene-one or #enter-button'); return; }

    const mobile = matchMedia('(max-width: 680px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const NEXT_SCENE = '../scene1/s1.html'; // Relative to the homepage HTML URL.
    let leaving = false;
    const clamp = (value,min,max) => Math.max(min,Math.min(max,value));

    button.addEventListener('click', () => {
      if (leaving) return;
      leaving = true;
      button.disabled = true;
      stage.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.assign(NEXT_SCENE);
      }, reduced.matches ? 180 : 1570);
    });

    // Handle browser back/forward cache so the button can be used again.
    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      leaving = false;
      button.disabled = false;
      stage.classList.remove('is-leaving');
    });

    // The mobile fish is in the button and floats with CSS, not pointer tracking.
    if (!fish) return;
    const position = { x: innerWidth * .825, y: innerHeight * .623 };
    const target = { ...position };
    window.addEventListener('pointermove', (event) => {
      if (leaving || mobile.matches || event.pointerType !== 'mouse') return;
      target.x = clamp(event.clientX,innerWidth*.08,innerWidth*.94);
      target.y = clamp(event.clientY,innerHeight*.11,innerHeight*.9);
    }, {passive:true});
    window.addEventListener('resize', () => {
      position.x = target.x = innerWidth * .825;
      position.y = target.y = innerHeight * .623;
    }, {passive:true});

    function animate(time) {
      if (!leaving && !mobile.matches) {
        const k = reduced.matches ? 1 : .092;
        position.x += (target.x-position.x)*k;
        position.y += (target.y-position.y)*k;
        const direction = clamp((target.x-position.x)*.035,-9,9);
        const sway = reduced.matches ? 0 : Math.sin(time*.0017)*2;
        fish.style.left = `${position.x}px`;
        fish.style.top = `${position.y}px`;
        fish.style.transform = `translate(-50%,-50%) rotate(${direction+sway}deg)`;
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();