import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent {
  jobs: Job[] = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Bangalore, India',
      description: 'Develop and maintain web applications using Angular and Spring Boot.'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'GrowEasy',
      location: 'Mumbai, India',
      description: 'Lead product development and strategy for AI-driven solutions.'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'AI Innovations',
      location: 'Delhi, India',
      description: 'Analyze data and build machine learning models for recruitment.'
    }
  ];

  postJob(jobId: number, jobTitle: string) {
    console.log(`Posting job ID: ${jobId} - ${jobTitle} to hiring platforms`);
    // Placeholder for posting logic (e.g., API call to hiring platforms)
  }
}