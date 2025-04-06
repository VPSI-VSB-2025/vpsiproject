"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery, queryOptions } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Doctor } from "@/types/doctor"
import { Nurse } from "@/types/nurse"

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

  useEffect(() => {
    // Jenom pokud je uživatel načten, přihlášen a obě data lékařů a sester jsou načtena
    if (!isLoaded || !isSignedIn || isLoadingDoctors || isLoadingNurses) {
      return
    }

    // Get the current user's email
    const userEmail = user?.emailAddresses[0]?.emailAddress

    // kontrola, zda je uživatel lékař nebo sestra
    const isDoctor = doctors?.some((doctor) => doctor.email === userEmail)
    const isNurse = nurses?.some((nurse) => nurse.email === userEmail)

    // Pokud uživatel není lékař ani sestra, přesměruj na stránku pro výběr role
    if (!isDoctor && !isNurse) {
      router.push("/protected/role")
    }
  }, [isLoaded, isSignedIn, isLoadingDoctors, isLoadingNurses, doctors, nurses, user, router])

  // Pokud se stále načítá nebo není přihlášen, zobrazí se stav načítání
  if (!isLoaded || !isSignedIn || isLoadingDoctors || isLoadingNurses) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    )
  }

  return <div className='w-full p-8'></div>
}
