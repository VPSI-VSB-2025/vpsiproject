export interface Appointment {
  id: number
  doctor_id: number
  event_type: string
  start_date_time: string
  end_date_time: string
  status: string
  mandatory_registration: boolean
  created_at: string
}
