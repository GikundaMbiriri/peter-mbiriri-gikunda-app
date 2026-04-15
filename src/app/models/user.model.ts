export type UserRole = 'Admin' | 'Manager' | 'User';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface UserFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  totalActive?: number;
  totalInactive?: number;
  totalAdmins?: number;
  page?: number;
  pageSize?: number;
  message?: string;
}
