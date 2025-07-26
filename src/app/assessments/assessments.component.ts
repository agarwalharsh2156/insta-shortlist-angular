import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Assessment, Job } from '../api.service';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {
  isGridView = true;
  assessments: Assessment[] = [];
  jobs: Job[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchJobs();
    this.fetchAssessments();
  }

  fetchJobs() {
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: () => {
        this.jobs = ApiService.getFallbackJobs ? ApiService.getFallbackJobs() : [];
      }
    });
  }

  getJobById(jobId: number): Job | undefined {
    return this.jobs.find(j => j.id === jobId);
  }

  getJobTitle(jobId: number): string {
    return this.getJobById(jobId)?.title || `Job #${jobId}`;
  }

  getJobRole(jobId: number): string {
    return this.getJobById(jobId)?.role || '';
  }

  fetchAssessments() {
    this.loading = true;
    this.apiService.getAssessments().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.assessments = data;
        } else {
          this.assessments = ApiService.getFallbackAssessments();
        }
        this.loading = false;
      },
      error: (err) => {
        // On error, use fallback data
        this.assessments = ApiService.getFallbackAssessments();
        this.loading = false;
        // Only show error if fallback is also empty
        if (this.assessments.length === 0) {
          this.error = err;
        }
      }
    });
  }

  // Group assessments by jobId for grid view
  get assessmentsByJob(): { jobId: number, steps: Assessment[] }[] {
    const map = new Map<number, Assessment[]>();
    for (const a of this.assessments) {
      if (!map.has(a.jobId)) map.set(a.jobId, []);
      map.get(a.jobId)!.push(a);
    }
    return Array.from(map.entries()).map(([jobId, steps]) => ({ jobId, steps }));
  }

  toggleView(isGrid: boolean) {
    this.isGridView = isGrid;
  }
}
