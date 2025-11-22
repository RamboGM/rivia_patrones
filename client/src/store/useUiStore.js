import { create } from 'zustand';

const useUiStore = create((set) => ({
  tool: 'brush',
  activeColorId: null,
  zoom: 1,
  selection: null,
  isPanning: false,
  stageRef: null,
  setTool: (tool) => set({ tool }),
  setActiveColorId: (activeColorId) => set({ activeColorId }),
  setZoom: (zoom) => set({ zoom }),
  setSelection: (selection) => set({ selection }),
  setIsPanning: (isPanning) => set({ isPanning }),
  setStageRef: (stageRef) => set({ stageRef }),
}));

export default useUiStore;
