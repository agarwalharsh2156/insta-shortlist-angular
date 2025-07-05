import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Candidate } from '../../api.service';

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
    jobId: 1
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

      if (this.attachments.length > 0) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('name', this.candidate.name);
        formData.append('role', this.candidate.role);
        formData.append('appliedRole', this.candidate.appliedRole);
        formData.append('department', this.candidate.department);
        formData.append('employmentType', this.candidate.employmentType);
        formData.append('workType', this.candidate.workType);
        formData.append('appliedDateStr', this.candidate.appliedDate); // Use correct field name
        formData.append('status', this.candidate.status);
        formData.append('score', String(this.candidate.score));
        formData.append('email', this.candidate.email);
        formData.append('phone', this.candidate.phone);
        formData.append('position', this.candidate.position);
        formData.append('experience', String(this.candidate.experience));
        formData.append('jobId', String(this.candidate.jobId || 1));
        
        // Add files
        for (const file of this.attachments) {
          formData.append('attachments', file, file.name);
        }

        this.apiService.updateCandidate(this.candidateId, formData).subscribe({
          next: (updatedCandidate) => {
            console.log('Candidate updated successfully:', updatedCandidate);
            this.loading = false;
            this.success = true;
            setTimeout(() => {
              this.router.navigate(['/candidates']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating candidate:', error);
            this.error = error;
            this.loading = false;
          }
        });
      } else {
        // Use JSON for updates without files
        this.apiService.updateCandidate(this.candidateId, this.candidate).subscribe({
          next: (updatedCandidate) => {
            console.log('Candidate updated successfully:', updatedCandidate);
            this.loading = false;
            this.success = true;
            setTimeout(() => {
              this.router.navigate(['/candidates']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating candidate:', error);
            this.error = error;
            this.loading = false;
          }
        });
      }
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