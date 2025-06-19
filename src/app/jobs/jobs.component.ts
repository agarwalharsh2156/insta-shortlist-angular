import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Job } from '../api.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  isGridView = true;
  loading = false;
  error: string | null = null;
  deletingJobId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.error = null;

    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Jobs loaded successfully:', jobs);
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.error = error;
        this.loading = false;
        
        // Fallback to static data if API fails
        this.loadFallbackJobs();
      }
    });
  }

  private loadFallbackJobs() {
    console.log('Loading fallback jobs due to API error');
    this.jobs = [
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

  toggleView(isGrid: boolean) {
    this.isGridView = isGrid;
  }

  postJob(jobId: number, jobTitle: string) {
    console.log(`Posting job ID: ${jobId} - ${jobTitle} to hiring platforms`);
    // Placeholder for posting logic
  }

  refreshJobs() {
    this.loadJobs();
  }

  // Clear error message
  clearError() {
    this.error = null;
  }

  // DELETE Job functionality
  deleteJob(job: Job) {
    if (!job.id) {
      console.error('Job ID is required for deletion');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      this.deletingJobId = job.id;
      
      this.apiService.deleteJob(job.id).subscribe({
        next: () => {
          console.log(`Job ${job.title} deleted successfully`);
          // Remove the job from the local array
          this.jobs = this.jobs.filter(j => j.id !== job.id);
          this.deletingJobId = null;
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          this.deletingJobId = null;
          
          // Show error message temporarily
          const errorMsg = this.error;
          this.error = `Failed to delete job: ${error}`;
          setTimeout(() => {
            this.error = errorMsg;
          }, 3000);
        }
      });
    }
  }

  // Helper method to check if a job is being deleted
  isDeletingJob(jobId: number | undefined): boolean {
    return this.deletingJobId === jobId;
  }
}