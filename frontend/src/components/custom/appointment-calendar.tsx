"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchAppointments, updateRequestStatus } from "@/utils/api"
import { toast } from "sonner"

interface AppointmentCalendarProps {
  userRole: "doctor" | "nurse"
  onCreateAppointment: () => void
}

export function AppointmentCalendar({ userRole, onCreateAppointment }: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [formattedDate, setFormattedDate] = useState<string>("")

  useEffect(() => {
    // Format the date as YYYY-MM-DD for the API
    setFormattedDate(date.toISOString().split("T")[0])
  }, [date])

  // Fetch appointments from the API
  const {
    data: allAppointments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["appointments", formattedDate],
    queryFn: () => fetchAppointments(),
    enabled: !!formattedDate,
  })

  // Filter appointments for the selected date
  const appointments =
    allAppointments?.filter((appointment) => {
      // Check if date_from exists and is valid (using the correct field name from backend)
      if (!appointment.date_from) {
        console.error("Invalid appointment data - missing date_from:", appointment)
        return false
      }

      try {
        const appointmentDate = new Date(appointment.date_from).toISOString().split("T")[0]
        return appointmentDate === formattedDate
      } catch (error) {
        console.error("Error parsing date:", appointment.date_from, error)
        return false
      }
    }) || []

  // Format appointments for display with error handling
  const formattedAppointments = appointments.map((appointment) => {
    let timeString = ""
    try {
      const startTime = new Date(appointment.date_from)
      if (isNaN(startTime.getTime())) {
        throw new Error("Invalid date")
      }
      timeString = startTime.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      console.error("Error formatting time for appointment:", appointment, error)
      timeString = "Neplatný čas"
    }

    // Map API status to UI status
    let status = "available"
    if (appointment.status === "With Registration") {
      status = "confirmed"
    } else if (appointment.status === "Pending") {
      status = "pending"
    }

    // Get patient name from the request relationship if available
    let patientName = "Jméno pacienta nedostupné"
    if (
      appointment.requests &&
      appointment.requests.length > 0 &&
      appointment.requests[0].patient &&
      appointment.requests[0].patient.name &&
      appointment.requests[0].patient.surname
    ) {
      patientName = `${appointment.requests[0].patient.name} ${appointment.requests[0].patient.surname}`
    }

    return {
      id: appointment.id,
      time: timeString,
      patientName: patientName,
      reason: appointment.event_type || "Neuvedeno",
      status: status as "available" | "confirmed" | "pending",
    }
  })

  // Handle appointment actions
  const handleApproveAppointment = async (id: number) => {
    try {
      await updateRequestStatus(id, "approved")
      toast.success("Termín byl schválen")
      refetch()
    } catch (error) {
      toast.error("Nepodařilo se schválit termín")
      console.error("Error approving appointment:", error)
    }
  }

  const handleRejectAppointment = async (id: number) => {
    try {
      await updateRequestStatus(id, "declined")
      toast.success("Termín byl odmítnut")
      refetch()
    } catch (error) {
      toast.error("Nepodařilo se odmítnout termín")
      console.error("Error rejecting appointment:", error)
    }
  }

  const handleCancelAppointment = async (id: number) => {
    try {
      await updateRequestStatus(id, "cancelled")
      toast.success("Termín byl zrušen")
      refetch()
    } catch (error) {
      toast.error("Nepodařilo se zrušit termín")
      console.error("Error cancelling appointment:", error)
    }
  }

  const handleBlockTime = async (id: number) => {
    // This would create a new appointment with status "blocked"
    toast.success("Čas byl zablokován")
    // Implementation would depend on your API
  }

  if (isLoading) {
    return <div className='flex justify-center p-8'>Načítání termínů...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
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
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center space-x-2'>
          <Badge
            variant='outline'
            className='bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700'
          >
            Dostupné
          </Badge>
          <Badge
            variant='outline'
            className='bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
          >
            Potvrzené
          </Badge>
          <Badge
            variant='outline'
            className='bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700'
          >
            Čekající
          </Badge>
        </div>
      </div>
      {formattedAppointments.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <p className='text-muted-foreground mb-4'>Nejsou žádné termíny pro vybraný den.</p>
          <Button onClick={onCreateAppointment} variant='default'>
            Vytvořit nový termín
          </Button>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {formattedAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className={cn(
                appointment.status === "available" && "border-green-200 bg-green-50",
                appointment.status === "confirmed" && "border-blue-200",
                appointment.status === "pending" && "border-yellow-200"
              )}
            >
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>{appointment.time}</CardTitle>
                <CardDescription>
                  {appointment.status === "available" ? "Volný termín" : appointment.patientName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointment.status !== "available" && (
                  <p className='text-sm'>{appointment.reason}</p>
                )}
              </CardContent>
              <CardFooter>
                {appointment.status === "available" ? (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleBlockTime(appointment.id)}
                  >
                    Blokovat čas
                  </Button>
                ) : appointment.status === "pending" ? (
                  <div className='flex space-x-2'>
                    <Button
                      size='sm'
                      variant='default'
                      onClick={() => handleApproveAppointment(appointment.id)}
                    >
                      Schválit
                    </Button>
                    {userRole === "doctor" && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleRejectAppointment(appointment.id)}
                      >
                        Odmítnout
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className='flex space-x-2'>
                    <Button size='sm' variant='outline'>
                      Zobrazit detaily
                    </Button>
                    {userRole === "doctor" && (
                      <Button
                        size='sm'
                        variant='outline'
                        className='text-red-500 hover:text-red-700'
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Zrušit
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
