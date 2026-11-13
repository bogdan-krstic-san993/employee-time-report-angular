import { Component, inject, signal,ElementRef, viewChild, OnInit  } from '@angular/core';
import { TimeEntryService } from './services/time-entry';
import { EmployeeTotal } from './models/employee-total';
import { DecimalPipe } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  imports: [DecimalPipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly pieCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('pieCanvas');
  private chart?: Chart<'pie'>;

  private readonly timeEntryService=inject(TimeEntryService);

  employees=signal<EmployeeTotal[]>([]);
  error =signal('');

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees(){

    this.error.set('');

    this.timeEntryService.getTimeEntries().subscribe({
      next: (entries) => {
        this.employees.set(
          this.timeEntryService.calculateTotals(entries)
        );
        this.drawChart();
      },
      error: () => {
        this.error.set('Podaci nisu ucitani. Proveri kljuc i vezu.');
      },
    });
  }

  downloadChart() {
    if (!this.chart) {
      return;
    }

    const link = document.createElement('a');
    link.href = this.chart.toBase64Image();
    link.download = 'employee-time-report.png';
    link.click();
  }

  private drawChart() {
  this.chart?.destroy();

  const employees = this.employees();
  const totalHours = employees.reduce(
    (sum, employee) => sum + employee.totalHours,
    0
  );

  this.chart = new Chart(this.pieCanvas().nativeElement, {
      type: 'pie',
      plugins: [
        {
          id: 'percentageLabels',
          afterDatasetsDraw: (chart) => {
            if (totalHours <= 0) return;

            const ctx = chart.ctx;
            ctx.save();
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';

            chart.getDatasetMeta(0).data.forEach((slice, index) => {
              const hours = employees[index].totalHours;
              if (!chart.getDataVisibility(index) || hours <= 0) return;

              const position = slice.tooltipPosition(false);
              if (position.x == null || position.y == null) return;

              const label = `${((hours / totalHours) * 100).toFixed(1)}%`;
              ctx.strokeText(label, position.x, position.y);
              ctx.fillText(label, position.x, position.y);
            });

            ctx.restore();
          },
        },
      ],
      data: {
        labels: employees.map(employee => employee.employeeName),
        datasets: [
          {
            data: employees.map(employee => employee.totalHours),
            backgroundColor: [
              '#4477aa', '#ee8833', '#449944', '#cc3333',
              '#9966bb', '#885544', '#dd77bb', '#888888',
              '#bbbb33', '#44bbcc',
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const hours = context.parsed;
                const percentage = totalHours > 0
                  ? (hours / totalHours) * 100
                  : 0;

                return `${context.label}: ${hours.toFixed(2)} hrs (${percentage.toFixed(1)}%)`;
              },
            },
          },
        },
      },
    });
  }

}
