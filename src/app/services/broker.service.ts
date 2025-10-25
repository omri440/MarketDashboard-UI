// broker.service.ts - Service for broker connection management
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import {
  BrokerAccountCreate,
  BrokerAccountResponse,
  BrokerConnectionStatus,
  SyncResponse,
  LiveQuote,
  BrokerPosition,
  BrokerTrade,
  PortfolioSummary,
  BrokerBalance
} from '../models/broker.model';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private apiUrl = `${environment.apiUrl}/broker`;

  // Signals for reactive state
  brokerAccounts = signal<BrokerAccountResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  liveQuote = signal<LiveQuote | null>(null);

  constructor(private http: HttpClient) {
    this.loadBrokerAccounts();
  }

  /**
   * Connect to broker - creates connection and tests it
   */
  connectBroker(account: BrokerAccountCreate): Observable<BrokerAccountResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<BrokerAccountResponse>(`${this.apiUrl}/connect`, account).pipe(
      tap(response => {
        // Add to local state
        this.brokerAccounts.update(accounts => [...accounts, response]);
        this.loading.set(false);
      }),
      catchError(error => {
        const errorMessage = error.error?.detail || 'Failed to connect to broker';
        this.error.set(errorMessage);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all broker accounts for current user
   */
  loadBrokerAccounts(): void {
    this.loading.set(true);

    this.http.get<BrokerAccountResponse[]>(`${this.apiUrl}/accounts`).pipe(
      tap(accounts => {
        this.brokerAccounts.set(accounts);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Failed to load broker accounts');
        this.loading.set(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Disconnect broker account
   */
  disconnectBroker(brokerAccountId: number): Observable<any> {
    this.loading.set(true);

    return this.http.delete(`${this.apiUrl}/disconnect/${brokerAccountId}`).pipe(
      tap(() => {
        // Remove from local state
        this.brokerAccounts.update(accounts =>
          accounts.filter(acc => acc.id !== brokerAccountId)
        );
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Failed to disconnect broker');
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get connection status for a broker account
   */
  getConnectionStatus(brokerAccountId: number): Observable<BrokerConnectionStatus> {
    return this.http.get<BrokerConnectionStatus>(
      `${this.apiUrl}/status/${brokerAccountId}`
    );
  }

  /**
   * Sync broker data (portfolio, trades, etc.)
   */
  syncBrokerData(brokerAccountId: number): Observable<SyncResponse> {
    return this.http.post<SyncResponse>(
      `${this.apiUrl}/sync/${brokerAccountId}`,
      {}
    ).pipe(
      tap(() => {
        // Optionally show success message
      }),
      catchError(error => {
        this.error.set('Failed to sync broker data');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get live quote for a symbol (BTCUSD)
   * Note: This would need a backend endpoint to fetch from IBKR
   */
  getLiveQuote(symbol: string): Observable<LiveQuote> {
    // TODO: Implement backend endpoint for live quotes
    // For now, returning mock data
    return this.http.get<LiveQuote>(`${this.apiUrl}/quote/${symbol}`).pipe(
      tap(quote => {
        this.liveQuote.set(quote);
      }),
      catchError(error => {
        // Fallback to mock data for development
        const mockQuote: LiveQuote = {
          symbol: symbol,
          price: 45230.50,
          change: 1250.30,
          change_percent: 2.84,
          timestamp: new Date().toISOString()
        };
        this.liveQuote.set(mockQuote);
        return throwError(() => error);
      })
    );
  }

  /**
   * Start live data stream for a symbol
   * This would use WebSocket in production
   */
  startLiveDataStream(symbol: string, callback: (quote: LiveQuote) => void): void {
    // TODO: Implement WebSocket connection for real-time data
    // For now, using polling as fallback
    setInterval(() => {
      this.getLiveQuote(symbol).subscribe({
        next: (quote) => callback(quote),
        error: (err) => console.error('Failed to fetch live quote:', err)
      });
    }, 5000); // Update every 5 seconds
  }

  /**
   * Check if user has any connected broker accounts
   */
  hasConnectedBroker(): boolean {
    return this.brokerAccounts().some(acc => acc.status === 'active');
  }

  /**
   * Get active broker account ID (first active account)
   */
  getActiveBrokerAccountId(): number | null {
    const activeAccount = this.brokerAccounts().find(acc => acc.status === 'active');
    return activeAccount?.id ?? null;
  }

  /**
   * Get portfolio positions from broker
   */
  getPositions(brokerAccountId?: number): Observable<BrokerPosition[]> {
    const accountId = brokerAccountId ?? this.getActiveBrokerAccountId();

    if (!accountId) {
      return throwError(() => new Error('No active broker account'));
    }

    return this.http.get<BrokerPosition[]>(`${environment.apiUrl}/portfolio/positions`, {
      params: { broker_account_id: accountId.toString() }
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch positions:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get trades from broker
   */
  getTrades(brokerAccountId?: number): Observable<BrokerTrade[]> {
    const accountId = brokerAccountId ?? this.getActiveBrokerAccountId();

    if (!accountId) {
      return throwError(() => new Error('No active broker account'));
    }

    return this.http.get<BrokerTrade[]>(`${environment.apiUrl}/trades`, {
      params: { broker_account_id: accountId.toString() }
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch trades:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get portfolio summary from broker
   */
  getPortfolioSummary(brokerAccountId?: number): Observable<PortfolioSummary> {
    const accountId = brokerAccountId ?? this.getActiveBrokerAccountId();

    if (!accountId) {
      return throwError(() => new Error('No active broker account'));
    }

    return this.http.get<PortfolioSummary>(`${environment.apiUrl}/portfolio/summary`, {
      params: { broker_account_id: accountId.toString() }
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch portfolio summary:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get account balance from broker
   */
  getBalance(brokerAccountId?: number): Observable<BrokerBalance> {
    const accountId = brokerAccountId ?? this.getActiveBrokerAccountId();

    if (!accountId) {
      return throwError(() => new Error('No active broker account'));
    }

    return this.http.get<BrokerBalance>(`${environment.apiUrl}/portfolio/balance`, {
      params: { broker_account_id: accountId.toString() }
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch balance:', error);
        return throwError(() => error);
      })
    );
  }
}
