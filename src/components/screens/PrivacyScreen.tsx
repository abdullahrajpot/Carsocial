import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Sparkles, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { User, PlateDisplayMode, LocationPrecision, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { formatPlateNumber } from '../../data/mockData';

interface PrivacyScreenProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  lang: Language;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  currentUser,
  setCurrentUser,
  lang,
}) => {
  const t = translations[lang];

  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdate = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDownloadArchive = () => {
    const archiveData = {
      userProfile: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        region: currentUser.region,
        registeredPlates: [currentUser.primaryPlate],
      },
      privacyConsents: {
        plateProcessing: true,
        aiPersonalization: currentUser.aiPersonalization,
        locationSharing: currentUser.locationPrecision,
        autoBlurMedia: currentUser.autoBlurFacesAndPlates,
      },
      timestamp: new Date().toISOString(),
      governanceFramework: 'GDPR Art. 15/20 & ISO 29148 Compliance',
    };

    const blob = new Blob([JSON.stringify(archiveData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CarSocial_DataArchive_${currentUser.username}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t.privacy.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.privacy.subtitle}
          </p>
        </div>

        {savedNotice && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Plate Display Mode (FR-PRV-02: Default is Partly Masked) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                  {t.privacy.plateDisplayMode}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Control how your license plate is represented across feeds, profiles, and garage views
                </p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              Live Preview: {formatPlateNumber(currentUser.primaryPlate, 'DXB', currentUser.plateDisplayMode)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Masked (Default) */}
            <button
              onClick={() => handleUpdate({ plateDisplayMode: 'masked' })}
              className={`p-4 rounded-2xl border text-start transition-all ${
                currentUser.plateDisplayMode === 'masked'
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-900 dark:text-white">
                  Partly Masked (Default)
                </span>
                {currentUser.plateDisplayMode === 'masked' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Recommended privacy standard. Obscures middle digits (e.g. DXB • A ••• 42).
              </p>
            </button>

            {/* Full Plate */}
            <button
              onClick={() => handleUpdate({ plateDisplayMode: 'full' })}
              className={`p-4 rounded-2xl border text-start transition-all ${
                currentUser.plateDisplayMode === 'full'
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-900 dark:text-white">
                  Full Plate Visible
                </span>
                {currentUser.plateDisplayMode === 'full' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Shows entire plate number to community and paddock members.
              </p>
            </button>

            {/* Hidden */}
            <button
              onClick={() => handleUpdate({ plateDisplayMode: 'hidden' })}
              className={`p-4 rounded-2xl border text-start transition-all ${
                currentUser.plateDisplayMode === 'hidden'
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-900 dark:text-white">
                  Completely Hidden
                </span>
                {currentUser.plateDisplayMode === 'hidden' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                All numbers redacted (••••••••) on public interfaces.
              </p>
            </button>
          </div>
        </div>

        {/* Section 2: Discoverability & Private Owner Mode (Rule: Private owners show 'private vehicle') */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                {t.privacy.discoverabilityTitle}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t.privacy.discoverabilityDesc} (FR-PRV-03)
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900 dark:text-white">
                  Allow Plate & Spec Search Discovery
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  When enabled, enthusiasts can find your vehicle profile using plate search or ANPR camera scans.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentUser.allowPlateDiscovery}
                onChange={(e) => handleUpdate({ allowPlateDiscovery: e.target.checked })}
                className="mt-1 rounded text-amber-500 w-5 h-5 accent-amber-500"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{t.privacy.privateOwnerMode}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded bg-amber-500 text-white font-bold">
                    Rule Enforced
                  </span>
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  When enabled, search queries for your vehicle will strictly display <strong>'private vehicle'</strong> and hide all owner identity and modification details.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentUser.isPrivate}
                onChange={(e) => handleUpdate({ isPrivate: e.target.checked })}
                className="mt-1 rounded text-amber-500 w-5 h-5 accent-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Location Precision (FR-PRV-05) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
                {t.privacy.locationPrecision}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Control the resolution of GPS telemetry attached to meetups and feeds
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {(['exact', 'approximate', 'off'] as LocationPrecision[]).map((prec) => (
              <button
                key={prec}
                onClick={() => handleUpdate({ locationPrecision: prec })}
                className={`p-4 rounded-2xl border text-start transition-all ${
                  currentUser.locationPrecision === prec
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold capitalize text-stone-900 dark:text-white">
                    {prec === 'exact' ? t.privacy.locationExact : prec === 'approximate' ? t.privacy.locationApprox : t.privacy.locationOff}
                  </span>
                  {currentUser.locationPrecision === prec && (
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: AI Personalization & Auto-Blurring (AI-GOV-01 / AI-NN-03) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
                <span className="text-amber-500 font-mono">[AI]</span>
                <span>{t.privacy.aiPersonalizationToggle}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ethical AI controls compliant with ISO/IEC standards & user opt-out rights (AI-GOV-01)
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900 dark:text-white">
                  Allow AI Algorithmic Feed Ranking & Club Recommendations
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  When disabled, feed reverts to pure chronological timeline with no model personalization.
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentUser.aiPersonalization}
                onChange={(e) => handleUpdate({ aiPersonalization: e.target.checked })}
                className="mt-1 rounded text-amber-500 w-5 h-5 accent-amber-500"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900 dark:text-white">
                  {t.privacy.autoBlurMedia}
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {t.privacy.autoBlurDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={currentUser.autoBlurFacesAndPlates}
                onChange={(e) => handleUpdate({ autoBlurFacesAndPlates: e.target.checked })}
                className="mt-1 rounded text-amber-500 w-5 h-5 accent-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Section 5: GDPR Rights & Data Download (FR-PRV-04) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">
            {t.privacy.gdprTitle}
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadArchive}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-white font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>{t.privacy.downloadArchive}</span>
            </button>

            <button
              onClick={() => alert('Account deletion request queued with 30-day grace period per NFR-PRIV-03.')}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.privacy.deleteAccount}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
