export interface Referral {
  id: number
  doctor_id: number
  patient_id: number
  nurse_id: number
  referral_type_id: number
  status: string
  note: string
  created_at: string
}
