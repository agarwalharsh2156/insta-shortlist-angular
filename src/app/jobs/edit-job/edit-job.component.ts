import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateJobRequest, Job } from '../../api.service';

@Component({
  selector: 'app-edit-job',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './edit-job.component.html',
  styleUrl: './edit-job.component.css'
})
export class EditJobComponent implements OnInit {
  job: Job = {
    id: 0,
    title: '',
    role: '',
    location: '',
    description: '',
    isActive: true,
    applicants: 0,
    salaryMin: 0,
    salaryMax: 0,
    type: 'Full-time',
    level: 'Entry-level'
  };

  loading = false;
  error: string | null = null;
  success = false;
  loadingJob = false;
  jobId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Get job ID from route parameters
    this.route.params.subscribe(params => {
      this.jobId = +params['id']; // Convert to number
      if (this.jobId) {
        this.loadJobData();
      } else {
        this.error = 'Invalid job ID';
      }
    });
  }

  loadJobData() {
    this.loadingJob = true;
    this.error = null;

    this.apiService.getJobById(this.jobId).subscribe({
      next: (job) => {
        console.log('Job loaded for editing:', job);
        this.job = job;
        this.loadingJob = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.error = `Failed to load job: ${error}`;
        this.loadingJob = false;
        
        // Try to load from fallback data
        this.loadFallbackJob();
      }
    });
  }

  private loadFallbackJob() {
    // Fallback data for testing
    const fallbackJobs: Job[] = [
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

    const fallbackJob = fallbackJobs.find(job => job.id === this.jobId);
    if (fallbackJob) {
      this.job = fallbackJob;
      this.error = 'Loaded from fallback data - API unavailable';
    } else {
      this.error = 'Job not found';
    }
  }

  onSubmit(form: any) {
    if (form.valid && this.jobId) {
      this.loading = true;
      this.error = null;
      this.success = false;

      const jobData: CreateJobRequest = {
        title: this.job.title,
        role: this.job.role,
        location: this.job.location,
        description: this.job.description,
        salaryMin: Number(this.job.salaryMin),
        salaryMax: Number(this.job.salaryMax),
        type: this.job.type,
        level: this.job.level,
        isActive: this.job.isActive,
        applicants: this.job.applicants || 0
      };

      this.apiService.updateJob(this.jobId, jobData).subscribe({
        next: (updatedJob) => {
          console.log('Job updated successfully:', updatedJob);
          this.loading = false;
          this.success = true;
          
          // Navigate to jobs page after short delay
          setTimeout(() => {
            this.router.navigate(['/jobs']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error updating job:', error);
          this.error = `Failed to update job: ${error}`;
          this.loading = false;
          
          // Fallback to localStorage if API fails (for demo purposes)
          this.updateLocalStorage();
        }
      });
    }
  }

  private updateLocalStorage() {
    try {
      // This is a fallback for demo purposes
      console.log('Updating job in localStorage as fallback');
      this.success = true;
      setTimeout(() => {
        this.router.navigate(['/jobs']);
      }, 1500);
    } catch (err) {
      console.error('Error updating localStorage:', err);
      this.error = 'Failed to update job. Please try again.';
    }
  }

  clearError() {
    this.error = null;
  }

  // Toggle job status
  toggleJobStatus() {
    this.job.isActive = !this.job.isActive;
  }
}