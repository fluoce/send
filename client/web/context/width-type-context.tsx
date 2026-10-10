"use client"

import { localStorageKey } from "@/const/local-storage-key"
import useLocalStorage from "@/hooks/use-local-storage"
import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { RectangleHorizontal, RectangleVertical } from "lucide-react"
import { RoundedRectangleIcon } from "@/icon/rounded-rectangle-icon"

export type WidthType = "small" | "medium" | "full"

export const WIDTH_TYPE_OPTIONS = [
  {
    label: (
      <>
        <RectangleVertical className="mr-1 inline" />
        Small
      </>
    ),
    value: "small",
    icon: RectangleVertical,
  },
  {
    label: (
      <>
        <RoundedRectangleIcon className="mr-1 inline" />
        Medium
      </>
    ),
    value: "medium",
    icon: RoundedRectangleIcon,
  },
  {
    label: (
      <>
        <RectangleHorizontal className="mr-1 inline" />
        Full
      </>
    ),
    value: "full",
    icon: RectangleHorizontal,
  },
] as const

type WidthTypeOptionType = (typeof WIDTH_TYPE_OPTIONS)[number]

type WidthContextType = {
  widthType: WidthType
  setWidthType: Dispatch<SetStateAction<WidthType>>
  maxWidthClass: string
  getWidthTypeIcon: () => ReactElement
  WIDTH_TYPE_OPTIONS: readonly WidthTypeOptionType[]
}

const WidthTypeContext = createContext<WidthContextType | undefined>(undefined)

export function WidthTypeProvider({ children }: { children: ReactNode }) {
  const { setValue } = useLocalStorage<WidthType>({
    key: localStorageKey.widthType,
  })

  const [widthType, setWidthType] = useState<WidthType>("medium")

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(localStorageKey.widthType)
      if (stored) setWidthType(JSON.parse(stored) as WidthType)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) setValue(widthType)
  }, [hydrated, widthType, setValue])

  let maxWidthClass = ""

  if (widthType === "small") {
    maxWidthClass = "max-w-185"
  } else if (widthType === "full") {
    maxWidthClass = ""
  } else {
    maxWidthClass = "max-w-240"
  }

  function getWidthTypeIcon() {
    const opt = WIDTH_TYPE_OPTIONS.find((o) => o.value === widthType)
    const IconComponent = opt?.icon ?? RoundedRectangleIcon
    return <IconComponent />
  }

  const value = {
    widthType,
    setWidthType,
    maxWidthClass,
    getWidthTypeIcon,
    WIDTH_TYPE_OPTIONS,
  }

  return (
    <WidthTypeContext.Provider value={value}>
      {children}
    </WidthTypeContext.Provider>
  )
}

export function useWidthType() {
  const context = useContext(WidthTypeContext)
  if (context === undefined) {
    throw new Error("useWidthType must be used within a WidthTypeProvider")
  }
  return context
}
