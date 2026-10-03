import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Award
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PharmNexiaLogo } from './PharmNexiaLogo';

export const Navbar = ({ currentPath, onNavigate }) => {
  const { 
    currentUser, 
    logoutUser, 
    notifications, 
    markAllNotificationsRead 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Career Paths", path: "/career-paths" },
    { label: "Mentors", path: "/mentors" },
    { label: "Programs", path: "/programs" },
    { label: "Opportunities", path: "/opportunities" },
    { label: "Resources", path: "/resources" },
    { label: "About", path: "/about" },
  ];

  const handleNav = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] text-[#111827]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[74px] sm:h-[76px] lg:h-20">
          
          {/* Logo Container (Unified Brand Element, Vertically Centered) */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => handleNav('/')} 
              className="flex items-center group text-left focus:outline-none transition-opacity hover:opacity-95"
              aria-label="PharmNexia Home"
            >
              <PharmNexiaLogo size="navbar" theme="light" />
            </button>
          </div>

          {/* Desktop Navigation Links (Consistent 20-28px gap, white-space: nowrap, vertical center) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 flex-1 justify-center px-4">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`whitespace-nowrap text-[15.5px] font-medium transition-colors py-1 ${
                    isActive 
                      ? 'text-[#00A86B] font-semibold' 
                      : 'text-[#344054] hover:text-[#00A86B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar (All items vertically centered, white-space: nowrap) */}
          <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
            {/* Verify Certificate */}
            <button
              onClick={() => handleNav('/verify-certificate')}
              className="whitespace-nowrap text-xs text-[#667085] hover:text-[#00A86B] px-2.5 py-1.5 rounded-lg hover:bg-[#F8FAF9] flex items-center gap-1.5 transition-colors"
              title="Verify certificate authenticity"
            >
              <Award className="w-3.5 h-3.5 text-[#00A86B]" />
              <span>Verify Certificate</span>
            </button>

            {/* Notification Bell */}
            <div className="relative flex items-center">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg border border-[#E5E7EB] text-[#667085] hover:text-[#111827] hover:bg-[#F8FAF9] transition-colors relative flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00A86B]"></span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3.5 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E7EB] mb-2.5">
                    <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">Notifications</span>
                    {unreadNotifs > 0 && (
                      <button 
                        onClick={markAllNotificationsRead} 
                        className="text-[11px] text-[#00A86B] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#667085] text-center py-4">No new notifications.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => { if (n.link) handleNav(n.link); }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                            n.isRead ? 'bg-[#F8FAF9] text-[#667085]' : 'bg-[#E8F8F1] text-[#111827]'
                          }`}
                        >
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

            {/* Profile Dropdown or Auth Actions */}
            {currentUser ? (
              <div className="relative flex items-center">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F8FAF9] border border-[#E5E7EB] transition-colors"
                >
                  <img 
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-lg object-cover border border-[#00A86B]"
                  />
                  <span className="text-xs font-semibold text-[#111827] max-w-[120px] truncate hidden xl:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                      <div className="font-bold text-[#111827] text-sm">{currentUser.name}</div>
                      <div className="text-[#667085] text-[11px] truncate">{currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => handleNav('/dashboard')}
                      className="w-full text-left px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F8FAF9] hover:text-[#00A86B] flex items-center gap-2 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#00A86B]" />
                      <span>{currentUser.role === 'ADMIN' ? 'Admin Hub' : 'My Dashboard'}</span>
                    </button>

                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full text-left px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F8FAF9] hover:text-[#00A86B] flex items-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                        <span>Platform Administration</span>
                      </button>
                    )}

                    <button
                      onClick={() => { logoutUser(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-[#E5E7EB] mt-1"
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
                  className="whitespace-nowrap text-[15px] font-semibold text-[#344054] hover:text-[#00A86B] px-3.5 py-2 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/auth?mode=signup')}
                  className="whitespace-nowrap text-[15.5px] font-semibold rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white px-5 py-2.5 transition-colors shadow-sm btn-primary-action"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions: Certificate Button (44x44) & Hamburger Menu (44x44) with 10-12px gap */}
          <div className="lg:hidden flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => handleNav('/verify-certificate')}
              className="w-11 h-11 rounded-xl bg-[#F8FAF9] text-[#00A86B] border border-[#E5E7EB] hover:border-[#00A86B] hover:bg-white flex items-center justify-center transition-all active:scale-95 focus:outline-none shadow-xs"
              title="Verify Certificate Authenticity"
              aria-label="Verify Certificate"
            >
              <Award className="w-5 h-5 text-[#00A86B]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 rounded-xl bg-[#F8FAF9] text-[#111827] border border-[#E5E7EB] hover:border-[#00A86B] hover:bg-white flex items-center justify-center transition-all active:scale-95 focus:outline-none shadow-xs"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#111827]" /> : <Menu className="w-6 h-6 text-[#111827]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Clean White) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E5E7EB]">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`px-3 py-2 rounded-xl text-xs text-left font-medium transition-colors ${
                  currentPath === link.path ? 'bg-[#E8F8F1] text-[#00A86B] font-semibold' : 'text-[#344054] hover:bg-[#F8FAF9]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-1">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-lg border border-[#00A86B] object-cover" 
                  />
                  <div>
                    <div className="text-sm font-bold text-[#111827]">{currentUser.name}</div>
                    <div className="text-xs text-[#00A86B]">{currentUser.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#E8F8F1] text-[#00A86B] font-medium text-xs flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Dashboard</span>
                </button>

                <button
                  onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-rose-600 text-xs flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => handleNav('/auth?mode=login')}
                  className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[#111827] text-xs font-medium hover:border-[#00A86B]"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/auth?mode=signup')}
                  className="w-full py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-medium text-xs shadow-sm"
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
