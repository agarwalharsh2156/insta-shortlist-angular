import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateCandidateRequest, Candidate, Job } from '../../api.service';

@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.css'
})
export class CreateCandidateComponent implements OnInit {
  candidate: Candidate = {
    id: 0,
    name: '',
    role: '',
    appliedRole: '',
    department: '',
    employmentType: 'Full-time',
    workType: 'Onsite',
    appliedDate: '',
    attachments: '',
    status: 'Applied',
    score: 0,
    email: '',
    phone: '',
    position: '',
    experience: 0
  };

  selectedFile: File | null = null;
  selectedJobId: string = "";
  jobs: Job[] = [];
  loading = false;
  error: string | null = null;
  success = false;
  loadingJobs = false;
  
  // New properties to handle public application flow
  isPublicApplication = false;
  selectedJob: Job | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Set default applied date to today
    const today = new Date();
    this.candidate.appliedDate = today.toISOString().split('T')[0];

    // Check if jobId is present in the route (public application)
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('jobId');
      if (jobId) {
        this.isPublicApplication = true;
        this.selectedJobId = jobId;
        this.loadSpecificJob(Number(jobId));
      } else {
        this.isPublicApplication = false;
        this.loadJobs();
      }
    });
  }

  loadSpecificJob(jobId: number) {
    this.apiService.getJobById(jobId).subscribe({
      next: (job) => {
        this.selectedJob = job;
        // Auto-fill some fields based on the job
        this.candidate.appliedRole = job.title;
        this.candidate.role = job.role;
        // Note: Job interface doesn't have department, so we'll set a default or derive it
        this.candidate.department = this.getDepartmentFromRole(job.role);
        this.candidate.position = job.title;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.error = 'Job not found or unavailable';
      }
    });
  }

  loadJobs() {
    this.loadingJobs = true;
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs.filter(job => job.isActive);
        this.loadingJobs = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.jobs = ApiService.getFallbackJobs().filter(job => job.isActive);
        this.loadingJobs = false;
      }
    });
  }

  // Helper method to derive department from role (you can customize this logic)
  getDepartmentFromRole(role: string): string {
    const roleToDepartment: { [key: string]: string } = {
      'Backend Developer': 'Engineering',
      'Frontend Developer': 'Engineering',
      'Full Stack Developer': 'Engineering',
      'Software Engineer': 'Engineering',
      'Data Analyst': 'Analytics',
      'Data Scientist': 'Analytics',
      'Marketing Manager': 'Marketing',
      'Product Manager': 'Product',
      'HR Manager': 'Human Resources',
      'Sales Representative': 'Sales',
      'Legal Advisor': 'Legal',
      'Designer': 'Design'
    };
    
    return roleToDepartment[role] || 'General';
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(form: any) {
    if (form.valid && this.selectedFile && this.selectedJobId) {
      this.loading = true;
      this.error = null;
      this.success = false;

      const candidateData = {
        name: this.candidate.name,
        email: this.candidate.email,
        phone: this.candidate.phone,
        role: this.candidate.role,
        appliedRole: this.candidate.appliedRole,
        department: this.candidate.department,
        employmentType: this.candidate.employmentType,
        workType: this.candidate.workType,
        appliedDate: this.candidate.appliedDate,
        status: this.candidate.status,
        score: this.candidate.score,
        position: this.candidate.position,
        experience: this.candidate.experience,
        jobId: this.selectedJobId
      };

      const formData = new FormData();
      formData.append('candidate', JSON.stringify(candidateData));
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.apiService.createCandidate(formData).subscribe({
        next: (createdCandidate) => {
          console.log('Candidate created successfully:', createdCandidate);
          this.loading = false;
          this.success = true;
          
          // Different navigation based on application type
          setTimeout(() => {
            if (this.isPublicApplication) {
              // For public applications, show a thank you message or redirect to a thank you page
              alert('Thank you for your application! We will review it and get back to you soon.');
              // You can create a thank you page and redirect there instead
            } else {
              // For admin-created candidates, navigate to candidates page
              this.router.navigate(['/candidates']);
            }
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating candidate:', error);
          this.error = error;
          this.loading = false;
        }
      });
    } else {
      if (!this.selectedFile) {
        this.error = 'Please select a file (resume/cover letter)';
      } else if (!this.selectedJobId) {
        this.error = 'Please select a job position';
      }
    }
  }

  clearError() {
    this.error = null;
  }

  getSelectedJob(): Job | undefined {
    if (this.isPublicApplication) {
      return this.selectedJob || undefined;
    }
    return this.jobs.find(job => job.id === Number(this.selectedJobId));
  }

  onJobSelection() {
    if (this.selectedJobId && !this.isPublicApplication) {
      const selectedJob = this.getSelectedJob();
      if (selectedJob) {
        this.candidate.appliedRole = selectedJob.title;
        this.candidate.role = selectedJob.role;
        this.candidate.department = this.getDepartmentFromRole(selectedJob.role);
        this.candidate.position = selectedJob.title;
      }
    }
  }
}
