import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCollectionStore = create(
  persist(
    (set) => ({
      collectionName: "",

      setCollectionName: (name) => set({ collectionName: name }),
    }),
    {
      name: "collection-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCollectionStore;
