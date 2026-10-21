// Rubber-band overscroll (DESIGN.md §8.11): when you scroll past the top or bottom of the
// page, the page stretches a little with growing resistance and springs back, instead of
// stopping dead. Normal scrolling is never touched; the effect only runs at the edges.
//
// Where the effect comes from, per device:
//   Touch screens (phones, tablets) → the OS's own overscroll (iOS bounce, Android stretch)
//   Safari on macOS                 → WebKit's own bounce (the reference behaviour)
//   Mouse wheel / trackpad elsewhere → this module, in Chrome, Edge, Firefox and Opera
//                                      on Windows, macOS, Linux and ChromeOS
//   "Reduce motion" turned on       → off everywhere; the browser's default applies
//
// While active, the browser's own overscroll on the page is turned off
// (overscroll-behavior: none, via the .rubber-band class), so the two never stack.

/** How far the page can stretch, in px (also capped to 15% of the window height). */
const MAX_STRETCH = 120;
/** Resistance, as in iOS's rubber-band formula: higher = stretches further per scroll. */
const RESISTANCE = 0.55;
/** Pause after the last wheel event before the page springs back, in ms. */
const RELEASE_DELAY = 90;
/** Spring stiffness (rad/s). Critically damped: settles in ~0.35s without wobbling. */
const SPRING = 16;

const LINE_HEIGHT = 16;

function isSafari(): boolean {
  const ua = navigator.userAgent;
  return /safari/i.test(ua) && !/chrome|chromium|crios|fxios|edg|opr|android/i.test(ua);
}

/** Wheel delta in pixels, whatever unit the device reports. */
function pixelDelta(event: WheelEvent): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * LINE_HEIGHT;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

/** True when an element between the target and the page can still scroll in this direction. */
function innerScrollerCanScroll(target: EventTarget | null, direction: 1 | -1): boolean {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll|overlay)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      if (direction < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
    }
    el = el.parentElement;
  }
  return false;
}

export function installRubberBand(target: HTMLElement): () => void {
  const root = document.documentElement;
  const finePointer = window.matchMedia('(pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let enabled = false;
  let pulled = 0; // accumulated scroll distance past the edge (raw, before resistance)
  let offset = 0; // current visual displacement in px (+ = page moved down, top edge)
  let releaseTimer = 0;
  let frame = 0;

  const limit = () => Math.min(MAX_STRETCH, window.innerHeight * 0.15);
  const stretch = (raw: number) => {
    const d = limit();
    return Math.sign(raw) * d * (1 - 1 / ((Math.abs(raw) * RESISTANCE) / d + 1));
  };
  // Inverse of stretch(): the raw pull that produces a given displacement.
  const unstretch = (shown: number) => {
    const d = limit();
    const ratio = Math.min(Math.abs(shown) / d, 0.999);
    return Math.sign(shown) * ((1 / (1 - ratio) - 1) * d) / RESISTANCE;
  };

  function paint() {
    if (Math.abs(offset) < 0.1) {
      offset = 0;
      target.style.transform = '';
      target.style.willChange = '';
    } else {
      target.style.willChange = 'transform';
      target.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
  }

  function stopSpring() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  // Critically damped spring back to 0 (no overshoot, no wobble). Position is computed from
  // the time since release, x(t) = x0·(1 + ωt)·e^(−ωt), so it finishes on time even when
  // frames are dropped (slow devices, 30 Hz or 144 Hz screens, busy main thread).
  function springBack() {
    stopSpring();
    pulled = 0;
    const start = performance.now();
    const from = offset;
    const step = (now: number) => {
      const t = (now - start) / 1000;
      offset = from * (1 + SPRING * t) * Math.exp(-SPRING * t);
      if (Math.abs(offset) < 0.1) {
        offset = 0;
        paint();
        frame = 0;
        return;
      }
      paint();
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  function scheduleRelease() {
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(springBack, RELEASE_DELAY);
  }

  function onWheel(event: WheelEvent) {
    if (event.ctrlKey || event.defaultPrevented) return; // pinch-zoom / handled elsewhere
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return; // horizontal gesture
    if (document.body.style.overflow === 'hidden') return; // a menu or dialog is open

    const delta = pixelDelta(event);
    if (delta === 0) return;

    // Already stretched and scrolling back the other way: un-stretch first, and don't
    // let the page scroll until the stretch is gone.
    if (offset !== 0 && Math.sign(delta) === Math.sign(offset)) {
      event.preventDefault();
      stopSpring();
      pulled = unstretch(offset) - delta;
      if (Math.sign(pulled) !== Math.sign(offset)) pulled = 0;
      offset = stretch(pulled);
      paint();
      scheduleRelease();
      return;
    }

    const direction: 1 | -1 = delta > 0 ? 1 : -1;
    const atTop = window.scrollY <= 0;
    const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 1;
    if (!((direction < 0 && atTop) || (direction > 0 && atBottom))) return;
    if (innerScrollerCanScroll(event.target, direction)) return;

    // Past the edge: stretch. Pulling at the top moves the page down (+), at the bottom up (−).
    event.preventDefault();
    stopSpring();
    if (offset === 0) pulled = 0;
    pulled -= delta;
    offset = stretch(pulled);
    paint();
    scheduleRelease();
  }

  function reset() {
    window.clearTimeout(releaseTimer);
    stopSpring();
    pulled = 0;
    offset = 0;
    paint();
  }

  function update() {
    const shouldEnable = finePointer.matches && !reducedMotion.matches && !isSafari();
    if (shouldEnable === enabled) return;
    enabled = shouldEnable;
    if (enabled) {
      root.classList.add('rubber-band');
      // Non-passive so the page doesn't scroll while a stretch is being undone.
      window.addEventListener('wheel', onWheel, { passive: false });
    } else {
      root.classList.remove('rubber-band');
      window.removeEventListener('wheel', onWheel);
      reset();
    }
  }

  update();
  finePointer.addEventListener('change', update);
  reducedMotion.addEventListener('change', update);
  window.addEventListener('resize', reset);
  // Keyboard scrolling, find-in-page or a route change while stretched: snap back cleanly.
  window.addEventListener('keydown', reset);

  return () => {
    finePointer.removeEventListener('change', update);
    reducedMotion.removeEventListener('change', update);
    window.removeEventListener('resize', reset);
    window.removeEventListener('keydown', reset);
    window.removeEventListener('wheel', onWheel);
    root.classList.remove('rubber-band');
    reset();
  };
}
