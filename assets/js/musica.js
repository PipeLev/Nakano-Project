import { $, $$ } from './utils.js';

/**
 * Maneja la página de música
 * Animaciones y enlaces externos
 */
class MusicaPage {
  constructor() {
    this.pageSection = $('.musica-page-section');
    this.init();
  }

  init() {
    if (!this.pageSection) return;

    this.setupCardAnimations();
    this.setupExternalLinks();
  }

  /**
   * Animaciones de entrada para las cards
   */
  setupCardAnimations() {
    const cards = $$('.cancion-card');

    if (!('IntersectionObserver' in window)) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
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
            }, index * 100);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(35px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });
  }

  /**
   * Configura enlaces externos con confirmación
   */
  setupExternalLinks() {
    const externalLinks = $$('a[target="_blank"][rel*="noopener"]');

    externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const userConfirmed = confirm(
          'Serás redirigido a YouTube. ¿Deseas continuar?'
        );

        if (!userConfirmed) {
          e.preventDefault();
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MusicaPage();
});

export default MusicaPage;