// data.service.ts - Smart data service that uses broker or mock data
import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BrokerService } from './broker.service';
import { MockDataService, Trade, Holding } from '../components/dashboard/services/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Track if we're using real or mock data
  usingRealData = signal(false);

  constructor(
    private brokerService: BrokerService,
    private mockDataService: MockDataService
  ) {}

  /**
   * Get portfolio holdings - real data if broker connected, otherwise mock
   */
  getHoldings(): Observable<Holding[]> {
    if (this.brokerService.hasConnectedBroker()) {
      this.usingRealData.set(true);
      return this.brokerService.getPositions().pipe(
        map(positions => positions.map(pos => ({
          symbol: pos.symbol,
          quantity: pos.quantity,
          avgPrice: pos.avg_price,
          currentPrice: pos.current_price,
          value: pos.market_value,
          pl: pos.unrealized_pnl,
          plPercent: pos.unrealized_pnl_percent
        }))),
        catchError(error => {
          console.warn('Failed to fetch real holdings, falling back to mock:', error);
          this.usingRealData.set(false);
          return of(this.mockDataService.getHoldings());
        })
      );
    } else {
      this.usingRealData.set(false);
      return of(this.mockDataService.getHoldings());
    }
  }

  /**
   * Get trades - real data if broker connected, otherwise mock
   */
  getTrades(): Observable<Trade[]> {
    if (this.brokerService.hasConnectedBroker()) {
      this.usingRealData.set(true);
      return this.brokerService.getTrades().pipe(
        map(trades => trades.map(trade => {
          // For closed trades, we need to calculate profit
          // This is a simplified version - you may need more logic
          const profit = 0; // Would need to calculate from paired trades
          const profitPercent = 0;

          return {
            id: trade.id?.toString() ?? '',
            symbol: trade.symbol,
            side: trade.side,
            quantity: trade.quantity,
            entryPrice: trade.price,
            exitPrice: trade.price, // Would need paired trade data
            date: new Date(trade.execution_time),
            profit: profit,
            profitPercent: profitPercent
          };
        })),
        catchError(error => {
          console.warn('Failed to fetch real trades, falling back to mock:', error);
          this.usingRealData.set(false);
          return of(this.mockDataService.getTrades());
        })
      );
    } else {
      this.usingRealData.set(false);
      return of(this.mockDataService.getTrades());
    }
  }

  /**
   * Get portfolio summary - real data if broker connected, otherwise mock
   */
  getPortfolioSummary(): Observable<{
    totalValue: number;
    totalPL: number;
    plPercent: number;
    holdings: number;
    winRate: number;
  }> {
    if (this.brokerService.hasConnectedBroker()) {
      this.usingRealData.set(true);
      return this.brokerService.getPortfolioSummary().pipe(
        map(summary => ({
          totalValue: summary.total_value,
          totalPL: summary.total_pnl,
          plPercent: summary.total_pnl_percent,
          holdings: summary.positions_count,
          winRate: 0 // Would need to calculate from trades
        })),
        catchError(error => {
          console.warn('Failed to fetch real portfolio summary, falling back to mock:', error);
          this.usingRealData.set(false);
          return of(this.mockDataService.getPortfolioSummary());
        })
      );
    } else {
      this.usingRealData.set(false);
      return of(this.mockDataService.getPortfolioSummary());
    }
  }

  /**
   * Get journal stats - calculated from trades
   */
  getJournalStats(): Observable<{
    totalTrades: number;
    winners: number;
    losers: number;
    winRate: number;
    totalProfit: number;
    avgTrade: number;
  }> {
    return this.getTrades().pipe(
      map(trades => {
        const winners = trades.filter(t => t.profit > 0).length;
        const totalTrades = trades.length;
        const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
        const avgTrade = totalTrades > 0 ? totalProfit / totalTrades : 0;

        return {
          totalTrades,
          winners,
          losers: totalTrades - winners,
          winRate: totalTrades > 0 ? (winners / totalTrades) * 100 : 0,
          totalProfit,
          avgTrade
        };
      })
    );
  }

  /**
   * Get scanners - always use mock for now (until scanner backend is ready)
   */
  getScanners() {
    return this.mockDataService.getScanners();
  }

  /**
   * Get analytics data
   */
  getAnalytics() {
    return this.mockDataService.getAnalytics();
  }

  /**
   * Check if currently using real broker data
   */
  isUsingRealData(): boolean {
    return this.usingRealData();
  }

  /**
   * Check if broker is connected
   */
  isBrokerConnected(): boolean {
    return this.brokerService.hasConnectedBroker();
  }
}
