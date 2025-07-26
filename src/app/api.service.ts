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
}

export interface AssessmentTemplate {
  id: number;
  role: string;
  stepOrder: number;
  stepName: string;
  question: string | null;
  options: string | null;
  correctAnswer: string | null;
  type: string | null;
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
  appliedDateStr: string; // Backend uses appliedDateStr
  resumeUrl?: string; // Backend uses resumeUrl
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
  appliedDate: string; // Frontend uses appliedDate
  attachments: string; // For display purposes
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
  jobId?: number;
}

// Request structure for creating/updating candidates (what API expects)
export interface CreateCandidateRequest {
  name: string;
  role: string;
  appliedRole: string;
  department: string;
  employmentType: string;
  workType: string;
  appliedDateStr: string; // Backend expects appliedDateStr
  resumeUrl?: string; // Backend expects resumeUrl
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
  jobId: number;
}

// New interfaces for assessment steps
export interface CandidateStep {
  id: number;
  candidateId: number;
  assessmentId: number | null;
  stepOrder: number | null;
  stepName: string;
  status: string;
  completed: boolean;
}

export interface CandidateAssessment {
  candidateId: number;
  steps: CandidateStep[];
}

export interface Assessment {
  id: number;
  jobId: number;
  stepOrder: number;
  stepName: string;
  mode: string;
  passingCriteria: string;
}

export interface ApiError {
  error: string;
}

export interface Review {
  id?: number;
  stepId: number;
  reviewer: string;
  feedback: string;
  score: number;
  createdAt?: string;
}

export interface CreateReviewRequest {
  reviewer: string;
  feedback: string;
  score: number;
}

export interface AssessmentStepPayload {
  jobId: number;
  stepOrder: number;
  stepName: string;
  mode: string;
  passingCriteria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://10.232.187.158:8080";

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
      appliedDate: backendCandidate.appliedDateStr, // Map appliedDateStr to appliedDate
      attachments: backendCandidate.resumeUrl || backendCandidate.attachment?.fileName || 'No attachment',
      status: backendCandidate.status,
      score: backendCandidate.score,
      email: backendCandidate.email,
      phone: backendCandidate.phone,
      position: backendCandidate.position,
      experience: backendCandidate.experience,
      jobId: backendCandidate.jobId
    };
  }

  // Transform frontend candidate to backend request format
  private transformCandidateForAPI(candidate: Candidate): CreateCandidateRequest {
    return {
      name: candidate.name,
      role: candidate.role,
      appliedRole: candidate.appliedRole,
      department: candidate.department,
      employmentType: candidate.employmentType,
      workType: candidate.workType,
      appliedDateStr: candidate.appliedDate, // Map appliedDate to appliedDateStr
      resumeUrl: candidate.attachments !== 'No attachment' ? candidate.attachments : undefined,
      status: candidate.status,
      score: Number(candidate.score),
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      experience: Number(candidate.experience),
      jobId: candidate.jobId || 1
    };
  }
  getAssessmentTemplates(): Observable<AssessmentTemplate[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<AssessmentTemplate[]>(`${this.baseUrl}/api/assessment-templates`, { headers })
      .pipe(catchError(this.handleError));
  }

  getAssessmentTemplatesByRole(role: string): Observable<AssessmentTemplate[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<AssessmentTemplate[]>(`${this.baseUrl}/api/assessment-templates/role/${role}`, { headers })
    .pipe(catchError(this.handleError));
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

  // Candidate methods - Updated to handle both FormData and JSON
  createCandidate(candidateData: FormData | Candidate): Observable<Candidate> {
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
      const requestData = this.transformCandidateForAPI(candidateData);
      return this.http.post<BackendCandidate>(`${this.baseUrl}/api/candidates`, requestData, this.httpOptions)
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

  updateCandidate(id: number, candidateData: FormData | Candidate): Observable<Candidate> {
    if (candidateData instanceof FormData) {
      const headers = new HttpHeaders({
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${this.apiKey}`
      });

      return this.http.put<BackendCandidate>(`${this.baseUrl}/api/candidates/${id}`, candidateData, { headers })
        .pipe(
          map(candidate => this.transformCandidate(candidate)),
          catchError(this.handleError)
        );
    } else {
      const requestData = this.transformCandidateForAPI(candidateData);
      const headers = this.getAuthHeaders();
      return this.http.put<BackendCandidate>(`${this.baseUrl}/api/candidates/${id}`, requestData, { headers })
        .pipe(
          map(candidate => this.transformCandidate(candidate)),
          catchError(this.handleError)
        );
    }
  }

  deleteCandidate(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/api/candidates/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // NEW: Assessment/Steps methods
  getCandidateSteps(candidateId: number): Observable<CandidateStep[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<CandidateStep[]>(`${this.baseUrl}/api/candidate-steps/by-candidate/${candidateId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getCandidateAssessment(candidateId: number): Observable<CandidateAssessment> {
    return this.getCandidateSteps(candidateId).pipe(
      map(steps => ({
        candidateId: candidateId,
        steps: steps
      }))
    );
  }

  createAssessment(steps: AssessmentStepPayload[]): Observable<any> {
    const headers = this.getAuthHeaders();
    // Use /bulk endpoint for array payload
    return this.http.post<any>(`${this.baseUrl}/api/assessments/bulk`, steps, { headers })
      .pipe(catchError(this.handleError));
  }

  getAssessments(): Observable<Assessment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Assessment[]>(`${this.baseUrl}/api/assessments`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Review methods
createReview(stepId: number, reviewData: CreateReviewRequest): Observable<Review> {
  const headers = this.getAuthHeaders();
  return this.http.post<Review>(`${this.baseUrl}/reviews/step/${stepId}`, reviewData, { headers })
    .pipe(catchError(this.handleError));
}

  // Helper method to get step status summary
  getStepStatusSummary(steps: CandidateStep[]): { completed: number; total: number; currentStep: string | null } {
    const completedSteps = steps.filter(step => step.completed).length;
    const totalSteps = steps.length;
    const currentStep = steps.find(step => !step.completed && step.status !== 'COMPLETED')?.stepName || null;

    return {
      completed: completedSteps,
      total: totalSteps,
      currentStep: currentStep
    };
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
        role: 'Backend Developer',
        location: 'Bangalore',
        description: 'Build scalable APIs.',
        isActive: true,
        salaryMin: 1000000,
        salaryMax: 2000000,
        type: 'Full-time',
        level: 'Mid'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        role: 'Frontend Developer',
        location: 'Mumbai',
        description: 'Create responsive user interfaces.',
        isActive: true,
        salaryMin: 800000,
        salaryMax: 1500000,
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

  // NEW: Fallback assessment steps for testing
  static getFallbackCandidateSteps(candidateId: number): CandidateStep[] {
    const stepTemplates = [
      { stepName: 'Application Review', status: 'COMPLETED', completed: true },
      { stepName: 'Resume Screening', status: 'COMPLETED', completed: true },
      { stepName: 'Technical Interview', status: 'PENDING', completed: false },
      { stepName: 'HR Interview', status: 'PENDING', completed: false },
      { stepName: 'Final Decision', status: 'PENDING', completed: false }
    ];

    return stepTemplates.map((template, index) => ({
      id: candidateId * 10 + index + 1,
      candidateId: candidateId,
      assessmentId: null,
      stepOrder: index + 1,
      stepName: template.stepName,
      status: template.status,
      completed: template.completed
    }));
  }

  static getFallbackAssessments(): Assessment[] {
    return [
      {
        id: 1,
        jobId: 1,
        stepOrder: 1,
        stepName: 'Technical Round',
        mode: 'Video Conferencing',
        passingCriteria: 'Pass'
      },
      {
        id: 2,
        jobId: 1,
        stepOrder: 2,
        stepName: 'Managerial Round',
        mode: 'In-Person',
        passingCriteria: 'Pass'
      },
      {
        id: 3,
        jobId: 2,
        stepOrder: 1,
        stepName: 'HR Round',
        mode: 'Phone',
        passingCriteria: 'Qualified'
      },
      {
        id: 4,
        jobId: 3,
        stepOrder: 1,
        stepName: 'Technical Round',
        mode: 'Video Conferencing',
        passingCriteria: 'Pass'
      },
      {
        id:5,
        jobId: 3,
        stepOrder: 2,
        stepName: 'Managerial Round',
        mode: 'In-Person',
        passingCriteria: 'Pass'
      },
      {
        id: 6,
        jobId: 3,
        stepOrder: 3,
        stepName: 'HR Round',
        mode: 'Phone',
        passingCriteria: 'Qualified'
      }, 
      {
        id: 7,
        jobId: 4,
        stepOrder: 1,
        stepName: 'Technical Round',
        mode: 'Video Conferencing',
        passingCriteria: 'Pass'
      },
      {
        id: 8,
        jobId: 4,
        stepOrder: 2,
        stepName: 'Managerial Round',
        mode: 'In-Person',
        passingCriteria: 'Pass'
      },
      {
        id:9,
        jobId: 4,
        stepOrder: 1,
        stepName: 'HR Round',
        mode: 'Phone',
        passingCriteria: 'Qualified'
      }
    ];
  }
}