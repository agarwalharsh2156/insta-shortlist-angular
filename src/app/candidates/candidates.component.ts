import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Candidate } from '../api.service';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  tabs = ['All', 'In-Review', 'Interview', 'Hired', 'Rejected'];
  activeTab = 'All';
  candidates: Candidate[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    this.error = null;

    this.apiService.getCandidates().subscribe({
      next: (candidates) => {
        console.log('Candidates loaded successfully:', candidates);
        this.candidates = candidates;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.error = error;
        this.loading = false;
        
        // Fallback to static data if API fails
        this.loadFallbackCandidates();
      }
    });
  }

  private loadFallbackCandidates() {
    console.log('Loading fallback candidates due to API error');
    this.candidates = [
      {
        id: 1,
        name: 'Sophia Turner',
        role: 'Legal Advisor',
        appliedRole: 'Legal Advisor',
        department: 'Legal',
        employmentType: 'Full-time',
        workType: 'Hybrid',
        appliedDate: '2030-10-01',
        attachments: 'Resume, Cover Letter',
        status: 'Interview',
        score: 50,
        email: 'sophia@example.com',
        phone: '1234567890',
        position: 'Legal Advisor',
        experience: 5
      },
      {
        id: 2,
        name: 'John Smith',
        role: 'Software Engineer',
        appliedRole: 'Software Engineer',
        department: 'Engineering',
        employmentType: 'Full-time',
        workType: 'Remote',
        appliedDate: '2030-10-02',
        attachments: 'Resume, Cover Letter',
        status: 'In-Review',
        score: 75,
        email: 'john@example.com',
        phone: '1234567891',
        position: 'Software Engineer',
        experience: 3
      },
      {
        id: 3,
        name: 'Emily Johnson',
        role: 'Marketing Manager',
        appliedRole: 'Marketing Manager',
        department: 'Marketing',
        employmentType: 'Full-time',
        workType: 'Onsite',
        appliedDate: '2030-10-03',
        attachments: 'Resume, Cover Letter',
        status: 'Hired',
        score: 90,
        email: 'emily@example.com',
        phone: '1234567892',
        position: 'Marketing Manager',
        experience: 7
      },
      {
        id: 4,
        name: 'Michael Brown',
        role: 'Data Analyst',
        appliedRole: 'Data Analyst',
        department: 'Analytics',
        employmentType: 'Contract',
        workType: 'Hybrid',
        appliedDate: '2030-10-04',
        attachments: 'Resume, Cover Letter',
        status: 'Rejected',
        score: 35,
        email: 'michael@example.com',
        phone: '1234567893',
        position: 'Data Analyst',
        experience: 2
      }
    ];
  }

  get filteredCandidates() {
    if (this.activeTab === 'All') {
      return this.candidates;
    }
    return this.candidates.filter(c => c.status === this.activeTab);
  }

  // Add this method to get count for each tab
  getCandidateCountForTab(tab: string): number {
    if (tab === 'All') {
      return this.candidates.length;
    }
    return this.candidates.filter(c => c.status === tab).length;
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  refreshCandidates() {
    this.loadCandidates();
  }

  clearError() {
    this.error = null;
  }
}