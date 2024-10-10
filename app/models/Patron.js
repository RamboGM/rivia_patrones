const mongoose = require('mongoose');

const PatronSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grid: { type: Array, required: true },  // Matriz para almacenar los colores de las celdas
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patron', PatronSchema);
