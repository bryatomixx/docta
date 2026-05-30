export interface AttomConfigPaths {
  avmValue: string;
  avmHigh: string;
  avmLow: string;
  assessedValue: string;
  marketValue: string;
  taxAmount: string;
  taxYear: string;
  saleHistory: string;
  saleHistoryDate: string;
  saleHistoryAmount: string;
}

export interface AttomConfig {
  baseUrl: string;
  endpoint: string;
  mortgageEndpoint: string;
  timeoutMs: number;
  maxRetries: number;
  paths: AttomConfigPaths;
}

export interface HttpResponse {
  status: number;
  ok: boolean;
  json(): Promise<unknown>;
}

export type HttpClient = (
  url: string,
  init: { method?: string; headers: Record<string, string>; signal: AbortSignal },
) => Promise<HttpResponse>;

export interface AttomClientApi {
  fetchAllEvents(address1: string, address2: string): Promise<unknown>;
  fetchMortgageOwner(address1: string, address2: string): Promise<unknown>;
}

export interface EnrichedProperty {
  identifiers: { attomId: string; fips: string | null; apn: string | null };
  address: { line1: string; line2: string; oneLine: string };
  characteristics: {
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    yearBuilt: number | null;
    lotSizeSqft: number | null;
  };
  valuation: { avmValue: number; avmHigh: number | null; avmLow: number | null } | null;
  assessment: {
    assessedValue: number | null;
    marketValue: number | null;
    taxAmount: number | null;
    taxYear: number | null;
  } | null;
  saleHistory: Array<{ saleDate: string | null; saleAmount: number | null }>;
  financing: {
    loanAmount: number | null; // recorded original loan (NOT a live payoff balance)
    lender: string | null;
    loanDate: string | null;
    loanType: string | null;
    termMonths: number | null;
    dueDate: string | null;
    estimatedEquity: number | null; // AVM − recorded loan (conservative floor)
  } | null;
  owner: {
    name: string | null;
    secondName: string | null;
    corporate: boolean | null;
    absentee: boolean | null; // absenteeownerstatus === 'A'
    mailingAddress: string | null;
  } | null;
  enrichedAt: string;
}

export type EnrichmentOutcome = 'success' | 'not_found' | 'error';

export interface LogEntry {
  event: 'enrichment';
  inputAddress: string;
  attomId: string | null;
  outcome: EnrichmentOutcome;
  durationMs: number;
  error?: string;
}

export interface Logger {
  log(entry: LogEntry): void;
}

export interface EnrichmentRepository {
  upsert(record: EnrichedProperty, raw?: unknown): Promise<void>;
  findByAttomId(attomId: string): Promise<EnrichedProperty | null>;
}

export interface EnrichDeps {
  attom: AttomClientApi;
  repo: EnrichmentRepository;
  logger: Logger;
  config: AttomConfig;
}
