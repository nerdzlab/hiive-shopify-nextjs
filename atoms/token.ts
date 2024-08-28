"use client";
import { atom } from "recoil";
import { localStorageEffect } from "./helpers/localStorage";

export const userToken = atom({
  key: "user-token",
  default: "",
  effects: [localStorageEffect("user-token")],
});
