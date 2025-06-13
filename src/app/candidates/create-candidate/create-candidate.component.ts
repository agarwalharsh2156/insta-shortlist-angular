import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Candidate {
  id: number;
  name: string;
  role: string;
  appliedRole: string;
  department: string;
  employmentType: string;
  workType: string;
  appliedDate: string;
  attachments: string[];
  status: string;
  score: number;
  email: string;
  phone: string;
  position: string;
  experience: number;
}

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
    employmentType: '',
    workType: '',
    appliedDate: '',
    attachments: [],
    status: 'Shortlisted',
    score: 0,
    email: '',
    phone: '',
    position: '',
    experience: 0
  };

  constructor(private router: Router) {}

  onAttachmentsChange(value: string) {
    this.candidate.attachments = value
      .split(',')
      .map(a => a.trim())
      .filter(a => a);
  }

  onSubmit(form: any) {
    if (form.valid) {
      const candidates: Candidate[] = JSON.parse(localStorage.getItem('candidates') || '[]');
      const newCandidate: Candidate = {
        ...this.candidate,
        id: Date.now()
      };
      candidates.push(newCandidate);
      localStorage.setItem('candidates', JSON.stringify(candidates));
      this.router.navigate(['/candidates']);
    }
  }
}