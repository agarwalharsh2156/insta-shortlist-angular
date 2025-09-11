import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, AssessmentStepPayload } from '../../api.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Simple extension to add the two new fields

@Component({
  selector: 'app-create-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  assessmentTitle: string = '';
  steps: Omit<AssessmentStepPayload, 'title'>[] = [
    { stepOrder: 1, stepName: '', mode: '', passingCriteria: '', interviewerName: '', sendFeedback: false }
  ];
  loading = false;
  success = false;
  error: string | null = null;

  // Existing dropdown state management
  activeStepDropdown: number | null = null;
  activeModeDropdown: number | null = null;
  activeInterviewerDropdown: number | null = null; // Just add interviewer dropdown state

  filteredStepNames: { [key: number]: string[] } = {};
  filteredModeNames: { [key: number]: string[] } = {};
  filteredInterviewerNames: { [key: number]: string[] } = {}; // Add interviewer filtering

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

  // Simple interviewer list
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

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // Initialize filtered options for existing steps
    this.steps.forEach((_, index) => {
      this.filteredStepNames[index] = [...this.stepNameOptions];
      this.filteredModeNames[index] = [...this.modeOptions];
      this.filteredInterviewerNames[index] = [...this.interviewerOptions]; // Add this line
    });
  }

  addStep() {
    const newIndex = this.steps.length;
    this.steps.push({
      stepOrder: this.steps.length + 1,
      stepName: '',
      mode: '',
      passingCriteria: '',
      interviewerName: '',
      sendFeedback: false
    });
    // Initialize filtered options for the new step
    this.filteredStepNames[newIndex] = [...this.stepNameOptions];
    this.filteredModeNames[newIndex] = [...this.modeOptions];
    this.filteredInterviewerNames[newIndex] = [...this.interviewerOptions]; // Add this line
  }

  removeStep(index: number) {
    if (this.steps.length > 1) {
      this.steps.splice(index, 1);
      // Clean up filtered options
      delete this.filteredStepNames[index];
      delete this.filteredModeNames[index];
      delete this.filteredInterviewerNames[index]; // Add this line

      // Reindex remaining filtered options
      const newFilteredStepNames: { [key: number]: string[] } = {};
      const newFilteredModeNames: { [key: number]: string[] } = {};
      const newFilteredInterviewerNames: { [key: number]: string[] } = {}; // Add this line

      this.steps.forEach((_, i) => {
        const oldIndex = i < index ? i : i + 1;
        newFilteredStepNames[i] = this.filteredStepNames[oldIndex] || [...this.stepNameOptions];
        newFilteredModeNames[i] = this.filteredModeNames[oldIndex] || [...this.modeOptions];
        newFilteredInterviewerNames[i] = this.filteredInterviewerNames[oldIndex] || [...this.interviewerOptions]; // Add this line
      });

      this.filteredStepNames = newFilteredStepNames;
      this.filteredModeNames = newFilteredModeNames;
      this.filteredInterviewerNames = newFilteredInterviewerNames; // Add this line
    }
  }

  // Existing step dropdown methods (unchanged)
  toggleStepDropdown(index: number, show: boolean) {
    this.activeStepDropdown = show ? index : null;
    if (show) {
      this.activeModeDropdown = null;
      this.activeInterviewerDropdown = null; // Add this line
      this.filteredStepNames[index] = [...this.stepNameOptions];
    }
  }

  filterStepOptions(event: any, index: number) {
    const query = event.target.value.toLowerCase();
    this.filteredStepNames[index] = this.stepNameOptions.filter(option =>
      option.toLowerCase().includes(query)
    );
  }

  selectStepOption(option: string, index: number) {
    this.steps[index].stepName = option;
    this.activeStepDropdown = null;
  }

  getFilteredStepOptions(index: number): string[] {
    return this.filteredStepNames[index] || this.stepNameOptions;
  }

  // Existing mode dropdown methods (unchanged)
  toggleModeDropdown(index: number, show: boolean) {
    this.activeModeDropdown = show ? index : null;
    if (show) {
      this.activeStepDropdown = null;
      this.activeInterviewerDropdown = null; // Add this line
      this.filteredModeNames[index] = [...this.modeOptions];
    }
  }

  filterModeOptions(event: any, index: number) {
    const query = event.target.value.toLowerCase();
    this.filteredModeNames[index] = this.modeOptions.filter(option =>
      option.toLowerCase().includes(query)
    );
  }

  selectModeOption(option: string, index: number) {
    this.steps[index].mode = option;
    this.activeModeDropdown = null;

    // Clear interviewer if not Manual
    if (option !== 'Manual') {
      this.steps[index].interviewerName = '';
    }
  }

  getFilteredModeOptions(index: number): string[] {
    return this.filteredModeNames[index] || this.modeOptions;
  }

  // NEW: Interviewer dropdown methods (copy of mode dropdown pattern)
  toggleInterviewerDropdown(index: number, show: boolean) {
    this.activeInterviewerDropdown = show ? index : null;
    if (show) {
      this.activeStepDropdown = null;
      this.activeModeDropdown = null;
      this.filteredInterviewerNames[index] = [...this.interviewerOptions];
    }
  }

  filterInterviewerOptions(event: any, index: number) {
    const query = event.target.value.toLowerCase();
    this.filteredInterviewerNames[index] = this.interviewerOptions.filter(option =>
      option.toLowerCase().includes(query)
    );
  }

  selectInterviewerOption(option: string, index: number) {
    this.steps[index].interviewerName = option;
    this.activeInterviewerDropdown = null;
  }

  getFilteredInterviewerOptions(index: number): string[] {
    return this.filteredInterviewerNames[index] || this.interviewerOptions;
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown-wrapper')) {
      this.activeStepDropdown = null;
      this.activeModeDropdown = null;
      this.activeInterviewerDropdown = null; // Add this line
    }
  }

  moveStepUp(index: number) {
    if (index > 0) {
      const temp = this.steps[index];
      this.steps[index] = this.steps[index - 1];
      this.steps[index - 1] = temp;
      setTimeout(() => {
        this.updateFilteredOptions();
      }, 0);
    }
  }

  moveStepDown(index: number) {
    if (index < this.steps.length - 1) {
      const temp = this.steps[index];
      this.steps[index] = this.steps[index + 1];
      this.steps[index + 1] = temp;
      setTimeout(() => {
        this.updateFilteredOptions();
      }, 0);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  private updateFilteredOptions() {
    const newFilteredStepNames: { [key: number]: string[] } = {};
    const newFilteredModeNames: { [key: number]: string[] } = {};
    const newFilteredInterviewerNames: { [key: number]: string[] } = {}; // Add this line

    this.steps.forEach((_, i) => {
      newFilteredStepNames[i] = [...this.stepNameOptions];
      newFilteredModeNames[i] = [...this.modeOptions];
      newFilteredInterviewerNames[i] = [...this.interviewerOptions]; // Add this line
    });

    this.filteredStepNames = newFilteredStepNames;
    this.filteredModeNames = newFilteredModeNames;
    this.filteredInterviewerNames = newFilteredInterviewerNames; // Add this line
  }

  submit() {
    if (!this.assessmentTitle.trim()) {
      this.error = 'Please enter an assessment title.';
      return;
    }

    this.loading = true;
    this.success = false;
    this.error = null;

    const payload: AssessmentStepPayload[] = this.steps.map(step => ({
      title: this.assessmentTitle.trim(),
      stepOrder: step.stepOrder,
      stepName: step.stepName,
      mode: step.mode,
      passingCriteria: step.passingCriteria,
      interviewerName: step.interviewerName,
      sendFeedback: step.sendFeedback
    }));


    this.apiService.createAssessment(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = err;
      }
    });
  }
}