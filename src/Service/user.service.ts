import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`).pipe(
      catchError(err => {
        this.toastr.error('User not found', 'Error');
        return throwError(() => err);
      })
    );
  }

  createUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}`, data).pipe(
      tap(() => this.toastr.success('User added successfully!', 'Success')),
      catchError(err => {
        this.toastr.error('Failed to add user', 'Error');
        return throwError(() => err);
      })
    );
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, data).pipe(
      tap(() => this.toastr.success('User updated successfully!', 'Success')),
      catchError(err => {
        this.toastr.error('Failed to update user', 'Error');
        return throwError(() => err);
      })
    );
  }
  patchUser(id: string, data: any): Observable<any> {
  return this.http.patch<any>(`${this.api}/${id}`, data).pipe(
    tap(() => this.toastr.success('User partially updated!', 'Success')),
    catchError(err => {
      this.toastr.error('Failed to patch user', 'Error');
      return throwError(() => err);
    })
  );
}


  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`).pipe(
      tap(() => this.toastr.success('User deleted successfully!', 'Success')),
      catchError(err => {
        this.toastr.error('Failed to delete user', 'Error');
        return throwError(() => err);
      })
    );
  }
}
