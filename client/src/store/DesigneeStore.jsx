import { create } from "zustand";

const usePopupStore = create((set) => ({
  showDesignerPopup: false,
  designeeName: "",
  designeePhone: "",
  designeeEmail: "",
  openPopup: () => set({ showDesignerPopup: true }),
  closePopup: () => set({ showDesignerPopup: false }),
  setDesignerPopup: () => set({showDesignerPopup: true}),
  setDesigneeName: (name) => set({ designeeName: name }),
  setDesigneePhone: (phone) => set({ designeePhone: phone }),
  setDesigneeEmail: (email) => set({ designeeEmail: email }),
}));

export default usePopupStore;
