import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText, 
  Cpu, 
  UserCheck, 
  Clock, 
  Ban, 
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { ModerationItem, Language, User } from '../../types';
import { translations } from '../../i18n/translations';

interface AdminScreenProps {
  moderationItems: ModerationItem[];
  setModerationItems: React.Dispatch<React.SetStateAction<ModerationItem[]>>;
  currentUser: User;
  lang: Language;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  moderationItems,
  setModerationItems,
  currentUser,
  lang,
}) => {
  const t = translations[lang];

  const [activeItemId, setActiveItemId] = useState<string>(moderationItems[0]?.id || '');
  const [moderatorNote, setModeratorNote] = useState('');
  const [auditLog, setAuditLog] = useState<Array<{
    id: string;
    itemTitle: string;
    action: string;
    moderator: string;
    note: string;
    timestamp: string;
  }>>([
    {
      id: 'aud_1',
      itemTitle: 'Post: Late night highway race claim',
      action: 'Content Removed & User Warned',
      moderator: 'Sara Lindqvist (Safety Lead)',
      note: 'Confirmed speedometer overlay violated Rule BR-3 street racing policy.',
      timestamp: '2 hours ago',
    }
  ]);

  const activeItem = moderationItems.find((m) => m.id === activeItemId) || moderationItems[0];

  const handleResolveAction = (actionType: 'dismiss' | 'warn' | 'remove' | 'suspend' | 'ban') => {
    if (!activeItem) return;

    const actionLabels: Record<string, string> = {
      dismiss: 'Dismissed Flag',
      warn: 'Warning Issued to User',
      remove: 'Removed Violating Content',
      suspend: 'Account Suspended (48h)',
      ban: 'Permanent Account Ban Applied',
    };

    const newAuditEntry = {
      id: `aud_${Date.now()}`,
      itemTitle: activeItem.targetTitle,
      action: actionLabels[actionType],
      moderator: currentUser.name,
      note: moderatorNote.trim() || 'Reviewed per platform safety constitution and rule requirements.',
      timestamp: 'Just now',
    };

    setAuditLog([newAuditEntry, ...auditLog]);
    setModerationItems((prev) => prev.filter((item) => item.id !== activeItem.id));
    setModeratorNote('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              {t.admin.title}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-mono">
              Staff Portal (FR-ADM)
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {t.admin.subtitle}
          </p>
        </div>

        {/* Human in the loop reassurance badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-semibold self-start sm:self-auto">
          <UserCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <span>AI-GOV-02: Human-in-the-Loop Governance</span>
        </div>
      </div>

      {/* Main Grid: Queue and Detailed Case Resolver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Triage List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t.admin.activeQueue.replace('{count}', moderationItems.length.toString())}
            </span>
            <span className="text-[10px] text-stone-400">Sorted by AI Severity</span>
          </div>

          {moderationItems.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                Queue Clean
              </h4>
              <p className="text-xs text-stone-500">
                All AI moderation flags and plate disputes have been investigated.
              </p>
            </div>
          ) : (
            moderationItems.map((item) => {
              const isSelected = item.id === activeItem?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemId(item.id)}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'border-amber-500 bg-white dark:bg-stone-900 shadow-md ring-1 ring-amber-500/30'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full font-mono ${
                        item.severity === 'high'
                          ? 'bg-red-500 text-white'
                          : item.severity === 'medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {item.severity} severity
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      AI Conf: {item.aiConfidence}%
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                    {item.targetTitle}
                  </h3>

                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                    <span>Target: {item.authorName}</span>
                    <span className="font-mono text-stone-400">{item.authorPlateMasked}</span>
                  </div>
                </div>
              );
            })
          )}

          {/* Past Resolution Audit Log */}
          <div className="pt-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-1">
              {t.admin.actionLog}
            </span>
            <div className="space-y-2">
              {auditLog.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-stone-400">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Case: {log.itemTitle}
                  </p>
                  <p className="text-[10px] text-stone-600 dark:text-stone-300 italic">
                    "{log.note}" — {log.moderator}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Case Deep Dive & Decisions */}
        {activeItem ? (
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
            
            {/* Case Header */}
            <div className="space-y-2 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                  Flagged by: {activeItem.reportedBy}
                </span>
                <span className="text-xs text-stone-400">
                  {activeItem.createdAt}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                {activeItem.targetTitle}
              </h2>
              <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                <span>Account: <strong className="text-stone-800 dark:text-stone-200">{activeItem.authorName}</strong></span>
                <span>•</span>
                <span className="font-mono">{activeItem.authorPlateMasked}</span>
              </div>
            </div>

            {/* AI Analysis & Explanation Facility (Rule Explanation AI-ES-04 / AI-NN-05) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t.admin.aiRationale}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-white font-bold">
                  {activeItem.aiFlagRule}
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {lang === 'ar' ? activeItem.aiExplanationAr : activeItem.aiExplanation}
              </p>
              <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Neural Confidence: <strong>{activeItem.aiConfidence}%</strong>
              </div>
            </div>

            {/* Evidence & Content Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t.admin.flaggedContent}
              </span>

              {activeItem.mediaUrl && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
                  <img
                    src={activeItem.mediaUrl}
                    alt="Flagged media"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 end-3 px-2 py-1 rounded bg-red-600 text-white font-mono text-[10px] font-bold">
                    FLAGGED EVIDENCE
                  </div>
                </div>
              )}

              {activeItem.textContent && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 italic">
                  "{activeItem.textContent}"
                </div>
              )}
            </div>

            {/* Human Moderator Decision Note Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Official Moderator Justification Note (Required for Compliance Log AI-GOV-02):
              </label>
              <textarea
                rows={2}
                value={moderatorNote}
                onChange={(e) => setModeratorNote(e.target.value)}
                placeholder={t.admin.moderatorNotePlaceholder}
                className="w-full p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Moderation Actions (FR-ADM-02) */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Execute Decision:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  onClick={() => handleResolveAction('dismiss')}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {t.admin.actions.dismiss}
                </button>
                <button
                  onClick={() => handleResolveAction('warn')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                >
                  {t.admin.actions.warn}
                </button>
                <button
                  onClick={() => handleResolveAction('remove')}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                >
                  {t.admin.actions.remove}
                </button>
                <button
                  onClick={() => handleResolveAction('suspend')}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-800 hover:bg-stone-950"
                >
                  {t.admin.actions.suspend}
                </button>
                <button
                  onClick={() => handleResolveAction('ban')}
                  className="px-3.5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-sm"
                >
                  {t.admin.actions.ban}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center p-8 text-stone-400 text-xs">
            Select a case from the queue.
          </div>
        )}

      </div>

    </div>
  );
};
