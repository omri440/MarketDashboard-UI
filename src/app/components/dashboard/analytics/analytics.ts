import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../shared/components/card/card';
import { MockDataService,Scanner } from '../services/mock-data.service';
import { StatCard } from '../shared/components/stat-card/stat-card';
import { Chart } from '../shared/components/chart/chart';





@Component({
  selector: 'app-analytics',
  standalone:true,
  imports: [CommonModule, Card, Chart, StatCard],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics implements OnInit{
    metrics = {
    totalReturn: 12.5,
    winRate: 60,
    profitFactor: 2.8,
    maxDrawdown: -8.5,
    sharpeRatio: 1.85,
    avgTrade: 312.5,
    totalTrades: 30,
    winningTrades: 18,
    losingTrades: 10,
    breakEven: 2
  };

  profitChartData: { label: string; value: number }[] = [];

  monthlySummary = [
    { month: 'Jan', profit: 2450, trades: 12 },
    { month: 'Feb', profit: 1890, trades: 10 },
    { month: 'Mar', profit: 3240, trades: 15 },
    { month: 'Apr', profit: -580, trades: 8 },
    { month: 'May', profit: 4120, trades: 18 },
    { month: 'Jun', profit: 2890, trades: 14 }
  ];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.profitChartData = this.mockDataService.getAnalytics().map(d => ({
      label: d.date,
      value: d.cumProfit
    }));
  }

}
