import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../shared/components/card/card';
import { StatCard } from '../shared/components/stat-card/stat-card';
import { Chart } from '../shared/components/chart/chart';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,Card,StatCard,Chart],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
    portfolioSummary = {
    totalValue: 0,
    totalPL: 0,
    plPercent: 0,
    holdings: 0,
    winRate: 0
  };

  journalStats = {
    totalTrades: 0,
    winners: 0,
    losers: 0,
    winRate: 0,
    totalProfit: 0,
    avgTrade: 0
  };

  chartData: { label: string; value: number }[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.portfolioSummary = this.mockDataService.getPortfolioSummary();
    this.journalStats = this.mockDataService.getJournalStats();
    this.chartData = this.mockDataService.getAnalytics().map(d => ({
      label: d.date,
      value: d.cumProfit
    }));
  }

}
