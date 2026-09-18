import { cn } from "cn"
import { ReactNode } from "react"

export function PageWrapper({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>
}
