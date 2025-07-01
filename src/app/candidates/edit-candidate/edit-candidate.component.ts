import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateCandidateRequest, Candidate } from '../../api.service';

@Component({
  selector: 'app-edit-candidate',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './edit-candidate.component.html',
  styleUrl: './edit-candidate.component.css'
})
export class EditCandidateComponent implements OnInit {
  candidate: Candidate = {
    id: 0,
    name: '',
    role: '',
    appliedRole: '',
    department: '',
    employmentType: 'Full-time',
    workType: 'Onsite',
    appliedDate: '',
    attachments: '',
    status: 'Shortlisted',
    score: 0,
    email: '',
    phone: '',
    position: '',
    experience: 0,
    jobId: undefined // Added jobId field
  };

  candidateId: number = 0;
  loading = false;
  loadingCandidate = false;
  error: string | null = null;
  success = false;
  attachments: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.candidateId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.candidateId) {
      this.loadCandidate();
    } else {
      this.error = 'Invalid candidate ID';
    }
  }

  loadCandidate() {
    this.loadingCandidate = true;
    this.error = null;

    this.apiService.getCandidateById(this.candidateId).subscribe({
      next: (candidate) => {
        console.log('Candidate loaded successfully:', candidate);
        this.candidate = candidate;
        this.loadingCandidate = false;
      },
      error: (error) => {
        console.error('Error loading candidate:', error);
        this.error = error;
        this.loadingCandidate = false;
      }
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.loading = true;
      this.error = null;
      this.success = false;

      let body: any;

      if (this.attachments.length > 0) {
        // Use FormData for file upload
        body = new FormData();
        body.append('name', this.candidate.name);
        body.append('role', this.candidate.role);
        body.append('appliedRole', this.candidate.appliedRole);
        body.append('department', this.candidate.department);
        body.append('employmentType', this.candidate.employmentType);
        body.append('workType', this.candidate.workType);
        body.append('appliedDate', this.candidate.appliedDate);
        body.append('status', this.candidate.status);
        body.append('score', String(this.candidate.score));
        body.append('email', this.candidate.email);
        body.append('phone', this.candidate.phone);
        body.append('position', this.candidate.position);
        body.append('experience', String(this.candidate.experience));
        body.append('jobId', String(this.candidate.jobId || 1));
        for (const file of this.attachments) {
          body.append('attachments', file, file.name);
        }
      } else {
        // Fallback to JSON if no new files
        body = {
          name: this.candidate.name,
          role: this.candidate.role,
          appliedRole: this.candidate.appliedRole,
          department: this.candidate.department,
          employmentType: this.candidate.employmentType,
          workType: this.candidate.workType,
          appliedDate: this.candidate.appliedDate,
          attachments: this.candidate.attachments,
          status: this.candidate.status,
          score: Number(this.candidate.score),
          email: this.candidate.email,
          phone: this.candidate.phone,
          position: this.candidate.position,
          experience: Number(this.candidate.experience),
          jobId: this.candidate.jobId || 1
        };
      }

      this.apiService.updateCandidate(this.candidateId, body).subscribe({
        next: (updatedCandidate) => {
          this.loading = false;
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/candidates']);
          }, 1500);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      });
    }
  }

  clearError() {
    this.error = null;
  }

  onAttachmentsChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachments = Array.from(input.files);
    }
  }
}