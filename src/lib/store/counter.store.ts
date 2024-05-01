import { create } from 'zustand';

interface CounterSate {
  count: number;
  increase: (state: number) => void;
  decrease: (state: number) => void;
  set: (state: number) => void;
}

const counterStore = create<CounterSate>((set) => ({
  count: 0,
  increase: (state) => set((prev) => ({ count: prev.count + state })),
  decrease: (state) => set((prev) => ({ count: prev.count - state })),
  set: (state) => set(() => ({ count: state })),
}));

export default counterStore;
