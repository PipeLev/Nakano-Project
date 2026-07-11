import { $, $$, addClass, removeClass, hasClass, toggleClass } from './utils.js';

/**
 * Maneja la navegación principal del sitio
 * Controla menú responsive, enlace activo y overlay
 */
class Navigation {
  constructor() {
    this.header = $('.main-header');
    this.hamburgerBtn = $('.hamburger-btn');
    this.primaryNav = $('.primary-nav');
    this.navLinks = $$('.nav-link');
    this.navOverlay = $('.nav-overlay');
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    this.createOverlayIfNeeded();
    this.setupMobileMenu();
    this.setupActiveLink();
    this.setupScrollEffect();
    this.setupResizeListener();
    this.setupKeyboardNavigation();
  }

  /**
   * Crea el overlay si no existe en el HTML
   */
  createOverlayIfNeeded() {
    if (!this.navOverlay) {
      this.navOverlay = document.createElement('div');
      this.navOverlay.className = 'nav-overlay';
      this.navOverlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.navOverlay);
    }
  }

  /**
   * Configura el menú móvil
   */
  setupMobileMenu() {
    if (!this.hamburgerBtn || !this.primaryNav) return;

    this.hamburgerBtn.addEventListener('click', () => {
      this.toggleMenu();
    });

    this.navOverlay.addEventListener('click', () => {
      if (this.isMenuOpen) {
        this.closeMenu();
      }
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.closeMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
        if (this.hamburgerBtn) {
          this.hamburgerBtn.focus();
        }
      }
    });
  }

  /**
   * Alterna el menú móvil
   */
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Abre el menú móvil
   */
  openMenu() {
    this.isMenuOpen = true;
    addClass(this.primaryNav, 'open');
    addClass(this.hamburgerBtn, 'active');
    addClass(this.navOverlay, 'visible');
    this.hamburgerBtn.setAttribute('aria-expanded', 'true');
    this.hamburgerBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
    this.navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('nav:opened'));
  }

  /**
   * Cierra el menú móvil
   */
  closeMenu() {
    this.isMenuOpen = false;
    removeClass(this.primaryNav, 'open');
    removeClass(this.hamburgerBtn, 'active');
    removeClass(this.navOverlay, 'visible');
    this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    this.hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    this.navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('nav:closed'));
  }

  /**
   * Marca el enlace activo según la URL actual
   */
  setupActiveLink() {
    const currentPath = window.location.pathname;

    this.navLinks.forEach(link => {
      removeClass(link, 'active');
      link.removeAttribute('aria-current');

      const href = link.getAttribute('href');

      if (!href) return;

      if (currentPath.endsWith(href)) {
        addClass(link, 'active');
        link.setAttribute('aria-current', 'page');
      }

      if ((currentPath === '/' || currentPath.endsWith('/')) && href === 'index.html') {
        addClass(link, 'active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * Efecto de scroll en el header
   */
  setupScrollEffect() {
    if (!this.header) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollY > 50) {
        addClass(this.header, 'scrolled');
      } else {
        removeClass(this.header, 'scrolled');
      }
    }, { passive: true });
  }

  /**
   * Escucha cambios de tamaño de ventana
   */
  setupResizeListener() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Navegación por teclado dentro del menú
   */
  setupKeyboardNavigation() {
    if (!this.primaryNav) return;

    this.primaryNav.addEventListener('keydown', (e) => {
      const links = Array.from(this.primaryNav.querySelectorAll('.nav-link'));
      const currentIndex = links.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let newIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (currentIndex + 1) % links.length;
          links[newIndex].focus();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (currentIndex - 1 + links.length) % links.length;
          links[newIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          links[0].focus();
          break;
        case 'End':
          e.preventDefault();
          links[links.length - 1].focus();
          break;
      }
    });
  }
}

let navigationInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!navigationInstance) {
    navigationInstance = new Navigation();
    window.navigation = navigationInstance;
  }
});

export default Navigation;