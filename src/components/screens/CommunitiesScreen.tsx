import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Check, 
  Plus, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Community, Language, User } from '../../types';
import { translations } from '../../i18n/translations';

interface CommunitiesScreenProps {
  communities: Community[];
  setCommunities: React.Dispatch<React.SetStateAction<Community[]>>;
  currentUser: User;
  lang: Language;
}

export const CommunitiesScreen: React.FC<CommunitiesScreenProps> = ({
  communities,
  setCommunities,
  currentUser,
  lang,
}) => {
  const t = translations[lang];

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(communities[0]);
  const [activeTab, setActiveTab] = useState<'feed' | 'rules' | 'members'>('feed');

  const toggleJoin = (commId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === commId) {
          const isJoined = !c.isJoined;
          return {
            ...c,
            isJoined,
            membersCount: isJoined ? c.membersCount + 1 : c.membersCount - 1,
          };
        }
        return c;
      })
    );

    if (selectedCommunity && selectedCommunity.id === commId) {
      setSelectedCommunity((prev) =>
        prev
          ? {
              ...prev,
              isJoined: !prev.isJoined,
              membersCount: !prev.isJoined
                ? prev.membersCount + 1
                : prev.membersCount - 1,
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t.communities.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.communities.subtitle}
          </p>
        </div>

        <button
          onClick={() => alert('Community creation form opened. Verified title check required for Official brand clubs (FR-GRP-05).')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.communities.createClub}</span>
        </button>
      </div>

      {/* Suggested Club AI Banner (FR-GRP-02) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            AI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                [AI] {t.communities.aiSuggested}
              </span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300">
              Matched based on your verified <strong>Porsche 911 GT3</strong> and Gulf regional circuit telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedCommunity(communities[0])}
          className="px-4 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 self-start sm:self-auto"
        >
          Explore Porsche Club
        </button>
      </div>

      {/* Main Split Layout: Club Cards & Active Club Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Community Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {communities.map((club) => {
            const isSelected = selectedCommunity?.id === club.id;
            return (
              <div
                key={club.id}
                onClick={() => setSelectedCommunity(club)}
                className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-white dark:bg-stone-900 shadow-md ring-1 ring-amber-500/30'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={club.avatar}
                    alt={club.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-stone-200 dark:ring-stone-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-stone-900 dark:text-white truncate">
                        {lang === 'ar' && club.nameAr ? club.nameAr : club.name}
                      </h3>
                      {club.isVerifiedClub && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                      {lang === 'ar' && club.descriptionAr ? club.descriptionAr : club.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-400 font-medium">
                      <span>{club.membersCount.toLocaleString()} {t.communities.members}</span>
                      <span>•</span>
                      <span>{club.location}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 rtl:rotate-180 shrink-0 self-center" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Community Details & Feed */}
        {selectedCommunity && (
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm space-y-4">
            {/* Club Header Banner */}
            <div className="relative h-44 w-full bg-stone-950">
              <img
                src={selectedCommunity.coverImage}
                alt={selectedCommunity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

              <div className="absolute bottom-4 start-5 end-5 flex items-end justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCommunity.avatar}
                    alt={selectedCommunity.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-extrabold text-lg text-white">
                        {lang === 'ar' && selectedCommunity.nameAr ? selectedCommunity.nameAr : selectedCommunity.name}
                      </h2>
                      {selectedCommunity.isVerifiedClub && (
                        <span className="p-0.5 rounded-full bg-amber-500 text-white">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-300">
                      {selectedCommunity.membersCount.toLocaleString()} {t.communities.members} • {selectedCommunity.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoin(selectedCommunity.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    selectedCommunity.isJoined
                      ? 'bg-stone-800 text-stone-200 border border-stone-700'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {selectedCommunity.isJoined ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.communities.joined}</span>
                    </span>
                  ) : (
                    <span>{t.communities.join}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Pinned Announcement */}
            {selectedCommunity.pinnedPost && (
              <div className="mx-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white font-mono">
                  PINNED
                </span>
                <span>{selectedCommunity.pinnedPost}</span>
              </div>
            )}

            {/* Sub-tabs */}
            <div className="flex border-b border-stone-100 dark:border-stone-800 px-6 text-xs font-bold">
              <button
                onClick={() => setActiveTab('feed')}
                className={`py-3 px-3 border-b-2 transition-all ${
                  activeTab === 'feed'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-stone-500'
                }`}
              >
                {t.communities.clubFeed}
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`py-3 px-3 border-b-2 transition-all ${
                  activeTab === 'rules'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-stone-500'
                }`}
              >
                {t.communities.rules}
              </button>
            </div>

            {/* Tab: Feed */}
            {activeTab === 'feed' && (
              <div className="p-6 pt-2 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 dark:text-white">
                      Track Marshal Announcement
                    </span>
                    <span className="text-stone-400 text-[10px]">2h ago</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Mandatory sound decibel test (limit 105 dB static at 4,500 RPM) at pit entrance for the upcoming Yas Marina evening drive. Please verify your exhaust baffles.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Rules (FR-GRP-04) */}
            {activeTab === 'rules' && (
              <div className="p-6 pt-2 space-y-2.5">
                {(lang === 'ar' && selectedCommunity.rulesAr ? selectedCommunity.rulesAr : selectedCommunity.rules).map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
