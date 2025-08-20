import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFileStore = create(
  persist(
    (set) => ({
      files: [],

      // Add file (only metadata gets stored in localStorage)
      addFile: (file) =>
        set((state) => ({
          files: [
            ...state.files,
            {
              id: Date.now(),
              name: file.name,
              size: file.size,
              type: file.type,
              // ⚠️ original File object won't survive reload
              // If you want content, convert file -> base64 before saving
            },
          ],
        })),

      removeFile: (id) =>
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
        })),

      clearFiles: () => set({ files: [] }),
    }),
    {
      name: "file-storage", // localStorage key
      getStorage: () => localStorage, // use localStorage
    }
  )
);

export default useFileStore;
