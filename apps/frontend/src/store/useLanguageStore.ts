import { create } from 'zustand';
import { Language } from '@/types';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: 'bn',
  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'bn' ? 'en' : 'bn' })),
}));
