import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // Public routes (no AuthGuard)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'apply/:jobId',
    loadComponent: () => import('./candidates/create-candidate/create-candidate.component')
      .then(m => m.CreateCandidateComponent)
  },

  // Protected routes (with AuthGuard) - All lazy loaded
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },

  // Jobs module routes
  {
    path: 'jobs',
    loadComponent: () => import('./jobs/jobs.component')
      .then(m => m.JobsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/create-job',
    loadComponent: () => import('./jobs/create-job/create-job.component')
      .then(m => m.CreateJobComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/edit-job/:id',
    loadComponent: () => import('./jobs/edit-job/edit-job.component')
      .then(m => m.EditJobComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/view-job/:id',
    loadComponent: () => import('./jobs/view-job/view-job.component')
      .then(m => m.ViewJobComponent),
    canActivate: [AuthGuard]
  },

  // Candidates module routes
  {
    path: 'candidates',
    loadComponent: () => import('./candidates/candidates.component')
      .then(m => m.CandidatesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'candidates/create-candidate',
    loadComponent: () => import('./candidates/create-candidate/create-candidate.component')
      .then(m => m.CreateCandidateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'candidates/edit-candidate/:id',
    loadComponent: () => import('./candidates/edit-candidate/edit-candidate.component')
      .then(m => m.EditCandidateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'candidates/view-candidate/:id',
    loadComponent: () => import('./candidates/view-candidate/view-candidate.component')
      .then(m => m.ViewCandidateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'candidates/view-candidate/:id/review/:stepId',
    loadComponent: () => import('./candidates/review-form/review-form.component')
      .then(m => m.ReviewFormComponent),
    canActivate: [AuthGuard]
  },

  // Assessments module routes
  {
    path: 'assessments',
    loadComponent: () => import('./assessments/assessments.component')
      .then(m => m.AssessmentsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'assessments/create-assessment',
    loadComponent: () => import('./assessments/create-assessment/create-assessment.component')
      .then(m => m.CreateAssessmentComponent),
    canActivate: [AuthGuard]
  },

  // Offers route
  {
    path: 'offers',
    loadComponent: () => import('./offers/offers.component')
      .then(m => m.OffersComponent),
    canActivate: [AuthGuard]
  },

  // Default route - Protected and redirects to dashboard after authentication
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Wildcard route for 404s (optional)
  {
    path: '**',
    redirectTo: '/login'
  }
];
