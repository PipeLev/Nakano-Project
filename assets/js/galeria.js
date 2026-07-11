import { $, $$, addClass, removeClass, hasClass } from './utils.js';

/**
 * Maneja la página de galería
 * Filtros, lightbox y animaciones
 */
class GaleriaPage {
  constructor() {
    this.galleryGrid = $('#galleryGrid');
    this.lightbox = $('#lightbox');
    this.lightboxImage = $('#lightboxImage');
    this.filterButtons = $$('.gallery-filters .filter-btn');
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    if (!this.galleryGrid) return;

    this.setupFilters();
    this.setupLightbox();
    this.setupKeyboardNavigation();
  }

  /**
   * Configura los filtros de galería
   */
  setupFilters() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.dataset.filter;
        this.applyFilter(filterValue);

        this.filterButtons.forEach(b => removeClass(b, 'active'));
        addClass(btn, 'active');
      });
    });
  }

  /**
   * Aplica un filtro a la galería
   * @param {string} filter
   */
  applyFilter(filter) {
    this.currentFilter = filter;
    const items = $$('.gallery-item');
    let visibleIndex = 0;

    items.forEach(item => {
      const category = item.dataset.category;

      if (filter === 'all' || category === filter) {
        removeClass(item, 'hidden');
        const img = item.querySelector('img');
        if (img) {
          img.style.opacity = '1';
        }
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = `fadeInUp 0.45s ease-out ${visibleIndex * 0.06}s both`;
        visibleIndex++;
      } else {
        addClass(item, 'hidden');
      }
    });
  }

  /**
   * Configura el lightbox
   */
  setupLightbox() {
    if (!this.lightbox || !this.lightboxImage) return;

    const galleryItems = $$('.gallery-item img');

    galleryItems.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLightbox(img.src, img.alt);
      });
    });

    const closeBtn = $('.lightbox-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeLightbox();
      });
    }

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });
  }

  /**
   * Abre el lightbox
   * @param {string} src
   * @param {string} alt
   */
  openLightbox(src, alt) {
    if (!this.lightbox || !this.lightboxImage) return;

    this.lightboxImage.src = src;
    this.lightboxImage.alt = alt || 'Imagen ampliada';
    addClass(this.lightbox, 'active');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const closeBtn = $('.lightbox-close-btn');
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 100);
  }

  /**
   * Cierra el lightbox
   */
  closeLightbox() {
    if (!this.lightbox) return;

    removeClass(this.lightbox, 'active');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      if (this.lightboxImage) {
        this.lightboxImage.src = '';
        this.lightboxImage.alt = '';
      }
    }, 350);
  }

  /**
   * Navegación por teclado en lightbox
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox || !hasClass(this.lightbox, 'active')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeLightbox();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GaleriaPage();
});

export default GaleriaPage;