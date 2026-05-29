function normalizeState(address2: string): string {
  // Uppercase a 2-letter state code that sits immediately before a 5- or
  // 9-digit ZIP at the end of the string. Leaves everything else untouched.
  return address2.replace(/\b([A-Za-z]{2})\b(?=\s+\d{5}(-\d{4})?$)/, (m) => m.toUpperCase());
}

export function parseAddress(raw: string): { address1: string; address2: string } {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  const parts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);

  if (parts.length >= 3) {
    return { address1: parts[0], address2: normalizeState(parts.slice(1).join(', ')) };
  }
  if (parts.length === 2) {
    return { address1: parts[0], address2: normalizeState(parts[1]) };
  }

  // No commas: best-effort. Treat the last 3 tokens as "City ST ZIP".
  const tokens = cleaned.split(' ');
  if (tokens.length > 3) {
    return {
      address1: tokens.slice(0, -3).join(' '),
      address2: normalizeState(tokens.slice(-3).join(' ')),
    };
  }
  return { address1: cleaned, address2: '' };
}
