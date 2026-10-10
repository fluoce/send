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
      <div className="flex items-center gap-2">
        {icon && (
          <div className="rounded-md bg-muted p-2">
            <div className="opacity-70">{icon}</div>
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="line-clamp-1 font-medium opacity-80" title={title}>
            {title}
          </h3>
          {description && (
            <span
              title={description}
              className="line-clamp-1 text-xs text-muted-foreground"
            >
              {description}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
