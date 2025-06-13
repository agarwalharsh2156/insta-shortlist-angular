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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    // Load from localStorage and static data since API only supports POST
    this.loadFallbackJobs();
  }

  private loadFallbackJobs() {
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
}