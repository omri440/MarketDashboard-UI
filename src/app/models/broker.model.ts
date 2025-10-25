// broker.model.ts - TypeScript interfaces for broker integration

export enum BrokerType {
  IBKR = 'ibkr',
  // Future brokers can be added here
  // TD_AMERITRADE = 'td_ameritrade',
  // ALPACA = 'alpaca',
}

export interface BrokerAccountCreate {
  broker: BrokerType;
  account_code: string;
  conn_host: string;
  conn_port: number;
  client_id: number;
}

export interface BrokerAccountResponse {
  id: number;
  user_id: number;
  broker: BrokerType;
  account_code: string;
  conn_host: string;
  conn_port: number;
  client_id: number;
  status: 'pending' | 'active' | 'error' | 'disconnected';
  connected_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BrokerConnectionStatus {
  broker_account_id: number;
  db_status: string;
  connection_exists: boolean;
  connection_active: boolean;
  connected_at?: string;
}

export interface SyncResponse {
  status: string;
  broker_account_id: number;
}

export interface LiveQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  timestamp: string;
}
