import { $, $$, addClass, removeClass } from './utils.js';

/**
 * Maneja la página de personajes
 * Scroll suave a perfiles desde hash y animaciones
 */
class PersonajesPage {
  constructor() {
    this.pageSection = $('.personajes-page-section');
    this.init();
  }

  init() {
    if (!this.pageSection) return;

    this.scrollToHash();
    this.setupGalleryButtons();
    this.setupProfileAnimations();
  }

  /**
   * Hace scroll al perfil indicado en el hash
   */
  scrollToHash() {
    const hash = window.location.hash.slice(1);

    if (!hash) return;

    const targetProfile = document.getElementById(hash);

    if (targetProfile) {
      setTimeout(() => {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 72;
        const targetPosition = targetProfile.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        targetProfile.style.transition = 'background-color 0.6s ease';
        targetProfile.style.backgroundColor = 'rgba(242, 160, 181, 0.06)';

        setTimeout(() => {
          targetProfile.style.backgroundColor = '';
        }, 2500);
      }, 400);
    }
  }

  /**
   * Configura los botones de galería
   */
  setupGalleryButtons() {
    const galleryButtons = $$('.gallery-trigger-btn');

    galleryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.dataset.modal;

        if (modalId && window.modalManager) {
          window.modalManager.open(modalId);
        }
      });
    });
  }

  /**
   * Animaciones de entrada para perfiles
   */
  setupProfileAnimations() {
    const profiles = $$('.personaje-profile');

    if (!('IntersectionObserver' in window)) {
      profiles.forEach(profile => {
        profile.style.opacity = '1';
        profile.style.transform = 'translateY(0)';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 120);

            const img = entry.target.querySelector('.profile-main-image');
            if (img) {
              img.style.opacity = '1';
            }
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    profiles.forEach(profile => {
      profile.style.opacity = '0';
      profile.style.transform = 'translateY(40px)';
      profile.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
      observer.observe(profile);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PersonajesPage();
});

export default PersonajesPage;