"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/custom/dashboard-shell"
import { DashboardHeader } from "@/components/custom/dashboard-header"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, FileText, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentCalendar } from "@/components/custom/appointment-calendar"
import { RequestsTable } from "@/components/custom/request-table"
import { AppointmentDialog } from "@/components/custom/appointment-dialog"
import { fetchDoctors, fetchNurses, fetchAppointments, fetchRequests } from "@/utils/api"

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [role, setRole] = useState<"doctor" | "nurse">("doctor")
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false)

  // Fetch doctors data
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    enabled: !!isSignedIn,
  })

  // Fetch nurses data
  const { data: nurses, isLoading: isLoadingNurses } = useQuery({
    queryKey: ["nurses"],
    queryFn: fetchNurses,
    enabled: !!isSignedIn,
  })

  // Fetch appointments data
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(),
    enabled: !!isSignedIn,
  })

  // Fetch requests data
  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["requests"],
    queryFn: () => fetchRequests(),
    enabled: !!isSignedIn,
  })

  // Determine user role from fetched data
  const userEmail = user?.emailAddresses[0]?.emailAddress
  const isDoctor = doctors?.some((doctor) => doctor.email === userEmail)
  const isNurse = nurses?.some((nurse) => nurse.email === userEmail)

  // Set default role based on user data
  useEffect(() => {
    if (isDoctor) {
      setRole("doctor")
    } else if (isNurse) {
      setRole("nurse")
    }
  }, [isDoctor, isNurse])

  useEffect(() => {
    // Only proceed if user is loaded, signed in, and both doctors and nurses data are loaded
    if (!isLoaded || !isSignedIn || isLoadingDoctors || isLoadingNurses) {
      return
    }

    // Check if the user is either a doctor or a nurse
    const isDoctor = doctors?.some((doctor) => doctor.email === userEmail)
    const isNurse = nurses?.some((nurse) => nurse.email === userEmail)

    // If the user is neither a doctor nor a nurse, redirect to role selection page
    if (!isDoctor && !isNurse) {
      router.push("/protected/role")
    }
  }, [
    isLoaded,
    isSignedIn,
    isLoadingDoctors,
    isLoadingNurses,
    doctors,
    nurses,
    user,
    router,
    userEmail,
  ])

  // Calculate dashboard statistics
  const pendingRequestsCount = requests?.filter((req) => req.state === "pending")?.length || 0
  const totalAppointmentsCount = appointments?.length || 0
  // Calculate available appointments - an appointment is available if it doesn't have an associated request
  const availableAppointmentsCount = appointments?.length
    ? appointments.filter((appointment) => {
        // Check if this appointment ID doesn't exist in any request
        return !requests?.some((request) => request.appointment_id === appointment.id)
      }).length
    : 0

  // Loading state
  if (
    !isLoaded ||
    !isSignedIn ||
    isLoadingDoctors ||
    isLoadingNurses ||
    isLoadingRequests ||
    isLoadingAppointments
  ) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Přehled'
        text={`Vítejte zpět, ${user?.firstName} ${user?.lastName}. Máte ${pendingRequestsCount} čekajících žádanky.`}
        role={role}
      >
        <Button onClick={() => setIsCreateAppointmentOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Nový termín
        </Button>
      </DashboardHeader>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Celkem termínů</CardTitle>
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalAppointmentsCount}</div>
            <p className='text-xs text-muted-foreground'>Aktuální počet termínů</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Čekající žádanky</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingRequestsCount}</div>
            <p className='text-xs text-muted-foreground'>Čekající na zpracování</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Dostupné termíny</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{availableAppointmentsCount}</div>
            <p className='text-xs text-muted-foreground'>Na příštích 7 dní</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue='calendar' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='calendar'>Kalendář</TabsTrigger>
          <TabsTrigger value='requests'>žádanky pacientů</TabsTrigger>
        </TabsList>
        <TabsContent value='calendar' className='space-y-4'>
          <AppointmentCalendar
            userRole={role}
            onCreateAppointment={() => setIsCreateAppointmentOpen(true)}
          />
        </TabsContent>
        <TabsContent value='requests' className='space-y-4'>
          <RequestsTable userRole={role} />
        </TabsContent>
      </Tabs>
      <AppointmentDialog
        open={isCreateAppointmentOpen}
        onOpenChange={setIsCreateAppointmentOpen}
        userRole={role}
      />
    </DashboardShell>
  )
}
