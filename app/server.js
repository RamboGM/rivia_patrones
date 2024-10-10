const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Habilitar CORS
app.use(express.json()); // Para poder parsear JSON en las requests

// Simulación de datos de patrones
let patrones = [
  { name: 'Patrón 1' },
  { name: 'Patrón 2' }
];

// Ruta GET para obtener los patrones
app.get('/api/patrones', (req, res) => {
  res.json(patrones);
});

// Ruta POST para agregar un nuevo patrón
app.post('/api/patrones', (req, res) => {
  const nuevoPatron = req.body;
  patrones.push(nuevoPatron);
  res.json({ message: 'Patrón guardado exitosamente' });
});

// Arrancar el servidor en el puerto 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

