import { $, $$, addClass, removeClass, hasClass } from './utils.js';

/**
 * Sistema de modales genérico
 * Maneja abrir, cerrar, overlay, teclado y accesibilidad
 */
class ModalManager {
  constructor() {
    this.modals = {};
    this.activeModal = null;
    this.previousActiveElement = null;
    this.init();
  }

  init() {
    this.collectModals();
    this.setupTriggerButtons();
    this.setupGlobalListeners();
  }

  /**
   * Recolecta todos los modales del DOM
   */
  collectModals() {
    const modalElements = $$('.modal');

    modalElements.forEach(modal => {
      const id = modal.id;
      if (id) {
        this.modals[id] = modal;
        this.setupModalAccessibility(modal);
      }
    });
  }

  /**
   * Configura atributos de accesibilidad
   * @param {Element} modal
   */
  setupModalAccessibility(modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', 'Cerrar ventana');
    }
  }

  /**
   * Configura los botones que abren modales
   */
  setupTriggerButtons() {
    const triggers = $$('[data-modal]');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modalId = trigger.dataset.modal;
        this.open(modalId);
      });
    });
  }

  /**
   * Listeners globales para cierre
   */
  setupGlobalListeners() {
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.modal-close-btn');
      if (closeBtn && this.activeModal) {
        e.preventDefault();
        this.close();
        return;
      }

      if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        e.preventDefault();
        this.close();
      }

      if (e.key === 'Tab' && this.activeModal) {
        this.trapFocus(e);
      }
    });
  }

  /**
   * Atrapa el foco dentro del modal
   * @param {KeyboardEvent} e
   */
  trapFocus(e) {
    const modal = this.activeModal;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Abre un modal
   * @param {string} modalId
   */
  open(modalId) {
    const modal = this.modals[modalId];

    if (!modal) {
      console.warn(`Modal con ID "${modalId}" no encontrado.`);
      return;
    }

    if (this.activeModal && this.activeModal !== modal) {
      this.close();
    }

    this.previousActiveElement = document.activeElement;

    addClass(modal, 'active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    this.activeModal = modal;

    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    setTimeout(() => {
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        modal.setAttribute('tabindex', '-1');
        modal.focus();
      }
    }, 100);

    const content = modal.querySelector('.modal-content');
    if (content) {
      content.style.animation = 'none';
      content.offsetHeight;
      content.style.animation = 'modalIn 0.35s ease-out';
    }

    modal.dispatchEvent(new CustomEvent('modal:opened', {
      bubbles: true,
      detail: { modalId }
    }));
  }

  /**
   * Cierra el modal activo
   */
  close() {
    if (!this.activeModal) return;

    const modal = this.activeModal;

    removeClass(modal, 'active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    this.activeModal = null;

    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      setTimeout(() => {
        this.previousActiveElement.focus();
        this.previousActiveElement = null;
      }, 100);
    }

    modal.dispatchEvent(new CustomEvent('modal:closed', {
      bubbles: true,
      detail: { modalId: modal.id }
    }));
  }

  /**
   * Registra un modal dinámicamente
   * @param {Element} modalElement
   */
  register(modalElement) {
    if (modalElement && modalElement.id) {
      this.modals[modalElement.id] = modalElement;
      this.setupModalAccessibility(modalElement);
    }
  }

  /**
   * Elimina un modal
   * @param {string} modalId
   */
  unregister(modalId) {
    if (this.activeModal && this.activeModal.id === modalId) {
      this.close();
    }
    delete this.modals[modalId];
  }
}

let modalManagerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!modalManagerInstance) {
    modalManagerInstance = new ModalManager();
    window.modalManager = modalManagerInstance;
  }
});

export default ModalManager;