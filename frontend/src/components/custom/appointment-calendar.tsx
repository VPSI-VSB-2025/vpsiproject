"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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

interface AppointmentCalendarProps {
  userRole: "doctor" | "nurse"
}

export function AppointmentCalendar({ userRole }: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date>(new Date())

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      time: "09:00",
      patientName: "Jan Novák",
      reason: "Roční prohlídka",
      status: "confirmed",
    },
    {
      id: 2,
      time: "10:30",
      patientName: "Jana Svobodová",
      reason: "Kontrola",
      status: "confirmed",
    },
    {
      id: 3,
      time: "11:45",
      patientName: "",
      reason: "",
      status: "available",
    },
    {
      id: 4,
      time: "13:15",
      patientName: "Robert Dvořák",
      reason: "Výsledky krevních testů",
      status: "pending",
    },
    {
      id: 5,
      time: "14:30",
      patientName: "",
      reason: "",
      status: "available",
    },
    {
      id: 6,
      time: "15:45",
      patientName: "Eliška Nováková",
      reason: "Očkování",
      status: "confirmed",
    },
  ]

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
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {appointments.map((appointment) => (
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
                <Button size='sm' variant='outline'>
                  Blokovat čas
                </Button>
              ) : appointment.status === "pending" ? (
                <div className='flex space-x-2'>
                  <Button size='sm' variant='default'>
                    Schválit
                  </Button>
                  {userRole === "doctor" && (
                    <Button size='sm' variant='outline'>
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
                    <Button size='sm' variant='outline' className='text-red-500 hover:text-red-700'>
                      Zrušit
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
