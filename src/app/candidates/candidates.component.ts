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
  tabs = ['All', 'Applied', 'In-Review', 'Interview', 'Hired', 'Rejected'];
  activeTab = 'All';
  candidates: Candidate[] = [];
  loading = false;
  error: string | null = null;
  deletingCandidateId: number | null = null;
  deleteSuccess: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    this.error = null;

    this.apiService.getCandidates().subscribe({
      next: (candidates: Candidate[]) => {
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
    this.candidates = ApiService.getFallbackCandidates();
  }

  get filteredCandidates() {
    if (this.activeTab === 'All') {
      return this.candidates;
    }
    return this.candidates.filter(c => c.status === this.activeTab);
  }

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

  clearDeleteSuccess() {
    this.deleteSuccess = null;
  }

  deleteCandidate(candidate: Candidate) {
    if (!candidate.id) {
      console.error('Cannot delete candidate without ID');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete "${candidate.name}"? This action cannot be undone.`);
    
    if (!confirmed) {
      return;
    }

    this.deletingCandidateId = candidate.id;
    this.error = null;
    this.deleteSuccess = null;

    this.apiService.deleteCandidate(candidate.id).subscribe({
      next: () => {
        console.log('Candidate deleted successfully');
        this.deleteSuccess = `Candidate "${candidate.name}" has been deleted successfully.`;
        this.deletingCandidateId = null;
        
        // Remove candidate from local array
        this.candidates = this.candidates.filter(c => c.id !== candidate.id);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.deleteSuccess = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting candidate:', error);
        this.error = `Failed to delete candidate: ${error}`;
        this.deletingCandidateId = null;
        
        // For fallback data, we can still remove from local array
        if (this.error.includes('API') || this.error.includes('network')) {
          this.candidates = this.candidates.filter(c => c.id !== candidate.id);
          this.deleteSuccess = `Candidate "${candidate.name}" has been removed locally.`;
          this.error = null;
          
          setTimeout(() => {
            this.deleteSuccess = null;
          }, 3000);
        }
      }
    });
  }

  isDeletingCandidate(candidateId: number | undefined): boolean {
    return candidateId !== undefined && this.deletingCandidateId === candidateId;
  }
}