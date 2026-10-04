/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Theme, 
  User, 
  Vehicle, 
  Post, 
  Story, 
  Community, 
  Event, 
  Conversation, 
  ModerationItem 
} from './types';
import { 
  currentUserMock, 
  sampleUsers, 
  sampleVehicles, 
  samplePosts, 
  sampleStories, 
  sampleCommunities, 
  sampleEvents, 
  sampleConversations, 
  sampleModerationItems,
  formatPlateNumber 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { PersonalizedGreeting } from './components/PersonalizedGreeting';
import { AuthScreen } from './components/screens/AuthScreen';
import { FeedScreen } from './components/screens/FeedScreen';
import { GarageScreen } from './components/screens/GarageScreen';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { CommunitiesScreen } from './components/screens/CommunitiesScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { Sparkles, CheckCircle2, Navigation, Wrench, Search } from 'lucide-react';

export default function App() {
  // Theme & Language
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('en');

  // Active Screen
  const [currentScreen, setCurrentScreen] = useState<string>('feed');

  // Sub-feature shortcuts state
  const [garageInitialTab, setGarageInitialTab] = useState<'overview' | 'mods' | 'maintenance' | 'advisor'>('overview');
  const [discoverInitialQuery, setDiscoverInitialQuery] = useState<string>('');

  // Application State
  const [currentUser, setCurrentUser] = useState<User>(currentUserMock);
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [stories, setStories] = useState<Story[]>(sampleStories);
  const [communities, setCommunities] = useState<Community[]>(sampleCommunities);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(sampleModerationItems);

  // Sync RTL and Dark Theme classes on <html> tag
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', lang);

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, lang]);

  // Primary vehicle of the logged in user
  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser.id);
  const primaryVehicle = userVehicles.find((v) => v.isPrimary) || userVehicles[0];

  // Total unread messages count
  const unreadMsgCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Handle switching users between demo accounts (Layla / Omar / Private / Admin)
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentScreen('admin');
    }
  };

  // Auth Success callback
  const handleAuthSuccess = (newUser: User, newVehicle?: Vehicle) => {
    setCurrentUser(newUser);
    if (newVehicle && !vehicles.some((v) => v.id === newVehicle.id)) {
      setVehicles([newVehicle, ...vehicles]);
    }
    setCurrentScreen('feed');
  };

  // Flag content into admin queue from feed/message
  const handleFlagContent = (post: Post, reason: string) => {
    const newModItem: ModerationItem = {
      id: `flag_${Date.now()}`,
      type: 'post',
      targetTitle: `Post by ${post.authorName}`,
      reportedBy: 'User Community Report',
      authorName: post.authorName,
      authorPlateMasked: post.authorPlateMasked,
      reportedReason: reason,
      reportedReasonAr: 'بلاغ من مستخدم في المجتمع',
      severity: 'high',
      aiConfidence: 91.5,
      aiFlagRule: 'COMMUNITY-USER-REPORT-FLAG',
      aiExplanation: 'User flagged this submission for policy violation. Routed to admin queue for human review.',
      aiExplanationAr: 'تم توجيه البلاغ للوحة المشرفين للمراجعة البشرية.',
      status: 'pending',
      createdAt: 'Just now',
      mediaUrl: post.image,
      textContent: post.content,
    };
    setModerationItems([newModItem, ...moderationItems]);
    alert('Thank you. This post has been reported to the CarSocial safety moderation queue (UC-13).');
  };

  // Quick Action Jump Handlers for the 3 Follow-up Prompts
  const jumpToFuzzyPlate = () => {
    setDiscoverInitialQuery('A I9242');
    setCurrentScreen('discover');
  };

  const jumpToMaintenanceAdvisor = () => {
    setGarageInitialTab('advisor');
    setCurrentScreen('garage');
  };

  const jumpToRoutePlanner = () => {
    setCurrentScreen('events');
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors font-sans selection:bg-amber-500 selection:text-white pb-16">
      
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        allUsers={sampleUsers}
        unreadMsgCount={unreadMsgCount}
        pendingModCount={moderationItems.length}
      />

      {/* Quick Test Shortcuts Header Bar */}
      <div className="bg-amber-500/10 dark:bg-amber-500/5 border-b border-amber-500/20 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Follow-up Features Quick Access:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Follow-up 1 */}
            <button
              onClick={jumpToFuzzyPlate}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                currentScreen === 'discover'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. Fuzzy Plate Search (0/O & 1/I with %)</span>
            </button>

            {/* Follow-up 2 */}
            <button
              onClick={jumpToMaintenanceAdvisor}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                currentScreen === 'garage' && garageInitialTab === 'advisor'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>2. Maintenance Advisor ('Service Soon' + Rules)</span>
            </button>

            {/* Follow-up 3 */}
            <button
              onClick={jumpToRoutePlanner}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                currentScreen === 'events'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>3. Route Planner (3 Scenic Routes)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Personalized Greeting Banner (FR-REG-06: shown on feed, garage, discover) */}
        {['feed', 'garage', 'discover'].includes(currentScreen) && (
          <PersonalizedGreeting
            user={currentUser}
            vehicle={primaryVehicle}
            lang={lang}
          />
        )}

        {/* Screen Routing */}
        {currentScreen === 'auth' && (
          <AuthScreen
            lang={lang}
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => setCurrentScreen('feed')}
          />
        )}

        {currentScreen === 'feed' && (
          <FeedScreen
            posts={posts}
            setPosts={setPosts}
            stories={stories}
            currentUser={currentUser}
            userVehicles={userVehicles}
            lang={lang}
            onOpenGarage={(vehId) => {
              setCurrentScreen('garage');
            }}
            onFlagContent={handleFlagContent}
          />
        )}

        {currentScreen === 'garage' && (
          <GarageScreen
            vehicles={userVehicles.length > 0 ? userVehicles : vehicles}
            setVehicles={setVehicles}
            currentUser={currentUser}
            lang={lang}
            initialTab={garageInitialTab}
          />
        )}

        {currentScreen === 'discover' && (
          <DiscoverScreen
            vehicles={vehicles}
            currentUser={currentUser}
            lang={lang}
            initialQuery={discoverInitialQuery}
            onSelectVehicle={(veh) => {
              setCurrentScreen('garage');
            }}
            onOpenMessage={(name, plate) => {
              setCurrentScreen('messages');
            }}
          />
        )}

        {currentScreen === 'communities' && (
          <CommunitiesScreen
            communities={communities}
            setCommunities={setCommunities}
            currentUser={currentUser}
            lang={lang}
          />
        )}

        {currentScreen === 'events' && (
          <EventsScreen
            events={events}
            setEvents={setEvents}
            currentUser={currentUser}
            lang={lang}
          />
        )}

        {currentScreen === 'messages' && (
          <MessagesScreen
            conversations={conversations}
            setConversations={setConversations}
            currentUser={currentUser}
            lang={lang}
          />
        )}

        {currentScreen === 'privacy' && (
          <PrivacyScreen
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            lang={lang}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            moderationItems={moderationItems}
            setModerationItems={setModerationItems}
            currentUser={currentUser}
            lang={lang}
          />
        )}

      </main>

      {/* Footer Banner */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-500">CarSocial</span>
          <span>• Dedicated Automotive Social Network</span>
          <span className="hidden md:inline">• SWE 371 Requirements Specification Prototype</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Plates Masked by Default (BR-1)</span>
          <span>•</span>
          <span>AI Labeled (AI-GOV-01)</span>
          <span>•</span>
          <span>GDPR Compliant</span>
        </div>
      </footer>
    </div>
  );
}
