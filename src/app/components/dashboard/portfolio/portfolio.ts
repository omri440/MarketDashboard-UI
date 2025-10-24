import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../shared/components/card/card';
import { StatCard } from '../shared/components/stat-card/stat-card';
import { MockDataService,Holding } from '../services/mock-data.service'; 
@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, Card, StatCard],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio implements OnInit {
holdings: Holding[] = [];
  summary = {
    totalValue: 0,
    totalPL: 0,
    returnPercent: 0
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.holdings = this.mockDataService.getHoldings();
    const portfolioSummary = this.mockDataService.getPortfolioSummary();
    this.summary = {
      totalValue: portfolioSummary.totalValue,
      totalPL: portfolioSummary.totalPL,
      returnPercent: portfolioSummary.plPercent
    };
  }

}
