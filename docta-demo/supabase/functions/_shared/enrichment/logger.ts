import type { LogEntry, Logger } from './types.ts';

export const consoleLogger: Logger = {
  log(entry: LogEntry): void {
    console.log(JSON.stringify(entry));
  },
};

export interface MemoryLogger extends Logger {
  entries: LogEntry[];
}

export function createMemoryLogger(): MemoryLogger {
  const entries: LogEntry[] = [];
  return {
    entries,
    log(entry: LogEntry): void {
      entries.push(entry);
    },
  };
}
