import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, CreateJobRequest, AssessmentTemplate } from '../../api.service';
interface Job {
  id: number;
  title: string;
  role: string;
  location: string;
  description: string;
  status: string;
  applicants: number;
  salaryMin: number;
  salaryMax: number;
  type: string;
  level: string;
  assessmentTemplateIds: number[];
}

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.css'
})
export class CreateJobComponent implements OnInit {
    job: Job = {
      id: 0,
      title: '',
      role: '',
      location: '',
      description: '',
      status: 'Active',
      applicants: 0,
      salaryMin: 0,
      salaryMax: 0,
      type: 'Full-time',
      level: 'Entry-level',
      assessmentTemplateIds: []

    };
  assessmentTemplates: AssessmentTemplate[] = [];
  filteredAssessmentTemplates: AssessmentTemplate[] = [];
  availableStepNames: string[] = [];

  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }


  onSubmit(form: any) {
    if (form.valid) {
      this.loading = true;
      this.error = null;
      this.success = false;

      const jobData: CreateJobRequest = {
        title: this.job.title,
        role: this.job.role,
        location: this.job.location,
        description: this.job.description,
        salaryMin: Number(this.job.salaryMin),
        salaryMax: Number(this.job.salaryMax),
        type: this.job.type,
        level: this.job.level,
        isActive: true,
        applicants: 0,
        assessmentTemplateIds: this.job.assessmentTemplateIds
      };

      this.apiService.createJob(jobData).subscribe({
        next: (createdJob) => {
          console.log('Job created successfully:', createdJob);
          this.loading = false;
          this.success = true;

          // Navigate to jobs page after short delay
          setTimeout(() => {
            this.router.navigate(['/jobs']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating job:', error);
          this.error = error;
          this.loading = false;

          // Fallback to localStorage if API fails
          this.saveToLocalStorage();
        }
      });
    }
  }
  ngOnInit() {
    this.loadAssessmentTemplates();
  }

  private saveToLocalStorage() {
    try {
      const jobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
      const newJob: Job = {
        ...this.job,
        id: Date.now(),
        applicants: 0,
        status: 'Active',
        salaryMin: Number(this.job.salaryMin),
        salaryMax: Number(this.job.salaryMax)
      };
      jobs.push(newJob);
      localStorage.setItem('jobs', JSON.stringify(jobs));

      console.log('Job saved to localStorage as fallback');
      this.success = true;
      setTimeout(() => {
        this.router.navigate(['/jobs']);
      }, 10000);
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      this.error = 'Failed to save job. Please try again.';
    }
  }

  clearError() {
    this.error = null;
  }
  private loadAssessmentTemplates() {
    this.apiService.getAssessmentTemplates().subscribe({
      next: (templates) => {
        this.assessmentTemplates = templates;
        this.filterAssessmentTemplates();
      },
      error: (error) => {
        console.error('Error loading assessment templates:', error);
        // Fallback to empty array
        this.assessmentTemplates = [];
        this.filteredAssessmentTemplates = [];
      }
    });
  }

  onRoleChange() {
    this.filterAssessmentTemplates();
  }

  private filterAssessmentTemplates() {
    if (!this.job.role || this.job.role.trim() === '') {
      this.filteredAssessmentTemplates = [];
      this.availableStepNames = [];
      return;
    }

    // Filter templates by role (case-insensitive partial match)
    this.filteredAssessmentTemplates = this.assessmentTemplates.filter(template =>
      template.role.toLowerCase().includes(this.job.role.toLowerCase())
    );

    // Extract unique step names for the filtered role
    this.availableStepNames = [...new Set(
      this.filteredAssessmentTemplates.map(template => template.stepName)
    )];
  }
}