export interface Request {
  state: string;
  description: string;
  patient_id: number;
  doctor_id: number;
  appointment_id: number;
  request_type_id: number;
}