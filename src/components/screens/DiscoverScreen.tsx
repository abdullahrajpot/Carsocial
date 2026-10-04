import React, { useState } from 'react';
import { 
  Search, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  SlidersHorizontal,
  ScanLine,
  Zap,
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { Vehicle, User, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { 
  fuzzySearchPlates, 
  formatPlateNumber, 
  sampleVehicles 
} from '../../data/mockData';

interface DiscoverScreenProps {
  vehicles: Vehicle[];
  currentUser: User;
  lang: Language;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenMessage: (recipientName: string, recipientPlate: string) => void;
  initialQuery?: string;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  vehicles,
  currentUser,
  lang,
  onSelectVehicle,
  onOpenMessage,
  initialQuery = '',
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'track' | 'canyon'>('all');

  // Search rate limit counter (FR-DISC-05: 20 per hour)
  const [searchQuota, setSearchQuota] = useState(17);

  // ANPR Camera Simulation Modal (AI-NN-01 / UC-10)
  const [isAnprModalOpen, setIsAnprModalOpen] = useState(false);
  const [anprScanning, setAnprScanning] = useState(false);
  const [anprDetectedPlate, setAnprDetectedPlate] = useState<string | null>(null);
  const [anprConfidence, setAnprConfidence] = useState<number | null>(null);
  const [anprLatency, setAnprLatency] = useState<string | null>(null);
  const [selectedScanPreset, setSelectedScanPreset] = useState<number>(0);

  const scanPresets = [
    {
      title: 'Preset 1: Porsche 911 GT3 (Shark Blue)',
      img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      plate: 'A 19242',
      confidence: 98.7,
      latency: '1.2s'
    },
    {
      title: 'Preset 2: BMW M3 Touring (Isle of Man Green)',
      img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      plate: 'C 48102',
      confidence: 97.4,
      latency: '0.9s'
    },
    {
      title: 'Preset 3: Private Owner Ferrari F8 (Rosso Corsa)',
      img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
      plate: 'P 70007',
      confidence: 99.1,
      latency: '1.1s'
    }
  ];

  const handleStartAnprScan = () => {
    setIsAnprModalOpen(true);
    setAnprScanning(true);
    setAnprDetectedPlate(null);
    setAnprConfidence(null);

    // Simulate AI Neural Network Plate Detector & OCR Inference (AI-NN-01 <= 3s)
    setTimeout(() => {
      const preset = scanPresets[selectedScanPreset];
      setAnprDetectedPlate(preset.plate);
      setAnprConfidence(preset.confidence);
      setAnprLatency(preset.latency);
      setAnprScanning(false);
    }, 1800);
  };

  const handleApplyScannedPlate = () => {
    if (anprDetectedPlate) {
      setSearchQuery(anprDetectedPlate);
      setIsAnprModalOpen(false);
      setSearchQuota((prev) => Math.max(0, prev - 1));
    }
  };

  // Perform Fuzzy Search (Follow-up Prompt 1: AI-FZ-01)
  const searchResults = fuzzySearchPlates(searchQuery, vehicles);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t.discover.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.discover.subtitle}
          </p>
        </div>

        {/* Rate Limiting Notice (FR-DISC-05) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 self-start md:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.discover.searchLimitNotice.replace('{count}', searchQuota.toString())}</span>
        </div>
      </div>

      {/* Follow-up Prompt 1 Highlight: Dedicated Fuzzy Plate Testing Sandbox Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-mono text-[10px] font-extrabold uppercase">
              AI-FZ-01
            </span>
            <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
              Follow-up #1: Fuzzy Plate Search (OCR / Typing Confusion Tolerated: 0/O, 1/I, 8/B)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Shows Calculated Match Percentage
          </span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Test the fuzzy matching engine by clicking the pre-configured OCR misreads below. Notice how substituting <strong>'I' for '1'</strong>, <strong>'O' for '0'</strong>, or <strong>'B' for '8'</strong> still finds the target vehicle and highlights the exact match score:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSearchQuery('A I9242')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              searchQuery === 'A I9242'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/40 hover:bg-amber-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>Query: "A I9242"</span>
            <span className="ms-1.5 text-[10px] opacity-80">(1 vs I) → 98% Match</span>
          </button>

          <button
            onClick={() => setSearchQuery('C 48IO2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              searchQuery === 'C 48IO2'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/40 hover:bg-amber-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>Query: "C 48IO2"</span>
            <span className="ms-1.5 text-[10px] opacity-80">(0/O & 1/I) → 98% Match</span>
          </button>

          <button
            onClick={() => setSearchQuery('B 3O77I')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              searchQuery === 'B 3O77I'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-amber-500/40 hover:bg-amber-50 dark:hover:bg-stone-800'
            }`}
          >
            <span>Query: "B 3O77I"</span>
            <span className="ms-1.5 text-[10px] opacity-80">(O vs 0) → 98% Match</span>
          </button>

          <button
            onClick={() => setSearchQuery('P 7OOO7')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              searchQuery === 'P 7OOO7'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>Query: "P 7OOO7"</span>
            <span className="ms-1.5 text-[10px] opacity-80">(Private Owner)</span>
          </button>
        </div>
      </div>

      {/* Main Search Controls */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.discover.searchPlaceholder}
              className="w-full ps-10 pe-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/70 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3.5 top-3.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 'Scan Plate' Simulated ANPR Button */}
          <button
            onClick={handleStartAnprScan}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="font-mono">[AI]</span>
              <span>{t.discover.scanPlateBtn}</span>
            </span>
          </button>
        </div>

        {/* Feature Highlights & AI Helpers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            Quick Queries:
          </span>
          <button
            onClick={() => setSearchQuery('A 19242')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:border-amber-500/50 border border-stone-200 dark:border-stone-700 font-mono text-stone-700 dark:text-stone-300 text-[11px]"
          >
            Exact: A 19242
          </button>
          <button
            onClick={() => setSearchQuery('track prepared gt3')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:border-amber-500/50 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px]"
          >
            Natural Language: "track prepared gt3"
          </button>
          <button
            onClick={() => setSearchQuery('bmw touring')}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:border-amber-500/50 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px]"
          >
            Make/Model: "bmw touring"
          </button>
        </div>
      </div>

      {/* Discovery Results Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {t.discover.resultsCount.replace('{count}', searchResults.length.toString())}
          </span>
          {searchQuery && (
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
              Query active: "{searchQuery}"
            </span>
          )}
        </div>

        {searchResults.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
            <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
            <h4 className="font-bold text-sm text-stone-900 dark:text-white">
              No matching vehicles found
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try searching with fuzzy tolerances (e.g. "A I9242") or searching by brand such as "Porsche" or "BMW".
            </p>
          </div>
        ) : (
          searchResults.map(({ vehicle, matchScore, isFuzzyMatched, reasons }) => {
            // Check Rule: Private owners show 'private vehicle'
            if (vehicle.isPrivateVehicle || !vehicle.allowDiscovery) {
              return (
                <div
                  key={vehicle.id}
                  className="p-5 rounded-3xl bg-stone-100 dark:bg-stone-900/60 border border-stone-300 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-stone-300 dark:bg-stone-800 flex items-center justify-center text-stone-500 shrink-0">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {t.common.privateVehicle}
                        </span>
                        <span className="font-mono text-xs text-stone-400">
                          {formatPlateNumber(vehicle.plateNumber, vehicle.regionCode, 'hidden')}
                        </span>
                        {isFuzzyMatched && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white font-mono">
                            {matchScore}% FUZZY MATCH
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                        {t.discover.privateVehicleCard}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 max-w-lg">
                        {t.discover.privateVehicleDesc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onOpenMessage('Private Owner', '••••••••')}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      {t.discover.sendMsgRequest}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={vehicle.id}
                className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    className="w-20 h-20 rounded-2xl object-cover ring-1 ring-stone-200 dark:ring-stone-800 shrink-0"
                  />
                  <div className="space-y-1">
                    {/* Match Badges with Match Percentage */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                        {formatPlateNumber(vehicle.plateNumber, vehicle.regionCode, currentUser.plateDisplayMode)}
                      </span>
                      {vehicle.isVerified && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      )}

                      {/* Prominent Match Percentage */}
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono shadow-xs ${
                        matchScore >= 95
                          ? 'bg-emerald-500 text-white'
                          : matchScore >= 85
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-600 text-white'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        <span>{matchScore}% MATCH</span>
                      </span>

                      {isFuzzyMatched && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                          OCR TYPO TOLERATED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Owner: <span className="font-semibold text-stone-700 dark:text-stone-300">{vehicle.ownerName}</span> • {vehicle.region} • {vehicle.horsepower} HP
                    </p>

                    {/* Fuzzy Match Rationale Breakdown */}
                    {reasons.length > 0 && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 pt-0.5 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{reasons.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                  >
                    {t.discover.viewGarage}
                  </button>
                  <button
                    onClick={() => onOpenMessage(vehicle.ownerName, formatPlateNumber(vehicle.plateNumber, vehicle.regionCode, currentUser.plateDisplayMode))}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {t.discover.sendMsgRequest}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ANPR Camera Simulation Modal (UI-1 / AI-NN-01) */}
      {isAnprModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    {t.discover.anprModalTitle}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono">
                    CNN License Plate Boundary Detector & Character Recognizer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAnprModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Sample Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-stone-400">
                Choose Sample Camera Frame / Photograph:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {scanPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedScanPreset(idx);
                      handleStartAnprScan();
                    }}
                    className={`p-2 rounded-xl border text-start text-[11px] transition-all ${
                      selectedScanPreset === idx
                        ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                        : 'border-stone-800 bg-stone-850 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <p className="truncate font-semibold">{preset.plate}</p>
                    <p className="text-[9px] text-stone-400 truncate">{preset.title.split(':')[0]}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Viewfinder with Guide Overlay HUD (UI-1) */}
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-stone-700">
              <img
                src={scanPresets[selectedScanPreset].img}
                alt="Scanning frame"
                className="w-full h-full object-cover opacity-80"
              />

              {/* HUD Reticle Corners */}
              <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-s-2 border-amber-400" />
                  <div className="w-4 h-4 border-t-2 border-e-2 border-amber-400" />
                </div>

                {/* Target Plate Guide Box */}
                <div className="w-48 h-14 mx-auto border-2 border-dashed border-amber-400/80 rounded-lg flex items-center justify-center bg-amber-500/10 backdrop-blur-xs">
                  {anprScanning ? (
                    <span className="text-[11px] font-mono text-amber-300 font-bold animate-pulse flex items-center gap-1">
                      <ScanLine className="w-4 h-4 animate-spin" />
                      <span>Scanning Plate...</span>
                    </span>
                  ) : (
                    <span className="text-sm font-mono font-black text-amber-300 tracking-wider">
                      {anprDetectedPlate || scanPresets[selectedScanPreset].plate}
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-s-2 border-amber-400" />
                  <div className="w-4 h-4 border-b-2 border-e-2 border-amber-400" />
                </div>
              </div>

              {/* Scanning Laser Line */}
              {anprScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-[bounce_2s_infinite]" />
              )}
            </div>

            {/* Neural Net Output Telemetry */}
            {anprConfidence !== null && (
              <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">{t.discover.detectedPlate}:</span>
                  <span className="font-mono text-base font-black text-amber-400">
                    {anprDetectedPlate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">{t.discover.anprConfidence}:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {anprConfidence}% (Exceeds 95% target AI-NN-01)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">{t.discover.anprSpeed}:</span>
                  <span className="font-mono font-bold text-stone-200">
                    {anprLatency} (&lt;= 3.0s limit NFR-PERF-03)
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleStartAnprScan}
                className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-bold"
              >
                Scan Again
              </button>
              <button
                type="button"
                disabled={anprScanning || !anprDetectedPlate}
                onClick={handleApplyScannedPlate}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                Search Scanned Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
