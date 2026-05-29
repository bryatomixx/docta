import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Shield, Lock } from 'lucide-react';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('alex@docta.us');
  const [pwd, setPwd] = useState('•••••••••••');

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT — brand */}
      <div className="relative hidden lg:flex flex-col p-12 bg-gradient-to-br from-ink-deep via-ink to-ink-soft overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-50" />
        <div
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #c9a55a 0%, transparent 60%)' }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gold to-gold-deep grid place-items-center text-ink-deep font-bold font-display text-2xl">
              D
            </div>
            <div className="leading-tight">
              <div className="text-paper font-display text-xl">DOCTA Consulting</div>
              <div className="text-[11px] text-gold uppercase tracking-[0.2em]">Real Estate Solutions</div>
            </div>
          </div>
        </div>

        <div className="relative mt-auto max-w-md">
          <h1 className="font-display text-5xl leading-tight text-paper mb-4">
            Una sola plataforma <br />
            para <span className="italic text-gold">todo el ecosistema</span> inmobiliario.
          </h1>
          <p className="text-paper-soft/80 text-[14px] leading-relaxed">
            Multicanal, CRM, marketplace, multiusuarios y automatizaciones — diseñado para
            DOCTA y operadores serios en Florida.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 text-[11px]">
            {[
              ['100-150 usuarios activos', 'realtors · marketers · ops'],
              ['7 canales unificados', 'WhatsApp · SMS · Email · Web · Llamadas · Meta · Google'],
              ['Pipeline en vivo', 'Lead → Visita → Oferta → Cerrado'],
              ['Cumplimiento Florida', 'TREC · MLS · ESIGN · TILA'],
            ].map(([k, v]) => (
              <div key={k} className="rounded border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div className="text-paper">{k}</div>
                <div className="text-paper-dim mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex items-center justify-center p-8 bg-ink-deep">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-gold to-gold-deep grid place-items-center text-ink-deep font-bold font-display text-xl">D</div>
            <span className="text-paper font-display text-lg">DOCTA</span>
          </div>

          <h2 className="font-display text-3xl text-paper mb-1">Bienvenido de vuelta.</h2>
          <p className="text-paper-dim text-[13px] mb-8">
            Ingresa con tu correo corporativo de DOCTA.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              nav('/');
            }}
            className="space-y-3"
          >
            <label className="block">
              <span className="text-[11px] text-paper-dim uppercase tracking-wider">Correo</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-md bg-white/[0.03] ring-1 ring-white/10 focus:ring-gold/50 outline-none text-[13px] text-paper transition"
              />
            </label>
            <label className="block">
              <span className="text-[11px] text-paper-dim uppercase tracking-wider">Contraseña</span>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-md bg-white/[0.03] ring-1 ring-white/10 focus:ring-gold/50 outline-none text-[13px] text-paper transition font-mono"
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-[12px] text-paper-soft">
                <input type="checkbox" defaultChecked className="accent-gold" />
                Mantener sesión
              </label>
              <a href="#" className="text-[12px] text-gold hover:text-gold-bright">Recuperar</a>
            </div>

            <button
              type="submit"
              className="w-full h-10 mt-2 bg-gold hover:bg-gold-bright text-ink-deep font-medium text-[13px] rounded-md inline-flex items-center justify-center gap-2 transition"
            >
              Entrar al panel <ArrowRight size={14} strokeWidth={2.5} />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" className="h-9 rounded-md ring-1 ring-white/10 text-[12px] text-paper-soft hover:bg-white/5 transition inline-flex items-center justify-center gap-1.5">
                <Shield size={12} /> SSO Google
              </button>
              <button type="button" className="h-9 rounded-md ring-1 ring-white/10 text-[12px] text-paper-soft hover:bg-white/5 transition inline-flex items-center justify-center gap-1.5">
                <Lock size={12} /> Microsoft
              </button>
            </div>
          </form>

          <p className="text-[11px] text-paper-dim mt-8 text-center">
            Demo interactiva · DOCTA Consulting LLC · +1 (786) 586-7616
          </p>
        </div>
      </div>
    </div>
  );
}
