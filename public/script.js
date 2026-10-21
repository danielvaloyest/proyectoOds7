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
    documento: (v) => (/^\d{10}$/.test(v) ? '' : 'Debe tener exactamente 10 dígitos'),
    grado: (v) => (v ? '' : 'Selecciona un grado'),
    telefono: (v) => (/^\d{10}$/.test(v) ? '' : 'Debe tener exactamente 10 dígitos')
  };

  const mostrarError = (campo, msg) => {
    form.elements[campo].closest('.field').classList.toggle('invalid', !!msg);
    form.querySelector(`.error[data-for="${campo}"]`).textContent = msg;
  };

  ['documento', 'telefono'].forEach((c) => {
    form.elements[c].addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  });

  Object.keys(reglas).forEach((c) => {
    form.elements[c].addEventListener('blur', () => mostrarError(c, reglas[c](form.elements[c].value)));
    form.elements[c].addEventListener('input', () => mostrarError(c, ''));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    estado.textContent = '';
    const datos = {
      nombre: form.elements.nombre.value.trim(),
      documento: form.elements.documento.value.trim(),
      grado: form.elements.grado.value,
      telefono: form.elements.telefono.value.trim()
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
