"use client"

import { useWidthType } from "@/context/width-type-context"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useIsWidthLess } from "@/hooks/use-is-width-less"

export function WidthTypeBtn() {
  const { setWidthType, WIDTH_TYPE_OPTIONS, getWidthTypeIcon } = useWidthType()

  const isSmallWidth = useIsWidthLess({
    size: 740,
  })

  if (isSmallWidth) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-lg"
          variant="secondary"
          aria-label="Change width type"
        >
          {getWidthTypeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Screen sizes</DropdownMenuLabel>
          {WIDTH_TYPE_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setWidthType(opt.value)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
