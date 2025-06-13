import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-offers-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent {
  // Stat cards data
  stats = [
    { label: 'Offers Sent', value: 68, icon: 'fa-play', color: '#e6ff5c' },
    { label: 'Offers Accepted', value: 36, icon: 'fa-check-circle', color: '#e6ff5c' },
    { label: 'Offers Declined', value: 24, icon: 'fa-envelope-open-text', color: '#e6ff5c' }
  ];

  // Offer Patterns Bar Chart
  private offerPatternsAccepted = [41, 55, 41, 60, 50, 70, 60, 65];
  private offerPatternsDeclined = [37, 30, 37, 40, 35, 45, 40, 42];
  private offerPatternsMax = Math.max(
    ...[...this.offerPatternsAccepted, ...this.offerPatternsDeclined]
  );

  public offerPatternsOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } },
    scales: {
      x: {},
      y: {
        min: 0,
        max: this.offerPatternsMax + 20,
        beginAtZero: true,
        ticks: { stepSize: 20 }
      }
    }
  };

  public offerPatternsType: ChartType = 'bar';

  public offerPatternsData: ChartData<'bar'> = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Accepted',
        data: this.offerPatternsAccepted,
        backgroundColor: '#e6ff5c'
      },
      {
        label: 'Decline',
        data: this.offerPatternsDeclined,
        backgroundColor: '#bfcaff'
      }
    ]
  };

  // Decline Reasons Doughnut Chart
  declineReasons = [
    { label: 'Salary/Benefits', value: 50 },
    { label: 'Career Growth', value: 44 },
    { label: 'Counter Offer', value: 38 },
    { label: 'Personal Reasons', value: 30 },
    { label: 'Process Issues', value: 24 },
    { label: 'Others', value: 14 }
  ];

  public declineReasonsOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  public declineReasonsType = 'doughnut';

  public declineReasonsData: ChartData<'doughnut'> = {
    labels: this.declineReasons.map(r => r.label),
    datasets: [{
      data: this.declineReasons.map(r => r.value),
      backgroundColor: [
        '#bfcaff', '#e6ff5c', '#c7f5d9', '#ffe6e6', '#e6e6ff', '#f5e6ff'
      ]
    }]
  };

  // Offers by Department (for table/progress bars)
  offersByDepartment = [
    { label: 'Engineering', value: 158 },
    { label: 'Marketing', value: 140 },
    { label: 'Sales', value: 126 },
    { label: 'Customer Support', value: 94 },
    { label: 'Finance', value: 77 },
    { label: 'Human Resources', value: 62 }
  ];

  // Candidates table data
  candidates = [
    {
      name: 'Emily Carter',
      role: 'Digital Marketing Manager',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 12, 2030',
      salary: '$95,000',
      status: 'Sent'
    },
    {
      name: 'Michael Johnson',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 14, 2030',
      salary: '$110,000',
      status: 'Accepted'
    },
    {
      name: 'Angela White',
      role: 'HR Consultant',
      employmentType: 'Part-time',
      workType: 'Hybrid',
      offerDate: 'Oct 10, 2030',
      salary: '$50,000',
      status: 'Declined'
    },
    {
      name: 'Emily Carter',
      role: 'Digital Marketing Manager',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 12, 2030',
      salary: '$95,000',
      status: 'Sent'
    },
    {
      name: 'Michael Johnson',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 14, 2030',
      salary: '$110,000',
      status: 'Accepted'
    },
    {
      name: 'Angela White',
      role: 'HR Consultant',
      employmentType: 'Part-time',
      workType: 'Hybrid',
      offerDate: 'Oct 10, 2030',
      salary: '$50,000',
      status: 'Declined'
    },{
      name: 'Emily Carter',
      role: 'Digital Marketing Manager',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 12, 2030',
      salary: '$95,000',
      status: 'Sent'
    },
    {
      name: 'Michael Johnson',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 14, 2030',
      salary: '$110,000',
      status: 'Accepted'
    },
    {
      name: 'Angela White',
      role: 'HR Consultant',
      employmentType: 'Part-time',
      workType: 'Hybrid',
      offerDate: 'Oct 10, 2030',
      salary: '$50,000',
      status: 'Declined'
    },{
      name: 'Emily Carter',
      role: 'Digital Marketing Manager',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 12, 2030',
      salary: '$95,000',
      status: 'Sent'
    },
    {
      name: 'Michael Johnson',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      workType: 'Remote',
      offerDate: 'Oct 14, 2030',
      salary: '$110,000',
      status: 'Accepted'
    },
    {
      name: 'Angela White',
      role: 'HR Consultant',
      employmentType: 'Part-time',
      workType: 'Hybrid',
      offerDate: 'Oct 10, 2030',
      salary: '$50,000',
      status: 'Declined'
    }
  ];
}