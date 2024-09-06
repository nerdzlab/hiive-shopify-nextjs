"use client";
import { atom } from "recoil";

export const activeProductModal = atom<{ id: string; price?: string }>({
  key: "active-product-modal",
  default: {
    id: "",
    price: "",
  },
});
