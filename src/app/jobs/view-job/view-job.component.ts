import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Job, Assessment } from '../../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-job',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-job.component.html',
  styleUrls: ['../jobs.component.css', './view-job.component.css']
})
export class ViewJobComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  error: string | null = null;

  assessments: Assessment[] = [];
  assessmentTitles: string[] = [];
  loadingAssessments = false;
  assessmentsError: string | null = null;

  selectedAssessmentTitle: string = ''; // <-- set to empty string, not null
  linking = false;
  linkError: string | null = null;
  linkSuccess: string | null = null;

  assessmentSteps: any[] = []; // Response from GET /api/assessments/job/{jobId}
  showAssessmentSteps = false;

  copied = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getJobById(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
        this.loadAssessmentSteps(); // <-- Load steps first
      },
      error: (err) => {
        const fallback = ApiService.getFallbackJobs().find(j => j.id === id);
        if (fallback) {
          this.job = fallback;
          this.error = 'Showing fallback job data (API unavailable)';
          this.loadAssessmentSteps();
        } else {
          this.error = 'Job not found (API unavailable)';
        }
        this.loading = false;
      }
    });
  }

  loadAssessmentSteps() {
    if (!this.job?.id) return;
    this.apiService.getAssessmentStepsForJob(this.job.id).subscribe({
      next: (steps) => {
        this.assessmentSteps = steps;
        this.showAssessmentSteps = steps && steps.length > 0;
        if (!this.showAssessmentSteps) {
          this.loadAssessments(); // Only load assessments if no steps linked
        }
      },
      error: () => {
        this.assessmentSteps = [];
        this.showAssessmentSteps = false;
        this.loadAssessments();
      }
    });
  }

  loadAssessments() {
    this.loadingAssessments = true;
    this.assessmentsError = null;
    this.apiService.getAssessments().subscribe({
      next: (assessments) => {
        this.assessments = assessments;
        this.assessmentTitles = Array.from(new Set(assessments.map(a => a.title)));
        this.loadingAssessments = false;
      },
      error: (err) => {
        this.assessmentsError = 'Failed to load assessments';
        this.loadingAssessments = false;
        this.assessments = ApiService.getFallbackAssessments();
        this.assessmentTitles = Array.from(new Set(this.assessments.map(a => a.title)));
      }
    });
  }

  linkAssessmentToJob() {
    if (!this.job?.id || !this.selectedAssessmentTitle) return;
    this.linking = true;
    this.linkError = null;
    this.linkSuccess = null;

    this.apiService.linkAssessmentToJobByTitle(this.selectedAssessmentTitle, this.job.id).subscribe({
      next: () => {
        this.linking = false;
        this.linkSuccess = 'Assessment linked successfully!';
        this.loadAssessmentSteps(); // Reload steps after linking
      },
      error: (err) => {
        this.linkError = 'Failed to link assessment: ' + err;
        this.linking = false;
      }
    });
  }
  // Add this method to the ViewJobComponent class
getPublicApplicationUrl(): string {
  return `${window.location.origin}/apply/${this.job?.id}`;
}

copyApplicationUrl() {
  const url = this.getPublicApplicationUrl();
    const onCopied = () => {
      this.copied = true;
      setTimeout(() => this.copied = false, 1500);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(onCopied).catch(() => {
        this.fallbackCopy(url);
        onCopied();
      });
    } else {
      this.fallbackCopy(url);
      onCopied();
    }
  }

  private fallbackCopy(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
    document.execCommand('copy');
    } catch { }
    document.body.removeChild(textArea);
}


}