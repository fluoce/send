"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { funcDate } from "@/func/func-date"
import { cn } from "cn"

export function DatePicker({
  children,
  setDate,
  date,
  className,
  disabledDate,
}: {
  children?: ReactNode
  setDate: Dispatch<SetStateAction<Date>>
  date?: Date | string
  className?: string
  disabledDate?: Date
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            data-empty={!date}
            className={cn(
              "justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? `${funcDate(date)}` : <span>Pick a date</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={
            typeof date === "string"
              ? date
                ? new Date(date)
                : undefined
              : date
          }
          onSelect={setDate}
          required
          disabled={
            disabledDate
              ? (day) =>
                  day < new Date(new Date(disabledDate).setHours(0, 0, 0, 0))
              : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )
}
