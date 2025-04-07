export interface Appointment {
  id: number;
  doctor_id: number;
  event_type: string;
  date_from: string; 
  date_to: string; 
  registration_mandatory: boolean; 
  created_at: string;
  status?: string;
  doctor?: string;
  requests?: Request[];
  patient_name?: string; 
}
