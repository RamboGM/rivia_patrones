const PDFDocument = require('pdfkit');
const Patron = require('../models/Patron');

exports.getPatrones = async (req, res) => {
  try {
    const patrones = await Patron.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(patrones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los patrones', error: error.message });
  }
};

exports.getPatron = async (req, res) => {
  try {
    const patron = await Patron.findOne({ _id: req.params.id, owner: req.user._id });
    if (!patron) {
      return res.status(404).json({ message: 'Patrón no encontrado' });
    }
    return res.status(200).json(patron);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el patrón', error: error.message });
  }
};

exports.createPatron = async (req, res) => {
  try {
    const payload = { ...req.body, owner: req.user._id };
    const newPatron = await Patron.create(payload);
    res.status(201).json(newPatron);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el patrón', error: error.message });
  }
};

exports.updatePatron = async (req, res) => {
  try {
    const updated = await Patron.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: 'Patrón no encontrado' });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el patrón', error: error.message });
  }
};

exports.deletePatron = async (req, res) => {
  try {
    await Patron.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.status(200).json({ message: 'Patrón eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el patrón', error: error.message });
  }
};

const drawTapestryGrid = (doc, patron, opts) => {
  const maxArea = 450;
  const cellSize = Math.min(maxArea / patron.grid.width, maxArea / patron.grid.height, 18);
  const startX = doc.x;
  const startY = doc.y;
  const paletteMap = new Map((patron.palette || []).map((p) => [p.id, p.hex || '#ffffff']));

  doc.save();
  for (let r = 0; r < patron.grid.height; r += 1) {
    for (let c = 0; c < patron.grid.width; c += 1) {
      const cell = patron.cells?.find((item) => item.row === r && item.col === c);
      const color = paletteMap.get(cell?.colorId) || '#ffffff';
      doc.rect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize).fill(color).stroke('#dddddd');
    }
  }
  doc.restore();
  doc.moveDown().moveDown(1);
  doc.fontSize(12).text('Paleta:', { underline: true });
  (patron.palette || []).forEach((p) => {
    doc
      .fillColor('black')
      .text(`${p.name || p.code || p.id} - ${p.hex || ''}`, { continued: false });
  });
  doc.moveDown();
};

const drawCrochetGrid = (doc, patron) => {
  const maxArea = 450;
  const cellSize = Math.min(maxArea / patron.grid.width, maxArea / patron.grid.height, 22);
  const startX = doc.x;
  const startY = doc.y;
  doc.save();
  for (let r = 0; r < patron.grid.height; r += 1) {
    for (let c = 0; c < patron.grid.width; c += 1) {
      doc
        .rect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize)
        .fill('#ffffff')
        .stroke('#dddddd');
      const stitch = patron.stitches?.find((s) => s.row === r && s.col === c);
      if (stitch?.symbol) {
        doc
          .fontSize(Math.max(10, cellSize * 0.45))
          .fillColor('#111')
          .text(stitch.symbol, startX + c * cellSize + cellSize / 4, startY + r * cellSize + cellSize / 4);
      }
    }
  }
  doc.restore();
  doc.moveDown();
};

exports.exportPdf = async (req, res) => {
  try {
    const patron = await Patron.findOne({ _id: req.params.id, owner: req.user._id });
    if (!patron) {
      return res.status(404).json({ message: 'Patrón no encontrado' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${patron.name || 'patron'}.pdf"`);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(20).fillColor('#111').text(patron.name || 'Patrón', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#333');
    doc.text(`Técnica: ${patron.technique || patron.craftType}`);
    doc.text(`Dimensiones: ${patron.grid?.width} x ${patron.grid?.height}`);
    doc.text(`Orientación: ${patron.orientation || 'left-to-right'}`);
    doc.moveDown();

    if (patron.craftType === 'tapestry') {
      drawTapestryGrid(doc, patron);
    } else {
      drawCrochetGrid(doc, patron);
    }

    if (req.user.plan === 'free') {
      doc.save();
      doc.rotate(-30, { origin: [300, 400] });
      doc.fontSize(60).fillColor('#f08').opacity(0.1).text('RIVIA FREE', 80, 320, {
        align: 'center',
        width: 500,
      });
      doc.restore();
      doc.opacity(1);
    }

    doc.end();
    return null;
  } catch (error) {
    return res.status(500).json({ message: 'Error al exportar el PDF', error: error.message });
  }
};
