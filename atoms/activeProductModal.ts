"use client";
import { atom } from "recoil";

export const activeProductModal = atom<{ id: string; retailPrice?: string }>({
  key: "active-product-modal",
  default: {
    id: "",
    retailPrice: "",
  },
});
