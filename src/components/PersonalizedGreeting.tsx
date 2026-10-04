import React from 'react';
import { Sparkles, CheckCircle2, Shield, Gauge } from 'lucide-react';
import { User, Vehicle, Language } from '../types';
import { translations } from '../i18n/translations';
import { formatPlateNumber } from '../data/mockData';

interface PersonalizedGreetingProps {
  user: User;
  vehicle?: Vehicle;
  lang: Language;
}

export const PersonalizedGreeting: React.FC<PersonalizedGreetingProps> = ({
  user,
  vehicle,
  lang,
}) => {
  const t = translations[lang];

  // Compute time of day
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetings.morning;
    if (hour < 18) return t.greetings.afternoon;
    return t.greetings.evening;
  };

  const displayName = lang === 'ar' && user.nameAr ? user.nameAr : user.name;
  const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Performance Sports Car';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 md:p-8 text-white shadow-xl mb-6">
      {/* Subtle carbon / grid background effect */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <div className="absolute -end-16 -top-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreetingTime()}</span>
            </span>
            {user.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.common.verifiedBadge}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {t.greetings.enthusiastGreeting.replace('{name}', displayName)}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-stone-300 text-sm">
            <div className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>{t.greetings.welcomedWithCar.replace('{car}', vehicleName)}</span>
            </div>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700 text-amber-300">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>{formatPlateNumber(user.primaryPlate, 'DXB', user.plateDisplayMode)}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Quick Summary Card */}
        {vehicle && (
          <div className="flex items-center gap-4 bg-stone-800/60 backdrop-blur border border-stone-700/60 rounded-2xl p-3.5 sm:pe-6 self-start md:self-auto">
            <img
              src={vehicle.image}
              alt={vehicle.model}
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-stone-700"
            />
            <div className="text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                {t.garage.primaryCar}
              </span>
              <p className="font-bold text-white text-sm">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="text-stone-400">
                {vehicle.horsepower} HP • {vehicle.odometerKm.toLocaleString()} km
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
