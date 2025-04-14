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
import {
  fetchAppointmentsByDoctor,
  fetchDoctors,
  updateRequestStatus,
  fetchRequests,
} from "@/utils/api" // Import fetchRequests
import { toast } from "sonner"
import { AppointmentDetailsDialog } from "./appointment-details-dialog" // Import the new component
import { useUser } from "@clerk/nextjs"
import { Request } from "@/types/request" // Import Request type if not already imported

interface AppointmentCalendarProps {
  userRole: "doctor" | "nurse"
  onCreateAppointment: () => void
}

// Define a type for the combined appointment and request data
type CalendarAppointment = {
  id: number // Appointment ID
  time: string
  reason: string
  status: "available" | "confirmed" | "pending" | "declined" // Status derived from request
  requestId: number | null // ID of the associated request, if any
  requestState?: string // Original request state for debugging/logic
}

// Define a type for the details to be shown
type AppointmentDetailInfo = {
  appointmentId: number | null
  requestId: number | null
  patientId: number | null
}

export function AppointmentCalendar({ userRole, onCreateAppointment }: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [formattedDate, setFormattedDate] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<number>(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] =
    useState<AppointmentDetailInfo>({
      appointmentId: null,
      requestId: null,
      patientId: null,
    })

  const { user } = useUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress

  // Fetch doctor ID based on email
  useEffect(() => {
    fetchDoctors().then((doctors) => {
      const currentDoctor = doctors.find((doctor) => doctor.email === userEmail)
      if (currentDoctor) {
        setSelectedDoctor(currentDoctor.id)
      }
    })
  }, [userEmail])

  useEffect(() => {
    // Format the date as YYYY-MM-DD for the API

    const dateObject = new Date(date)
    dateObject.setDate(dateObject.getDate() + 1)
    const newFormattedDate = dateObject.toISOString().split("T")[0]

    setFormattedDate(newFormattedDate)
  }, [date])

  // Fetch appointments for the selected doctor
  const {
    data: allAppointments,
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ["appointments", selectedDoctor], // Query key depends on doctor ID
    queryFn: () => fetchAppointmentsByDoctor(selectedDoctor),
    enabled: !!selectedDoctor, // Enable only when doctor ID is known
  })

  // Fetch all requests to correlate with appointments
  const {
    data: allRequests, // Ensure allRequests is available in this scope
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: () => fetchRequests(),
    enabled: !!allAppointments, // Fetch requests only after appointments are loaded
  })

  // Combine refetching
  const refetchAll = () => {
    refetchAppointments()
    refetchRequests()
  }

  // Filter and format appointments for the selected date, considering request status
  const [formattedAppointments, setFormattedAppointments] = useState<CalendarAppointment[]>([])

  useEffect(() => {
    if (!allAppointments || !allRequests || !formattedDate) {
      setFormattedAppointments([])
      return
    }

    const dailyAppointments = allAppointments.filter((appointment) => {
      // Check if date_from exists and is valid (using the correct field name from backend)
      if (!appointment.date_from) {
        console.error("Invalid appointment data - missing date_from:", appointment)
        return false
      }

      try {
        // Convert both dates to their local date strings to avoid timezone issues
        const appointmentDate = new Date(appointment.date_from)
        const selectedDate = new Date(formattedDate)

        return (
          appointmentDate.getFullYear() === selectedDate.getFullYear() &&
          appointmentDate.getMonth() === selectedDate.getMonth() &&
          appointmentDate.getDate() === selectedDate.getDate()
        )
      } catch (error) {
        console.error("Error parsing date:", appointment.date_from, error)
        return false
      }
    })

    const processedAppointments = dailyAppointments.map((appointment): CalendarAppointment => {
      let timeString = "Neplatný čas"
      try {
        const startTime = new Date(appointment.date_from)
        if (!isNaN(startTime.getTime())) {
          timeString = startTime.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
        }
      } catch (error) {
        console.error("Error formatting time:", error)
      }

      // Find the relevant request for this appointment
      // Assuming one primary request per appointment slot for simplicity here.
      // Adjust logic if multiple requests per slot are possible and need specific handling.
      const relevantRequest = allRequests.find(
        (req) =>
          req.appointment_id === appointment.id &&
          req.state !== "declined" &&
          req.state !== "cancelled"
      )

      let status: CalendarAppointment["status"] = "available"
      let requestId: number | null = null
      let requestState: string | undefined = undefined

      if (relevantRequest) {
        requestId = relevantRequest.id ?? null
        requestState = relevantRequest.state?.toLowerCase()
        if (requestState === "pending") {
          status = "pending"
        } else if (requestState === "approved") {
          status = "confirmed"
        }
        // Note: 'declined' requests are filtered out above, so the slot appears available.
        // Add other states if needed (e.g., completed)
      }

      return {
        id: appointment.id, // Keep appointment ID for potential future use
        time: timeString,
        reason: relevantRequest?.description || appointment.event_type || "Neuvedeno", // Show request description if available
        status: status,
        requestId: requestId,
        requestState: requestState, // Include for debugging or complex logic
      }
    })

    setFormattedAppointments(processedAppointments)
  }, [allAppointments, allRequests, formattedDate])

  // Handle appointment actions - NOW USES REQUEST ID
  const handleApproveAppointment = async (requestId: number | null) => {
    if (requestId === null) {
      toast.error("Chybí ID žádosti pro schválení.")
      return
    }
    try {
      await updateRequestStatus(requestId, "approved")
      toast.success("Žádost byla schválena")
      refetchAll() // Refetch both appointments and requests
    } catch (error) {
      toast.error("Nepodařilo se schválit žádost")
      console.error("Error approving request:", error)
    }
  }

  const handleRejectAppointment = async (requestId: number | null) => {
    if (requestId === null) {
      toast.error("Chybí ID žádosti pro odmítnutí.")
      return
    }
    try {
      await updateRequestStatus(requestId, "declined")
      toast.success("Žádost byla odmítnuta")
      refetchAll() // Refetch both appointments and requests
    } catch (error) {
      toast.error("Nepodařilo se odmítnout žádost")
      console.error("Error rejecting request:", error)
    }
  }

  // This function might need adjustment - cancelling an *approved* request?
  // Or should it delete the appointment? Clarify requirement.
  // Assuming it cancels the *request* for now.
  const handleCancelAppointment = async (requestId: number | null) => {
    if (requestId === null) {
      toast.error("Chybí ID žádosti pro zrušení.")
      return
    }
    try {
      // Using 'declined' or a dedicated 'cancelled' status depends on backend implementation
      await updateRequestStatus(requestId, "declined") // Or "cancelled"
      toast.success("Termín (žádost) byl zrušen")
      refetchAll() // Refetch both appointments and requests
    } catch (error) {
      toast.error("Nepodařilo se zrušit termín (žádost)")
      console.error("Error cancelling request:", error)
    }
  }

  if (isLoadingAppointments || isLoadingRequests) {
    // Check both loading states
    return <div className='flex justify-center p-8'>Načítání termínů a žádostí...</div>
  }

  // Function to open the details dialog
  const handleShowDetails = (appointment: CalendarAppointment) => {
    // Find the full request object to get the patient ID
    const fullRequest = allRequests?.find((req) => req.id === appointment.requestId)
    if (fullRequest) {
      setSelectedAppointmentDetails({
        appointmentId: appointment.id, // Use the appointment ID from the formatted data
        requestId: appointment.requestId,
        patientId: fullRequest.patient_id, // Get patient ID from the full request object
      })
      setIsDetailsOpen(true)
    } else {
      // Handle case where request data might not be loaded or found
      toast.error("Nepodařilo se načíst kompletní data žádosti pro zobrazení detailů.")
      console.error(
        "Could not find full request data for request ID:",
        appointment.requestId,
        "Available requests:",
        allRequests
      )
    }
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
          {/* Add other status badges if needed, e.g., Declined */}
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
                appointment.status === "confirmed" && "border-blue-200 bg-blue-50", // Adjusted style for confirmed
                appointment.status === "pending" && "border-yellow-200 bg-yellow-50" // Adjusted style for pending
                // Add styles for other statuses if needed
              )}
            >
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>{appointment.time}</CardTitle>
                <CardDescription>
                  {/* Update description based on actual status */}
                  {appointment.status === "available" && "Volný termín"}
                  {appointment.status === "pending" && "Čeká na schválení"}
                  {appointment.status === "confirmed" && "Potvrzený termín"}
                  {/* Add descriptions for other statuses */}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Show reason (request description) only if not available */}
                {appointment.status !== "available" && (
                  <p className='text-sm'>{appointment.reason}</p>
                )}
              </CardContent>
              <CardFooter>
                {/* Update button logic based on status and request ID */}
                {
                  appointment.status === "available" ? null : appointment.status === "pending" ? (
                    <div className='flex space-x-2'>
                      <Button
                        size='sm'
                        variant='default'
                        onClick={() => handleApproveAppointment(appointment.requestId)} // Pass request ID
                      >
                        Schválit
                      </Button>
                      {/* Reject button should always be available for pending if user is doctor */}
                      {userRole === "doctor" && (
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleRejectAppointment(appointment.requestId)} // Pass request ID
                        >
                          Odmítnout
                        </Button>
                      )}
                    </div>
                  ) : appointment.status === "confirmed" ? ( // Actions for confirmed appointments
                    <div className='flex space-x-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleShowDetails(appointment)} // Call handleShowDetails
                      >
                        Zobrazit detaily
                      </Button>
                      {/* Allow doctor to cancel a confirmed appointment (request) */}
                      {userRole === "doctor" && (
                        <Button
                          size='sm'
                          variant='outline'
                          className='text-red-500 hover:text-red-700'
                          onClick={() => handleCancelAppointment(appointment.requestId)} // Pass request ID
                        >
                          Zrušit
                        </Button>
                      )}
                    </div>
                  ) : null /* Add rendering for other statuses if necessary */
                }
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Render the details dialog */}
      <AppointmentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        appointmentId={selectedAppointmentDetails.appointmentId}
        requestId={selectedAppointmentDetails.requestId}
        patientId={selectedAppointmentDetails.patientId}
      />
    </div>
  )
}
