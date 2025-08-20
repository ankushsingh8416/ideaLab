// utils/persistStore.js
export const persistMiddleware = (config, key) => (set, get) => {
  const savedState = typeof window !== "undefined" ? localStorage.getItem(key) : null;

  if (savedState) {
    set(JSON.parse(savedState));
  }

  return config(
    (args) => {
      set(args);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(get()));
      }
    },
    get
  );
};
