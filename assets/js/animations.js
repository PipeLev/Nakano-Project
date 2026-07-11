import { $, $$, addClass, removeClass, hasClass, isInViewport, throttle } from './utils.js';

class AnimationController {
  constructor() {
    this.observedImages = new Map();
    this.init();
  }

  init() {
    this.setupImageLoading();
    this.setupImageErrorHandling();
    this.setupHoverEffects();
    this.setupParallaxEffects();
  }

  setupImageLoading() {
    if (!('IntersectionObserver' in window)) {
      const allImages = $$('img');
      allImages.forEach(img => {
        img.style.opacity = '1';
      });
      return;
    }

    const lazyImages = $$('img[loading="lazy"]');

    if (lazyImages.length > 0) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const img = entry.target;

            if (entry.isIntersecting) {
              if (img.dataset.src && !img.src.includes(img.dataset.src)) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }

              if (!hasClass(img, 'loaded')) {
                img.style.opacity = '1';
              }
            } else {
              if (hasClass(img, 'hidden') || img.offsetParent === null) {
                img.style.opacity = '0';
              }
            }
          });
        },
        {
          rootMargin: '200px 0px',
          threshold: 0.01
        }
      );

      lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-out';

        img.addEventListener('load', () => {
          addClass(img, 'loaded');
          img.style.opacity = '1';
        }, { once: true });

        imageObserver.observe(img);
        this.observedImages.set(img, imageObserver);
      });
    }

    const regularImages = $$('img:not([loading="lazy"])');
    regularImages.forEach(img => {
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.4s ease-out';
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        }, { once: true });
      }
    });
  }

  setupImageErrorHandling() {
    const allImages = $$('img');

    allImages.forEach(img => {
      img.addEventListener('error', () => {
        img.style.opacity = '0.6';
        img.style.backgroundColor = '#fde8ee';
        img.style.minHeight = '200px';
        console.warn(`⚠️ Imagen no encontrada: ${img.src}`);
      }, { once: true });
    });
  }

  setupHoverEffects() {
    const cards = Array.from($$('.personaje-card, .cancion-card, .curiosidad-card, .gallery-item, .galeria-preview-item'));

    cards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      card.addEventListener('mouseleave', function () {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  setupParallaxEffects() {
    const parallaxElements = $$('[data-parallax]');
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', throttle(() => {
      const elements = Array.from(parallaxElements);
      elements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.3;
        const yOffset = window.pageYOffset * speed;
        element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      });
    }, 16), { passive: true });
  }

  animateIn(element, animationClass = 'animate-fade-in-up') {
    if (!element) return;
    element.style.animation = 'none';
    element.offsetHeight;
    addClass(element, animationClass);
    element.addEventListener('animationend', () => {
      removeClass(element, animationClass);
      element.style.animation = '';
    }, { once: true });
  }

  animateOut(element, animationClass = 'animate-fade-out') {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }
      element.style.animation = 'none';
      element.offsetHeight;
      addClass(element, animationClass);
      element.addEventListener('animationend', () => {
        removeClass(element, animationClass);
        element.style.animation = '';
        resolve();
      }, { once: true });
    });
  }
}

let animationControllerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!animationControllerInstance) {
    animationControllerInstance = new AnimationController();
    window.animationController = animationControllerInstance;
  }
});

export default AnimationController;