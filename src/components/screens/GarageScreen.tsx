import React, { useState } from 'react';
import { 
  Car, 
  Wrench, 
  History, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  Gauge, 
  Cpu, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Sliders,
  FileCheck2,
  Lock,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { Vehicle, Modification, MaintenanceLog, Language, User } from '../../types';
import { translations } from '../../i18n/translations';
import { formatPlateNumber, evaluateMaintenanceAdvisor } from '../../data/mockData';

interface GarageScreenProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  currentUser: User;
  lang: Language;
  initialTab?: 'overview' | 'mods' | 'maintenance' | 'advisor';
}

export const GarageScreen: React.FC<GarageScreenProps> = ({
  vehicles,
  setVehicles,
  currentUser,
  lang,
  initialTab = 'overview',
}) => {
  const t = translations[lang];

  // Active Vehicle in garage
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    vehicles.find((v) => v.isPrimary)?.id || vehicles[0]?.id || ''
  );

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'mods' | 'maintenance' | 'advisor'>(initialTab);

  // Interactive Maintenance Advisor inputs (Follow-up Prompt 2)
  const [inputMileage, setInputMileage] = useState<number>(activeVehicle?.odometerKm || 18450);
  const [inputDate, setInputDate] = useState<string>(activeVehicle?.lastServiceDate || '2025-11-15');
  const [advisorEvaluated, setAdvisorEvaluated] = useState(true);

  // Add Modification Modal
  const [isAddModOpen, setIsAddModOpen] = useState(false);
  const [modCategory, setModCategory] = useState<'Exhaust' | 'Wheels' | 'Suspension' | 'Aero' | 'Engine' | 'Interior' | 'Brakes'>('Exhaust');
  const [modPartName, setModPartName] = useState('');
  const [modBrand, setModBrand] = useState('');
  const [modCost, setModCost] = useState('');
  const [modNotes, setModNotes] = useState('');

  // Add Maintenance Log Modal
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [logType, setLogType] = useState('Track Brake Fluid Flush & Inspection');
  const [logOdo, setLogOdo] = useState('18450');
  const [logWorkshop, setLogWorkshop] = useState('Al Nabooda Performance Centre');
  const [logCost, setLogCost] = useState('450');
  const [logNotes, setLogNotes] = useState('');

  // Evaluate Expert System Maintenance Advisor (AI-ES-01, AI-ES-04, AI-FZ-04)
  const advice = evaluateMaintenanceAdvisor(activeVehicle, inputMileage, inputDate);

  const handleSetPrimary = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isPrimary: v.id === vehicleId,
      }))
    );
  };

  const handleAddModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modPartName || !modBrand) return;

    const newMod: Modification = {
      id: `mod_${Date.now()}`,
      category: modCategory,
      partName: modPartName,
      brand: modBrand,
      installedDate: new Date().toISOString().split('T')[0],
      cost: Number(modCost) || 0,
      notes: modNotes,
    };

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === activeVehicle.id
          ? { ...v, modifications: [newMod, ...v.modifications] }
          : v
      )
    );

    setIsAddModOpen(false);
    setModPartName('');
    setModBrand('');
    setModCost('');
    setModNotes('');
  };

  const handleAddMaintenanceLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logType) return;

    const newLog: MaintenanceLog = {
      id: `maint_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      serviceType: logType,
      odometer: Number(logOdo) || activeVehicle.odometerKm,
      workshop: logWorkshop,
      cost: Number(logCost) || 0,
      invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
      notes: logNotes,
    };

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === activeVehicle.id
          ? {
              ...v,
              maintenanceLogs: [newLog, ...v.maintenanceLogs],
              lastServiceDate: newLog.date,
              lastServiceMileage: newLog.odometer,
              odometerKm: Math.max(v.odometerKm, newLog.odometer),
            }
          : v
      )
    );

    setIsAddLogOpen(false);
    setLogType('');
    setLogCost('');
    setLogNotes('');
  };

  if (!activeVehicle) {
    return <div className="p-8 text-center">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Garage Header & Vehicle Selector Carousel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t.garage.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.garage.subtitle}
          </p>
        </div>

        {/* Garage Vehicle Switcher Cards */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {vehicles.map((v) => {
            const isSelected = v.id === activeVehicle.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVehicleId(v.id);
                  setInputMileage(v.odometerKm);
                  setInputDate(v.lastServiceDate);
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all text-start shrink-0 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                }`}
              >
                <img
                  src={v.image}
                  alt={v.model}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-bold line-clamp-1">
                      {v.year} {v.make} {v.model}
                    </span>
                    {v.isPrimary && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    {formatPlateNumber(v.plateNumber, v.regionCode, currentUser.plateDisplayMode)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Vehicle Display Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xl">
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-stone-950 overflow-hidden">
          <img
            src={activeVehicle.image}
            alt={activeVehicle.model}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Badge Overlays */}
          <div className="absolute top-4 start-4 flex flex-wrap items-center gap-2">
            {activeVehicle.isVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.common.verifiedBadge}</span>
              </span>
            )}
            {activeVehicle.isPrimary && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white backdrop-blur shadow-md">
                {t.garage.primaryCar}
              </span>
            )}
          </div>

          <div className="absolute top-4 end-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{t.garage.vinProtected}: {activeVehicle.vinMasked}</span>
            </span>
          </div>

          {/* Vehicle Title & License Plate */}
          <div className="absolute bottom-4 start-4 end-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </h1>
              </div>
              <p className="text-sm text-stone-300 mt-0.5">
                {activeVehicle.trim} • {activeVehicle.color}
              </p>
            </div>

            {/* Official Plate Display */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-xs font-bold uppercase text-amber-400">
                {activeVehicle.regionCode}
              </span>
              <span className="text-lg font-mono font-black tracking-wider text-white">
                {formatPlateNumber(activeVehicle.plateNumber, activeVehicle.regionCode, currentUser.plateDisplayMode)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{t.garage.specs}</span>
          </button>

          <button
            onClick={() => setActiveTab('mods')}
            className={`py-4 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'mods'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{t.garage.modifications.replace('{count}', activeVehicle.modifications.length.toString())}</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-4 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'maintenance'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t.garage.maintenance}</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`py-4 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'advisor'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="flex items-center gap-1">
              <span className="font-extrabold text-amber-500">[AI]</span>
              <span>{t.garage.aiAdvisor} (Follow-Up #2)</span>
            </span>
          </button>
        </div>

        {/* Tab 1: Overview & Specs */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
                  <Cpu className="w-4 h-4 text-amber-500" />
                  <span>{t.garage.engine}</span>
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-white mt-1">
                  {activeVehicle.engine}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <span>{t.garage.horsepower}</span>
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-white mt-1">
                  {activeVehicle.horsepower} BHP (OEM Spec)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
                  <History className="w-4 h-4 text-amber-500" />
                  <span>{t.garage.odometer}</span>
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-white mt-1 font-mono">
                  {activeVehicle.odometerKm.toLocaleString()} km
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Last Service</span>
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-white mt-1">
                  {activeVehicle.lastServiceDate}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!activeVehicle.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(activeVehicle.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  {t.garage.setPrimary}
                </button>
              )}
              <button
                onClick={() => setActiveTab('advisor')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test AI Maintenance Advisor ('Service Soon')</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Modifications (FR-VEH-02) */}
        {activeTab === 'mods' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Documented Aftermarket Hardware & Upgrades
              </span>
              <button
                onClick={() => setIsAddModOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.garage.addModBtn}</span>
              </button>
            </div>

            {activeVehicle.modifications.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No modifications recorded yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeVehicle.modifications.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                        {lang === 'ar' && mod.categoryAr ? mod.categoryAr : mod.category}
                      </span>
                      {mod.cost && (
                        <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                          ${mod.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                        {mod.partName}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                        Brand: {mod.brand} • Installed: {mod.installedDate}
                      </p>
                    </div>
                    {mod.notes && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                        "{mod.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Maintenance History Log (FR-VEH-04) */}
        {activeTab === 'maintenance' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Certified Service History & Workshop Records
              </span>
              <button
                onClick={() => setIsAddLogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.garage.logServiceBtn}</span>
              </button>
            </div>

            {activeVehicle.maintenanceLogs.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">No service records entered.</p>
            ) : (
              <div className="space-y-3">
                {activeVehicle.maintenanceLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-white">
                          {lang === 'ar' && log.serviceTypeAr ? log.serviceTypeAr : log.serviceType}
                        </span>
                        {log.invoiceNumber && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            {log.invoiceNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {log.workshop} • {log.date} • Odometer: <span className="font-mono">{log.odometer.toLocaleString()} km</span>
                      </p>
                      {log.notes && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                          {log.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-end font-mono font-bold text-stone-900 dark:text-white text-sm">
                      ${log.cost.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: AI Maintenance Advisor (AI-ES-01, AI-ES-04, AI-FZ-04) Follow-up Prompt 2 */}
        {activeTab === 'advisor' && (
          <div className="p-6 space-y-6">
            
            {/* Follow-up Prompt 2 Highlight Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-mono text-[10px] font-extrabold uppercase">
                    AI-ES-01 & AI-FZ-04
                  </span>
                  <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                    Follow-Up #2: Maintenance Advisor with Rules Explanation
                  </h3>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  After mileage and last service date are entered, the expert system evaluates service thresholds and outputs <strong>'service soon'</strong> with the exact rules and facts used.
                </p>
              </div>

              {/* Instant Preset Button */}
              <button
                type="button"
                onClick={() => {
                  setInputMileage(18450);
                  setInputDate('2025-11-15');
                  setAdvisorEvaluated(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600 whitespace-nowrap self-start sm:self-auto"
              >
                Reset 'Service Soon' Test Case
              </button>
            </div>

            {/* Input Form: Enter Mileage & Last Service Date */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Enter Current Vehicle Metrics to Evaluate:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Current Odometer (km):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={inputMileage}
                      onChange={(e) => setInputMileage(Number(e.target.value))}
                      className="flex-1 px-3 py-2 rounded-xl text-sm font-mono border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-bold"
                    />
                    <span className="text-xs text-stone-400 font-mono">KM</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="500"
                    value={inputMileage}
                    onChange={(e) => setInputMileage(Number(e.target.value))}
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Last Service Date:
                  </label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white"
                  />
                  <p className="text-[11px] text-stone-400 mt-2">
                    Baseline interval: 12,000 km recorded at Porsche Centre Dubai
                  </p>
                </div>
              </div>
            </div>

            {/* AI Advisor Diagnosis Outcome: Shows 'SERVICE SOON' */}
            <div className={`p-6 rounded-3xl border shadow-md space-y-4 ${
              advice.urgencyLevel === 'High'
                ? 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
                : advice.urgencyLevel === 'Medium'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                    advice.urgencyLevel === 'High'
                      ? 'bg-red-500 text-white'
                      : advice.urgencyLevel === 'Medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {/* Prominent 'SERVICE SOON' label */}
                      <span className="text-sm uppercase font-black tracking-widest px-2.5 py-0.5 rounded-lg bg-black/80 text-amber-400 font-mono">
                        {advice.status === 'service_soon' ? 'SERVICE SOON' : advice.status === 'overdue' ? 'SERVICE OVERDUE' : 'HEALTHY'}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                        Urgency: {advice.urgencyLevel} ({advice.fuzzyUrgencyScore}%)
                      </span>
                    </div>
                    <h3 className="text-lg font-black mt-1">
                      {lang === 'ar' ? advice.summaryAr : advice.summary}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddLogOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-md transition-all self-start sm:self-auto"
                >
                  Schedule / Log Service
                </button>
              </div>
            </div>

            {/* Explanation Facility: Exact rules and facts fired (AI-ES-04) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Rules Used in Decision (AI-ES-04 Explanation Facility):
                  </h4>
                </div>
                <span className="text-xs font-mono text-stone-400">
                  {advice.rulesFired.length} rules triggered
                </span>
              </div>

              {advice.rulesFired.map((rule) => (
                <div
                  key={rule.ruleId}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
                      Rule ID: [{rule.ruleId}]
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                      Rule Triggered
                    </span>
                  </div>
                  <p className="font-bold text-stone-900 dark:text-white text-sm">
                    {rule.description}
                  </p>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 font-mono text-[11px] text-stone-700 dark:text-stone-300">
                    <span className="font-bold text-amber-500">Fact Evaluated: </span>
                    <span>{rule.factUsed}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Add Modification Modal */}
      {isAddModOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-white">
                {t.garage.addModBtn}
              </h3>
              <button onClick={() => setIsAddModOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModification} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.category}
                </label>
                <select
                  value={modCategory}
                  onChange={(e) => setModCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                >
                  <option value="Exhaust">Exhaust</option>
                  <option value="Wheels">Wheels & Tires</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Aero">Aero & Body</option>
                  <option value="Engine">Engine & ECU</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Interior">Interior / Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.partBrand}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akrapovič Evolution Titanium"
                  value={modBrand}
                  onChange={(e) => setModBrand(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Specific Part Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inconel Race Headers"
                  value={modPartName}
                  onChange={(e) => setModPartName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.cost} ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5200"
                  value={modCost}
                  onChange={(e) => setModCost(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Weight savings, lap time change..."
                  value={modNotes}
                  onChange={(e) => setModNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl shadow-md hover:bg-amber-600"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Maintenance Log Modal */}
      {isAddLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-white">
                {t.garage.logServiceBtn}
              </h3>
              <button onClick={() => setIsAddLogOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaintenanceLog} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.serviceType}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine Oil Flush & Filter"
                  value={logType}
                  onChange={(e) => setLogType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.odometer} (km)
                </label>
                <input
                  type="number"
                  required
                  value={logOdo}
                  onChange={(e) => setLogOdo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.workshop}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Porsche Centre Workshop"
                  value={logWorkshop}
                  onChange={(e) => setLogWorkshop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.garage.cost} ($ USD)
                </label>
                <input
                  type="number"
                  value={logCost}
                  onChange={(e) => setLogCost(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLogOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl shadow-md hover:bg-amber-600"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
