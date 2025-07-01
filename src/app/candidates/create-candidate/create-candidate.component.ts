import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateCandidateRequest, Candidate, Job } from '../../api.service';

@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
    status: 'Applied', // Changed to match backend expectation
    score: 0,
    email: '',
    phone: '',
    position: '',
    experience: 0
  };

  selectedFile: File | null = null;
  selectedJobId: number | null = null;
  jobs: Job[] = [];

  loading = false;
  error: string | null = null;
  success = false;
  loadingJobs = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadJobs();
    // Set default applied date to today
    const today = new Date();
    this.candidate.appliedDate = today.toISOString().split('T')[0];
  }

  loadJobs() {
    this.loadingJobs = true;
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs.filter(job => job.isActive); // Only show active jobs
        this.loadingJobs = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.jobs = ApiService.getFallbackJobs().filter(job => job.isActive);
        this.loadingJobs = false;
      }
    });
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

      // Create the candidate object that matches backend expectation
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
      // Add candidate data as JSON string
      formData.append('candidate', JSON.stringify(candidateData));
      // Add file with the correct field name
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.apiService.createCandidate(formData).subscribe({
        next: (createdCandidate) => {
          console.log('Candidate created successfully:', createdCandidate);
          this.loading = false;
          this.success = true;
          
          // Navigate to candidates page after short delay
          setTimeout(() => {
            this.router.navigate(['/candidates']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating candidate:', error);
          this.error = error;
          this.loading = false;
        }
      });
    } else {
      // Show validation errors
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

  // Helper method to get selected job details
  getSelectedJob(): Job | undefined {
    return this.jobs.find(job => job.id === this.selectedJobId);
  }

  // Auto-fill some fields when job is selected
  onJobSelection() {
    if (this.selectedJobId) {
      const selectedJob = this.getSelectedJob();
      if (selectedJob) {
        // Auto-fill applied role with job title
        this.candidate.appliedRole = selectedJob.title;
        // You can auto-fill other fields as needed
      }
    }
  }
}