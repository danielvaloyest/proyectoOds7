const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CSV = path.join(__dirname, 'registros.csv');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GRADOS = ['Sexto', 'Septimo', 'Octavo', 'Noveno', 'Decimo', 'Once'];

app.post('/api/registro', (req, res) => {
  const { nombre = '', grado = '', opinion = '' } = req.body || {};
  const n = String(nombre).trim();
  const o = String(opinion).trim();

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,25}$/.test(n))
    return res.status(400).json({ ok: false, mensaje: 'Nombre no válido' });
  if (!GRADOS.includes(grado))
    return res.status(400).json({ ok: false, mensaje: 'Grado no válido' });
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü .,;:¡!¿?()\-\n]{10,200}$/.test(o))
  return res.status(400).json({ ok: false, mensaje: 'Opinión no válida' });

  if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'fecha,nombre,grado,opinion\n');
  // Entre comillas, sin saltos de línea, y sin que Excel lo tome como fórmula
const csv = (v) => {
  let s = String(v).replace(/\r?\n/g, ' ');
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};
const fila = [new Date().toISOString(), csv(n), grado, csv(o)].join(',') + '\n';

  fs.appendFile(CSV, fila, (err) => {
    if (err) return res.status(500).json({ ok: false, mensaje: 'No se pudo guardar el registro' });
    res.json({ ok: true });
  });
});

app.listen(PORT, () => console.log(`EcoVolt en http://localhost:${PORT}`));
