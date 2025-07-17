import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slice/auth-slice";

export const useAppStore = create(
  persist(
    (set) => ({
      ...createAuthSlice(set),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({ userInfo: state.userInfo }), // only persist userInfo
    }
  )
);
