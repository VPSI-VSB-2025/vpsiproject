import axios from "axios"

// --- Existing Interfaces ---
interface PatientLookupData {
  personal_number: string
  name: string
  surname: string
}

// Update Request interface if needed for selection
interface Request {
  id: number
  state: string
  created_at: string
  description?: string
  patient_id: number // Added for context in selection
  // Add other relevant fields from RequestOut
}

interface Appointment {
  id: number
  event_type: string
  date_from: string
  date_to: string
  // Add other relevant fields from AppointmentOut
}

// Update Test interface to include foreign keys if not present
interface Test {
  id: number
  test_date: string
  results: string
  state: string
  created_at: string
  test_type_id: number // Ensure this exists
  request_id: number // Ensure this exists
  // Add other relevant fields from TestOut
}

export interface HistoryData {
  requests: Request[]
  appointments: Appointment[]
  tests: Test[]
}

// --- New Interfaces ---
export interface TestType {
  id: number
  name: string
  description?: string
  // Add other fields if present in TestType model/schema
}

// Assuming a simplified Request structure for selection
export interface RequestSelectItem {
  id: number
  description?: string // Or other identifying info
  patient_id: number // Useful context
  patient_name: string
  // Add patient name/details if needed via backend join
}

export interface TestCreateData {
  test_date: string // ISO string format expected by backend?
  results: string
  state: string
  test_type_id: number
  request_id: number
}

// --- Existing API Client Setup ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://vpsiproject.onrender.com"
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// --- Existing Functions ---
/**
 * Fetches patient history from the backend.
 * @param lookupData - The patient lookup details.
 * @returns A promise that resolves with the patient's history data.
 */
export const fetchPatientHistory = async (lookupData: PatientLookupData): Promise<HistoryData> => {
  try {
    const response = await apiClient.post<HistoryData>("/history/patient", lookupData)
    return response.data
  } catch (error) {
    // Enhance error handling (e.g., check for axios error structure)
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error:", error.response.data)
      // Throw a more specific error message if available
      throw new Error(
        error.response.data.detail || `API request failed with status ${error.response.status}`
      )
    } else {
      console.error("Network or other error:", error)
      throw new Error("Failed to fetch history due to network or other error.")
    }
  }
}

// --- New API Functions ---

/**
 * Fetches all tests from the backend.
 * @returns A promise that resolves with the list of tests.
 */
export const fetchTests = async (): Promise<Test[]> => {
  try {
    const response = await apiClient.get<Test[]>("/tests")
    return response.data
  } catch (error) {
    // Add specific error handling like in fetchPatientHistory
    console.error("Failed to fetch tests:", error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.detail || `API request failed with status ${error.response.status}`
      )
    }
    throw new Error("Failed to fetch tests.")
  }
}

/**
 * Creates a new test result.
 * @param testData - The data for the new test.
 * @returns A promise that resolves with the created test data.
 */
export const createTest = async (testData: TestCreateData): Promise<Test> => {
  try {
    const response = await apiClient.post<Test>("/tests", testData)
    return response.data
  } catch (error) {
    // Add specific error handling
    console.error("Failed to create test:", error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.detail || `API request failed with status ${error.response.status}`
      )
    }
    throw new Error("Failed to create test.")
  }
}

/**
 * Fetches all test types from the backend.
 * @returns A promise that resolves with the list of test types.
 */
export const fetchTestTypes = async (): Promise<TestType[]> => {
  try {
    // Assuming you have a /test_types endpoint (create if not)
    const response = await apiClient.get<TestType[]>("/test-types")
    return response.data
  } catch (error) {
    console.error("Failed to fetch test types:", error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.detail || `API request failed with status ${error.response.status}`
      )
    }
    throw new Error("Failed to fetch test types.")
  }
}

/**
 * Fetches all requests (or relevant ones for selection) from the backend.
 * @returns A promise that resolves with the list of requests.
 */
export const fetchRequestsForSelection = async (): Promise<RequestSelectItem[]> => {
  try {
    // Assuming you have a /requests endpoint that returns suitable data
    // You might need a specific endpoint or query params for selection
    const response = await apiClient.get<RequestSelectItem[]>("/requests") // Adjust endpoint/params if needed
    return response.data
  } catch (error) {
    console.error("Failed to fetch requests:", error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.detail || `API request failed with status ${error.response.status}`
      )
    }
    throw new Error("Failed to fetch requests.")
  }
}

// Define the input type for creating a test type
export interface TestTypeCreateData {
  name: string
  description?: string | null // Match backend schema
}

// Function to create a new test type
export const createTestType = async (data: TestTypeCreateData): Promise<TestType> => {
  const response = await fetch(`${API_BASE_URL}/test-types/`, {
    // Use the correct endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header if needed
      // Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) // Catch cases where body isn't JSON
    // Use a more specific error message if available
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}
