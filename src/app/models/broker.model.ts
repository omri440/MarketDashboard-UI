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

// Portfolio Position from broker
export interface BrokerPosition {
  id?: number;
  broker_account_id: number;
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  last_updated?: string;
}

// Trade from broker
export interface BrokerTrade {
  id?: number;
  broker_account_id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  commission: number;
  execution_time: string;
  order_id?: string;
}

// Portfolio summary
export interface PortfolioSummary {
  total_value: number;
  total_pnl: number;
  total_pnl_percent: number;
  cash_balance: number;
  positions_count: number;
}

// Broker balance
export interface BrokerBalance {
  cash_balance: number;
  stock_value: number;
  total_value: number;
  buying_power: number;
}

// Stock quote from broker
export interface StockQuote {
  symbol: string;
  last: number | null;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  timestamp: string;
}
