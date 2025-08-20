// store/contentStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useContentStore = create(
  persist(
    (set) => ({
      contents: [], // store multiple pasted contents

      addContent: (content) =>
        set((state) => ({
          contents: [
            ...state.contents,
            {
              id: Date.now(),
              name: `content-${state.contents.length + 1}`,
              value: content,
            },
          ],
        })),

      clearContents: () => set({ contents: [] }),
    }),
    {
      name: "content-storage", // localStorage key
      getStorage: () => localStorage, // explicitly use localStorage
    }
  )
);

export default useContentStore;
