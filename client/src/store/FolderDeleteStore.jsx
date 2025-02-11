import { create } from "zustand";

const useFolderDeleteStore = create((set) => ({
  deletebuttonfolder: false,
  setDeletebuttonfolder: (value) => set({ deletebuttonfolder: value }),
  selectedFolder: null,
  setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),
  openMenufolderId: null, 
  setOpenMenufolderId: (folderId) => set({ openMenufolderId: folderId }),
  deleteFolder: (folderId) => {
    console.log(`Deleting folder with ID: ${folderId}`);
    
  },
}));

export default useFolderDeleteStore;