import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Candidate, CandidateStep } from '../../api.service';

@Component({
  selector: 'app-view-candidate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-candidate.component.html',
  styleUrls: ['../candidates.component.css', './view-candidate.component.css']
})
export class ViewCandidateComponent implements OnInit {
  candidate: Candidate | null = null;
  candidateSteps: CandidateStep[] = [];
  loading = true;
  loadingSteps = true;
  error: string | null = null;
  stepsError: string | null = null;
  candidateId: number = 0;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.candidateId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCandidateDetails();
    this.loadCandidateSteps();
  }

  private loadCandidateDetails() {
    this.apiService.getCandidateById(this.candidateId).subscribe({
      next: (candidate) => {
        this.candidate = candidate;
        this.loading = false;
      },
      error: (err) => {
        // Fallback
        const fallback = ApiService.getFallbackCandidates().find(c => c.id === this.candidateId);
        if (fallback) {
          this.candidate = fallback;
          this.error = 'Showing fallback candidate data (API unavailable)';
        } else {
          this.error = 'Candidate not found (API unavailable)';
        }
        this.loading = false;
      }
    });
  }

  private loadCandidateSteps() {
    this.apiService.getCandidateSteps(this.candidateId).subscribe({
      next: (steps) => {
        this.candidateSteps = steps;
        this.loadingSteps = false;
      },
      error: (err) => {
        console.error('Error loading candidate steps:', err);
        this.stepsError = 'Unable to load assessment steps (API unavailable)';
        
        // Fallback to static data
        this.candidateSteps = ApiService.getFallbackCandidateSteps(this.candidateId);
        this.loadingSteps = false;
      }
    });
  }

  // Helper methods for assessment steps
  getCompletedStepsCount(): number {
    return this.candidateSteps.filter(step => step.completed).length;
  }

  getTotalStepsCount(): number {
    return this.candidateSteps.length;
  }

  getCurrentStep(): CandidateStep | null {
    return this.candidateSteps.find(step => !step.completed && step.status !== 'COMPLETED') || null;
  }

  getProgressPercentage(): number {
    if (this.candidateSteps.length === 0) return 0;
    return Math.round((this.getCompletedStepsCount() / this.getTotalStepsCount()) * 100);
  }

  getStepStatusClass(step: CandidateStep): string {
    if (step.completed) return 'step-completed';
    if (step.status === 'PENDING') return 'step-pending';
    if (step.status === 'IN_PROGRESS') return 'step-in-progress';
    return 'step-default';
  }

  getStepStatusIcon(step: CandidateStep): string {
    if (step.completed) return 'fas fa-check-circle';
    if (step.status === 'PENDING') return 'fas fa-clock';
    if (step.status === 'IN_PROGRESS') return 'fas fa-spinner';
    return 'fas fa-circle';
  }

  refreshAll() {
    this.loading = true;
    this.loadingSteps = true;
    this.error = null;
    this.stepsError = null;
    this.loadCandidateDetails();
    this.loadCandidateSteps();
  }
}