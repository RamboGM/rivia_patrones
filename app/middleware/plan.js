const Patron = require('../models/Patron');

const LIMITS = {
  free: { maxPatterns: 10, maxWidth: 100, maxHeight: 100, maxPalette: 8 },
  premium: { maxPatterns: 999, maxWidth: 300, maxHeight: 300, maxPalette: 250 },
};

exports.checkPlanLimits = async (req, res, next) => {
  try {
    const plan = req.user?.plan || 'free';
    const limits = LIMITS[plan] || LIMITS.free;
    const { palette = [], grid = {} } = req.body;

    const paletteLength = palette.length;
    if (paletteLength > limits.maxPalette) {
      return res
        .status(403)
        .json({ message: `Tu plan (${plan}) permite hasta ${limits.maxPalette} colores.` });
    }

    if (grid.width > limits.maxWidth || grid.height > limits.maxHeight) {
      return res
        .status(403)
        .json({ message: `La grilla supera el límite de ${limits.maxWidth}x${limits.maxHeight} para el plan ${plan}.` });
    }

    if (req.method === 'POST') {
      const count = await Patron.countDocuments({ owner: req.user._id });
      if (count >= limits.maxPatterns) {
        return res.status(403).json({ message: `Alcanzaste el máximo de patrones (${limits.maxPatterns}) para tu plan ${plan}.` });
      }
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Error al validar límites del plan', error: err.message });
  }
};
