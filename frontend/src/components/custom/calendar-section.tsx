"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useCallback, useEffect, useState } from "react"
import ContainerSection from "./container-section"

import { Doctor } from "@/types/doctor"

import { Appointment } from "@/types/appointment"

import { formatDateToCzech } from "@/utils/helper"
import { useForm } from "@tanstack/react-form"

// const fetchDoctors = async (): Promise<Doctor[]> => {
//   return axios
//     .get("https://vpsiproject.onrender.com/doctors")
//     .then((response) => {
//       console.log("Fetched doctors:", response.data)
//       return response.data
//     })
//     .catch((error: AxiosError) => {
//       console.error("Error fetching doctors:", error)
//       return []
//     })
// }

const doctors: Doctor[] = [
  {
    name: "Ing. MBA, Prof. Dominik",
    surname: "Wojnar (Miliardar)",
    email: "king.wojnys@seznam.com",
    phone_number: "000 000 007",
    specialization: 1,
    id: 1,
  },
  {
    name: "Dr. Sarah",
    surname: "Johnson",
    email: "sarah.johnson@hospital.com",
    phone_number: "123 456 789",
    specialization: 2,
    id: 10,
  },
  {
    name: "Dr. Michael",
    surname: "Chen",
    email: "michael.chen@hospital.com",
    phone_number: "987 654 321",
    specialization: 3,
    id: 2,
  },
  {
    name: "Dr. Emily",
    surname: "Rodriguez",
    email: "emily.rodriguez@hospital.com",
    phone_number: "456 789 123",
    specialization: 4,
    id: 3,
  },
  {
    name: "Dr. James",
    surname: "Wilson",
    email: "james.wilson@hospital.com",
    phone_number: "321 654 987",
    specialization: 5,
    id: 4,
  },
  {
    name: "Dr. Aisha",
    surname: "Patel",
    email: "aisha.patel@hospital.com",
    phone_number: "654 321 789",
    specialization: 6,
    id: 5,
  },
]

const doctorAppointsmentApi: Appointment[] = [
  {
    id: 1,
    doctor_id: 1,
    event_type: "Consultation",
    start_date_time: "2025-03-29T14:00:00Z",
    end_date_time: "2025-03-29T14:15:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T10:00:00",
  },
  {
    id: 2,
    doctor_id: 1,
    event_type: "Follow-up",
    start_date_time: "2025-03-29T11:00:00Z",
    end_date_time: "2025-03-29T11:15:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T10:15:00",
  },
  {
    id: 3,
    doctor_id: 1,
    event_type: "Routine Checkup",
    start_date_time: "2025-03-29T12:30:00Z",
    end_date_time: "2025-03-29T13:00:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T10:30:00",
  },
  {
    id: 4,
    doctor_id: 1,
    event_type: "Emergency",
    start_date_time: "2025-03-29T13:00:00Z",
    end_date_time: "2025-03-29T13:15:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T10:45:00",
  },
  {
    id: 5,
    doctor_id: 4,
    event_type: "Consultation",
    start_date_time: "2025-03-29T13:15:00Z",
    end_date_time: "2025-03-29T13:45:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T11:00:00",
  },
  {
    id: 52,
    doctor_id: 1,
    event_type: "Consultation",
    start_date_time: "2025-03-29T13:15:00Z",
    end_date_time: "2025-03-29T13:45:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T11:00:00",
  },
  {
    id: 522,
    doctor_id: 1,
    event_type: "Consultation",
    start_date_time: "2025-03-28T13:15:00Z",
    end_date_time: "2025-03-28T13:45:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T11:00:00",
  },
  {
    id: 521,
    doctor_id: 2,
    event_type: "Consultation",
    start_date_time: "2025-03-29T13:15:00Z",
    end_date_time: "2025-03-29T13:45:00Z",
    status: "With Registration",
    mandatory_registration: true,
    created_at: "2025-03-27T11:00:00",
  },
  {
    id: 5211,
    doctor_id: 2,
    event_type: "Consultation",
    start_date_time: "2025-03-29T16:15:00Z",
    end_date_time: "2025-03-29T18:45:00Z",
    status: "Public",
    mandatory_registration: false,
    created_at: "2025-03-27T11:00:00",
  },
  {
    id: 52111,
    doctor_id: 1,
    event_type: "Consultation",
    start_date_time: "2025-03-30T10:00:00Z",
    end_date_time: "2025-03-30T15:00:00Z",
    status: "Public",
    mandatory_registration: false,
    created_at: "2025-03-27T11:00:00",
  },
  {
    id: 521111,
    doctor_id: 1,
    event_type: "Consultation",
    start_date_time: "2025-03-30T05:00:00Z",
    end_date_time: "2025-03-30T07:00:00Z",
    status: "Public",
    mandatory_registration: false,
    created_at: "2025-03-27T11:00:00",
  },
]

const CalendarSection = () => {
  const [doctorFreeAppointments, setDoctorFreeAppointments] = useState<Appointment[]>([])
  const [date, setDate] = useState(new Date())
  const [doctorId, setDoctorId] = useState<number>(0)

  const form = useForm({
    defaultValues: {
      appointment_id: null as number | null,
      doctor_id: null as number | null,
      firstname: "",
      lastname: "",
      phone: "",
      note: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value)
      console.log(value)
    },
  })

  useEffect(() => {
    fetchFreeTermsForDoctor()
  }, [date, doctorId])

  const fetchFreeTermsForDoctor = () => {
    const freeAppoint: Appointment[] = doctorAppointsmentApi
      .filter((appointment: Appointment) => {
        return (
          appointment.doctor_id === form.getFieldValue("doctor_id") &&
          appointment.mandatory_registration === true &&
          new Date(date).getDate() === new Date(appointment.start_date_time).getDate() &&
          new Date(date).getMonth() === new Date(appointment.start_date_time).getMonth() &&
          new Date(date).getFullYear() === new Date(appointment.start_date_time).getFullYear()
        )
      })
      .sort((a, b) => new Date(a.start_date_time).getTime() - new Date(b.start_date_time).getTime())

    setDoctorFreeAppointments(freeAppoint)
  }

  // i need to rewrite as useCallback

  const withoutRegistrationAppointments = useCallback(() => {
    return doctorAppointsmentApi
      .filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.start_date_time).toISOString().split("T")[0]
        const selectedDate = date.toISOString().split("T")[0]
        return (
          appointment.mandatory_registration === false &&
          appointmentDate === selectedDate &&
          doctorId === appointment.doctor_id // Compare only the date part
        )
      })
      .sort((a, b) => new Date(a.start_date_time).getTime() - new Date(b.start_date_time).getTime())
  }, [date, doctorId])

  return (
    <ContainerSection id='calendar' className='py-12 md:py-24 lg:py-32'>
      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='space-y-2'>
          <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
            Kalendář
          </div>
          <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
            Přehled dostupných termínů
          </h2>
          <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
            Zde si můžete vybrat z nabízených volných termínů pro jednotlivé oddělení a lékaře.
          </p>
        </div>
      </div>
      <div className='mx-auto max-w-4xl py-12'>
        <Tabs defaultValue='appointment' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='appointment'>Rezervujte si žádanku</TabsTrigger>
            <TabsTrigger value='virtual'>Termíny bez registrace</TabsTrigger>
          </TabsList>
          <TabsContent value='appointment'>
            <Card>
              <form
                className='w-full mx-auto p-4'
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
              >
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='doctor'>Doktor</Label>

                      <form.Field
                        name='doctor_id'
                        validators={{
                          onSubmit: ({ value }) => {
                            console.log(value)
                            if (value === null) {
                              return "Vyberte lékaře"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <Select
                            onValueChange={(value) => {
                              field.handleChange(Number(value))
                              setDoctorId(Number(value))
                            }}
                          >
                            <SelectTrigger id='doctor'>
                              <SelectValue placeholder='Zvolte lékaře' />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map((doctor: Doctor) => (
                                <SelectItem key={doctor.id} value={String(doctor.id)}>
                                  {doctor.name} {doctor.surname} - {doctor.specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            <p className='text-red-500'>
                              {field.state.meta.errors.length ? (
                                <em>{field.state.meta.errors.join(",")}</em>
                              ) : null}
                            </p>
                          </Select>
                        )}
                      </form.Field>
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Vyberte datum</Label>
                      <div className='border rounded-md p-4'>
                        <div className='flex justify-between items-center gap-5'>
                          <Calendar
                            mode='single'
                            selected={date}
                            onSelect={(day: Date | undefined) => day && setDate(day)}
                            className='rounded-md border w-1/3 p-3 max-h-[330px] gap-4'
                          />
                          <Card className='w-2/3 p-3 '>
                            <div className='max-h-[300px] overflow-y-auto  flex flex-row flex-wrap gap-4 w-full'>
                              {doctorFreeAppointments.length === 0 && (
                                <p className='text-gray-500'>
                                  Žádné volné termíny, nebo nemáte vybraného doktora
                                </p>
                              )}

                              {doctorFreeAppointments.map((term: Appointment) => (
                                <form.Field
                                  key={term.id}
                                  name='appointment_id'
                                  validators={{
                                    onSubmit: ({ value }) => {
                                      if (value === null) {
                                        return "Vybrat termín je povinné"
                                      }
                                    },
                                  }}
                                >
                                  {(field) => (
                                    <div
                                      className={`border p-4 rounded-lg cursor-pointer transition-all duration-200
                                 ${
                                   field.state.value === term.id
                                     ? "border-2 border-blue-500 bg-blue-100 shadow-lg"
                                     : "hover:bg-gray-100"
                                 }`}
                                      onClick={() => {
                                        field.handleChange(term.id) // Update form state
                                      }}
                                    >
                                      <p className='font-semibold text-green-500'>
                                        Od: {formatDateToCzech(term.start_date_time)}
                                      </p>
                                      <p className='text-red-500'>
                                        Do: {formatDateToCzech(term.end_date_time)}
                                      </p>
                                      {/* Hidden radio input for form accessibility */}
                                      <input
                                        type='radio'
                                        name='appointment'
                                        value={term.id}
                                        checked={field.state.value === term.id}
                                        onChange={(e) => {
                                          const id = Number(e.target.value)
                                          field.handleChange(id)
                                        }}
                                        className='hidden' // Hide the default radio button
                                      />
                                      {field.state.meta.errors.length > 0 && (
                                        <p className='text-red-500 text-sm mt-1'>
                                          <em>{field.state.meta.errors.join(", ")}</em>
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </form.Field>
                              ))}
                            </div>
                          </Card>
                        </div>

                        {/* <AppointmentCalendar doctorFreeAppointments={doctorFreeAppointments} /> */}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <form.Field
                        name='firstname'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "Jméno je povinné"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor='name'>Jméno</Label>
                            <Input
                              id='name'
                              placeholder='Zadejte Jméno'
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            <p className='text-red-500'>
                              {field.state.meta.errors.length ? (
                                <em>{field.state.meta.errors.join(",")}</em>
                              ) : null}
                            </p>
                          </>
                        )}
                      </form.Field>
                    </div>
                    <div className='space-y-2'>
                      <form.Field
                        name='lastname'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "Příjmení je povinné"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>Příjmení</Label>
                            <Input
                              id='lastname'
                              placeholder='Zadejte Příjmení'
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            <p className='text-red-500'>
                              {field.state.meta.errors.length ? (
                                <em>{field.state.meta.errors.join(",")}</em>
                              ) : null}
                            </p>
                          </>
                        )}
                      </form.Field>
                    </div>

                    <div className='space-y-2 md:col-span-2'>
                      <form.Field
                        name='phone'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "Telefonní číslo je povinné"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>Telefonní číslo</Label>
                            <Input
                              id='phone'
                              placeholder='Zadejte Telefonní číslo'
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                field.handleChange(e.target.value)
                              }
                            />
                            <p className='text-red-500'>
                              {field.state.meta.errors.length ? (
                                <em>{field.state.meta.errors.join(",")}</em>
                              ) : null}
                            </p>
                          </>
                        )}
                      </form.Field>
                    </div>

                    <div className='space-y-2 md:col-span-2'>
                      <form.Field name='note'>
                        {(field) => (
                          <>
                            <Label htmlFor=''>Důvod návštěvy</Label>
                            <Textarea
                              id='note'
                              placeholder='Zadejte Důvod návštěvy'
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>
                </CardContent>
              </form>
              <CardFooter>
                <Button className='w-full' onClick={form.handleSubmit} type='submit'>
                  Zarezervujte si termín
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='virtual'>
            <Card>
              <CardContent className='space-y-4'>
                <div className=''>
                  <div className='space-y-2'>
                    <Label htmlFor='doctor'>Doktor</Label>
                    <Select
                      onValueChange={(value) => {
                        setDoctorId(Number(value))
                      }}
                    >
                      <SelectTrigger id='doctor'>
                        <SelectValue placeholder='Zvolte lékaře' />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor: Doctor) => (
                          <SelectItem key={doctor.id} value={String(doctor.id)}>
                            {doctor.name} {doctor.surname} - {doctor.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='w-full'>
                      <Card className='flex flex-row justify-between items-center gap-4 w-full px-4'>
                        <Calendar
                          mode='single'
                          selected={date}
                          onSelect={(day: Date | undefined) => day && setDate(day)}
                          className='rounded-md border p-3 max-h-[330px] gap-4'
                        />

                        <div className='w-full '>
                          {withoutRegistrationAppointments().map((term: Appointment) => (
                            <div key={term.id} className='border p-4 my-4 rounded-md'>
                              <p className='text-green-500'>
                                od {formatDateToCzech(term.start_date_time)}
                              </p>
                              <p className='text-red-500'>
                                do {formatDateToCzech(term.end_date_time)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContainerSection>
  )
}

export default CalendarSection

// interface AppointmentCalendarProps {
//   doctorFreeAppointments: Appointment[]
// }

// const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ doctorFreeAppointments }) => {
//   const [date, setDate] = useState(new Date())
//   console.log(date)
//   const [time, setTime] = useState<string>("")

//   return (
//     <div className='space-y-4 flex justify-between items-center'>
//       <Calendar
//         mode='single'
//         selected={date}
//         onSelect={(day: Date | undefined) => day && setDate(day)}
//         className='rounded-md border w-1/2 '
//       />
//       <Card className='w-1/2'>
//         <div>
//           {doctorFreeAppointments.length === 0 && <p>Žádné volné termíny</p>}
//           {doctorFreeAppointments.map((term: Appointment) => (
//             <div key={term.id} className='border p-4 rounded-md'>
//               <p>od {formatDateToCzech(term.start_date_time)}</p>
//               <p>do {formatDateToCzech(term.end_date_time)}</p>
//               <input type='radio' name='term' value={term.id} />
//             </div>
//           ))}
//         </div>
//       </Card>
//     </div>
//   )
// }
