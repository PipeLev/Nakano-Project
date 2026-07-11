/**
 * Utilidades generales para The Nakano Archives
 * Funciones helper reutilizables en todo el proyecto
 */

/**
 * Selecciona un elemento del DOM
 * @param {string} selector - Selector CSS
 * @param {Element} parent - Elemento padre opcional
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Selecciona todos los elementos que coinciden con el selector
 * Devuelve un array real, no una NodeList viva
 * @param {string} selector - Selector CSS
 * @param {Element} parent - Elemento padre opcional
 * @returns {Element[]}
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Crea un elemento HTML con atributos y contenido
 * @param {string} tag - Etiqueta HTML
 * @param {Object} attrs - Atributos del elemento
 * @param {...any} children - Hijos (string, Element, Array)
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, value);
    } else if (key === 'style' && typeof value === 'object') {
      for (const [styleKey, styleValue] of Object.entries(value)) {
        element.style[styleKey] = styleValue;
      }
    } else if (key === 'html') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Element || child instanceof Node) {
      element.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(c => {
        if (c instanceof Element || c instanceof Node) {
          element.appendChild(c);
        } else if (typeof c === 'string') {
          element.appendChild(document.createTextNode(c));
        }
      });
    }
  }

  return element;
}

/**
 * Agrega una clase a un elemento
 * @param {Element} element
 * @param {string} className
 */
export function addClass(element, className) {
  if (element && className) {
    element.classList.add(className);
  }
}

/**
 * Remueve una clase de un elemento
 * @param {Element} element
 * @param {string} className
 */
export function removeClass(element, className) {
  if (element && className) {
    element.classList.remove(className);
  }
}

/**
 * Alterna una clase en un elemento
 * @param {Element} element
 * @param {string} className
 * @returns {boolean}
 */
export function toggleClass(element, className) {
  if (element && className) {
    return element.classList.toggle(className);
  }
  return false;
}

/**
 * Verifica si un elemento tiene una clase
 * @param {Element} element
 * @param {string} className
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element ? element.classList.contains(className) : false;
}

/**
 * Debounce para optimizar eventos
 * @param {Function} func
 * @param {number} wait - Milisegundos de espera
 * @returns {Function}
 */
export function debounce(func, wait = 250) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      clearTimeout(timeout);
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle para limitar frecuencia
 * @param {Function} func
 * @param {number} limit - Milisegundos
 * @returns {Function}
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  return function executedFunction(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastFunc) {
          lastFunc();
          lastFunc = null;
        }
      }, limit);
    } else {
      lastFunc = () => func.apply(context, args);
    }
  };
}

/**
 * Detecta si un elemento está en el viewport
 * @param {Element} element
 * @param {number} offset - Margen adicional
 * @returns {boolean}
 */
export function isInViewport(element, offset = 0) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top <= windowHeight + offset &&
    rect.bottom >= -offset &&
    rect.left <= windowWidth + offset &&
    rect.right >= -offset
  );
}

/**
 * Obtiene la ruta base según la ubicación actual
 * @returns {string}
 */
export function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/pages/')) {
    return '../';
  }
  return './';
}

/**
 * Detecta si es dispositivo móvil
 * @returns {boolean}
 */
export function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Detecta si es tablet
 * @returns {boolean}
 */
export function isTablet() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Formatea una fecha
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('es-ES', options);
}

/**
 * Genera un ID único
 * @returns {string}
 */
export function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos
 * @returns {Promise}
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Manejo seguro de errores para funciones async
 * @param {Promise} promise
 * @returns {Promise<[Error|null, any]>}
 */
export async function safeAsync(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

/**
 * Dispara un evento personalizado
 * @param {Element} element
 * @param {string} eventName
 * @param {Object} detail
 */
export function dispatchCustomEvent(element, eventName, detail = {}) {
  if (!element) return;
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    detail
  });
  element.dispatchEvent(event);
}