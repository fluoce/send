import { ArrowUpRightIcon, BadgeInfo } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ReactElement, ReactNode } from "react"

export function Nodata({
  description,
  title,
  children,
  icon,
}: {
  title: string
  description: string
  icon?: ReactElement
  children?: ReactNode
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon ? icon : <BadgeInfo />}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {children}
      </EmptyContent>
    </Empty>
  )
}
