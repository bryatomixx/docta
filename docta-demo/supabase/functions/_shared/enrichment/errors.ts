export class AttomNotFoundError extends Error {
  readonly address: string;
  constructor(address: string) {
    super(`ATTOM: address not found: ${address}`);
    this.name = 'AttomNotFoundError';
    this.address = address;
  }
}

export class AttomApiError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(`ATTOM API error ${code}: ${message}`);
    this.name = 'AttomApiError';
    this.code = code;
  }
}

export class AttomRequestError extends Error {
  constructor(message: string, cause?: unknown) {
    super(`ATTOM request failed: ${message}`, { cause });
    this.name = 'AttomRequestError';
  }
}
