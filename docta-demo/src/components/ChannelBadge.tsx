import { CHANNELS, type ChannelKey } from '../data/channels';
import {
  MessageCircle,
  MessageSquare,
  Mail,
  Globe,
  Phone,
  Megaphone,
  Search as SearchIcon,
} from 'lucide-react';
import { cn } from '../lib/cn';

const ICON: Record<ChannelKey, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  sms: MessageSquare,
  email: Mail,
  web: Globe,
  call: Phone,
  'meta-ads': Megaphone,
  'google-ads': SearchIcon,
};

export function ChannelBadge({
  channel,
  size = 'md',
  showLabel = false,
}: {
  channel: ChannelKey;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}) {
  const meta = CHANNELS[channel];
  const Icon = ICON[channel];
  const px = size === 'sm' ? 'h-5 w-5' : 'h-7 w-7';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn('grid place-items-center rounded-md ring-1', px, meta.bg, meta.ring)}
        style={{ color: meta.color }}
      >
        <Icon size={size === 'sm' ? 11 : 14} strokeWidth={2.25} />
      </span>
      {showLabel && <span className="text-xs text-paper-dim">{meta.label}</span>}
    </span>
  );
}
