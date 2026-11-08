'use client';
import { useEffect, useRef, useState } from 'react';
const CHANGE = 'jk:cursor-status';
const TOGGLE = 'jk:toggle-cursor';
const REQUEST = 'jk:request-cursor-status';
export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = cursor.current!;
    const root = document.documentElement;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = true, frame = 0, wheelTimer = 0, scrolling = false, x = -100, y = -100;
    try { enabled = localStorage.getItem('jk-cursor') !== 'system'; } catch { /* Use the default for this visit. */ }
    const allowed = () => enabled && fine.matches && !motion.matches;
    const hide = () => { root.classList.remove('has-custom-cursor'); element.dataset.visible = 'false'; };
    const mode = (target: EventTarget | null) => {
      const node = target instanceof Element ? target : null;
      if (!allowed() || document.querySelector('dialog[open]') || node?.closest('input,textarea,select,[contenteditable=true]')) { hide(); return; }
      let label = '';
      if (scrolling) label = 'Scroll';
      else if (root.dataset.loading === 'true') label = 'Loading';
      else { const control = node?.closest<HTMLElement>('a,button,[data-cursor]'); if (control && !control.hasAttribute('disabled')) label = control.dataset.cursor || (control.tagName === 'A' ? 'View' : 'Click'); }
      element.dataset.mode = label || 'default';
      const text = element.querySelector('span')!; text.textContent = label;
      element.dataset.visible = 'true'; root.classList.add('has-custom-cursor');
    };
    const updatePosition = () => { frame = 0; element.style.transform = `translate3d(${x}px,${y}px,0)`; };
    const move = (event: PointerEvent) => { if (event.pointerType !== 'mouse') { hide(); return; } x = event.clientX; y = event.clientY; if (!frame) frame = requestAnimationFrame(updatePosition); mode(event.target); };
    const over = (event: PointerEvent) => { if (event.pointerType === 'mouse') mode(event.target); };
    const wheel = () => { if (!allowed()) return; scrolling = true; mode(document.elementFromPoint(x, y)); clearTimeout(wheelTimer); wheelTimer = window.setTimeout(() => { scrolling = false; mode(document.elementFromPoint(x, y)); }, 550); };
    const down = () => { element.dataset.pressed = 'true'; }; const up = () => { element.dataset.pressed = 'false'; };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab') hide(); };
    const changed = () => { if (!allowed()) hide(); window.dispatchEvent(new CustomEvent(CHANGE, { detail: allowed() })); };
    const toggle = () => { enabled = !enabled; try { localStorage.setItem('jk-cursor', enabled ? 'enhanced' : 'system'); } catch { /* Preference remains valid for this visit. */ } changed(); };
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerover', over, { passive: true }); window.addEventListener('wheel', wheel, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true }); window.addEventListener('pointerup', up, { passive: true }); window.addEventListener('blur', hide); document.addEventListener('pointerleave', hide); window.addEventListener('keydown', keyboard); document.addEventListener('focusin', hide);
    fine.addEventListener('change', changed); motion.addEventListener('change', changed); window.addEventListener(TOGGLE, toggle); window.addEventListener(REQUEST, changed); changed();
    return () => {
      cancelAnimationFrame(frame); clearTimeout(wheelTimer); hide();
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); window.removeEventListener('wheel', wheel); window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('blur', hide); document.removeEventListener('pointerleave', hide); window.removeEventListener('keydown', keyboard); document.removeEventListener('focusin', hide); fine.removeEventListener('change', changed); motion.removeEventListener('change', changed); window.removeEventListener(TOGGLE, toggle); window.removeEventListener(REQUEST, changed);
    };
  }, []);
  return <div ref={cursor} className="custom-cursor" data-visible="false" data-mode="default" aria-hidden="true"><i/><span/></div>;
}
export function CursorSettingsButton() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => { const update = (event: Event) => setEnabled((event as CustomEvent<boolean>).detail); window.addEventListener(CHANGE, update); window.dispatchEvent(new Event(REQUEST)); return () => window.removeEventListener(CHANGE, update); }, []);
  return <button className="footer-link-button cursor-setting" type="button" aria-pressed={enabled} onClick={() => window.dispatchEvent(new Event(TOGGLE))}>Cursor effects <span aria-hidden="true">{enabled ? 'on' : 'off'}</span></button>;
}
