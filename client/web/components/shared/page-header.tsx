"use client"

import { ReactElement, ReactNode } from "react"

export function PageHeader({
  title,
  icon,
  description,
  children,
}: {
  title: string
  icon?: ReactElement
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="flex w-full items-start justify-between gap-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-lg font-medium opacity-80 sm:text-xl">
          {icon}
          <h1>{title}</h1>
        </div>
        {description && (
          <span className="text-xs text-muted-foreground sm:text-sm">
            {description}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
