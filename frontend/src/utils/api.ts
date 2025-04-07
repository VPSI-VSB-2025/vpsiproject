import axios, { AxiosError } from "axios";
import { Doctor } from "@/types/doctor";
import { Nurse } from "@/types/nurse";
import { Appointment } from "@/types/appointment";
import { Specialization } from "@/types/specialization";
import { Patient } from "@/types/patient";
import { MedicalRecord } from "@/types/medical_record";
import { Request } from "@/types/request";
import { RequestType } from "@/types/request_type";

const API_BASE_URL = "http://localhost:8000";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Doctor endpoints
export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await api.get("/doctors/");
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

export const fetchDoctor = async (doctorId: number): Promise<Doctor | null> => {
  try {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor ${doctorId}:`, error);
    return null;
  }
};

export const createDoctor = async (doctor: Omit<Doctor, "id">): Promise<Doctor | null> => {
  try {
    const response = await api.post("/doctors/", doctor);
    return response.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    return null;
  }
};

// Nurse endpoints
export const fetchNurses = async (): Promise<Nurse[]> => {
  try {
    const response = await api.get("/nurses/");
    return response.data;
  } catch (error) {
    console.error("Error fetching nurses:", error);
    return [];
  }
};

export const fetchNurse = async (nurseId: number): Promise<Nurse | null> => {
  try {
    const response = await api.get(`/nurses/${nurseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching nurse ${nurseId}:`, error);
    return null;
  }
};

export const createNurse = async (nurse: Omit<Nurse, "id">): Promise<Nurse | null> => {
  try {
    const response = await api.post("/nurses/", nurse);
    return response.data;
  } catch (error) {
    console.error("Error creating nurse:", error);
    return null;
  }
};

// Appointment endpoints
export const fetchAppointments = async (options?: { skip?: number; limit?: number }): Promise<Appointment[]> => {
  const { skip = 0, limit = 100 } = options || {};
  try {
    const response = await api.get(`/appointments/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

export const fetchAppointmentsByDoctor = async (doctorId: number, options?: { skip?: number; limit?: number }): Promise<Appointment[]> => {
  try {
    const response = await api.get(`/appointments/`);

    const filteredAppointments = response.data.filter((appointment: Appointment) => {
      return appointment.doctor_id === doctorId;
    })

    return filteredAppointments;
  } catch (error) {
    console.error(`Error fetching appointments for doctor ${doctorId}:`, error);
    return [];
  }
}

export const fetchAppointment = async (appointmentId: number): Promise<Appointment | null> => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment ${appointmentId}:`, error);
    return null;
  }
};

export const createAppointment = async (appointment: Omit<Appointment, "id" | "created_at">): Promise<Appointment | null> => {
  try {
    const response = await api.post("/appointments/", appointment);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    return null;
  }
};


// Request endpoints
export const fetchRequests = async (options?: { skip?: number; limit?: number }): Promise<Request[]> => {
  const { skip = 0, limit = 100 } = options || {};
  try {
    const response = await api.get(`/requests/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
};

export const fetchRequest = async (requestId: number): Promise<Request | null> => {
  try {
    const response = await api.get(`/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching request ${requestId}:`, error);
    return null;
  }
};

export const createRequest = async (request: {
  state: string;
  description: string;
  patient_id: number;
  doctor_id: number;
  appointment_id: number;
  request_type_id: number;
}): Promise<Request | null> => {
  try {
    const response = await api.post("/requests/", request);
    return response.data;
  } catch (error) {
    console.error("Error creating request:", error);
    return null;
  }
};

export const updateRequestStatus = async (requestId: number, status: string): Promise<Request | null> => {
  try {
    const request = await fetchRequest(requestId);
    if (!request) return null;
    
    const updatedRequest = { ...request, status };
    const response = await api.put(`/requests/${requestId}`, updatedRequest);
    return response.data;
  } catch (error) {
    console.error(`Error updating request ${requestId} status:`, error);
    return null;
  }
};

// Request types endpoints
export const fetchRequestTypes = async (): Promise<RequestType[]> => {
  try {
    const response = await api.get("/request_types/");
    return response.data;
  } catch (error) {
    console.error("Error fetching request types:", error);
    return [];
  }
};

export const createRequestType = async (
  name: string,
  description: string,
  length: number
): Promise<RequestType | null> => {
  try {
    const response = await api.post("/request_types/", { name, description, length });
    return response.data;
  } catch (error) {
    console.error("Error creating request type:", error);
    return null;
  }
}

// Patient endpoints
export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    const response = await api.get(`/patients/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

export const fetchPatient = async (patientId: number): Promise<Patient | null> => {
  try {
    const response = await api.get(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient ${patientId}:`, error);
    return null;
  }
};

export const createPatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    const response = await api.post("/patients/", patient);
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    return null;
  }
};

// Medical record endpoints
export const fetchMedicalRecords = async (patientId: number): Promise<MedicalRecord[]> => {
  try {
    const response = await api.get(`/medical_records/?patient_id=${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medical records for patient ${patientId}:`, error);
    return [];
  }
};


// Specialization endpoints
export const fetchSpecializations = async (): Promise<Specialization[]> => {
  try {
    const response = await api.get("/specializations");
    return response.data;
  } catch (error) {
    console.error("Error fetching specializations:", error);
    return [];
  }
};



export const createSpecialization = async (name: string): Promise<Specialization | null> => {
  try {
    const response = await api.post("/specializations", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating specialization:", error);
    return null;
  }
};

// List all available terms endpoint
export const fetchAvailableTerms = async (doctorId?: number, date?: string): Promise<any[]> => {
  try {
    let url = "/list_all_terms/";
    const params = [];
    
    if (doctorId) params.push(`doctor_id=${doctorId}`);
    if (date) params.push(`date=${date}`);
    
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching available terms:", error);
    return [];
  }
};