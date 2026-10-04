import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  Compass, 
  MessageSquare, 
  QrCode, 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Navigation,
  Send,
  Flag,
  ArrowRight,
  TrendingUp,
  Mountain,
  Waves,
  Zap,
  Check,
  X
} from 'lucide-react';
import { Event, RouteOption, ChatMessage, Language, User } from '../../types';
import { translations } from '../../i18n/translations';

interface EventsScreenProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  currentUser: User;
  lang: Language;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({
  events,
  setEvents,
  currentUser,
  lang,
}) => {
  const t = translations[lang];

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Selected Route Option (Follow-up Prompt 3: AI-PL-01)
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    activeEvent?.routes[0]?.id || 'rt_scenic_pass'
  );

  // Live Event Chat Drawer (FR-EVT-05)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // QR Code Check-in Modal (FR-EVT-07)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleRsvp = (eventId: string, newRsvp: 'going' | 'maybe' | 'not_going') => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const isAtCapacity = e.attendeesCount >= e.capacity;

          let finalStatus: 'going' | 'maybe' | 'not_going' | 'waitlisted' = newRsvp;
          let newAttendees = e.attendeesCount;
          let newWaitlist = e.waitlistCount;

          if (e.userRsvp === 'going') newAttendees--;
          if (e.userRsvp === 'waitlisted') newWaitlist--;

          if (newRsvp === 'going') {
            if (isAtCapacity) {
              finalStatus = 'waitlisted';
              newWaitlist++;
            } else {
              newAttendees++;
            }
          }

          return {
            ...e,
            userRsvp: finalStatus,
            attendeesCount: Math.min(e.capacity, newAttendees),
            waitlistCount: newWaitlist,
          };
        }
        return e;
      })
    );
  };

  const handleSendEventMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeEvent) return;

    const newMsg: ChatMessage = {
      id: `msg_evt_${Date.now()}`,
      senderId: currentUser.id,
      senderName: lang === 'ar' && currentUser.nameAr ? currentUser.nameAr : currentUser.name,
      senderAvatar: currentUser.avatar,
      text: chatInput,
      timestamp: 'Just now',
      isOwn: true,
    };

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === activeEvent.id
          ? { ...evt, chatMessages: [...evt.chatMessages, newMsg] }
          : evt
      )
    );

    setChatInput('');
  };

  if (!activeEvent) {
    return <div className="p-8 text-center">{t.common.loading}</div>;
  }

  const selectedRoute = activeEvent.routes.find((r) => r.id === selectedRouteId) || activeEvent.routes[0];
  const isCapacityFull = activeEvent.attendeesCount >= activeEvent.capacity;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t.events.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.events.subtitle}
          </p>
        </div>

        <button
          onClick={() => alert('New Event Creation Dialog: Fill date, route, capacity limit & automated AI policy screening.')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.events.createEvent}</span>
        </button>
      </div>

      {/* Main Grid: Event Showcase & Route Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Events Selector */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {t.events.allEvents}
          </span>

          <div className="space-y-3">
            {events.map((evt) => {
              const isSelected = evt.id === activeEvent.id;
              const atCap = evt.attendeesCount >= evt.capacity;
              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedEventId(evt.id);
                    if (evt.routes[0]) setSelectedRouteId(evt.routes[0].id);
                  }}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-white dark:bg-stone-900 shadow-md ring-1 ring-amber-500/30'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {lang === 'ar' && evt.typeAr ? evt.typeAr : evt.type.replace('_', ' ')}
                        </span>
                        {atCap && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                            Waitlist Only
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm text-stone-900 dark:text-white truncate">
                        {lang === 'ar' && evt.titleAr ? evt.titleAr : evt.title}
                      </h3>

                      <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        <span>{evt.date} • {evt.time}</span>
                      </p>

                      <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                        <span>{evt.attendeesCount} / {evt.capacity} registered</span>
                        {evt.userRsvp === 'going' && (
                          <span className="text-emerald-500 font-bold">✓ Going</span>
                        )}
                        {evt.userRsvp === 'waitlisted' && (
                          <span className="text-amber-500 font-bold">⏳ Waitlist #{evt.waitlistCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Hub & Follow-up 3 Route Planner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            {/* Event Hero */}
            <div className="relative h-52 w-full bg-stone-950">
              <img
                src={activeEvent.image}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

              <div className="absolute bottom-4 start-5 end-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    {activeEvent.date} • {activeEvent.time}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black mt-0.5">
                    {lang === 'ar' && activeEvent.titleAr ? activeEvent.titleAr : activeEvent.title}
                  </h1>
                  <p className="text-xs text-stone-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ar' && activeEvent.locationAr ? activeEvent.locationAr : activeEvent.location}</span>
                  </p>
                </div>

                {/* Event Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="p-2.5 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 text-white transition-colors"
                    title={t.events.eventChat}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="p-2.5 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 text-white transition-colors"
                    title={t.events.checkInQr}
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RSVP & Capacity Meter */}
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-900 dark:text-white">
                      {isCapacityFull
                        ? t.events.waitlistStatus.replace('{count}', activeEvent.waitlistCount.toString())
                        : t.events.capacityStatus
                            .replace('{current}', activeEvent.attendeesCount.toString())
                            .replace('{max}', activeEvent.capacity.toString())}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-56 h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCapacityFull ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (activeEvent.attendeesCount / activeEvent.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* RSVP Controls (FR-EVT-03) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRsvp(activeEvent.id, 'going')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      activeEvent.userRsvp === 'going'
                        ? 'bg-emerald-500 text-white'
                        : activeEvent.userRsvp === 'waitlisted'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {isCapacityFull && activeEvent.userRsvp !== 'going'
                      ? t.events.joinWaitlistBtn
                      : activeEvent.userRsvp === 'going'
                      ? '✓ ' + t.common.going
                      : t.common.going}
                  </button>

                  <button
                    onClick={() => handleRsvp(activeEvent.id, 'maybe')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeEvent.userRsvp === 'maybe'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {t.common.maybe}
                  </button>

                  <button
                    onClick={() => handleRsvp(activeEvent.id, 'not_going')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeEvent.userRsvp === 'not_going'
                        ? 'bg-stone-700 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {t.common.notGoing}
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {lang === 'ar' && activeEvent.descriptionAr
                  ? activeEvent.descriptionAr
                  : activeEvent.description}
              </p>
            </div>

            {/* Follow-up Prompt 3: AI Route Planner (FR-RTE / AI-PL-01) */}
            <div className="p-6 space-y-5 bg-gradient-to-b from-stone-50/50 to-white dark:from-stone-850/50 dark:to-stone-900">
              
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-mono text-[10px] font-extrabold uppercase">
                      AI-PL-01
                    </span>
                    <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                      Follow-up #3: AI Route Planner (Ranked by Scenic Score)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                    Multi-objective graph optimization evaluated asphalt grip, twist ratios, canyon vistas and convoy safety.
                  </p>
                </div>

                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold whitespace-nowrap self-start sm:self-auto">
                  3 Routes Evaluated (&lt;= 5s)
                </span>
              </div>

              {/* 3 Ranked Route Options Cards */}
              <div className="space-y-3">
                {activeEvent.routes.map((rt, idx) => {
                  const isRtSelected = rt.id === selectedRoute?.id;
                  return (
                    <div
                      key={rt.id}
                      onClick={() => setSelectedRouteId(rt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isRtSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                            idx === 0
                              ? 'bg-amber-500 text-white shadow-sm'
                              : idx === 1
                              ? 'bg-stone-400 text-white'
                              : 'bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                                {lang === 'ar' ? rt.nameAr : rt.name}
                              </h4>
                              {idx === 0 && (
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono">
                                  Top Pick
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {rt.distanceKm} km • {rt.estimatedMinutes} mins drive • Pace: {lang === 'ar' ? rt.recommendedPaceAr : rt.recommendedPace}
                            </p>
                          </div>
                        </div>

                        {/* Scenic Score Pill */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <div className="text-end">
                            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                              Scenic Score
                            </span>
                            <span className={`font-mono text-base font-black ${
                              rt.scenicScore >= 90
                                ? 'text-emerald-500'
                                : rt.scenicScore >= 75
                                ? 'text-amber-500'
                                : 'text-stone-400'
                            }`}>
                              {rt.scenicScore} / 100
                            </span>
                          </div>

                          <div className="w-16 h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                            <div
                              className={`h-full ${
                                rt.scenicScore >= 90
                                ? 'bg-emerald-500'
                                : rt.scenicScore >= 75
                                ? 'bg-amber-500'
                                : 'bg-stone-400'
                              }`}
                              style={{ width: `${rt.scenicScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Route Blueprint & Waypoint Breakdown */}
              {selectedRoute && (
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        Topographical & Curvature Analysis: {selectedRoute.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-500">
                      Scenic Rating: {selectedRoute.scenicScore}/100
                    </span>
                  </div>

                  {/* Simulated Elevation / Scenic Curvature SVG Graph */}
                  <div className="h-24 w-full bg-stone-50 dark:bg-stone-950 rounded-xl p-3 border border-stone-200 dark:border-stone-800 relative overflow-hidden flex flex-col justify-between">
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>Start: ENOC Staging (Elev. 40m)</span>
                      <span>Apex: Hairpin 12 (Elev. 1,120m)</span>
                      <span>Finish: Summit Lounge (Elev. 1,934m)</span>
                    </div>

                    {/* SVG Curve */}
                    <svg className="w-full h-10 overflow-visible" viewBox="0 0 400 40">
                      <path
                        d={
                          selectedRoute.type === 'canyon'
                            ? "M 0 35 Q 60 30, 100 25 T 180 18 T 260 10 T 340 5 L 400 2"
                            : selectedRoute.type === 'coastal'
                            ? "M 0 30 Q 80 32, 160 28 T 280 29 T 400 30"
                            : "M 0 32 L 400 32"
                        }
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Waypoint Dots */}
                      <circle cx="100" cy={selectedRoute.type === 'canyon' ? "25" : "30"} r="4" fill="#10b981" />
                      <circle cx="260" cy={selectedRoute.type === 'canyon' ? "10" : "30"} r="4" fill="#f59e0b" />
                      <circle cx="400" cy={selectedRoute.type === 'canyon' ? "2" : "30"} r="4" fill="#ef4444" />
                    </svg>

                    <div className="flex justify-between text-[9px] font-mono text-stone-500">
                      <span>0.0 km</span>
                      <span className="text-amber-500 font-bold">Elevation Gain: +1,894m</span>
                      <span>{selectedRoute.distanceKm} km</span>
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                      Verified Scenic Highlights:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(lang === 'ar' ? selectedRoute.highlightsAr : selectedRoute.highlights).map((hl, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-amber-500" />
                          <span>{hl}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => alert(`Exported GPX Track: ${selectedRoute.name} (Ready for Garmin, Apple Maps, or Google Maps).`)}
                      className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold hover:opacity-90 shadow-sm"
                    >
                      Export to Navigation App (GPX)
                    </button>
                    <button
                      onClick={() => alert('Convoy Live ETA Telemetry broadcast enabled for registered attendees (FR-RTE-03).')}
                      className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Share Live ETA with Convoy
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Live Event Chat Drawer (FR-EVT-05) */}
      {isChatOpen && (
        <div className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-white dark:bg-stone-900 border-s border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                  {t.events.eventChat}
                </h3>
                <p className="text-[10px] text-stone-400">
                  {activeEvent.title} (Live Channel)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {activeEvent.chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs ${
                  msg.isOwn ? 'justify-end' : 'justify-start'
                }`}
              >
                {!msg.isOwn && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.isOwn
                      ? 'bg-amber-500 text-white rounded-br-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white rounded-bl-xs'
                  }`}
                >
                  {!msg.isOwn && (
                    <p className="text-[10px] font-bold opacity-75 mb-0.5">
                      {msg.senderName}
                    </p>
                  )}
                  <p>{msg.text}</p>
                  <p className="text-[9px] opacity-70 mt-1 text-end">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendEventMessage} className="pt-2 border-t border-stone-100 dark:border-stone-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message event convoy..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}

      {/* QR Check-in Modal (FR-EVT-07) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Official Check-in Pass
              </span>
              <button onClick={() => setIsQrModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 inline-block shadow-inner">
              <div className="w-44 h-44 bg-stone-900 rounded-xl flex flex-col items-center justify-center p-3 text-white">
                <QrCode className="w-24 h-24 text-white" />
                <span className="font-mono text-[9px] mt-2 tracking-widest text-amber-400">
                  CS-EVENT-{activeEvent.id.slice(-4)}-{currentUser.primaryPlate.replace(' ', '')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                {currentUser.name}
              </h4>
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400">
                Vehicle: {currentUser.primaryPlate} (Verified)
              </p>
              <p className="text-[11px] text-stone-400">
                Present this QR at the staging gate or ANPR camera lane (AI-RB-03).
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
