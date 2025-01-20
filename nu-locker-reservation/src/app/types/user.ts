export interface User {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;

}export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface SignUpData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}