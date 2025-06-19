import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: any;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface Job {
  id?: number;
  title: string;
  role: string;
  location: string;
  description: string;
  isActive: boolean;
  applicants: number;
  salaryMin: number;
  salaryMax: number;
  type: string;
  level: string;
}

export interface CreateJobRequest {
  title: string;
  role: string;
  location: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  level: string;
  isActive: boolean;
  applicants: number;
}

export interface Candidate {
  id?: number;
  name: string;
  role: string;
  appliedRole: string;
  department: string;
  employmentType: string;
  workType: string;
  appliedDate: string;
  attachments: string;
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
}

export interface CreateCandidateRequest {
  name: string;
  role: string;
  appliedRole: string;
  department: string;
  employmentType: string;
  workType: string;
  appliedDate: string;
  attachments: string;
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
}

export interface ApiError {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "https://c540-2a09-bac5-3c94-1aa0-00-2a7-d2.ngrok-free.app";
  
  // Replace 'YOUR_API_KEY_HERE' with your actual authorization key
  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiaGFza2FyIiwiaWF0IjoxNzQ5ODAzMzg4LCJleHAiOjE3NDk4MzkzODh9.vs518QlQXCvHB-YUhauw9Pzbi_cg14F8z5j9SIsSINc';
  
  private httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${this.apiKey}` // or just this.apiKey depending on your API requirements
    }
  };

  constructor(private http: HttpClient) { }

  // Auth methods
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, credentials, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users`, userData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Job methods
  createJob(jobData: CreateJobRequest): Observable<Job> {
    const headers = this.getAuthHeaders();
    return this.http.post<Job>(`${this.baseUrl}/api/jobs`, jobData, { headers })
      .pipe(catchError(this.handleError));
  }

  // NEW: Get all jobs method
  getJobs(): Observable<Job[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Job[]>(`${this.baseUrl}/api/jobs`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateJob(id: number, jobData: CreateJobRequest): Observable<Job> {
  const headers = this.getAuthHeaders();
  return this.http.put<Job>(`${this.baseUrl}/api/jobs/${id}`, jobData, { headers })
    .pipe(catchError(this.handleError));
}

// DELETE Job method
deleteJob(id: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.baseUrl}/api/jobs/${id}`, { headers })
    .pipe(catchError(this.handleError));
}

// GET single job by ID (helpful for edit form)
getJobById(id: number): Observable<Job> {
  const headers = this.getAuthHeaders();
  return this.http.get<Job>(`${this.baseUrl}/api/jobs/${id}`, { headers })
    .pipe(catchError(this.handleError));
}

  // Candidate methods
  createCandidate(candidateData: CreateCandidateRequest): Observable<Candidate> {
    const headers = this.getAuthHeaders();
    return this.http.post<Candidate>(`${this.baseUrl}/api/candidates`, candidateData, { headers })
      .pipe(catchError(this.handleError));
  }

  getCandidates(): Observable<Candidate[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Candidate[]>(`${this.baseUrl}/api/candidates`, { headers })
      .pipe(catchError(this.handleError));
  }

  // NEW: Get single candidate by ID
  getCandidateById(id: number): Observable<Candidate> {
    const headers = this.getAuthHeaders();
    return this.http.get<Candidate>(`${this.baseUrl}/api/candidates/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // NEW: Update candidate
  updateCandidate(id: number, candidateData: CreateCandidateRequest): Observable<Candidate> {
    const headers = this.getAuthHeaders();
    return this.http.put<Candidate>(`${this.baseUrl}/api/candidates/${id}`, candidateData, { headers })
      .pipe(catchError(this.handleError));
  }

  // NEW: Delete candidate
  deleteCandidate(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/api/candidates/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Helper method to get auth headers (updated to include API key)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${this.apiKey}` // API key for jobs endpoint
    });

    // If user is logged in, you might want to include both API key and user token
    // This depends on your API requirements
    if (token) {
      headers = headers.set('X-User-Token', token); // or combine with Authorization header
    }

    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => errorMessage);
  }
}