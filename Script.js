function setTextSafe(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function getTodayLabel() {
  const fecha = new Date();
  return fecha.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function personalizarPorURL() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre') || 'Aspirante';
  const carrera = params.get('carrera') || 'Negocios';
  const campus = params.get('campus') || 'Ciudad Juárez';

  window.DATOS = { nombre, carrera, campus };

  setTextSafe('hero-nombre', nombre);
  setTextSafe('chip-carrera', `Interés: ${carrera}`);
  setTextSafe('chip-campus', `Campus ${campus}`);
  setTextSafe('nav-carrera', carrera);
  setTextSafe('nav-campus', `Campus ${campus}`);
  setTextSafe('mockup-nombre', nombre);
  setTextSafe('mockup-carrera', carrera);
  setTextSafe('mockup-inicial', nombre.charAt(0).toUpperCase());

  const fecha = getTodayLabel();
  setTextSafe('fecha-sesion', fecha);
  setTextSafe('polaroid-date', fecha);

  document.title = `${nombre} — Bitácora de Sesión Informativa Tec`;
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    if (
      element.parentElement &&
      (
        element.parentElement.classList.contains('cards-trio') ||
        element.parentElement.classList.contains('next-grid')
      )
    ) {
      element.style.transitionDelay = `${index * 0.05}s`;
    }

    observer.observe(element);
  });
}

function initHeroAnimacion() {
  document.querySelectorAll('.hero .reveal').forEach((element, index) => {
    setTimeout(() => element.classList.add('visible'), 250 + index * 180);
  });
}

function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach((item, index) => {
          setTimeout(() => item.classList.add('tl-visible'), index * 140);
        });

        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(timeline);
}

function initDudas() {
  document.querySelectorAll('.duda-card').forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      document.querySelectorAll('.duda-card').forEach(item => {
        item.classList.remove('open');
      });

      if (!isOpen) card.classList.add('open');
    });
  });
}

function initPolaroid() {
  const input = document.getElementById('photo-input');
  const photo = document.getElementById('polaroid-photo');
  const form = document.getElementById('memory-form');
  const textArea = document.getElementById('moment-text');
  const polaroidText = document.getElementById('polaroid-text');
  const savedPill = document.getElementById('saved-pill');

  const savedImage = localStorage.getItem('bitacoraFoto');
  const savedText = localStorage.getItem('bitacoraTexto');

  if (savedImage) renderPhoto(savedImage);

  if (savedText) {
    textArea.value = savedText;
    polaroidText.textContent = savedText;
    savedPill.classList.add('visible');
  }

  if (input) {
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        renderPhoto(imageUrl);
        localStorage.setItem('bitacoraFoto', imageUrl);
      };

      reader.readAsDataURL(file);
    });
  }

  if (textArea) {
    textArea.addEventListener('input', () => {
      const value = textArea.value.trim();
      polaroidText.textContent = value || 'Hoy me imaginé estudiando aquí.';
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const value = textArea.value.trim() || 'Hoy me imaginé estudiando aquí.';
      polaroidText.textContent = value;
      localStorage.setItem('bitacoraTexto', value);

      savedPill.classList.add('visible');

      const polaroid = document.getElementById('polaroid');

      if (polaroid) {
        polaroid.animate([
          { transform: 'rotate(-2deg) scale(1)' },
          { transform: 'rotate(0deg) scale(1.04)' },
          { transform: 'rotate(-2deg) scale(1)' }
        ], {
          duration: 650,
          easing: 'ease-out'
        });
      }
    });
  }

  function renderPhoto(src) {
    if (!photo) return;
    photo.innerHTML = `<img src="${src}" alt="Foto guardada del primer momento Tec" />`;
  }
}

function initPreguntaPropia() {
  const textarea = document.getElementById('user-question');
  const button = document.getElementById('save-question');
  const preview = document.getElementById('question-preview');

  const savedQuestion = localStorage.getItem('bitacoraPregunta');

  if (savedQuestion && textarea && preview) {
    textarea.value = savedQuestion;
    preview.textContent = `Pregunta guardada: “${savedQuestion}”`;
  }

  if (!button || !textarea || !preview) return;

  button.addEventListener('click', () => {
    const question = textarea.value.trim();

    if (!question) {
      preview.textContent = 'Escribe una pregunta antes de guardarla.';
      return;
    }

    localStorage.setItem('bitacoraPregunta', question);
    preview.textContent = `Pregunta guardada: “${question}”`;

    preview.animate([
      { transform: 'translateY(8px)', opacity: 0.5 },
      { transform: 'translateY(0)', opacity: 1 }
    ], {
      duration: 350,
      easing: 'ease-out'
    });
  });
}

function initBotones() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const btnInicio = document.getElementById('btn-inicio');

  if (btnInicio) {
    btnInicio.addEventListener('click', (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 40
      ? '0 2px 20px rgba(0,61,165,0.12)'
      : 'none';
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  personalizarPorURL();
  initHeroAnimacion();
  initReveal();
  initTimeline();
  initDudas();
  initPolaroid();
  initPreguntaPropia();
  initBotones();
  initNavbar();

  console.log(
    '%c✅ Bitácora de Sesión Informativa Tec cargada',
    'color:#003DA5;font-weight:bold;font-size:14px'
  );

  console.log('Datos:', window.DATOS);
});
