import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MapPin, 
  Image as ImageIcon, 
  Check, 
  CheckCheck, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  UserX,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';
import { Conversation, ChatMessage, Language, User } from '../../types';
import { translations } from '../../i18n/translations';

interface MessagesScreenProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentUser: User;
  lang: Language;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  conversations,
  setConversations,
  currentUser,
  lang,
}) => {
  const t = translations[lang];

  // Active view: Direct Chats vs Message Requests (FR-MSG-04)
  const [tab, setTab] = useState<'chats' | 'requests'>('chats');
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [messageText, setMessageText] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: lang === 'ar' && currentUser.nameAr ? currentUser.nameAr : currentUser.name,
      senderAvatar: currentUser.avatar,
      text: messageText,
      timestamp: 'Just now',
      isOwn: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessage: messageText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    setMessageText('');

    // Trigger simulated reply from participant after 2 seconds
    if (!activeConv.isRequest) {
      setTimeout(() => {
        setIsTypingSimulated(true);
        setTimeout(() => {
          setIsTypingSimulated(false);
          const replyMsg: ChatMessage = {
            id: `reply_${Date.now()}`,
            senderId: activeConv.participantId,
            senderName: activeConv.participantName,
            senderAvatar: activeConv.participantAvatar,
            text: 'Sounds great! Looking forward to seeing the build in person.',
            timestamp: 'Just now',
          };
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConv.id
                ? {
                    ...c,
                    lastMessage: replyMsg.text,
                    lastMessageTime: 'Just now',
                    messages: [...c.messages, replyMsg],
                  }
                : c
            )
          );
        }, 1800);
      }, 800);
    }
  };

  const handleAcceptRequest = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isRequest: false } : c))
    );
    setTab('chats');
  };

  const handleDeclineRequest = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
  };

  const handleSendVoiceNote = () => {
    if (!activeConv) return;
    const newMsg: ChatMessage = {
      id: `vn_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: 'Voice Note (0:14) • Exhaust acoustic clip recorded',
      timestamp: 'Just now',
      isOwn: true,
      isVoiceNote: true,
      voiceDuration: '0:14',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessage: '🎤 Voice note (0:14)',
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
  };

  const handleShareLocation = () => {
    if (!activeConv) return;
    const newMsg: ChatMessage = {
      id: `loc_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: 'Shared Waypoint: Staging Gate 3, Autodrome',
      timestamp: 'Just now',
      isOwn: true,
      locationShare: {
        name: 'Autodrome Staging Gate 3',
        coordinates: '25.0441° N, 55.2341° E',
      },
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessage: '📍 Waypoint: Staging Gate 3',
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
  };

  const directConversations = conversations.filter((c) => !c.isRequest);
  const requestConversations = conversations.filter((c) => c.isRequest);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {t.messages.title}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {t.messages.subtitle}
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        
        {/* Left: Chats and Message Requests Lists */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-e border-stone-200 dark:border-stone-800 flex flex-col">
          
          {/* Tab Bar (Direct Chats vs Message Request Inbox FR-MSG-04) */}
          <div className="p-3 border-b border-stone-100 dark:border-stone-800 flex gap-2">
            <button
              onClick={() => setTab('chats')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'chats'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.messages.directChats}
            </button>
            <button
              onClick={() => setTab('requests')}
              className={`relative flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'requests'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span>{t.messages.messageRequests.replace('{count}', requestConversations.length.toString())}</span>
              {requestConversations.length > 0 && (
                <span className="ms-1.5 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                  {requestConversations.length}
                </span>
              )}
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(tab === 'chats' ? directConversations : requestConversations).map((conv) => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/30'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-stone-900 dark:text-white truncate">
                        {conv.participantName}
                      </h4>
                      <span className="text-[10px] text-stone-400">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400">
                        {conv.participantPlateMasked}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        {activeConv ? (
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Chat Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.participantAvatar}
                  alt={activeConv.participantName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                    {activeConv.participantName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-[11px] text-stone-400">
                      {activeConv.participantPlateMasked}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-emerald-500">{t.common.activeNow}</span>
                  </div>
                </div>
              </div>

              {/* Safety & Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Reported user ${activeConv.participantName} to admin moderation queue (FR-MSG-04).`)}
                  className="p-2 rounded-xl text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                  title={t.common.report}
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`User blocked. Their messages and vehicles will no longer be visible (FR-DISC-06).`)}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                  title={t.common.block}
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Request Notice Banner (if message request) */}
            {activeConv.isRequest && (
              <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-300">
                    Message Request from Non-Connected Enthusiast (FR-MSG-04)
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Accept to reveal direct communication channels or decline to dismiss.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAcceptRequest(activeConv.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                  >
                    {t.messages.requestAccept}
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(activeConv.id)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
                  >
                    {t.messages.requestDecline}
                  </button>
                </div>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.messages.map((msg) => (
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
                      className="w-7 h-7 rounded-full object-cover shrink-0 self-end"
                    />
                  )}

                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl space-y-1.5 ${
                      msg.isOwn
                        ? 'bg-amber-500 text-white rounded-br-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white rounded-bl-xs'
                    }`}
                  >
                    {/* Voice Note Player Simulation */}
                    {msg.isVoiceNote ? (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:scale-105 transition-transform"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div className="space-y-1">
                          <div className="w-32 h-3 flex items-center gap-0.5">
                            {[12, 24, 18, 28, 14, 22, 30, 16, 20, 10].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${
                                  isPlayingAudio ? 'bg-white animate-pulse' : 'bg-white/50'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono opacity-80 block">
                            {msg.voiceDuration} • Exhaust Sound Clip
                          </span>
                        </div>
                      </div>
                    ) : msg.locationShare ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <MapPin className="w-4 h-4" />
                          <span>{msg.locationShare.name}</span>
                        </div>
                        <p className="text-[10px] font-mono opacity-80">
                          {msg.locationShare.coordinates}
                        </p>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.text}</p>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {msg.isOwn && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTypingSimulated && (
                <div className="flex items-center gap-2 text-xs text-stone-400 italic">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>{activeConv.participantName} {t.messages.typing}</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendVoiceNote}
                className="p-2.5 rounded-xl text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                title="Send Voice Note (0:14)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShareLocation}
                className="p-2.5 rounded-xl text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                title="Share Waypoint"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={t.messages.typeMessage}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center p-8 text-stone-400 text-xs">
            Select a conversation to begin chatting.
          </div>
        )}

      </div>

    </div>
  );
};
