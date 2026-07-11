/**
 * The Nakano Archives - Archivo principal
 * Inicializa todos los módulos del sitio
 * Gotoubun no Hanayome Fan Project
 * v1.0.0
 */

import Navigation from './navigation.js';
import ScrollAnimator from './scroll.js';
import ThemeManager from './theme.js';
import AnimationController from './animations.js';

import PersonajesPage from './personajes.js';
import GaleriaPage from './galeria.js';
import MusicaPage from './musica.js';
import CuriosidadesPage from './curiosidades.js';

class App {
  constructor() {
    this.initialized = false;
    this.modules = {};
    this.version = '1.0.0';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      this.boot();
    }
  }

  boot() {
    if (this.initialized) {
      console.warn('⚠️ The Nakano Archives ya está inicializado.');
      return;
    }

    console.log(`🌸 The Nakano Archives v${this.version} - Iniciando...`);

    try {
      this.initCoreModules();
      this.initPageModules();
      this.setupGlobalErrorHandling();

      this.initialized = true;
      console.log('✅ The Nakano Archives listo.');
    } catch (error) {
      console.error('❌ Error crítico al inicializar:', error);
    }
  }

  initCoreModules() {
    this.modules.navigation = new Navigation();
    this.modules.scrollAnimator = new ScrollAnimator();
    this.modules.themeManager = new ThemeManager();
    this.modules.animationController = new AnimationController();

    window.app = this;
  }

  initPageModules() {
    const path = window.location.pathname;

    try {
      if (path.includes('personajes')) {
        this.modules.personajes = new PersonajesPage();
      } else if (path.includes('galeria')) {
        this.modules.galeria = new GaleriaPage();
      } else if (path.includes('musica')) {
        this.modules.musica = new MusicaPage();
      } else if (path.includes('curiosidades')) {
        this.modules.curiosidades = new CuriosidadesPage();
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar módulo de página:', error.message);
    }
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      if (event.filename && event.filename.includes('assets/js/')) {
        console.error('❌ Error en módulo:', {
          mensaje: event.message,
          archivo: event.filename,
          linea: event.lineno
        });
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promesa no manejada:', event.reason);
    });
  }
}

const app = new App();

export default app;