/**
 * ================================================================
 * EVIDENCIA 21: Desarrollo de aplicativo Bootstrap
 * Masha y el Oso — Script principal (main.js)
 * Técnico en Programación de Software · SENA (Código 233104)
 *
 * Módulos:
 *  1. Validación del formulario de contacto (HTML5 + Bootstrap)
 *  2. Contador de caracteres del textarea
 *  3. Modal de éxito al enviar el formulario
 *  4. Botón "Volver arriba" dinámico
 *  5. Navbar activa según sección visible (IntersectionObserver)
 *  6. Cerrar navbar en móvil al hacer clic en un enlace
 *  7. Lightbox de galería (pasar src+caption al modal)
 *  8. Animación de aparición de tarjetas al hacer scroll
 * ================================================================
 */

'use strict';

/* ----------------------------------------------------------------
   Ejecutar todo al cargar el DOM
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarFormulario();
  iniciarContadorCaracteres();
  iniciarBotonVolverArriba();
  iniciarNavbarActiva();
  iniciarCerrarNavMovil();
  iniciarGaleriaLightbox();
  iniciarAnimacionTarjetas();
});

/* ----------------------------------------------------------------
   1. VALIDACIÓN DEL FORMULARIO
   - Bootstrap añade mensajes visuales al agregar la clase
     'was-validated' al <form>.
   - Se previene el envío real del formulario; si es válido,
     se muestra el modal de éxito y se resetea.
---------------------------------------------------------------- */
function iniciarFormulario() {
  const form = document.getElementById('formContacto');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    form.classList.add('was-validated');

    if (form.checkValidity()) {
      // Mostrar modal de éxito
      const modalExitoEl = document.getElementById('modalExito');
      if (modalExitoEl) {
        const modalExito = new bootstrap.Modal(modalExitoEl);
        modalExito.show();
      }

      // Limpiar formulario
      form.reset();
      form.classList.remove('was-validated');

      // Resetear contador
      const contador = document.getElementById('contadorCaracteres');
      if (contador) {
        contador.textContent = '0';
        contador.style.color = '';
      }
    }
  });
}

/* ----------------------------------------------------------------
   2. CONTADOR DE CARACTERES DEL TEXTAREA
   - Actualiza el <span> en tiempo real.
   - Cambia de color: rojo si < 10 chars, verde si >= 10.
---------------------------------------------------------------- */
function iniciarContadorCaracteres() {
  const textarea = document.getElementById('mensaje');
  const contador = document.getElementById('contadorCaracteres');
  if (!textarea || !contador) return;

  textarea.addEventListener('input', () => {
    const n = textarea.value.length;
    contador.textContent = n;
    contador.style.color = n >= 10 ? '#27ae60' : '#e74c3c';
  });
}

/* ----------------------------------------------------------------
   3. BOTÓN "VOLVER ARRIBA"
   - Aparece cuando el scroll baja más de 350 px.
   - Al hacer clic desplaza suavemente al inicio.
---------------------------------------------------------------- */
function iniciarBotonVolverArriba() {
  const btn = document.getElementById('btnVolverArriba');
  if (!btn) return;

  const mostrar  = () => btn.classList.add('visible');
  const ocultar  = () => btn.classList.remove('visible');

  // Listener de scroll con throttle pasivo
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        window.scrollY > 350 ? mostrar() : ocultar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------------------
   4. NAVBAR ACTIVA POR SECCIÓN (IntersectionObserver)
   - Observa las secciones con id.
   - Marca el enlace del nav correspondiente como 'active'.
---------------------------------------------------------------- */
function iniciarNavbarActiva() {
  const secciones = document.querySelectorAll('section[id], main[id]');
  const links     = document.querySelectorAll('#navMenu .nav-link');
  if (!secciones.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const id = entrada.target.getAttribute('id');
        links.forEach((link) => {
          const activo = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', activo);
          if (activo) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    { rootMargin: '-80px 0px -45% 0px', threshold: 0 }
  );

  secciones.forEach((s) => observer.observe(s));
}

/* ----------------------------------------------------------------
   5. CERRAR NAVBAR EN MÓVIL
   - Al hacer clic en cualquier enlace del nav, colapsa el menú.
---------------------------------------------------------------- */
function iniciarCerrarNavMovil() {
  const navMenu = document.getElementById('navMenu');
  const links   = document.querySelectorAll('#navMenu .nav-link');
  if (!navMenu) return;

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const instancia = bootstrap.Collapse.getInstance(navMenu);
      if (instancia) instancia.hide();
    });
  });
}

/* ----------------------------------------------------------------
   6. GALERÍA LIGHTBOX
   - Al hacer clic en un ítem de galería, obtiene los atributos
     data-img y data-caption y los pone en el modal.
   - También soporta teclado (Enter / Space).
---------------------------------------------------------------- */
function iniciarGaleriaLightbox() {
  const items   = document.querySelectorAll('.galeria-item[data-img]');
  const imgEl   = document.getElementById('galeriaImgAmpliada');
  const captEl  = document.getElementById('galeriaCaptionAmpliada');

  if (!items.length || !imgEl || !captEl) return;

  const actualizar = (item) => {
    const src     = item.dataset.img     || '';
    const caption = item.dataset.caption || '';
    imgEl.src     = src;
    imgEl.alt     = caption;
    captEl.textContent = caption;
  };

  items.forEach((item) => {
    // Clic con ratón
    item.addEventListener('click', () => actualizar(item));

    // Teclado: Enter o Space
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        actualizar(item);
        // Abrir el modal manualmente (Bootstrap ya lo hace por data-bs-toggle,
        // pero al keydown necesitamos dispararlo)
        const modalEl = document.getElementById('modalGaleria');
        if (modalEl) {
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.show();
        }
      }
    });
  });

  // Al cerrar el modal limpiar la imagen para no cachear src
  const modalEl = document.getElementById('modalGaleria');
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', () => {
      imgEl.src = '';
      imgEl.alt = '';
      captEl.textContent = '';
    });
  }
}

/* ----------------------------------------------------------------
   7. ANIMACIÓN DE APARICIÓN DE TARJETAS (IntersectionObserver)
   - Las tarjetas se ocultan inicialmente y aparecen con fadeInUp
     cuando entran al viewport.
---------------------------------------------------------------- */
function iniciarAnimacionTarjetas() {
  if (!('IntersectionObserver' in window)) return;

  const elementos = document.querySelectorAll(
    '.card, .galeria-item, .stat-card'
  );
  if (!elementos.length) return;

  // Ocultar inicialmente sin quitar del flujo (accesible)
  elementos.forEach((el) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, idx) => {
        if (!entrada.isIntersecting) return;
        // Pequeño retraso escalonado por índice dentro del grupo visible
        setTimeout(() => {
          entrada.target.style.opacity   = '1';
          entrada.target.style.transform = 'translateY(0)';
        }, idx * 60);
        obs.unobserve(entrada.target);
      });
    },
    { threshold: 0.08 }
  );

  elementos.forEach((el) => obs.observe(el));
}
