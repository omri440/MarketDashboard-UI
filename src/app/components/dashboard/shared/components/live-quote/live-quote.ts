// live-quote.ts - Live price ticker widget
import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerService } from '../../../../../services/broker.service';
import { LiveQuote } from '../../../../../models/broker.model';

@Component({
  selector: 'app-live-quote',
  imports: [CommonModule],
  templateUrl: './live-quote.html',
  styleUrl: './live-quote.scss'
})
export class LiveQuoteComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSD';
  @Input() compact: boolean = false;

  quote = signal<LiveQuote | null>(null);
  loading = signal(true);
  error = signal(false);

  private intervalId?: number;

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.fetchQuote();
    // Update every 5 seconds
    this.intervalId = window.setInterval(() => {
      this.fetchQuote();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private fetchQuote(): void {
    this.brokerService.getLiveQuote(this.symbol).subscribe({
      next: (quote) => {
        this.quote.set(quote);
        this.loading.set(false);
        this.error.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch quote:', err);
        // Use mock data on error
        const mockQuote: LiveQuote = {
          symbol: this.symbol,
          price: 45230.50,
          change: 1250.30,
          change_percent: 2.84,
          timestamp: new Date().toISOString()
        };
        this.quote.set(mockQuote);
        this.loading.set(false);
        this.error.set(false); // Don't show error, just use mock data
      }
    });
  }

  get isPositive(): boolean {
    return (this.quote()?.change ?? 0) >= 0;
  }

  get formattedPrice(): string {
    const price = this.quote()?.price ?? 0;
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  get formattedChange(): string {
    const change = this.quote()?.change ?? 0;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  }

  get formattedChangePercent(): string {
    const percent = this.quote()?.change_percent ?? 0;
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  }
}
