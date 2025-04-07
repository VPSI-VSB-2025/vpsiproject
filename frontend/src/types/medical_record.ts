export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
}