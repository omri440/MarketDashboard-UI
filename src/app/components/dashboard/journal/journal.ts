import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../shared/components/card/card';
import { StatCard } from '../shared/components/stat-card/stat-card';
import { MockDataService, Trade } from '../services/mock-data.service';

@Component({
  selector: 'app-journal',
  imports: [CommonModule, Card, StatCard],
  templateUrl: './journal.html',
  styleUrl: './journal.scss'
})
export class Journal implements OnInit {
    trades: Trade[] = [];
    stats = {
    totalTrades: 0,
    winners: 0,
    losers: 0,
    winRate: 0,
    totalProfit: 0,
    avgTrade: 0
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.trades = this.mockDataService.getTrades();
    this.stats = this.mockDataService.getJournalStats();
  }

}
