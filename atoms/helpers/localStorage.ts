"use client";
import { AtomEffect } from "recoil";

// Define a generic type for the local storage effect
export const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);

    // Initialize the state with the saved value from local storage, if it exists
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue) as T);
    }

    // Handle changes to the atom value
    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };
