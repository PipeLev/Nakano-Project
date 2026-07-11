import { $$, addClass, isInViewport, throttle } from './utils.js';

/**
 * Maneja animaciones basadas en scroll
 * Detecta elementos en viewport y aplica clases de revelado
 */
class ScrollAnimator {
  constructor() {
    this.revealElements = [];
    this.observer = null;
    this.init();
  }

  init() {
    this.collectRevealElements();
    this.setupIntersectionObserver();
    this.setupSmoothScroll();
    this.observeElements();
  }

  /**
   * Recolecta elementos con clases de animación
   */
  collectRevealElements() {
    this.revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  }

  /**
   * Configura Intersection Observer
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      this.fallbackScrollListener();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            addClass(entry.target, 'visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );
  }

  /**
   * Observa todos los elementos recolectados
   */
  observeElements() {
    if (!this.observer) return;

    this.revealElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  /**
   * Fallback sin Intersection Observer
   */
  fallbackScrollListener() {
    const checkElements = throttle(() => {
      this.revealElements.forEach(element => {
        if (isInViewport(element, 60)) {
          addClass(element, 'visible');
        }
      });
    }, 80);

    window.addEventListener('scroll', checkElements, { passive: true });
    checkElements();
  }

  /**
   * Scroll suave para enlaces internos
   */
  setupSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.main-header')?.offsetHeight || 72;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      history.pushState(null, null, `#${targetId}`);

      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    });
  }

  /**
   * Actualiza la lista de elementos (para contenido dinámico)
   */
  refresh() {
    if (this.observer) {
      this.revealElements.forEach(el => this.observer.unobserve(el));
    }
    this.collectRevealElements();
    this.observeElements();
  }
}

let scrollAnimatorInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!scrollAnimatorInstance) {
    scrollAnimatorInstance = new ScrollAnimator();
    window.scrollAnimator = scrollAnimatorInstance;
  }
});

export default ScrollAnimator;