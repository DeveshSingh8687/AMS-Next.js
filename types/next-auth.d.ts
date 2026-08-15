import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    employeeId?: string;
    department?: string;
    designation?: string;
    role?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      employeeId?: string;
      department?: string;
      designation?: string;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      employeeId?: string;
      department?: string;
      designation?: string;
      role?: string;
    };
  }
}