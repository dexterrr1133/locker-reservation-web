export interface User {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;

}
  export interface AuthResponse {
    success: boolean;
    error?: string;
    user?: User;
  }