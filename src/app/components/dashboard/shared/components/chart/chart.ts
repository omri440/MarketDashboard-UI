import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.html',
  styleUrl: './chart.scss'
})
export class Chart {
  @Input() data: { label: string; value: number }[] = [];
  @Input() type: 'line' | 'bar' = 'line';
  @ViewChild('chartCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    setTimeout(() => this.drawChart(), 100);
  }

  private drawChart(): void {
    if (!this.canvas) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const { width, height } = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;

    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Draw background
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (plotHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    if (this.data.length === 0) return;

    // Find min/max values
    const values = this.data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Draw line/bars
    ctx.strokeStyle = '#6366f1';
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Calculate points
    const points = this.data.map((d, i) => ({
      x: padding + (plotWidth / (this.data.length - 1 || 1)) * i,
      y: height - padding - ((d.value - minValue) / range) * plotHeight
    }));

    if (this.type === 'line') {
      // Draw line
      ctx.beginPath();
      points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Fill area under line
      ctx.lineTo(points[points.length - 1].x, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fill();
    }

    // Draw points
    ctx.fillStyle = '#6366f1';
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    this.data.forEach((d, i) => {
      const x = padding + (plotWidth / (this.data.length - 1 || 1)) * i;
      ctx.fillText(d.label, x, height - padding + 20);
    });
  }
}
