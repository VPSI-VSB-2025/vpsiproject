export interface Request {
  id: number;
  state: string; // Changed from status to match backend
  created_at: string;
  description?: string; // Changed from reason to match backend
  
  patient_id: number;
  doctor_id: number;
  nurse_id?: number;
  appointment_id?: number;
  request_type_id?: number;
  
  // Relationships (optional fields that might be populated by API)
  patient?: any;
  doctor?: any;
  nurse?: any;
  request_type?: any;
  appointments?: any;
  tests?: any[];
  
  // Legacy fields - keeping for backward compatibility
  status?: string; // Alias for state
  reason?: string; // Alias for description
  type_id?: number; // Alias for request_type_id
  type?: string; // Virtual property derived from request_type
}