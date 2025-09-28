import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Assessment, Job, AssessmentStepPayload } from '../api.service';


// Extend Assessment interface to include missing properties
interface ExtendedAssessment extends Assessment {
  interviewerName?: string;
  sendFeedback?: boolean;
}


@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {
  assessments: ExtendedAssessment[] = [];
  jobs: Job[] = [];
  loading = false;
  error: string | null = null;

  // Editing state
  editingAssessment: Assessment | null = null;
  editForm = {
    title: '',
    stepOrder: 1,
    stepName: '',
    mode: '',
    passingCriteria: '',
    interviewerName: '',
    sendFeedback: false
  };

  // Options from create-assessment component
  stepNameOptions = [
    'Resume Screening',
    'Technical Interview',
    'Managerial Round',
    'HR Round',
    'Coding Test',
    'Group Discussion',
    'Case Study',
    'Aptitude Test',
    'Psychometric Test',
    'Portfolio Review',
    'Assignment Evaluation',
    'Presentation Round',
    'Background Verification',
    'Offer Discussion',
    'Reference Check'
  ];

  modeOptions = [
    'Manual',
    'AI Enabled'
  ];

  interviewerOptions = [
    'John Smith - Technical Interviewer',
    'Sarah Johnson - HR Interviewer',
    'Mike Davis - Managerial Interviewer',
    'Emily Chen - Coding Test Assessor',
    'David Wilson - Resume Screening',
    'Priya Patel - Group Discussion Moderator',
    'Carlos Martinez - Case Study Evaluator',
    'Linda Brown - Aptitude Test Assessor',
    'Akash Mehra - Psychometric Test Assessor',
    'Julia Roberts - Portfolio Reviewer',
    'Tom Lee - Assignment Evaluator',
    'Ravi Kumar - Presentation Judge',
    'Anna Ivanova - Background Verification',
    'Mohammed Ali - Offer Discussion',
    'Sofia Rossi - Reference Check'
  ];

  constructor(
    private apiService: ApiService,
    private router: Router // Add Router injection
  ) { }

  ngOnInit() {
    this.fetchJobs();
    this.fetchAssessments();
  }

  navigateToCreateAssessment() {
    this.router.navigate(['assessments/create-assessment']);
  }

  fetchJobs() {
    this.apiService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: () => {
        this.jobs = ApiService.getFallbackJobs ? ApiService.getFallbackJobs() : [];
      }
    });
  }

  getJobById(jobId: number): Job | undefined {
    return this.jobs.find(j => j.id === jobId);
  }

  getJobTitle(jobId: number): string {
    const job = this.getJobById(jobId);
    return job ? job.title : 'Unknown Job';
  }

  fetchAssessments() {
    this.loading = true;
    this.error = null;

    this.apiService.getAssessments().subscribe({
      next: (assessments) => {
        this.assessments = assessments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching assessments:', error);
        this.error = error;
        this.assessments = ApiService.getFallbackAssessments ? ApiService.getFallbackAssessments() : [];
        this.loading = false;
      }
    });
  }

  // Group assessments by title for display
  get assessmentsByTitle(): { [title: string]: Assessment[] } {
    return this.assessments.reduce((groups, assessment) => {
      if (!groups[assessment.title]) {
        groups[assessment.title] = [];
      }
      groups[assessment.title].push(assessment);
      return groups;
    }, {} as { [title: string]: Assessment[] });
  }

  // Get grouped assessments as array for template iteration
  get groupedAssessments(): { title: string; assessments: Assessment[] }[] {
    const grouped = this.assessmentsByTitle;
    return Object.keys(grouped).map(title => ({
      title,
      assessments: grouped[title].sort((a, b) => a.stepOrder - b.stepOrder)
    }));
  }

  // Check if mode requires interviewer
  get showInterviewerField(): boolean {
    return this.editForm.mode === 'Manual';
  }
  // Helper methods to safely access extended properties
  getInterviewerName(assessment: Assessment): string | null {
    return (assessment as any).interviewerName || null;
  }

  getSendFeedback(assessment: Assessment): boolean {
    return (assessment as any).sendFeedback || false;
  }

  // Edit assessment functionality
  startEdit(assessment: Assessment) {
    this.editingAssessment = { ...assessment };
    this.editForm = {
      title: assessment.title,
      stepOrder: assessment.stepOrder,
      stepName: assessment.stepName,
      mode: assessment.mode,
      passingCriteria: assessment.passingCriteria,
      interviewerName: this.getInterviewerName(assessment) || '',
      sendFeedback: this.getSendFeedback(assessment)

    };
  }

  cancelEdit() {
    this.editingAssessment = null;
    this.editForm = {
      title: '',
      stepOrder: 1,
      stepName: '',
      mode: '',
      passingCriteria: '',
      interviewerName: '',
      sendFeedback: false
    };
  }

  onModeChange() {
    // Clear interviewer when switching away from Manual
    if (this.editForm.mode !== 'Manual') {
      this.editForm.interviewerName = '';
    }
  }

  saveEdit() {
    if (!this.editingAssessment) return;

    // Create the payload in the format expected by the API (AssessmentStepPayload format)
    const updatePayload: AssessmentStepPayload = {
      title: this.editForm.title.trim(),
      stepOrder: this.editForm.stepOrder,
      stepName: this.editForm.stepName,
      mode: this.editForm.mode,
      passingCriteria: this.editForm.passingCriteria,
      interviewerName: this.editForm.interviewerName || undefined,
      sendFeedback: this.editForm.sendFeedback
    };

    this.apiService.updateAssessment(this.editingAssessment.id, updatePayload as any).subscribe({
      next: (updated) => {
        // Update the assessment in the local array
        const index = this.assessments.findIndex(a => a.id === updated.id);
        if (index !== -1) {
          this.assessments[index] = updated;
        }
        this.cancelEdit();
      },
      error: (error) => {
        console.error('Error updating assessment:', error);
        this.error = 'Failed to update assessment: ' + error;
      }
    });
  }

  // Delete assessment functionality
  deleteAssessment(assessment: Assessment) {
    if (!confirm(`Are you sure you want to delete "${assessment.stepName}" from "${assessment.title}"?`)) {
      return;
    }

    this.apiService.deleteAssessment(assessment.id).subscribe({
      next: () => {
        // Remove the assessment from the local array
        this.assessments = this.assessments.filter(a => a.id !== assessment.id);
      },
      error: (error) => {
        console.error('Error deleting assessment:', error);
        this.error = 'Failed to delete assessment: ' + error;
      }
    });
  }
}
