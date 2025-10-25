import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../shared/components/card/card';
import { StatCard } from '../shared/components/stat-card/stat-card';
import { Chart } from '../shared/components/chart/chart';
import { LiveQuoteComponent } from '../shared/components/live-quote/live-quote';
import { DataService } from '../../../services/data.service';
import { MockDataService } from '../services/mock-data.service';
import { BrokerService } from '../../../services/broker.service';
import { StockQuote } from '../../../models/broker.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, Card, StatCard, Chart, LiveQuoteComponent],
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
  isLoadingData = signal(true);
  isUsingRealData = signal(false);

  // Stock quote lookup
  symbolInput = '';
  stockQuote = signal<StockQuote | null>(null);
  isLoadingQuote = signal(false);
  quoteError = signal<string | null>(null);

  constructor(
    private dataService: DataService,
    private mockDataService: MockDataService,
    private brokerService: BrokerService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoadingData.set(true);

    // Load portfolio summary
    this.dataService.getPortfolioSummary().subscribe({
      next: (summary) => {
        this.portfolioSummary = summary;
        this.isUsingRealData.set(this.dataService.isUsingRealData());
      },
      error: (err) => console.error('Error loading portfolio summary:', err)
    });

    // Load journal stats
    this.dataService.getJournalStats().subscribe({
      next: (stats) => {
        this.journalStats = stats;
      },
      error: (err) => console.error('Error loading journal stats:', err),
      complete: () => this.isLoadingData.set(false)
    });

    // Load chart data (still using mock for now)
    this.chartData = this.mockDataService.getAnalytics().map(d => ({
      label: d.date,
      value: d.cumProfit
    }));
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  /**
   * Fetch stock quote for the entered symbol
   */
  fetchQuote(): void {
    const symbol = this.symbolInput.trim().toUpperCase();

    if (!symbol) {
      this.quoteError.set('Please enter a stock symbol');
      return;
    }

    if (!this.brokerService.hasConnectedBroker()) {
      this.quoteError.set('Please connect to a broker first');
      return;
    }

    this.isLoadingQuote.set(true);
    this.quoteError.set(null);
    this.stockQuote.set(null);

    this.brokerService.getStockQuote(symbol).subscribe({
      next: (quote) => {
        this.stockQuote.set(quote);
        this.isLoadingQuote.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.detail || `Failed to get quote for ${symbol}`;
        this.quoteError.set(errorMsg);
        this.isLoadingQuote.set(false);
      }
    });
  }

  /**
   * Handle Enter key press in input
   */
  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.fetchQuote();
    }
  }

}
