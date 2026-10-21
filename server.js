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
  const { nombre = '', documento = '', grado = '', telefono = '' } = req.body || {};
  const n = String(nombre).trim();

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,25}$/.test(n))
    return res.status(400).json({ ok: false, mensaje: 'Nombre no válido' });
  if (!/^\d{10}$/.test(documento))
    return res.status(400).json({ ok: false, mensaje: 'Documento no válido' });
  if (!GRADOS.includes(grado))
    return res.status(400).json({ ok: false, mensaje: 'Grado no válido' });
  if (!/^\d{10}$/.test(telefono))
    return res.status(400).json({ ok: false, mensaje: 'Teléfono no válido' });

  if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'fecha,nombre,documento,grado,telefono\n');
  const fila = [new Date().toISOString(), n, documento, grado, telefono].join(',') + '\n';

  fs.appendFile(CSV, fila, (err) => {
    if (err) return res.status(500).json({ ok: false, mensaje: 'No se pudo guardar el registro' });
    res.json({ ok: true });
  });
});

app.listen(PORT, () => console.log(`EcoVolt en http://localhost:${PORT}`));
