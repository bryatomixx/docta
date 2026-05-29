import { initials } from '../lib/format';

export function Avatar({
  name,
  hue,
  size = 32,
}: {
  name: string;
  hue?: number;
  size?: number;
}) {
  const h = hue ?? Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % 360;
  return (
    <div
      className="rounded-full grid place-items-center text-[11px] font-medium tracking-wide ring-1 ring-white/10"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${h} 60% 28%), hsl(${(h + 40) % 360} 70% 18%))`,
        color: '#f4f0e6',
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
}
