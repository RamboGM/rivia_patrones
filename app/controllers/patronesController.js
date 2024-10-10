const Patron = require('../models/Patron');

exports.createPatron = async (req, res) => {
  const { name, grid } = req.body;

  try {
    const newPatron = new Patron({ name, grid });
    await newPatron.save();
    res.status(201).json(newPatron);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el patrón', error });
  }
};

exports.getPatrones = async (req, res) => {
  try {
    const patrones = await Patron.find();
    res.status(200).json(patrones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los patrones', error });
  }
};
