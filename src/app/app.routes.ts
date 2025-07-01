import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { CreateJobComponent } from './jobs/create-job/create-job.component';
import { EditJobComponent } from './jobs/edit-job/edit-job.component';
import { AuthGuard } from './auth.guard';
import { CandidatesComponent } from './candidates/candidates.component'
import { CreateCandidateComponent } from './candidates/create-candidate/create-candidate.component';
import { EditCandidateComponent } from './candidates/edit-candidate/edit-candidate.component';
import { OffersComponent } from './offers/offers.component';
import { ViewJobComponent } from './jobs/view-job/view-job.component';
import { ViewCandidateComponent } from './candidates/view-candidate/view-candidate.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] },
  { path: 'candidates', component: CandidatesComponent, canActivate: [AuthGuard] },
  { path: 'jobs/create-job', component: CreateJobComponent, canActivate: [AuthGuard] },
  { path: 'jobs/edit-job/:id', component: EditJobComponent, canActivate: [AuthGuard] },
  { path: 'candidates/create-candidate', component: CreateCandidateComponent, canActivate: [AuthGuard] },
  { path: 'offers', component: OffersComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'candidates/create-candidate', component: CreateCandidateComponent, canActivate: [AuthGuard] },
  { path: 'candidates/edit-candidate/:id', component: EditCandidateComponent, canActivate: [AuthGuard] },
  { path: 'jobs/view-job/:id', component: ViewJobComponent, canActivate: [AuthGuard] },
  { path: 'candidates/view-candidate/:id', component: ViewCandidateComponent, canActivate: [AuthGuard] },
];