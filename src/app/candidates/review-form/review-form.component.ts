import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateReviewRequest, CandidateStep, Candidate } from '../../api.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  candidateId: number = 0;
  stepId: number = 0;
  candidate: Candidate | null = null;
  step: CandidateStep | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  reviewForm: CreateReviewRequest = {
    reviewer: '',
    feedback: '',
    score: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.candidateId = Number(this.route.snapshot.paramMap.get('id'));
    this.stepId = Number(this.route.snapshot.paramMap.get('stepId'));

    // Get current user email for reviewer field
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.reviewForm.reviewer = user.email || 'interviewer@example.com';
    } else {
      this.reviewForm.reviewer = 'interviewer@example.com';
    }

    this.loadCandidateAndStep();
  }

  private loadCandidateAndStep() {
    this.loading = true;

    // Load candidate details
    this.apiService.getCandidateById(this.candidateId).subscribe({
      next: (candidate) => {
        this.candidate = candidate;
        this.loadStep();
      },
      error: (err) => {
        // Try fallback data
        const fallback = ApiService.getFallbackCandidates().find(c => c.id === this.candidateId);
        if (fallback) {
          this.candidate = fallback;
          this.loadStep();
        } else {
          this.error = 'Candidate not found';
          this.loading = false;
        }
      }
    });
  }

  private loadStep() {
    this.apiService.getCandidateSteps(this.candidateId).subscribe({
      next: (steps) => {
        this.step = steps.find(s => s.id === this.stepId) || null;
        this.loading = false;
      },
      error: (err) => {
        // Try fallback data
        const fallbackSteps = ApiService.getFallbackCandidateSteps(this.candidateId);
        this.step = fallbackSteps.find(s => s.id === this.stepId) || null;
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.apiService.createReview(this.stepId, this.reviewForm).subscribe({
      next: (review) => {
        this.success = 'Review submitted successfully!';
        this.loading = false;

        // Navigate back to candidate view after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/candidates/view-candidate', this.candidateId]);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Failed to submit review. Please try again.';
        this.loading = false;
      }
    });
  }

  private isFormValid(): boolean {
    if (!this.reviewForm.reviewer.trim()) {
      this.error = 'Reviewer email is required';
      return false;
    }

    if (!this.reviewForm.feedback.trim()) {
      this.error = 'Feedback is required';
      return false;
    }

    if (this.reviewForm.score < 0 || this.reviewForm.score > 100) {
      this.error = 'Score must be between 0 and 100';
      return false;
    }

    return true;
  }

  goBack() {
    this.router.navigate(['/candidates/view-candidate', this.candidateId]);
  }
}