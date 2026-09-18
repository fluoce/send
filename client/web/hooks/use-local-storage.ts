"use client"

import { useSyncExternalStore } from "react"

function subscribe(callback: () => void) {
  window.addEventListener("localstorage-update", callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener("localstorage-update", callback)
    window.removeEventListener("storage", callback)
  }
}

function getSnapshot(key: string) {
  if (typeof window === "undefined") return null
  const value = localStorage.getItem(key)
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return value
  }
}

export default function useLocalStorage<T = any>({ key }: { key: string }) {
  const value = useSyncExternalStore(
    subscribe,
    () => getSnapshot(key),
    () => null
  )

  const setValue = (data: T) => {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new Event("localstorage-update"))
  }

  const removeValue = () => {
    if (typeof window === "undefined") return null
    localStorage.removeItem(key)
    window.dispatchEvent(new Event("localstorage-update"))
  }

  return {
    value,
    setValue,
    removeValue,
  }
}
