import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService, Candidate } from '../../api.service';

@Component({
  selector: 'app-view-candidate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-candidate.component.html',
  styleUrls: ['../candidates.component.css', './view-candidate.component.css']
})
export class ViewCandidateComponent implements OnInit {
  candidate: Candidate | null = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getCandidateById(id).subscribe({
      next: (candidate) => {
        this.candidate = candidate;
        this.loading = false;
      },
      error: (err) => {
        // Fallback
        const fallback = ApiService.getFallbackCandidates().find(c => c.id === id);
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
}