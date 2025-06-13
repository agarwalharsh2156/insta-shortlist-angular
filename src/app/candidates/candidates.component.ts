import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  email?: string;
  phone?: string;
  position?: string;
  experience?: number;
}

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent {
  tabs = ['All', 'In-Review', 'Interview', 'Hired', 'Rejected'];
  activeTab = 'All';
  get candidates(): Candidate[] {
  const stored = JSON.parse(localStorage.getItem('candidates') || '[]');
  return [
    {
      id: 1,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 2,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 3,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 4,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 5,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 6,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 7,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
     id: 8,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 9,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 10,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 11,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 12,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    {
      id: 13,
      name: 'Sophia Turner',
      role: 'Legal Advisor',
      appliedRole: 'Legal Advisor',
      department: 'Legal',
      employmentType: 'Full-time',
      workType: 'Hybrid',
      appliedDate: '2030-10-01',
      attachments: ['Resume', 'Cover Letter'],
      status: 'Interview',
      score: 50,
      email: 'sophia@example.com',
      phone: '1234567890',
      position: 'Legal Advisor',
      experience: 5
    },
    ...stored
  ];
}

  get filteredCandidates() {
    if (this.activeTab === 'All') {
      return this.candidates;
    }
    return this.candidates.filter(c => c.status === this.activeTab);
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}