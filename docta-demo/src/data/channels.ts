export type ChannelKey =
  | 'whatsapp'
  | 'sms'
  | 'email'
  | 'web'
  | 'call'
  | 'meta-ads'
  | 'google-ads';

export const CHANNELS: Record<
  ChannelKey,
  { label: string; short: string; color: string; bg: string; ring: string }
> = {
  whatsapp:    { label: 'WhatsApp',     short: 'WA', color: '#22c55e', bg: 'bg-green-500/10',   ring: 'ring-green-500/30' },
  sms:         { label: 'SMS',          short: 'SMS', color: '#60a5fa', bg: 'bg-blue-500/10',   ring: 'ring-blue-500/30' },
  email:       { label: 'Email',        short: 'EM',  color: '#c9a55a', bg: 'bg-gold/10',       ring: 'ring-gold/40' },
  web:         { label: 'Web / Form',   short: 'WEB', color: '#a78bfa', bg: 'bg-violet-500/10', ring: 'ring-violet-500/30' },
  call:        { label: 'Llamada',      short: 'TEL', color: '#fbbf24', bg: 'bg-amber-500/10',  ring: 'ring-amber-500/30' },
  'meta-ads':  { label: 'Meta Ads',     short: 'META',color: '#38bdf8', bg: 'bg-sky-500/10',    ring: 'ring-sky-500/30' },
  'google-ads':{ label: 'Google Ads',   short: 'GA',  color: '#f472b6', bg: 'bg-pink-500/10',   ring: 'ring-pink-500/30' },
};
