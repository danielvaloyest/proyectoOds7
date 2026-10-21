document.documentElement.classList.add('js');

/* Animaciones laterales al hacer scroll */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting));
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => obs.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

/* Formulario (solo existe en index.html) */
const form = document.getElementById('formRegistro');
if (form) {
  const estado = document.getElementById('estado');
  const boton = form.querySelector('button[type="submit"]');

  const reglas = {
    nombre: (v) => {
      const t = v.trim();
      if (t.length < 3) return 'Mínimo 3 letras';
      if (t.length > 25) return 'Máximo 25 caracteres';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(t)) return 'Solo letras y espacios';
      return '';
    },
    
    grado: (v) => (v ? '' : 'Selecciona un grado'),
    opinion: (v) => {
      const t = v.trim();
      if (t.length < 10) return 'Mínimo 10 caracteres';
      if (t.length > 200) return 'Máximo 200 caracteres';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .,;:¡!¿?()\-\n]+$/.test(t)) return 'Usa solo letras y signos de puntuación básicos';
      return '';
    }
  };

  const mostrarError = (campo, msg) => {
    form.elements[campo].closest('.field').classList.toggle('invalid', !!msg);
    form.querySelector(`.error[data-for="${campo}"]`).textContent = msg;
  };



  Object.keys(reglas).forEach((c) => {
    form.elements[c].addEventListener('blur', () => mostrarError(c, reglas[c](form.elements[c].value)));
    form.elements[c].addEventListener('input', () => mostrarError(c, ''));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    estado.textContent = '';
    const datos = {
      nombre: form.elements.nombre.value.trim(),
      grado: form.elements.grado.value,
      opinion: form.elements.opinion.value.trim()
    };

    let valido = true;
    Object.keys(reglas).forEach((c) => {
      const msg = reglas[c](datos[c]);
      mostrarError(c, msg);
      if (msg) valido = false;
    });
    if (!valido) return;

    boton.disabled = true;
    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const json = await res.json();
      estado.textContent = json.ok ? '¡Gracias por sumarte!' : json.mensaje;
      if (json.ok) form.reset();
    } catch {
      estado.textContent = 'No se pudo conectar con el servidor';
    } finally {
      boton.disabled = false;
    }
  });
}
