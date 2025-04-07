export interface Appointment {
  id: number;
  doctor_id: number;
  event_type: string;
  date_from: string; // Changed from start_date_time to match backend
  date_to: string; // Changed from end_date_time to match backend
  registration_mandatory: boolean; // Changed from mandatory_registration to match backend
  created_at: string;
  
  // The status is not in the backend model but might be derived
  // I'll keep it for now since your UI depends on it
  status?: string;
  
  // Relationships (optional fields that are populated by API depending on includes)
  doctor?: any;
  requests?: any[];
  
  // Virtual properties that might be calculated or merged from relationships
  patient_name?: string; // Virtual property - not in backend model
}
