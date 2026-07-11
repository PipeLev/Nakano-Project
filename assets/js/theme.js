/**
 * Maneja el tema de color del sitio
 * Preparado para modo claro/oscuro futuro
 */
class ThemeManager {
  constructor() {
    this.storageKey = 'nakano-theme-preference';
    this.currentTheme = 'light';
    this.metaThemeColor = document.querySelector('meta[name="theme-color"]');
    this.init();
  }

  init() {
    this.loadSavedTheme();
    this.detectSystemPreference();
    this.applyTheme();
    this.listenForSystemChanges();
  }

  /**
   * Carga tema guardado
   */
  loadSavedTheme() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.currentTheme = saved;
      }
    } catch (error) {
      console.warn('No se pudo acceder a localStorage:', error);
    }
  }

  /**
   * Detecta preferencia del sistema
   */
  detectSystemPreference() {
    if (localStorage.getItem(this.storageKey)) return;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }
  }

  /**
   * Escucha cambios en preferencia del sistema
   */
  listenForSystemChanges() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme();
        }
      });
    }
  }

  /**
   * Aplica el tema actual
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    if (this.metaThemeColor) {
      const color = this.currentTheme === 'dark' ? '#2b1e2c' : '#f2a0b5';
      this.metaThemeColor.setAttribute('content', color);
    }

    dispatchEvent(new CustomEvent('theme:changed', {
      detail: { theme: this.currentTheme }
    }));
  }

  /**
   * Alterna entre temas
   * @returns {string} Nuevo tema
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch (error) {
      console.warn('No se pudo guardar preferencia de tema:', error);
    }
    this.applyTheme();
    return this.currentTheme;
  }

  /**
   * Establece un tema específico
   * @param {string} theme - 'light' o 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    this.currentTheme = theme;
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('No se pudo guardar preferencia de tema:', error);
    }
    this.applyTheme();
  }

  /**
   * Obtiene el tema actual
   * @returns {string}
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}

let themeManagerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager();
    window.themeManager = themeManagerInstance;
  }
});

export default ThemeManager;