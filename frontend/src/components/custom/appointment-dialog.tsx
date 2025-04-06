"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: "doctor" | "nurse"
}

export function AppointmentDialog({ open, onOpenChange, userRole }: AppointmentDialogProps) {
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [duration, setDuration] = useState<string>("30")
  const [notes, setNotes] = useState<string>("")

  // This would come from an API in a real app
  const doctors = [
    { id: "1", name: "Dr. Smith (Vy)" },
    { id: "2", name: "Dr. Johnson" },
    { id: "3", name: "Dr. Williams" },
  ]

  const [selectedDoctor, setSelectedDoctor] = useState<string>(userRole === "doctor" ? "1" : "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit the form data to your API
    console.log({
      date,
      startTime,
      duration,
      doctorId: selectedDoctor,
      notes,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Vytvořit nový termín</DialogTitle>
            <DialogDescription>
              Přidejte nový dostupný časový slot pro termíny pacientů.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {userRole === "nurse" && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='doctor' className='text-right'>
                  Lékař
                </Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor} required>
                  <SelectTrigger id='doctor' className='col-span-3'>
                    <SelectValue placeholder='Vyberte lékaře' />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='date' className='text-right'>
                Datum
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='date'
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, "PPP") : <span>Vyberte datum</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='time' className='text-right'>
                Čas začátku
              </Label>
              <div className='col-span-3 flex items-center gap-2'>
                <Clock className='h-4 w-4 text-muted-foreground' />
                <Input
                  id='time'
                  type='time'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='duration' className='text-right'>
                Délka
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id='duration' className='col-span-3'>
                  <SelectValue placeholder='Vyberte délku' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='15'>15 minut</SelectItem>
                  <SelectItem value='30'>30 minut</SelectItem>
                  <SelectItem value='45'>45 minut</SelectItem>
                  <SelectItem value='60'>60 minut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='notes' className='text-right'>
                Poznámky
              </Label>
              <Textarea
                id='notes'
                placeholder='Přidejte jakékoliv speciální poznámky k tomuto termínu'
                className='col-span-3'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Zrušit
            </Button>
            <Button type='submit'>Vytvořit termín</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
