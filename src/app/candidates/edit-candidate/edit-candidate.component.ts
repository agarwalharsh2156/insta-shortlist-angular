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
    experience: 0
  };

  candidateId: number = 0;
  loading = false;
  loadingCandidate = false;
  error: string | null = null;
  success = false;

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

      const candidateData: CreateCandidateRequest = {
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
        experience: Number(this.candidate.experience)
      };

      this.apiService.updateCandidate(this.candidateId, candidateData).subscribe({
        next: (updatedCandidate) => {
          console.log('Candidate updated successfully:', updatedCandidate);
          this.loading = false;
          this.success = true;
          
          // Navigate to candidates page after short delay
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

  clearError() {
    this.error = null;
  }
}