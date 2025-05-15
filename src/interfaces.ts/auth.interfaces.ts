// src/interfaces/auth.interfaces.ts (create this file)
export interface JwtPayload {
    id?: number;
    email?: string;
    roleId?: number;
    token?: string;
    username?: string;
  }
  
  export interface AuthResponse {
    user: {
      id: number;
      email: string;
      token: string;
      username: string;
      roleId?: number;  // Optional based on your needs
    };
  }