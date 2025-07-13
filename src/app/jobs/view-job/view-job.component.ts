import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Job, AssessmentTemplate } from '../../api.service';

@Component({
  selector: 'app-view-job',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-job.component.html',
  styleUrls: ['../jobs.component.css', './view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  error: string | null = null;
  assessmentSteps: AssessmentTemplate[] = [];
  loadingSteps = false;
  stepsError: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getJobById(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
        // Load assessment steps after job is loaded
        this.loadAssessmentSteps(job.role);
      },
      error: (err) => {
        // Try to find the job in fallback jobs
        const fallback = ApiService.getFallbackJobs().find(j => j.id === id);
        if (fallback) {
          this.job = fallback;
          this.error = 'Showing fallback job data (API unavailable)';
          this.loadAssessmentSteps(fallback.role);
        } else {
          this.error = 'Job not found (API unavailable)';
        }
        this.loading = false;
      }
    });
  }

  private loadAssessmentSteps(role: string) {
    this.loadingSteps = true;
    this.stepsError = null;

    this.apiService.getAssessmentTemplatesByRole(role).subscribe({
      next: (steps) => {
        this.assessmentSteps = steps.sort((a, b) => a.stepOrder - b.stepOrder);
        this.loadingSteps = false;
      },
      error: (err) => {
        console.error('Error loading assessment steps:', err);
        this.stepsError = 'Failed to load assessment steps';
        this.loadingSteps = false;
        // Fallback to empty array
        this.assessmentSteps = [];
      }
    });
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}