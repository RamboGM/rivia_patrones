const mongoose = require('mongoose');

const PaletteItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: String,
    code: String,
    hex: String,
  },
  { _id: false },
);

const CellSchema = new mongoose.Schema(
  {
    row: Number,
    col: Number,
    colorId: String,
  },
  { _id: false },
);

const StitchSchema = new mongoose.Schema(
  {
    row: Number,
    col: Number,
    symbol: String,
    colorId: String,
    rotation: Number,
  },
  { _id: false },
);

const PatronSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    craftType: { type: String, enum: ['tapestry', 'crochet'], required: true },
    technique: { type: String },
    handedness: { type: String, enum: ['right', 'left'], default: 'right' },
    orientation: { type: String, enum: ['left-to-right', 'right-to-left'], default: 'left-to-right' },
    grid: {
      width: { type: Number, default: 20 },
      height: { type: Number, default: 20 },
    },
    gauge: {
      stitchesPer10cm: Number,
      rowsPer10cm: Number,
    },
    palette: [PaletteItemSchema],
    cells: [CellSchema],
    stitches: [StitchSchema],
    tags: [String],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Patron', PatronSchema);
