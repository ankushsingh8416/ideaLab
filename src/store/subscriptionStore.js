import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSubscriptionStore = create(
  persist(
    (set) => ({
      isActive: false,
      serviceName: null,
      subscribeId: null,
      setSubscription: (active, name, id) =>
        set({ isActive: active, serviceName: name, subscribeId: id }),
      clearSubscription: () =>
        set({ isActive: false, serviceName: null, subscribeId: null }),
    }),
    {
      name: "subscription-storage", // localStorage key
    }
  )
);
