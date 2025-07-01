import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

// Backend candidate structure (what API returns)
export interface BackendCandidate {
  id: number;
  name: string;
  role: string;
  appliedRole: string;
  department: string;
  employmentType: string;
  workType: string;
  appliedDate: string;
  attachment?: {
    base64: string;
    fileName: string;
    fileType: string;
  };
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
  jobId: number;
}

// Frontend candidate structure (for forms and display)
export interface Candidate {
  id?: number;
  name: string;
  role: string;
  appliedRole: string;
  department: string;
  employmentType: string;
  workType: string;
  appliedDate: string;
  attachments: string; // For display purposes
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
  jobId?: number;
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
  jobId: number;
}

export interface ApiError {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "https://e444-2a09-bac1-3680-120-00-1c5-106.ngrok-free.app";
  
  private apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiaGFza2FyIiwiaWF0IjoxNzQ5ODAzMzg4LCJleHAiOjE3NDk4MzkzODh9.vs518QlQXCvHB-YUhauw9Pzbi_cg14F8z5j9SIsSINc';
  
  private httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${this.apiKey}`
    }
  };

  constructor(private http: HttpClient) { }

  // Transform backend candidate to frontend candidate
  private transformCandidate(backendCandidate: BackendCandidate): Candidate {
    return {
      id: backendCandidate.id,
      name: backendCandidate.name,
      role: backendCandidate.role,
      appliedRole: backendCandidate.appliedRole,
      department: backendCandidate.department,
      employmentType: backendCandidate.employmentType,
      workType: backendCandidate.workType,
      appliedDate: backendCandidate.appliedDate,
      attachments: backendCandidate.attachment?.fileName || 'No attachment',
      status: backendCandidate.status,
      score: backendCandidate.score,
      email: backendCandidate.email,
      phone: backendCandidate.phone,
      position: backendCandidate.position,
      experience: backendCandidate.experience,
      jobId: backendCandidate.jobId
    };
  }

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

  deleteJob(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/api/jobs/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getJobById(id: number): Observable<Job> {
    const headers = this.getAuthHeaders();
    return this.http.get<Job>(`${this.baseUrl}/api/jobs/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Candidate methods - Updated to transform data
  createCandidate(candidateData: FormData | CreateCandidateRequest) {
    if (candidateData instanceof FormData) {
      const headers = new HttpHeaders({
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${this.apiKey}`
      });
      
      return this.http.post<BackendCandidate>(`${this.baseUrl}/api/candidates`, candidateData, { headers })
        .pipe(
          map(candidate => this.transformCandidate(candidate)),
          catchError(this.handleError)
        );
    } else {
      return this.http.post<BackendCandidate>(`${this.baseUrl}/api/candidates`, candidateData, this.httpOptions)
        .pipe(
          map(candidate => this.transformCandidate(candidate)),
          catchError(this.handleError)
        );
    }
  }

  getCandidates(): Observable<Candidate[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<BackendCandidate[]>(`${this.baseUrl}/api/candidates`, { headers })
      .pipe(
        map(candidates => candidates.map(candidate => this.transformCandidate(candidate))),
        catchError(this.handleError)
      );
  }

  getCandidateById(id: number): Observable<Candidate> {
    const headers = this.getAuthHeaders();
    return this.http.get<BackendCandidate>(`${this.baseUrl}/api/candidates/${id}`, { headers })
      .pipe(
        map(candidate => this.transformCandidate(candidate)),
        catchError(this.handleError)
      );
  }

  updateCandidate(id: number, candidateData: CreateCandidateRequest): Observable<Candidate> {
    const headers = this.getAuthHeaders();
    return this.http.put<BackendCandidate>(`${this.baseUrl}/api/candidates/${id}`, candidateData, { headers })
      .pipe(
        map(candidate => this.transformCandidate(candidate)),
        catchError(this.handleError)
      );
  }

  deleteCandidate(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/api/candidates/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${this.apiKey}`
    });

    if (token) {
      headers = headers.set('X-User-Token', token);
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

  static getFallbackJobs(): Job[] {
    return [
      {
        id: 1,
        title: 'Software Engineer',
        role: 'Tech Corp',
        location: 'Bangalore, India',
        description: 'Develop and maintain web applications using Angular and Spring Boot.',
        isActive: true,
        applicants: 120,
        salaryMin: 12000,
        salaryMax: 30000,
        type: 'Full-time',
        level: 'Mid-level'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        role: 'Web Solutions',
        location: 'Mumbai, India',
        description: 'Create responsive user interfaces using modern web technologies.',
        isActive: true,
        applicants: 85,
        salaryMin: 8000,
        salaryMax: 25000,
        type: 'Full-time',
        level: 'Entry-level'
      }
    ];
  }

  static getFallbackCandidates(): Candidate[] {
    return [
      {
        id: 1,
        name: 'Sophia Turner',
        role: 'Legal Advisor',
        appliedRole: 'Legal Advisor',
        department: 'Legal',
        employmentType: 'Full-time',
        workType: 'Hybrid',
        appliedDate: '2030-10-01',
        attachments: 'Resume, Cover Letter',
        status: 'Interview',
        score: 50,
        email: 'sophia@example.com',
        phone: '1234567890',
        position: 'Legal Advisor',
        experience: 5,
        jobId: 1
      },
      {
        id: 2,
        name: 'John Smith',
        role: 'Software Engineer',
        appliedRole: 'Software Engineer',
        department: 'Engineering',
        employmentType: 'Full-time',
        workType: 'Remote',
        appliedDate: '2030-10-02',
        attachments: 'Resume, Cover Letter',
        status: 'In-Review',
        score: 75,
        email: 'john@example.com',
        phone: '1234567891',
        position: 'Software Engineer',
        experience: 3,
        jobId: 2
      },
      {
        id: 3,
        name: 'Emily Johnson',
        role: 'Marketing Manager',
        appliedRole: 'Marketing Manager',
        department: 'Marketing',
        employmentType: 'Full-time',
        workType: 'Onsite',
        appliedDate: '2030-10-03',
        attachments: 'Resume, Cover Letter',
        status: 'Hired',
        score: 90,
        email: 'emily@example.com',
        phone: '1234567892',
        position: 'Marketing Manager',
        experience: 7,
        jobId: 1
      },
      {
        id: 4,
        name: 'Michael Brown',
        role: 'Data Analyst',
        appliedRole: 'Data Analyst',
        department: 'Analytics',
        employmentType: 'Contract',
        workType: 'Hybrid',
        appliedDate: '2030-10-04',
        attachments: 'Resume, Cover Letter',
        status: 'Rejected',
        score: 35,
        email: 'michael@example.com',
        phone: '1234567893',
        position: 'Data Analyst',
        experience: 2,
        jobId: 2
      }
    ];
  }
}