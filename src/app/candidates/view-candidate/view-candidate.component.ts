import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Candidate, CandidateStep } from '../../api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  stepsSortOrder: 'asc' | 'desc' = 'asc';

  // PDF handling properties
  showPDFViewer = false;
  pdfDataUrl: SafeResourceUrl | null = null;
  private _blobUrl: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    
  ) { }

  ngOnInit() {
    this.candidateId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCandidateDetails();
    this.loadCandidateSteps();
  }
  ngOnDestroy() {
    if (this._blobUrl) {
      URL.revokeObjectURL(this._blobUrl);
    }
  }



  private loadCandidateDetails() {
    this.apiService.getCandidateById(this.candidateId).subscribe({
      next: (candidate) => {
        this.candidate = candidate;
        this.loading = false;
        this.processPDFAttachment();
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

  private processPDFAttachment() {
    if (this.candidate?.attachment?.base64) {
      try {
        const byteCharacters = atob(this.candidate.attachment.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // revoke old URL if it exists
        if (this._blobUrl) {
          URL.revokeObjectURL(this._blobUrl);
        }

        this._blobUrl = URL.createObjectURL(blob);

        // sanitizer ensures Angular lets iframe use it
        this.pdfDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._blobUrl);

        console.log('PDF blob URL ready:', this._blobUrl);
      } catch (err) {
        console.error('Error creating PDF blob URL:', err);
      }
    }
  }





  togglePDFViewer() {
    this.showPDFViewer = !this.showPDFViewer;
  }

  downloadPDF() {
    if (this._blobUrl && this.candidate) {
      const link = document.createElement('a');
      link.href = this._blobUrl;
      link.download = this.candidate.attachment?.fileName || `resume_${this.candidate.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('PDF not available.');
    }
  }



  // Helper methods for assessment steps
  getProgressPercentage(): number {
    if (this.candidateSteps.length === 0) return 0;
    return Math.round((this.getCompletedStepsCount() / this.getTotalStepsCount()) * 100);
  }

  getStepStatusClass(step: CandidateStep): string {
    const status = (step.status || '').toLowerCase();
    if (step.completed) return 'step-completed';
    if (status === 'pending') return 'step-pending';
    if (status === 'in_progress') return 'step-in-progress';
    return 'step-default';
  }

  getStepStatusIcon(step: CandidateStep): string {
    const status = (step.status || '').toLowerCase();
    if (step.completed) return 'fas fa-check-circle';
    if (status === 'pending') return 'fas fa-clock';
    if (status === 'in_progress') return 'fas fa-spinner';
    return 'fas fa-circle';
  }

  getCurrentStep(): CandidateStep | null {
    return this.candidateSteps.find(step =>
      !step.completed &&
      (step.status || '').toLowerCase() !== 'completed'
    ) || null;
  }

  getCompletedStepsCount(): number {
    return this.candidateSteps.filter(step =>
      step.completed ||
      (step.status || '').toLowerCase() === 'completed'
    ).length;
  }

  getTotalStepsCount(): number {
    return this.candidateSteps.length;
  }

  getProgressColor(): string {
    if (this.getProgressPercentage() >= 70) return '#28a745'; // green
    if (this.getProgressPercentage() >= 40) return '#ffc107'; // yellow
    return '#dc3545'; // red
  }

  refreshAll() {
    this.loading = true;
    this.loadingSteps = true;
    this.error = null;
    this.stepsError = null;
    this.loadCandidateDetails();
    this.loadCandidateSteps();
  }

  navigateToReview(step: CandidateStep) {
    this.router.navigate(['/candidates/view-candidate', this.candidateId, 'review', step.id]);
  }

  getSortedSteps(): CandidateStep[] {
    return [...this.candidateSteps].sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0));
  }
}
