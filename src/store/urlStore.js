// store/urlStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUrlStore = create(
  persist(
    (set) => ({
      urls: [],

      addUrl: (url) =>
        set((state) => ({
          urls: [
            ...state.urls,
            {
              id: Date.now(),
              name: `url-${state.urls.length + 1}`,
              value: url,
            },
          ],
        })),

      clearUrls: () => set({ urls: [] }),
    }),
    {
      name: "url-store", // localStorage key
      getStorage: () => localStorage, // explicitly use localStorage
    }
  )
);

export default useUrlStore;
