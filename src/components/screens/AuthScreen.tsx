import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  FileText, 
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Language, User, Vehicle } from '../../types';
import { translations } from '../../i18n/translations';
import { currentUserMock, sampleVehicles, formatPlateNumber } from '../../data/mockData';

interface AuthScreenProps {
  lang: Language;
  onAuthSuccess: (user: User, vehicle?: Vehicle) => void;
  onCancel: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  lang,
  onAuthSuccess,
  onCancel,
}) => {
  const t = translations[lang];

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState<'form' | 'registry_verify' | 'otp' | 'completed'>('form');

  // Form Fields
  const [plateNumber, setPlateNumber] = useState('A 19242');
  const [region, setRegion] = useState('Dubai, UAE (RTA)');
  const [phone, setPhone] = useState('+971 50 839 2144');
  const [email, setEmail] = useState('layla.mansouri@carsocial.club');
  const [fullName, setFullName] = useState('Layla Al-Mansouri');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Consents (FR-REG-08)
  const [consentTerms, setConsentTerms] = useState(true);
  const [consentPlate, setConsentPlate] = useState(true);
  const [consentAi, setConsentAi] = useState(true);

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7392');
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(60);

  // Registry Verification State (UC-16)
  const [registryMatching, setRegistryMatching] = useState(false);
  const [verifiedVehicle, setVerifiedVehicle] = useState<Vehicle | null>(null);

  const regionOptions = [
    { id: 'dxb', label: 'Dubai, UAE (RTA Code A-Z)', placeholder: 'A 19242' },
    { id: 'auh', label: 'Abu Dhabi, UAE (Category 1-17)', placeholder: 'C 48102' },
    { id: 'ruh', label: 'Riyadh, Saudi Arabia (3 Letters 4 Digits)', placeholder: 'KSA 4410' },
    { id: 'uk', label: 'United Kingdom (DVLA Standard)', placeholder: 'GB22 STR' },
    { id: 'cal', label: 'California, USA (DMV Format)', placeholder: '7XYZ882' },
  ];

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    setStep('registry_verify');
    setRegistryMatching(true);

    // Simulate Vehicle Registry Query (SW-1 / UC-16)
    setTimeout(() => {
      setRegistryMatching(false);
      const matched = sampleVehicles[0]; // Porsche 911 GT3
      setVerifiedVehicle(matched);
      setGeneratedOtp('7392');
    }, 1500);
  };

  const handleProceedToOtp = () => {
    setStep('otp');
    setTimer(60);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== generatedOtp && otpCode !== '1234') {
      setOtpError('Invalid OTP code. Please enter 7392 or click auto-fill.');
      return;
    }
    setOtpError('');
    setStep('completed');

    setTimeout(() => {
      onAuthSuccess(currentUserMock, verifiedVehicle || sampleVehicles[0]);
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      {/* Container Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-colors">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mb-3 border border-amber-500/20 shadow-inner">
            <Car className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {mode === 'signup' ? t.auth.title : t.auth.alreadyHaveAccount}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto">
            {t.auth.subtitle}
          </p>

          {/* Toggle Tab */}
          <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 mt-5 border border-stone-200 dark:border-stone-700/60">
            <button
              onClick={() => {
                setMode('signup');
                setStep('form');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.nav.signUp}
            </button>
            <button
              onClick={() => {
                setMode('login');
                setStep('form');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.nav.login}
            </button>
          </div>
        </div>

        {/* Step 1: Form Input */}
        {step === 'form' && (
          <form onSubmit={handleStartVerification} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Layla Al-Mansouri"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Plate Number (Primary Identifier FR-REG-01 / FR-AUTH-01) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
                  <span>{t.auth.plateNumber}</span>
                  <span className="text-[10px] text-amber-500 font-mono">Primary ID</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder={t.auth.platePlaceholder}
                    className="w-full px-4 py-3 font-mono font-bold tracking-wider rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                  <div className="absolute end-3 top-3 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold font-mono">
                    PLATE
                  </div>
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.auth.region}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                >
                  {regionOptions.map((r) => (
                    <option key={r.id} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile / Contact Channel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.auth.phone}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-stone-400 absolute start-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.auth.phonePlaceholder}
                    className="w-full ps-10 pe-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.auth.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-3.5 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Consents & Business Rules Acceptance (FR-REG-08) */}
            {mode === 'signup' && (
              <div className="pt-2 space-y-2 border-t border-stone-100 dark:border-stone-800">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>{t.auth.termsAcceptance}</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={consentPlate}
                    onChange={(e) => setConsentPlate(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>{t.auth.plateConsent}</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={consentAi}
                    onChange={(e) => setConsentAi(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-amber-500">[AI]</span>
                    <span>{t.auth.aiConsent}</span>
                  </span>
                </label>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={mode === 'signup' && (!consentTerms || !consentPlate)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
              >
                <span>{mode === 'signup' ? 'Verify Plate with Registry' : 'Log In & Authenticate'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="py-3 px-5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
              >
                {t.common.cancel}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Simulated Registry Verification (UC-16 / FR-REG-03) */}
        {step === 'registry_verify' && (
          <div className="py-6 text-center space-y-6">
            {registryMatching ? (
              <div className="space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                    <RefreshCw className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Querying Official Vehicle Registry (UC-16)...
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Matching plate <span className="font-mono font-bold text-amber-500">{plateNumber}</span> with RTA government vehicle database
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    Ownership Match Confirmed
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 dark:text-white mt-2">
                    {t.auth.registryMatched}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Plate: <span className="font-mono font-bold">{plateNumber}</span> • VIN: WP0AF2A9••••••992 • Ownership Record: 1 Active Primary Owner
                  </p>
                </div>

                {verifiedVehicle && (
                  <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 p-4 flex items-center gap-4 text-start">
                    <img
                      src={verifiedVehicle.image}
                      alt={verifiedVehicle.model}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white">
                        {verifiedVehicle.year} {verifiedVehicle.make} {verifiedVehicle.model}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {verifiedVehicle.trim} • {verifiedVehicle.engine}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                          {formatPlateNumber(verifiedVehicle.plateNumber, 'DXB', 'masked')}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-bold">
                          ✓ Official Title Verified
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleProceedToOtp}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Send Security OTP to Phone</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Simulated OTP (FR-REG-04 / FR-AUTH-02) */}
        {step === 'otp' && (
          <div className="py-6 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 mb-3">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                {t.auth.otpTitle}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {t.auth.otpSubtitle.replace('{phone}', phone)}
              </p>
            </div>

            {/* Demo Banner */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simulated SMS Gateway: Your verification code is <strong>{generatedOtp}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(generatedOtp)}
                className="px-2.5 py-1 rounded bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600"
              >
                Auto-fill
              </button>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center tracking-[1em] font-mono text-2xl font-extrabold py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {otpError && (
                <p className="text-xs text-red-500 font-semibold text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="flex-1 py-3 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 transition-all text-sm"
              >
                {t.auth.verifyOtpBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGeneratedOtp('8912');
                  setTimer(60);
                }}
                className="py-3 px-5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
              >
                {t.auth.resendOtp} ({timer}s)
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Verification Success & Personalized Greeting Transition */}
        {step === 'completed' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              {t.auth.successGreeting.replace('{name}', fullName)}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              Your digital garage has been provisioned with your verified 2023 Porsche 911 GT3. Initializing personalized feed...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
