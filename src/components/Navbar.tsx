import React from 'react';
import { 
  Car, 
  Compass, 
  Users, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  Languages, 
  UserCheck, 
  CheckCircle2, 
  Bell,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Language, Theme, User } from '../types';
import { translations } from '../i18n/translations';
import { formatPlateNumber } from '../data/mockData';

interface NavbarProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
  allUsers: User[];
  unreadMsgCount: number;
  pendingModCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  setCurrentScreen,
  lang,
  setLang,
  theme,
  setTheme,
  currentUser,
  onSelectUser,
  allUsers,
  unreadMsgCount,
  pendingModCount,
}) => {
  const t = translations[lang];
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'feed', label: t.nav.feed, icon: Car },
    { id: 'garage', label: t.nav.garage, icon: ShieldCheck },
    { id: 'discover', label: t.nav.discover, icon: Compass },
    { id: 'communities', label: t.nav.communities, icon: Users },
    { id: 'events', label: t.nav.events, icon: Calendar },
    { 
      id: 'messages', 
      label: t.nav.messages, 
      icon: MessageSquare, 
      badge: unreadMsgCount > 0 ? unreadMsgCount : null 
    },
    { id: 'privacy', label: t.nav.privacy, icon: SlidersHorizontal },
    { 
      id: 'admin', 
      label: t.nav.admin, 
      icon: Lock, 
      badge: pendingModCount > 0 ? pendingModCount : null,
      adminOnly: true
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors bg-white/90 dark:bg-stone-950/90 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('feed')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                    {t.appName}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Auto-ID
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden md:block line-clamp-1">
                  {t.appTagline}
                </p>
              </div>
            </button>
          </div>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Theme, User Switcher */}
          <div className="flex items-center gap-2">
            {/* Language Toggle (EN / AR) */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 transition-colors"
              title="Toggle English / Arabic"
            >
              <Languages className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Quick Demo Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/40 bg-stone-50 dark:bg-stone-900 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500/30"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold leading-tight line-clamp-1">
                      {lang === 'ar' && currentUser.nameAr ? currentUser.nameAr : currentUser.name}
                    </span>
                    {currentUser.isVerified && (
                      <CheckCircle2 className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 block leading-none">
                    {formatPlateNumber(currentUser.primaryPlate, 'DXB', currentUser.plateDisplayMode)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute end-0 mt-2 w-72 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800 mb-1">
                    <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      {t.auth.quickLoginAs}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {allUsers.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSelectUser(u);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium'
                              : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold truncate">
                                {lang === 'ar' && u.nameAr ? u.nameAr : u.name}
                              </span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 font-mono">
                                {u.role}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block">
                              {formatPlateNumber(u.primaryPlate, 'DXB', u.plateDisplayMode)}
                              {u.isPrivate && ' • (Private Owner)'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-stone-100 dark:border-stone-800 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setCurrentScreen('auth');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{t.auth.title}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-100 dark:border-stone-800 scrollbar-none text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
