import Image from 'next/image';

import { brand } from '@/lib/config/brand';
import { AthleteProfileForm } from '@/components/athlete/AthleteProfileForm';
import type { AthleteProfile } from '@/types';

type AthleteProfileViewProps = {
  profile: AthleteProfile;
};

export function AthleteProfileView({ profile }: AthleteProfileViewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
      <aside className="space-y-5 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(0,92,255,0.18),rgba(255,255,255,0.03))] p-6 shadow-[var(--shadow-soft)]">
        <div className="inline-flex rounded-[1.35rem] border border-white/10 bg-[rgba(250,250,250,0.92)] px-5 py-4">
          <Image src={brand.assets.officialBlue} alt={brand.name} width={160} height={68} priority />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
            Identidad
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{profile.fullName}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[color:var(--color-primary-soft)]">
            {profile.level} · {profile.boxName}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ['Correo', profile.email],
            ['Ciudad', profile.city],
            ['Enfoque', profile.favoriteFocus],
            ['Ingreso', new Date(profile.joinedAt).toLocaleDateString('es-CR')],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
            Nota
          </p>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
            Esta vista prioriza edición rápida de identidad y contexto deportivo. Los campos
            extendidos siguen siendo de presentación hasta que el backend los modele por completo.
          </p>
        </div>
      </aside>
      <AthleteProfileForm profile={profile} />
    </div>
  );
}
