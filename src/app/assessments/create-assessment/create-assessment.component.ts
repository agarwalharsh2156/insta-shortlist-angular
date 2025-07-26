import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, AssessmentStepPayload, Job } from '../../api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  jobs: Job[] = [];
  loadingJobs = false;
  selectedJobId: number | null = null;
  steps: Omit<AssessmentStepPayload, 'jobId'>[] = [
    { stepOrder: 1, stepName: '', mode: '', passingCriteria: '' }
  ];
  loading = false;
  success = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loadingJobs = true;
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs.filter(job => job.isActive);
        this.loadingJobs = false;
        // Optionally, set default selectedJobId
        if (this.jobs.length > 0) {
          this.selectedJobId = this.jobs[0].id!;
        }
      },
      error: (error) => {
        this.jobs = ApiService.getFallbackJobs().filter(job => job.isActive);
        this.loadingJobs = false;
        if (this.jobs.length > 0) {
          this.selectedJobId = this.jobs[0].id!;
        }
      }
    });
  }

  getSelectedJob(): Job | undefined {
    return this.jobs.find(job => job.id === this.selectedJobId);
  }

  addStep() {
    this.steps.push({ stepOrder: this.steps.length + 1, stepName: '', mode: '', passingCriteria: '' });
  }

  removeStep(index: number) {
    if (this.steps.length > 1) this.steps.splice(index, 1);
  }

  submit() {
    if (!this.selectedJobId) {
      this.error = 'Please select a job.';
      return;
    }
    this.loading = true;
    this.success = false;
    this.error = null;
    // Attach jobId to each step before sending
    const payload: AssessmentStepPayload[] = this.steps.map(step => ({ ...step, jobId: Number(this.selectedJobId) }));
    this.apiService.createAssessment(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = err;
      }
    });
  }
}
