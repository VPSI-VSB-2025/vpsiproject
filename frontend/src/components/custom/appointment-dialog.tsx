"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TimePicker } from "@/components/ui/time-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createAppointment, fetchDoctors } from "@/utils/api"

interface Doctor {
  id: number
  name: string
  surname: string
}

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
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [eventType, setEventType] = useState<string>("Consultation")
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  // Fetch doctors for the dropdown
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    enabled: open, // Only fetch when dialog is open
  })

  // Set default doctor based on role
  useEffect(() => {
    if (userRole === "doctor" && doctors && doctors.length > 0) {
      // Find current doctor in the list (this would be based on user ID in a real app)
      const currentDoctor = doctors[0]
      setSelectedDoctor(currentDoctor.id.toString())
    } else {
      setSelectedDoctor("")
    }
  }, [userRole, doctors])

  // Mutation for creating a new appointment
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Termín byl úspěšně vytvořen")
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      onOpenChange(false)
      resetForm()
    },
    onError: (error) => {
      toast.error("Nepodařilo se vytvořit termín")
      console.error("Error creating appointment:", error)
    },
  })

  const resetForm = () => {
    setDate(undefined)
    setStartTime("")
    setDuration("30")
    setNotes("")
    if (userRole !== "doctor") {
      setSelectedDoctor("")
    }
    setEventType("Consultation")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !startTime || !selectedDoctor) {
      toast.error("Vyplňte prosím všechna povinná pole")
      return
    }

    // Combine date and time to create start and end timestamps
    const startDateTime = new Date(date)
    const [hours, minutes] = startTime.split(":").map(Number)
    startDateTime.setHours(hours, minutes, 0, 0)

    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + Number.parseInt(duration, 10))

    // Create appointment data object with correct field names
    const appointmentData = {
      doctor_id: Number.parseInt(selectedDoctor, 10),
      event_type: eventType,
      date_from: startDateTime.toISOString(),
      date_to: endDateTime.toISOString(),
      registration_mandatory: true,
      created_at: new Date().toISOString(), // Adding the missing required field
    }

    // Call the mutation to create the appointment
    createAppointmentMutation.mutate(appointmentData)
  }

  const eventTypes = [
    { value: "Consultation", label: "Konzultace" },
    { value: "Follow-up", label: "Kontrola" },
    { value: "Routine Checkup", label: "Běžná prohlídka" },
    { value: "Emergency", label: "Akutní případ" },
    { value: "Surgery", label: "Operace" },
    { value: "Examination", label: "Vyšetření" },
  ]

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
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  required
                  disabled={isLoadingDoctors}
                >
                  <SelectTrigger id='doctor' className='col-span-3'>
                    <SelectValue placeholder='Vyberte lékaře' />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingDoctors ? (
                      <SelectItem value='loading' disabled>
                        Načítání lékařů...
                      </SelectItem>
                    ) : (
                      doctors?.map((doctor: Doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.name} {doctor.surname}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='event-type' className='text-right'>
                Typ
              </Label>
              <Select value={eventType} onValueChange={setEventType} required>
                <SelectTrigger id='event-type' className='col-span-3'>
                  <SelectValue placeholder='Vyberte typ termínu' />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='date' className='text-right'>
                Datum
              </Label>
              <div className='col-span-3 flex flex-col'>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      id='date'
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                      onSelect={(newDate) => {
                        setDate(newDate)
                        setCalendarOpen(false)
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='time' className='text-right'>
                Čas začátku
              </Label>
              <div className='col-span-3'>
                <TimePicker
                  date={date || new Date()}
                  setDate={(newDate: Date) => {
                    // Update both the date and time
                    if (date) {
                      const updatedDate = new Date(date)
                      updatedDate.setHours(newDate.getHours(), newDate.getMinutes(), 0, 0)
                      setDate(updatedDate)
                    } else {
                      setDate(newDate)
                    }
                    // Also update the startTime string for backward compatibility
                    setStartTime(
                      `${newDate.getHours().toString().padStart(2, "0")}:${newDate
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`
                    )
                  }}
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
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Zrušit
            </Button>
            <Button type='submit' disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? "Vytvářím..." : "Vytvořit termín"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
