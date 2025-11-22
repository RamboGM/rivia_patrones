import { create } from 'zustand';
import { nanoid } from '../utils/id.js';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const defaultPalette = () => ([
  { id: nanoid(), name: 'Base', code: 'A1', hex: '#ff46a4' },
  { id: nanoid(), name: 'Contraste', code: 'B1', hex: '#f1be0a' },
  { id: nanoid(), name: 'Fondo', code: 'C1', hex: '#ffffff' },
]);

const initialPattern = () => ({
  name: 'Nuevo patrón',
  craftType: 'tapestry',
  technique: 'tapestry_flat',
  handedness: 'right',
  orientation: 'left-to-right',
  grid: { width: 20, height: 20 },
  palette: defaultPalette(),
  cells: [],
  stitches: [],
  tags: [],
  isPublic: false,
});

const usePatternStore = create((set, get) => ({
  pattern: null,
  history: [],
  future: [],

  setPattern: (pattern, options = { pushHistory: true }) => {
    const state = get();
    const prev = state.pattern ? clone(state.pattern) : null;
    const history = options.pushHistory && prev ? [...state.history, prev] : state.history;
    set({ pattern, history, future: [] });
  },

  startNewPattern: (draft) => {
    const base = { ...initialPattern(), ...draft };
    set({ pattern: base, history: [], future: [] });
  },

  setGrid: (grid) => {
    const { pattern } = get();
    if (!pattern) return;
    const next = { ...pattern, grid: { ...pattern.grid, ...grid } };
    get().setPattern(next);
  },

  setMeta: (meta) => {
    const { pattern } = get();
    if (!pattern) return;
    const next = { ...pattern, ...meta };
    get().setPattern(next);
  },

  updatePalette: (palette) => {
    const { pattern } = get();
    if (!pattern) return;
    const next = { ...pattern, palette };
    get().setPattern(next);
  },

  updateCell: (row, col, colorId) => {
    const { pattern } = get();
    if (!pattern) return;
    const cells = [...pattern.cells];
    const idx = cells.findIndex((c) => c.row === row && c.col === col);
    if (!colorId && idx >= 0) {
      cells.splice(idx, 1);
    } else if (colorId && idx >= 0) {
      cells[idx] = { ...cells[idx], colorId };
    } else if (colorId) {
      cells.push({ row, col, colorId });
    }
    const next = { ...pattern, cells };
    get().setPattern(next);
  },

  updateStitch: (row, col, payload) => {
    const { pattern } = get();
    if (!pattern) return;
    const stitches = [...pattern.stitches];
    const idx = stitches.findIndex((s) => s.row === row && s.col === col);
    if (!payload && idx >= 0) {
      stitches.splice(idx, 1);
    } else if (payload && idx >= 0) {
      stitches[idx] = { ...stitches[idx], ...payload };
    } else if (payload) {
      stitches.push({ row, col, ...payload });
    }
    const next = { ...pattern, stitches };
    get().setPattern(next);
  },

  undo: () => {
    const { history, pattern, future } = get();
    if (!history.length) return;
    const previous = history[history.length - 1];
    const nextHistory = history.slice(0, -1);
    set({ pattern: previous, history: nextHistory, future: [pattern, ...future] });
  },

  redo: () => {
    const { history, pattern, future } = get();
    if (!future.length) return;
    const next = future[0];
    const remaining = future.slice(1);
    set({ pattern: next, history: [...history, pattern], future: remaining });
  },

  reset: () => set({ pattern: null, history: [], future: [] }),
}));

export default usePatternStore;
