import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCard {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() subtitle = '';
  @Input() isPositive = true;
  @Input() format: 'number' | 'currency' | 'percent' = 'number';

  get formattedValue(): string {
    if (typeof this.value === 'string') return this.value;

    switch (this.format) {
      case 'currency':
        return `$${this.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
      case 'percent':
        return `${(this.value as number).toFixed(2)}%`;
      default:
        return this.value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  }

}
