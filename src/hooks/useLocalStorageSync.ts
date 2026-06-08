"use client";

import { useEffect } from "react";

export function useLocalStorageSync<T>(value: T | undefined, key: string): void {
  useEffect(() => {
    if (value === undefined) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
}
