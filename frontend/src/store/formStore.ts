import { create } from "zustand";

type ContactFormType = {
  openContact: boolean;
  toggleOpenContact: () => void;
};

export const useContactForm = create<ContactFormType>()((set) => ({
  openContact: false,
  toggleOpenContact: () =>
    set((state) => ({ openContact: !state.openContact })),
}));
