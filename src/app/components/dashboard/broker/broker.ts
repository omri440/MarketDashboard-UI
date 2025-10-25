// broker.ts - Broker connection management component
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Card } from '../shared/components/card/card';
import { BrokerService } from '../../../services/broker.service';
import { BrokerType, BrokerAccountCreate, BrokerAccountResponse } from '../../../models/broker.model';

@Component({
  selector: 'app-broker',
  imports: [CommonModule, ReactiveFormsModule, Card],
  templateUrl: './broker.html',
  styleUrl: './broker.scss'
})
export class BrokerComponent implements OnInit {
  connectionForm: FormGroup;
  showForm = signal(false);
  BrokerType = BrokerType; // Expose enum to template

  // Computed signals
  hasAccounts = computed(() => this.brokerService.brokerAccounts().length > 0);
  isLoading = computed(() => this.brokerService.loading());
  errorMessage = computed(() => this.brokerService.error());
  accounts = computed(() => this.brokerService.brokerAccounts());

  constructor(
    private fb: FormBuilder,
    public brokerService: BrokerService
  ) {
    this.connectionForm = this.fb.group({
      broker: [BrokerType.IBKR, Validators.required],
      account_code: ['', Validators.required],
      conn_host: ['127.0.0.1', Validators.required],
      conn_port: [7497, [Validators.required, Validators.min(1000), Validators.max(65535)]],
      client_id: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Load broker accounts on init
    this.brokerService.loadBrokerAccounts();
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.connectionForm.valid) {
      const accountData: BrokerAccountCreate = this.connectionForm.value;

      this.brokerService.connectBroker(accountData).subscribe({
        next: (response) => {
          console.log('Broker connected successfully:', response);
          this.connectionForm.reset({
            broker: BrokerType.IBKR,
            account_code: '',
            conn_host: '127.0.0.1',
            conn_port: 7497,
            client_id: 1
          });
          this.showForm.set(false);
        },
        error: (error) => {
          console.error('Failed to connect broker:', error);
        }
      });
    }
  }

  disconnect(account: BrokerAccountResponse): void {
    if (confirm(`Are you sure you want to disconnect ${account.account_code}?`)) {
      this.brokerService.disconnectBroker(account.id).subscribe({
        next: () => {
          console.log('Broker disconnected successfully');
        },
        error: (error) => {
          console.error('Failed to disconnect broker:', error);
        }
      });
    }
  }

  syncData(account: BrokerAccountResponse): void {
    this.brokerService.syncBrokerData(account.id).subscribe({
      next: (response) => {
        console.log('Sync started:', response);
        alert('Sync started in background. Data will be updated shortly.');
      },
      error: (error) => {
        console.error('Failed to sync data:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'status-active',
      'pending': 'status-pending',
      'error': 'status-error',
      'disconnected': 'status-disconnected'
    };
    return statusMap[status] || 'status-unknown';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'active': '✓',
      'pending': '⏳',
      'error': '✗',
      'disconnected': '○'
    };
    return iconMap[status] || '?';
  }
}
