import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateCandidateRequest, Candidate } from '../../api.service';

@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.css'
})
export class CreateCandidateComponent {
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

  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  // onAttachmentsChange(value: string) {
  //   this.candidate.attachments = value
  //     .split(',')
  //     .map(a => a.trim())
  //     .filter(a => a);
  // }

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

      this.apiService.createCandidate(candidateData).subscribe({
        next: (createdCandidate) => {
          console.log('Candidate created successfully:', createdCandidate);
          this.loading = false;
          this.success = true;
          
          // Navigate to candidates page after short delay
          setTimeout(() => {
            this.router.navigate(['/candidates']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating candidate:', error);
          this.error = error;
          this.loading = false;
          
          // Note: Not using localStorage fallback as mentioned in constraints
          // You could implement a different fallback strategy here if needed
        }
      });
    }
  }

  clearError() {
    this.error = null;
  }
}