import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, LayoutDashboard, ShieldCheck, Bell, Menu, X, Briefcase, Info, Mail, UserCheck } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PharmNexiaLogo } from './PharmNexiaLogo';

export const Navbar = ({ currentPath, onNavigate }) => {
  const { currentUser, logoutUser, notifications, markAllNotificationsRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const moreRef = useRef(null);
  const userRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation items (Clean & uncrowded)
  const primaryLinks = [
    { label: 'Home', path: '/' },
    { label: 'Career Paths', path: '/career-paths' },
    { label: 'Mentors', path: '/mentors' },
    { label: 'Programs', path: '/programs' },
    { label: 'Resources', path: '/resources' },
  ];

  // Secondary items placed cleanly in "More ▾" dropdown
  const secondaryLinks = [
    { label: 'Opportunities', path: '/opportunities', icon: Briefcase, desc: 'Internships, Jobs & Fellowships' },
    { label: 'About', path: '/about', icon: Info, desc: 'Our Mission & Academic Council' },
    { label: 'Contact', path: '/contact', icon: Mail, desc: 'Student Help & Institutional Desk' },
    { label: 'Become a Mentor', path: '/become-a-mentor', icon: UserCheck, desc: 'Guide next-gen pharmacy aspirants' },
  ];

  const unreadNotifs = notifications ? notifications.filter((n) => !n.isRead).length : 0;

  const handleNav = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive = secondaryLinks.some(link => 
    currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path))
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] text-[#111827]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] sm:h-[76px]">
          
          {/* 1. BRAND LOGO */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => handleNav('/')} 
              className="flex items-center group text-left focus:outline-none transition-opacity hover:opacity-95" 
              aria-label="PharmNexia Home"
            >
              <PharmNexiaLogo size="navbar" theme="light" />
            </button>
          </div>

          {/* 2. DESKTOP PRIMARY NAVIGATION (MINIMAL & UNCLUTTERED) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 justify-center px-4">
            {primaryLinks.map((link) => {
              const isActive = link.path === '/' 
                ? (currentPath === '/' || currentPath === '') 
                : currentPath.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`whitespace-nowrap text-[15px] font-medium transition-colors py-1 ${
                    isActive ? 'text-[#00A86B] font-semibold' : 'text-[#344054] hover:text-[#00A86B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* "More ▾" Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium transition-colors py-1 ${
                  isMoreActive || moreDropdownOpen ? 'text-[#00A86B] font-semibold' : 'text-[#344054] hover:text-[#00A86B]'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#00A86B]' : 'text-[#667085]'}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                  {secondaryLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path || currentPath.startsWith(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNav(item.path)}
                        className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                          isActive ? 'bg-[#E8F8F1] text-[#00A86B]' : 'hover:bg-[#F8FAF9] text-[#111827]'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-[#00A86B] text-white' : 'bg-[#F8FAF9] text-[#00A86B]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold leading-tight">{item.label}</div>
                          <div className="text-[11px] text-[#667085] leading-tight mt-0.5 truncate">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* 3. DESKTOP RIGHT ACTIONS (LOGIN ALWAYS VISIBLE) */}
          <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
            
            {/* Notification Bell */}
            <div className="relative flex items-center" ref={notifRef}>
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} 
                className="p-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:text-[#111827] hover:bg-[#F8FAF9] transition-colors relative flex items-center justify-center" 
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-[#344054]" />
                {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00A86B]"></span>}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3.5 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E7EB] mb-2.5">
                    <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">Notifications</span>
                    {unreadNotifs > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-[11px] text-[#00A86B] hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {!notifications || notifications.length === 0 ? (
                      <p className="text-xs text-[#667085] text-center py-4">No new notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} onClick={() => { if (n.link) handleNav(n.link); }} className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${n.isRead ? 'bg-[#F8FAF9] text-[#667085]' : 'bg-[#E8F8F1] text-[#111827]'}`}>
                          <div className="font-semibold text-[#00A86B]">{n.title}</div>
                          <div className="text-[#667085] text-[11px] mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-[#667085] mt-1">{n.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User vs Guest (LOGIN VISIBLE) */}
            {currentUser ? (
              <div className="relative flex items-center" ref={userRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F8FAF9] border border-[#E5E7EB] transition-colors"
                >
                  <img 
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-lg object-cover border border-[#00A86B]" 
                  />
                  <span className="text-xs font-semibold text-[#111827] max-w-[120px] truncate hidden xl:inline">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-2 z-50 text-xs animate-fadeIn">
                    <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                      <div className="font-bold text-[#111827] text-sm">{currentUser.name}</div>
                      <div className="text-[#667085] text-[11px] truncate">{currentUser.email}</div>
                    </div>

                    <button 
                      onClick={() => handleNav('/dashboard')} 
                      className="w-full text-left px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F8FAF9] hover:text-[#00A86B] flex items-center gap-2 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#00A86B]" />
                      <span>
                        {currentUser.role === 'DEVELOPER'
                          ? 'Developer Hub'
                          : ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)
                            ? 'Admin Hub'
                            : ['MENTOR_MANAGER', 'CONTENT_MANAGER', 'SUPPORT', 'ANALYST'].includes(currentUser.role || currentUser.staffRole)
                              ? 'Staff Console'
                              : 'My Dashboard'}
                      </span>
                    </button>

                    <button 
                      onClick={() => handleNav('/profile')} 
                      className="w-full text-left px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F8FAF9] hover:text-[#00A86B] flex items-center gap-2 transition-colors font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                      <span>Profile</span>
                    </button>

                    <button 
                      onClick={async () => { 
                        await logoutUser(); 
                        setUserDropdownOpen(false); 
                        onNavigate('/'); 
                      }} 
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-[#E5E7EB] mt-1 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleNav('/auth?mode=login')} 
                  className="whitespace-nowrap text-[15px] font-semibold text-[#344054] hover:text-[#00A86B] px-3 py-2 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNav('/auth?mode=signup')} 
                  className="whitespace-nowrap text-[15px] font-semibold rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white px-5 py-2.5 transition-colors shadow-sm btn-primary-action"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* 4. MOBILE ACTIONS (CLEAN & MINIMAL WITH DIRECT ACCESS) */}
          <div className="lg:hidden flex items-center gap-2.5 flex-shrink-0">
            {currentUser ? (
              <button 
                onClick={() => handleNav('/dashboard')} 
                className="flex items-center p-1 rounded-xl border border-[#00A86B]/30 bg-[#E8F8F1] transition-all"
                title="My Dashboard"
                aria-label="My Dashboard"
              >
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-lg object-cover border border-[#00A86B]" 
                />
              </button>
            ) : (
              <button 
                onClick={() => handleNav('/auth?mode=login')} 
                className="px-3.5 py-1.5 rounded-xl border border-[#00A86B]/40 bg-[#E8F8F1] hover:bg-[#00A86B] hover:text-white text-[#087A52] text-xs font-bold transition-all shadow-xs"
              >
                Log In
              </button>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="w-10 h-10 rounded-xl bg-[#F8FAF9] text-[#111827] border border-[#E5E7EB] hover:border-[#00A86B] hover:bg-white flex items-center justify-center transition-all" 
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#111827]" /> : <Menu className="w-5 h-5 text-[#111827]" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-5 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn">
          
          {/* Main Links Grid */}
          <div className="space-y-1 pb-3 border-b border-[#E5E7EB]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] px-3 py-1 font-mono">
              Main Menu
            </div>
            {primaryLinks.map((link) => {
              const isActive = link.path === '/' ? (currentPath === '/' || currentPath === '') : currentPath.startsWith(link.path);
              return (
                <button 
                  key={link.path} 
                  onClick={() => handleNav(link.path)} 
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm text-left font-semibold transition-colors flex items-center justify-between ${
                    isActive ? 'bg-[#E8F8F1] text-[#00A86B]' : 'text-[#344054] hover:bg-[#F8FAF9]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]"></span>}
                </button>
              );
            })}
          </div>

          {/* Secondary Links */}
          <div className="space-y-1 pb-3 border-b border-[#E5E7EB]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] px-3 py-1 font-mono">
              Explore More
            </div>
            {secondaryLinks.map((link) => {
              const isActive = currentPath === link.path || currentPath.startsWith(link.path);
              const Icon = link.icon;
              return (
                <button 
                  key={link.path} 
                  onClick={() => handleNav(link.path)} 
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm text-left font-semibold transition-colors flex items-center gap-2.5 ${
                    isActive ? 'bg-[#E8F8F1] text-[#00A86B]' : 'text-[#344054] hover:bg-[#F8FAF9]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#00A86B]" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Auth Bottom Bar */}
          <div className="pt-1">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-lg border border-[#00A86B] object-cover" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#111827] truncate">{currentUser.name}</div>
                    <div className="text-xs text-[#667085] truncate">{currentUser.email}</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleNav('/dashboard')} 
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#E8F8F1] text-[#00A86B] font-bold text-xs flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Student Dashboard</span>
                </button>

                <button 
                  onClick={() => handleNav('/profile')} 
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] text-[#111827] font-semibold text-xs flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                  <span>My Profile</span>
                </button>

                <button 
                  onClick={async () => { 
                    await logoutUser(); 
                    setMobileMenuOpen(false); 
                    onNavigate('/'); 
                  }} 
                  className="w-full text-left px-3.5 py-2 text-rose-600 font-semibold text-xs flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pt-1">
                <button 
                  onClick={() => handleNav('/auth?mode=login')} 
                  className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[#111827] text-sm font-semibold hover:border-[#00A86B] transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNav('/auth?mode=signup')} 
                  className="w-full py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
