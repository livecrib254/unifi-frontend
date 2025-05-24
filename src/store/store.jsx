import { create } from 'zustand'




export const useStore = create((set) => ({
  activeDuration: "",
  updateActiveDuration: (value) => set({  activeDuration: value }),
  activeDataPlan: "",
  updateActiveDataplan: (value) => set({ activeDataPlan: value }),
  activeTab: "",
  updateActiveTab: (value) => set({ activeTab: value }),
  
}));

