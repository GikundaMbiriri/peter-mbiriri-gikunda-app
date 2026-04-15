import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, User, UserFormData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(search?: string, page = 1, pageSize = 10) {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    params = params.set('page', String(page));
    params = params.set('pageSize', String(pageSize));
    return this.http.get<ApiResponse<User[]>>('/api/users', { params });
  }

  getUserById(id: string) {
    return this.http.get<ApiResponse<User>>(`/api/users/${id}`);
  }

  createUser(data: UserFormData) {
    return this.http.post<ApiResponse<User>>('/api/users', data);
  }

  updateUser(id: string, data: UserFormData) {
    return this.http.put<ApiResponse<User>>(`/api/users/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete<ApiResponse<User>>(`/api/users/${id}`);
  }
}
