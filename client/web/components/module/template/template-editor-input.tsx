"use client"

import { cn } from "cn"
import { LabelHTMLAttributes, InputHTMLAttributes } from "react"

export function TemplateEditorInput({
  inputProps,
  labelProps,
  className,
}: {
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  className?: string
}) {
  return (
    <div
      className={cn(
        "group smooth flex w-full flex-wrap items-center gap-1 border-b px-1 text-sm focus-within:border-b-blue-500",
        className
      )}
    >
      <label {...labelProps} className="text-muted-foreground" />
      <input
        {...inputProps}
        className="flex-1 bg-transparent p-2 outline-0 autofill:bg-transparent"
        autoComplete={inputProps?.autoComplete ?? "off"}
      />
    </div>
  )
}
