"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  date?: Date
  setDate: (date: Date) => void
  className?: string
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  // The selected hour in 24-hour format (0-23)
  const hour = date ? date.getHours() : 0

  // The selected minute (0-59)
  const minute = date ? date.getMinutes() : 0

  // Update the date with the selected hour and minute
  const handleTimeChange = (newHour: number, newMinute: number) => {
    if (!date) {
      const newDate = new Date()
      newDate.setHours(newHour, newMinute, 0, 0)
      setDate(newDate)
      return
    }

    const newDate = new Date(date)
    newDate.setHours(newHour, newMinute, 0, 0)
    setDate(newDate)
  }

  // Handle hour change from select
  const handleHourChange = (value: string) => {
    const newHour = parseInt(value, 10)
    if (isNaN(newHour)) return
  }

  // Handle minute change from select
  const handleMinuteChange = (value: string) => {
    const newMinute = parseInt(value, 10)
    if (isNaN(newMinute)) return
  }

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className='grid gap-1'>
        <Label htmlFor='hours'>Hodiny</Label>
        <Select value={hour.toString().padStart(2, "0")} onValueChange={handleHourChange}>
          <SelectTrigger id='hours' className='w-[70px]'>
            <SelectValue placeholder='Hodiny' />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-1'>
        <Label htmlFor='minutes'>Minuty</Label>
        <Select value={minute.toString().padStart(2, "0")} onValueChange={handleMinuteChange}>
          <SelectTrigger id='minutes' className='w-[70px]'>
            <SelectValue placeholder='Minuty' />
          </SelectTrigger>
          <SelectContent>
            {["00", "15", "30", "45"].map((min) => (
              <SelectItem key={min} value={min}>
                {min}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Standalone component for time input
export function TimePickerInput({
  placeholder,
  value,
  onChange,
  className,
  disabled,
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      type='number'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn(
        "w-[40px] text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className
      )}
      min={placeholder === "hh" ? 0 : 0}
      max={placeholder === "hh" ? 23 : 59}
      disabled={disabled}
    />
  )
}

// Separator for hours and minutes
export function TimePickerSeparator() {
  return <span className='text-sm'>:</span>
}

// Popover component wrapper for time picker (combined example)
export function TimePickerDemo({ date, setDate }: { date?: Date; setDate: (date: Date) => void }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            "w-[150px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className='mr-2 h-4 w-4' />
          {date ? (
            `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          ) : (
            <span>Vyberte čas</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-3'>
        <TimePicker date={date} setDate={setDate} />
      </PopoverContent>
    </Popover>
  )
}
