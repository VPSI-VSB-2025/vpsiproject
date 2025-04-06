"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery, queryOptions } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Doctor } from "@/types/doctor"
import { Nurse } from "@/types/nurse"
import { DashboardShell } from "@/components/custom/dashboard-shell"
import { DashboardHeader } from "@/components/custom/dashboard-header"
import { Button } from "@/components/ui/button"
import { Clock, FileText, Plus, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentCalendar } from "@/components/custom/appointment-calendar"
import { RequestsTable } from "@/components/custom/request-table"
import { AppointmentDialog } from "@/components/custom/appointment-dialog"

const fetchDoctors = async (): Promise<Doctor[]> => {
  return axios
    .get("https://vpsiproject.onrender.com/doctors")
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.error("Error fetching doctors:", error)
      return []
    })
}

const fetchNurses = async (): Promise<Nurse[]> => {
  return axios
    .get("https://vpsiproject.onrender.com/nurses")
    .then((response) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.error("Error fetching nurses:", error)
      return []
    })
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [role, setRole] = useState<"doctor" | "nurse">("doctor")
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false)

  const doctorsQueryOptions = queryOptions({
    queryKey: ["doctors"],
    queryFn: () => fetchDoctors(),
    enabled: !!isSignedIn,
  })

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery(doctorsQueryOptions)

  const nursesQueryOptions = queryOptions({
    queryKey: ["nurses"],
    queryFn: () => fetchNurses(),
    enabled: !!isSignedIn,
  })

  const { data: nurses, isLoading: isLoadingNurses } = useQuery(nursesQueryOptions)

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
    // Jenom pokud je uživatel načten, přihlášen a obě data lékařů a sester jsou načtena
    if (!isLoaded || !isSignedIn || isLoadingDoctors || isLoadingNurses) {
      return
    }

    // kontrola, zda je uživatel lékař nebo sestra
    const isDoctor = doctors?.some((doctor) => doctor.email === userEmail)
    const isNurse = nurses?.some((nurse) => nurse.email === userEmail)

    // Pokud uživatel není lékař ani sestra, přesměruj na stránku pro výběr role
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

  // Pokud se stále načítá nebo není přihlášen, zobrazí se stav načítání
  if (!isLoaded || !isSignedIn || isLoadingDoctors || isLoadingNurses) {
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
        text={`Vítejte zpět, ${user?.firstName} ${user?.lastName}. Máte 8 čekajících žádostí.`}
        role={role}
        onRoleChange={setRole}
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
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-xs text-muted-foreground'>+5 oproti minulému týdnu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Čekající žádosti</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8</div>
            <p className='text-xs text-muted-foreground'>-2 oproti včerejšku</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Dostupné termíny</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>Na příštích 7 dní</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {role === "doctor" ? "Ošetřených pacientů" : "Přidělení lékaři"}
            </CardTitle>
            <User className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{role === "doctor" ? "156" : "3"}</div>
            <p className='text-xs text-muted-foreground'>
              {role === "doctor" ? "Tento měsíc" : "Aktivní lékaři"}
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue='calendar' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='calendar'>Kalendář</TabsTrigger>
          <TabsTrigger value='requests'>Žádosti pacientů</TabsTrigger>
        </TabsList>
        <TabsContent value='calendar' className='space-y-4'>
          <AppointmentCalendar userRole={role} />
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
