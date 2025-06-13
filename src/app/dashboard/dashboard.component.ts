import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

// Register all necessary Chart.js components for usage
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard', // Selector for this component
  standalone: true, // Allows this component to be used standalone
  imports: [CommonModule, BaseChartDirective], // Import Angular common module and chart directive
  templateUrl: './dashboard.component.html', // HTML template for the dashboard
  styleUrls: ['./dashboard.component.css'] // CSS styles for the dashboard
})
// Find the tallest bar and assign green, others purple


export class DashboardComponent {

  private barData = [100, 45, 20, 30];
  private maxBar = Math.max(...this.barData);
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 0, max: this.maxBar + 20 } },
    plugins: { legend: { display: false } }
  };

  public barChartType: ChartType = 'bar';



  public barChartData: ChartData<'bar'> = {
    labels: ['Applied', 'Interviewed', 'Offered', 'Rejected'],
    datasets: [
      {
        data: this.barData,
        label: 'Applications',
        backgroundColor: this.barData.map(v =>
          v === this.maxBar ? 'rgb(210, 245, 91)' : 'rgb(202, 210, 255)'
        )
      }
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };

  public pieChartType: ChartType = 'pie';

  // Pie: largest slice green, others purple shades
  private pieData = [50, 30, 20, 10];
  private maxPie = Math.max(...this.pieData);
  private purpleShades = [
    'rgb(202, 210, 255)',
    'rgba(202, 210, 255, 0.7)',
    'rgba(202, 210, 255, 0.5)'
  ];

  public pieChartData: ChartData<'pie'> = {
    labels: ['Engineering', 'Marketing', 'Sales', 'HR'],
    datasets: [
      {
        data: this.pieData,
        backgroundColor: this.pieData.map((v, i) =>
          v === this.maxPie
            ? 'rgb(210, 245, 91)'
            : this.purpleShades[(i - (this.pieData.indexOf(this.maxPie) < i ? 1 : 0)) % this.purpleShades.length]
        )
      }
    ]
  };
}