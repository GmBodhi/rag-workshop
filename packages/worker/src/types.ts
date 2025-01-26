export interface RegistrationData {
  fullName: string;
  email: string;
  semester: string;
  branch: string;
  college: string;
  phone_number: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface Env {
    DB: D1Database;
}
