import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — Adds `data-revealed` attribute when element enters the viewport.
 * Used with CSS to trigger entry animations.
 *
 * Usage: const ref = useScrollReveal(); <div ref={ref} className="reveal-on-scroll" />
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If user prefers reduced motion, just show elements immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.setAttribute('data-revealed', 'true');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-revealed', 'true');
          observer.unobserve(el); // Trigger only once
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
        ...options,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * useStaggerReveal — Adds staggered `data-revealed` to all child elements
 * with `data-stagger` attribute when container enters viewport.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  staggerDelayMs = 80
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const children = Array.from(
      container.querySelectorAll<HTMLElement>('[data-stagger]')
    );

    if (prefersReducedMotion) {
      children.forEach((child) => child.setAttribute('data-revealed', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => {
              child.setAttribute('data-revealed', 'true');
            }, i * staggerDelayMs);
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerDelayMs]);

  return ref;
}
