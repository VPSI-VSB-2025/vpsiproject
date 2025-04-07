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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Doctor } from "@/types/doctor"
import { Appointment } from "@/types/appointment"
import { formatDateToCzech } from "@/utils/helper"
import { useForm } from "@tanstack/react-form"
import {
  fetchDoctors,
  fetchAppointments,
  createRequest,
  fetchSpecializations,
  fetchRequestTypes,
  createRequestType,
  fetchPatients,
  createPatient,
} from "@/utils/api"
import { Specialization } from "@/types/specialization"

const CalendarSection = () => {
  const [doctorFreeAppointments, setDoctorFreeAppointments] = useState<Appointment[]>([])
  const [date, setDate] = useState(new Date())
  const [doctorId, setDoctorId] = useState<number>(0)
  const queryClient = useQueryClient()

  // Fetch doctors from API
  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  })

  // Fetch specializations from API
  const { data: specializations = [] } = useQuery({
    queryKey: ["specializations"],
    queryFn: () => fetchSpecializations(),
  })
  // Add specializations to doctors
  doctors.map((doctor: Doctor) => {
    specializations.forEach((specialization: Specialization) => {
      if (doctor.specialization_id === specialization.id) {
        doctor.specialization = specialization.name
      }
    })
  })

  // Fetch appointments for selected doctor and date
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments", doctorId, date.toISOString().split("T")[0]],
    queryFn: () =>
      fetchAppointments({
        skip: 0,
        limit: 100,
      }),
    enabled: !!doctorId,
  })

  // Create request mutation
  const createRequestMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success("Vaše žádost byla úspěšně odeslána")
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      queryClient.invalidateQueries({ queryKey: ["requests"] })
      form.reset()
    },
    onError: (error) => {
      toast.error("Nepodařilo se odeslat žádost")
      console.error("Error creating request:", error)
    },
  })

  const form = useForm({
    defaultValues: {
      appointment_id: null as number | null,
      doctor_id: null as number | null,
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      date_of_birth: "",
      sex: "",
      address: "",
      personal_number: "",
      note: "",
    },
    onSubmit: async ({ value }) => {
      // First fetch all request types:
      const requestTypes = await fetchRequestTypes()

      // Check if the request type exists
      const requestType = requestTypes.find(
        (type) =>
          type.name ===
          appointments[appointments.findIndex((a) => a.id === value.appointment_id)].event_type
      )

      // If it's not existing, create it
      let createdRequestType
      if (!requestType) {
        const newRequestType = {
          name: appointments[appointments.findIndex((a) => a.id === value.appointment_id)]
            .event_type,
          description: "Popis nového typu žádanky",
          length: 20,
        }

        createdRequestType = await createRequestType(
          newRequestType.name,
          newRequestType.description,
          newRequestType.length
        )
      }

      // Secondly, fetch all patients:
      const patients = await fetchPatients()

      // Check if the patient exists
      const patient = patients.find((p) => p.personal_number === value.personal_number)

      // If it's not existing, create it
      let createdPatient
      if (!patient) {
        const newPatient = {
          name: value.firstname,
          surname: value.lastname,
          email: value.email,
          date_of_birth: value.date_of_birth
            .split(".")
            .map((part, index) => (index === 1 && part.length === 1 ? `0${part}` : part))
            .reverse()
            .join("-"),
          sex: value.sex,
          address: value.address,
          phone_number: value.phone,
          personal_number: value.personal_number,
        }

        console.log("Creating new patient:", newPatient)

        createdPatient = await createPatient(newPatient)
      }

      if (!value.appointment_id || !value.doctor_id) {
        toast.error("Vyberte lékaře a termín")
        return
      }

      // Ensure we have a patient ID
      const patientId = patient ? patient.id : createdPatient?.id
      if (!patientId) {
        toast.error("Nepodařilo se vytvořit pacienta")
        return
      }

      // Ensure we have a request type ID
      const requestTypeId = requestType ? requestType.id : createdRequestType?.id
      if (!requestTypeId) {
        toast.error("Nepodařilo se vytvořit typ žádanky")
        return
      }

      const requestData = {
        state: "pending",
        //createdAt: new Date().toISOString(), // Keep full ISO format: YYYY-MM-DDTHH:MM:SS.SSSZ
        description: value.note || "Konzultace",
        patient_id: patientId,
        doctor_id: value.doctor_id,
        appointment_id: value.appointment_id,
        request_type_id: requestTypeId,
      }

      createRequestMutation.mutate(requestData)
    },
  })

  const fetchFreeTermsForDoctor = useCallback(() => {
    if (appointments.length === 0) {
      return
    }

    const freeAppoint: Appointment[] = appointments
      .filter((appointment: Appointment) => {
        return (
          appointment.doctor_id === doctorId &&
          appointment.registration_mandatory === true &&
          new Date(date).getDate() === new Date(appointment.date_from).getDate() &&
          new Date(date).getMonth() === new Date(appointment.date_from).getMonth() &&
          new Date(date).getFullYear() === new Date(appointment.date_from).getFullYear()
        )
      })
      .sort((a, b) => new Date(a.date_from).getTime() - new Date(b.date_from).getTime())

    setDoctorFreeAppointments(freeAppoint)
  }, [appointments, doctorId, date])

  // Get public appointments (without registration required)
  const withoutRegistrationAppointments = useCallback(() => {
    if (!appointments) return []

    return appointments
      .filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.date_from).toISOString().split("T")[0]
        const selectedDate = date.toISOString().split("T")[0]
        return (
          appointment.registration_mandatory === false &&
          appointmentDate === selectedDate &&
          doctorId === appointment.doctor_id
        )
      })
      .sort((a, b) => new Date(a.date_from).getTime() - new Date(b.date_from).getTime())
  }, [date, doctorId, appointments])

  useEffect(() => {
    if (doctorId && date) {
      fetchFreeTermsForDoctor()
    }
  }, [date, doctorId, appointments, fetchFreeTermsForDoctor])

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
                            disabled={isLoadingDoctors}
                          >
                            <SelectTrigger id='doctor'>
                              <SelectValue placeholder='Zvolte lékaře' />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingDoctors ? (
                                <SelectItem value='loading' disabled>
                                  Načítání lékařů...
                                </SelectItem>
                              ) : (
                                doctors.map((doctor: Doctor) => (
                                  <SelectItem key={doctor.id} value={String(doctor.id)}>
                                    {doctor.name} {doctor.surname} - {doctor.specialization}
                                  </SelectItem>
                                ))
                              )}
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
                            disabled={(date) => date < new Date()} // Disable past dates
                          />
                          <Card className='w-2/3 p-3 '>
                            <div className='max-h-[300px] overflow-y-auto flex flex-row flex-wrap gap-4 w-full'>
                              {isLoadingAppointments ? (
                                <p className='text-center w-full'>Načítání termínů...</p>
                              ) : doctorFreeAppointments.length === 0 ? (
                                <p className='text-gray-500'>
                                  Žádné volné termíny, nebo nemáte vybraného doktora
                                </p>
                              ) : (
                                doctorFreeAppointments.map((term: Appointment) => (
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
                                          Od: {formatDateToCzech(term.date_from)}
                                        </p>
                                        <p className='text-red-500'>
                                          Do: {formatDateToCzech(term.date_to)}
                                        </p>
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
                                ))
                              )}
                            </div>
                          </Card>
                        </div>
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
                      <form.Field
                        name='email'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "email je povinný"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>Email</Label>
                            <Input
                              id='email'
                              placeholder='Zadejte Email'
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
                        name='date_of_birth'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "datum narození je povinné"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>
                              Datum narození {"(den.měsíc.rok - například 10.5.1980)"}
                            </Label>
                            <Input
                              id='date_of_birth'
                              placeholder='Zadejte Datum Narození'
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
                        name='sex'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "pohlaví je povinné"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>
                              Pohlaví {"("}F pro ženu, M pro muže, O pro jiné{")"}
                            </Label>
                            <Input
                              id='sex'
                              placeholder='Zadejte Pohlaví'
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
                        name='address'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "adresa je povinná"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>Adresa</Label>
                            <Input
                              id='address'
                              placeholder='Zadejte Adresu'
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
                        name='personal_number'
                        validators={{
                          onChange: ({ value }) => {
                            if (value === "") {
                              return "rodné číslo je povinné"
                            }
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <Label htmlFor=''>Rodné číslo</Label>
                            <Input
                              id='personal_number'
                              placeholder='Zadejte Rodné číslo'
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
                <Button
                  className='w-full'
                  onClick={form.handleSubmit}
                  type='submit'
                  disabled={createRequestMutation.isPending}
                >
                  {createRequestMutation.isPending ? "Odesílání..." : "Zarezervujte si termín"}
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
                      disabled={isLoadingDoctors}
                    >
                      <SelectTrigger id='doctor'>
                        <SelectValue placeholder='Zvolte lékaře' />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingDoctors ? (
                          <SelectItem value='loading' disabled>
                            Načítání lékařů...
                          </SelectItem>
                        ) : (
                          doctors.map((doctor: Doctor) => (
                            <SelectItem key={doctor.id} value={String(doctor.id)}>
                              {doctor.name} {doctor.surname} - {doctor.specialization}
                            </SelectItem>
                          ))
                        )}
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

                        <div className='w-full'>
                          {isLoadingAppointments ? (
                            <div className='text-center py-4'>Načítání termínů...</div>
                          ) : withoutRegistrationAppointments().length === 0 ? (
                            <div className='text-center py-4'>
                              Žádné dostupné termíny bez registrace
                            </div>
                          ) : (
                            withoutRegistrationAppointments().map((term: Appointment) => (
                              <div key={term.id} className='border p-4 my-4 rounded-md'>
                                <p className='text-green-500'>
                                  od {formatDateToCzech(term.date_from)}
                                </p>
                                <p className='text-red-500'>do {formatDateToCzech(term.date_to)}</p>
                              </div>
                            ))
                          )}
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
