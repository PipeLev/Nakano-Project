import { $, $$, addClass, removeClass, hasClass, debounce } from './utils.js';

/**
 * Maneja la página de curiosidades
 * Búsqueda, filtros por categoría y animaciones
 */
class CuriosidadesPage {
  constructor() {
    this.curiosidadesGrid = $('#curiosidadesGrid');
    this.searchInput = $('#curiosidadesSearch');
    this.categoryButtons = $$('.category-filters .filter-btn');
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.init();
  }

  init() {
    if (!this.curiosidadesGrid) return;

    this.setupSearch();
    this.setupCategoryFilters();
    this.setupCardAnimations();
  }

  /**
   * Configura la búsqueda con debounce
   */
  setupSearch() {
    if (!this.searchInput) return;

    const debouncedFilter = debounce((term) => {
      this.searchTerm = term.toLowerCase().trim();
      this.applyFilters();
    }, 300);

    this.searchInput.addEventListener('input', (e) => {
      debouncedFilter(e.target.value);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.searchInput.value = '';
        this.searchTerm = '';
        this.applyFilters();
        this.searchInput.blur();
      }
    });
  }

  /**
   * Configura los filtros por categoría
   */
  setupCategoryFilters() {
    this.categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.category;

        this.categoryButtons.forEach(b => removeClass(b, 'active'));
        addClass(btn, 'active');

        this.applyFilters();
      });
    });
  }

  /**
   * Aplica filtros combinados
   */
  applyFilters() {
    const cards = $$('.curiosidad-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.dataset.category;
      const textContent = card.textContent.toLowerCase();

      const matchesCategory = this.currentCategory === 'all' || category === this.currentCategory;
      const matchesSearch = this.searchTerm === '' || textContent.includes(this.searchTerm);

      if (matchesCategory && matchesSearch) {
        removeClass(card, 'hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = `fadeInUp 0.4s ease-out ${visibleCount * 0.06}s both`;
        visibleCount++;
      } else {
        addClass(card, 'hidden');
      }
    });

    this.updateNoResultsMessage(visibleCount === 0);
  }

  /**
   * Muestra mensaje si no hay resultados
   * @param {boolean} show
   */
  updateNoResultsMessage(show) {
    let message = $('.no-results-message');

    if (show) {
      if (!message) {
        message = document.createElement('p');
        message.className = 'no-results-message';
        message.textContent = 'No se encontraron curiosidades con los filtros actuales. Intenta con otra búsqueda. 🌸';
        this.curiosidadesGrid.appendChild(message);
      }
    } else if (message) {
      message.remove();
    }
  }

  /**
   * Animaciones de entrada para las cards
   */
  setupCardAnimations() {
    const cards = $$('.curiosidad-card');

    if (!('IntersectionObserver' in window)) {
      cards.forEach(card => {
        card.style.opacity = '1';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasClass(entry.target, 'hidden')) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
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
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CuriosidadesPage();
});

export default CuriosidadesPage;