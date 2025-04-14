import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { fetchAppointment, fetchRequest, fetchPatient } from "@/utils/api"
import { format } from "date-fns"
import { cs } from "date-fns/locale" // Import Czech locale if needed

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: number | null
  requestId: number | null
  patientId: number | null
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointmentId,
  requestId,
  patientId,
}: AppointmentDetailsDialogProps) {
  // Fetch Appointment Data
  const {
    data: appointment,
    isLoading: isLoadingAppointment,
    error: errorAppointment,
  } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => (appointmentId ? fetchAppointment(appointmentId) : Promise.resolve(null)),
    enabled: !!appointmentId && open, // Fetch only when dialog is open and ID is valid
  })

  // Fetch Request Data
  const {
    data: request,
    isLoading: isLoadingRequest,
    error: errorRequest,
  } = useQuery({
    queryKey: ["request", requestId],
    queryFn: () => (requestId ? fetchRequest(requestId) : Promise.resolve(null)),
    enabled: !!requestId && open,
  })

  // Fetch Patient Data
  const {
    data: patient,
    isLoading: isLoadingPatient,
    error: errorPatient,
  } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => (patientId ? fetchPatient(patientId) : Promise.resolve(null)),
    enabled: !!patientId && open,
  })

  const isLoading = isLoadingAppointment || isLoadingRequest || isLoadingPatient
  const hasError = errorAppointment || errorRequest || errorPatient

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      // Format date and time, adjust format as needed
      return format(new Date(dateString), "PPPpp", { locale: cs })
    } catch {
      return "Neplatné datum"
    }
  }

  const formatSimpleDate = (dateString: string | undefined | Date) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "P", { locale: cs }) // Just the date part
    } catch {
      return "Neplatné datum"
    }
  }

  console.log(patient)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Detail termínu</DialogTitle>
          <DialogDescription>Podrobné informace o termínu, žádosti a pacientovi.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {isLoading && <p>Načítání dat...</p>}
          {hasError && <p className='text-red-500'>Chyba při načítání dat.</p>}

          {!isLoading && !hasError && (
            <>
              {/* Appointment Details */}
              <h3 className='font-semibold text-lg mb-2 border-b pb-1'>Termín</h3>
              <div className='grid grid-cols-3 items-center gap-x-4 gap-y-2'>
                <Label className='text-right font-medium'>Typ:</Label>
                <span className='col-span-2'>{appointment?.event_type || "N/A"}</span>

                <Label className='text-right font-medium'>Od:</Label>
                <span className='col-span-2'>{formatDate(appointment?.date_from)}</span>

                <Label className='text-right font-medium'>Do:</Label>
                <span className='col-span-2'>{formatDate(appointment?.date_to)}</span>

                <Label className='text-right font-medium'>Povinná registrace:</Label>
                <span className='col-span-2'>
                  {appointment?.registration_mandatory ? "Ano" : "Ne"}
                </span>
              </div>

              {/* Request Details */}
              {request && (
                <>
                  <h3 className='font-semibold text-lg mt-4 mb-2 border-b pb-1'>Žádost</h3>
                  <div className='grid grid-cols-3 items-center gap-x-4 gap-y-2'>
                    <Label className='text-right font-medium'>Stav:</Label>
                    <span className='col-span-2 capitalize'>{request.state || "N/A"}</span>

                    <Label className='text-right font-medium'>Vytvořeno:</Label>
                    <span className='col-span-2'>{formatDate(request.created_at)}</span>

                    <Label className='text-right font-medium'>Popis:</Label>
                    <span className='col-span-2'>{request.description || "Neuveden"}</span>
                  </div>
                </>
              )}

              {/* Patient Details */}
              {patient && (
                <>
                  <h3 className='font-semibold text-lg mt-4 mb-2 border-b pb-1'>Pacient</h3>
                  <div className='grid grid-cols-3 items-center gap-x-4 gap-y-2'>
                    <Label className='text-right font-medium'>Jméno:</Label>
                    <span className='col-span-2'>
                      {patient.name} {patient.surname}
                    </span>

                    <Label className='text-right font-medium'>Email:</Label>
                    <span className='col-span-2'>{patient.email || "N/A"}</span>

                    <Label className='text-right font-medium'>Telefon:</Label>
                    <span className='col-span-2'>{patient.phone_number || "N/A"}</span>

                    <Label className='text-right font-medium'>Datum narození:</Label>
                    <span className='col-span-2'>{formatSimpleDate(patient.date_of_birth)}</span>

                    <Label className='text-right font-medium'>Pohlaví:</Label>
                    <span className='col-span-2'>{patient.sex || "N/A"}</span>

                    <Label className='text-right font-medium'>Adresa:</Label>
                    <span className='col-span-2'>{patient.address || "N/A"}</span>

                    <Label className='text-right font-medium'>Rodné číslo:</Label>
                    <span className='col-span-2'>{patient.personal_number || "N/A"}</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Zavřít
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
