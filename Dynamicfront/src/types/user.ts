export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  status: "pending" | "approved";
  batch?: string;
  profilePicture?: string;
  gymName?: string;
  address?: string;
  contactPhone?: string;
  phone?: string;
  gender?: string;
  fatherName?: string;
  dob?: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessGoals?: string[];
  entryAmount?: number;
  bloodGroup?: string;
  emergencyContact?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  batch: string;
  gender: string;
  fatherName: string;
  dob: string;
  age: number;
  height: number;
  weight: number;
  fitnessGoals: string[];
  entryAmount: number;
  bloodGroup: string;
  emergencyContact: string;
  address: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}
