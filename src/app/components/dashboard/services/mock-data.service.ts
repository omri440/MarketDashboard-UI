// mock-data.service.ts
import { Injectable } from '@angular/core';

export interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  date: Date;
  profit: number;
  profitPercent: number;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pl: number;
  plPercent: number;
}

export interface Scanner {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  category: string;
}

export interface AnalyticsData {
  date: string;
  cumProfit: number;
  trades: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  getTrades(): Trade[] {
    return [
      {
        id: '1',
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        entryPrice: 175.5,
        exitPrice: 182.3,
        date: new Date('2025-10-15'),
        profit: 680,
        profitPercent: 3.88
      },
      {
        id: '2',
        symbol: 'GOOGL',
        side: 'BUY',
        quantity: 5,
        entryPrice: 140.2,
        exitPrice: 138.9,
        date: new Date('2025-10-14'),
        profit: -65,
        profitPercent: -1.09
      },
      {
        id: '3',
        symbol: 'MSFT',
        side: 'SELL',
        quantity: 8,
        entryPrice: 420.5,
        exitPrice: 425.8,
        date: new Date('2025-10-13'),
        profit: -424,
        profitPercent: -1.26
      },
      {
        id: '4',
        symbol: 'TSLA',
        side: 'BUY',
        quantity: 20,
        entryPrice: 245.1,
        exitPrice: 258.7,
        date: new Date('2025-10-12'),
        profit: 2720,
        profitPercent: 5.57
      },
      {
        id: '5',
        symbol: 'NVDA',
        side: 'BUY',
        quantity: 3,
        entryPrice: 875.2,
        exitPrice: 895.5,
        date: new Date('2025-10-11'),
        profit: 609,
        profitPercent: 2.32
      }
    ];
  }

  getHoldings(): Holding[] {
    return [
      {
        symbol: 'AAPL',
        quantity: 50,
        avgPrice: 170.2,
        currentPrice: 182.3,
        value: 9115,
        pl: 605,
        plPercent: 7.11
      },
      {
        symbol: 'MSFT',
        quantity: 25,
        avgPrice: 410.5,
        currentPrice: 425.8,
        value: 10645,
        pl: 382.5,
        plPercent: 3.73
      },
      {
        symbol: 'GOOGL',
        quantity: 15,
        avgPrice: 135.8,
        currentPrice: 138.9,
        value: 2083.5,
        pl: 46.5,
        plPercent: 2.28
      },
      {
        symbol: 'TSLA',
        quantity: 40,
        avgPrice: 240.5,
        currentPrice: 258.7,
        value: 10348,
        pl: 728,
        plPercent: 7.56
      },
      {
        symbol: 'NVDA',
        quantity: 8,
        avgPrice: 860.2,
        currentPrice: 895.5,
        value: 7164,
        pl: 282.4,
        plPercent: 4.10
      }
    ];
  }

  getScanners(): Scanner[] {
    return [
      {
        symbol: 'MSTR',
        price: 245.3,
        change: 18.5,
        changePercent: 8.18,
        volume: 2450000,
        category: 'Top Gainers'
      },
      {
        symbol: 'COIN',
        price: 165.8,
        change: 12.3,
        changePercent: 8.01,
        volume: 3120000,
        category: 'Top Gainers'
      },
      {
        symbol: 'CRM',
        price: 312.5,
        change: -15.2,
        changePercent: -4.64,
        volume: 1890000,
        category: 'Top Losers'
      },
      {
        symbol: 'AMZN',
        price: 198.7,
        change: 8.2,
        changePercent: 4.31,
        volume: 4230000,
        category: 'Most Active'
      },
      {
        symbol: 'META',
        price: 545.9,
        change: 22.1,
        changePercent: 4.22,
        volume: 3560000,
        category: 'Top Gainers'
      },
      {
        symbol: 'NFLX',
        price: 287.4,
        change: -18.6,
        changePercent: -6.07,
        volume: 2780000,
        category: 'Top Losers'
      }
    ];
  }

  getAnalytics(): AnalyticsData[] {
    return [
      { date: '10/01', cumProfit: 145, trades: 2 },
      { date: '10/02', cumProfit: 425, trades: 4 },
      { date: '10/03', cumProfit: 280, trades: 3 },
      { date: '10/04', cumProfit: 812, trades: 5 },
      { date: '10/05', cumProfit: 645, trades: 4 },
      { date: '10/06', cumProfit: 1230, trades: 6 },
      { date: '10/07', cumProfit: 1560, trades: 7 },
      { date: '10/08', cumProfit: 1450, trades: 5 },
      { date: '10/09', cumProfit: 2105, trades: 8 },
      { date: '10/10', cumProfit: 1945, trades: 6 },
      { date: '10/11', cumProfit: 2554, trades: 7 },
      { date: '10/12', cumProfit: 3274, trades: 8 },
      { date: '10/13', cumProfit: 2850, trades: 6 },
      { date: '10/14', cumProfit: 2785, trades: 5 },
      { date: '10/15', cumProfit: 3465, trades: 7 }
    ];
  }

  getPortfolioSummary() {
    const holdings = this.getHoldings();
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const totalPL = holdings.reduce((sum, h) => sum + h.pl, 0);
    const avgReturn = holdings.length > 0 ? (totalPL / (totalValue - totalPL)) * 100 : 0;

    return {
      totalValue: totalValue,
      totalPL: totalPL,
      plPercent: (totalPL / (totalValue - totalPL)) * 100,
      holdings: holdings.length,
      winRate: 60
    };
  }

  getJournalStats() {
    const trades = this.getTrades();
    const winners = trades.filter(t => t.profit > 0).length;
    const totalTrades = trades.length;
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const avgTrade = totalProfit / totalTrades;

    return {
      totalTrades,
      winners,
      losers: totalTrades - winners,
      winRate: (winners / totalTrades) * 100,
      totalProfit,
      avgTrade
    };
  }
}