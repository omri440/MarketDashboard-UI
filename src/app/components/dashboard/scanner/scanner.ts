import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../shared/components/card/card';
import { MockDataService,Scanner } from '../services/mock-data.service';

@Component({
  selector: 'app-scanner',
  imports: [CommonModule, Card],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss'
})
export class ScannerComponent{
    allScanners: Scanner[] = [];
  activeFilter = signal<'all' | 'gainers' | 'losers' | 'active'>('all');
  Math = Math;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.allScanners = this.mockDataService.getScanners();
  }

  setFilter(filter: 'all' | 'gainers' | 'losers' | 'active'): void {
    this.activeFilter.set(filter);
  }

  filteredScanners(): Scanner[] {
    const filter = this.activeFilter();

    if (filter === 'all') return this.allScanners;
    if (filter === 'gainers') return this.allScanners.filter(s => s.changePercent > 0);
    if (filter === 'losers') return this.allScanners.filter(s => s.changePercent < 0);
    if (filter === 'active') return this.allScanners.filter(s => s.category === 'Most Active');

    return this.allScanners;
  }

  formatVolume(volume: number): string {
    if (volume >= 1000000) return (volume / 1000000).toFixed(1) + 'M';
    if (volume >= 1000) return (volume / 1000).toFixed(1) + 'K';
    return volume.toString();
  }

}
