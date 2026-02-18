
export interface MarketUpdate {
  content: string;
  sources: { title: string; uri: string }[];
  timestamp: string;
  error?: boolean;
}

export enum MarketSection {
  SUMMARY = 'summary',
  NEWS = 'news',
  FUTURES = 'futures',
  STOCKS = 'stocks'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
