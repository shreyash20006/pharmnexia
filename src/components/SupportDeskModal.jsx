import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  User, 
  Copy, 
  Check, 
  ChevronRight, 
  AlertCircle,
  Sparkles,
  ArrowLeft,
  LifeBuoy,
  Paperclip,
  CreditCard,
  Compass,
  BookOpen
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SUPPORT_CATEGORIES } from '../data/supportTicketsData';

export const SupportDeskModal = ({ onOpenAuth }) => {
  const { 
    currentUser, 
    bookings, 
    supportTickets, 
    supportAgents, 
    createSupportTicket, 
    sendMessageToTicket 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list' | 'new_ticket' | 'chat'
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // New ticket form state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBookingForContext, setSelectedBookingForContext] = useState(null);
  const [initialMessageText, setInitialMessageText] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Chat message input
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);

  // Filter tickets for current user
  const userTickets = supportTickets.filter(t => {
    if (!currentUser) return false;
    return t.userId === currentUser.id || t.userPharmNexiaId === currentUser.pharmNexiaId || t.userEmail === currentUser.email;
  });

  const activeTicket = supportTickets.find(t => t.id === selectedTicketId) || userTickets[0] || null;

  // Auto scroll chat to bottom
  useEffect(() => {
    if (activeView === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicket?.messages?.length, activeView]);

  // When opening or logging in, pick the most recent open ticket if exists
  useEffect(() => {
    if (currentUser && userTickets.length > 0 && !selectedTicketId) {
      const openTicket = userTickets.find(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED');
      if (openTicket) {
        setSelectedTicketId(openTicket.id);
      } else {
        setSelectedTicketId(userTickets[0].id);
      }
    }
  }, [currentUser, userTickets.length]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartNewTicket = () => {
    setSelectedCategory(null);
    setSelectedBookingForContext(bookings.length > 0 ? bookings[0] : null);
    setInitialMessageText('');
    setCustomSubject('');
    setActiveView('new_ticket');
  };

  const handleSubmitNewTicket = (e) => {
    e.preventDefault();
    if (!selectedCategory || !initialMessageText.trim()) return;

    let attachedContext = {
      education: currentUser?.degree ? `${currentUser.degree} — ${currentUser.year || 'Student'}` : 'B.Pharm',
      interests: currentUser?.interests || ['Pharmacovigilance', 'Medical Writing'],
      recentActivity: [
        `Verified PharmNexia ID: ${currentUser?.pharmNexiaId || 'PHN-STU-001247'}`,
        `Selected Category: ${selectedCategory}`
      ]
    };

    if (selectedCategory === 'Mentor Booking' || selectedCategory === 'Payment Issue') {
      if (selectedBookingForContext) {
        attachedContext = {
          ...attachedContext,
          bookingId: selectedBookingForContext.id,
          mentorName: selectedBookingForContext.mentorName,
          sessionDate: `${selectedBookingForContext.scheduledDate}, ${selectedBookingForContext.scheduledTime}`,
          paymentStatus: selectedBookingForContext.paymentStatus === 'PAID' ? 'Successful' : selectedBookingForContext.paymentStatus,
          paymentAmount: selectedBookingForContext.paymentAmount || 599,
          recentActivity: [
            ...attachedContext.recentActivity,
            `Linked Booking: ${selectedBookingForContext.id} (${selectedBookingForContext.mentorName})`,
            `Payment: ₹${selectedBookingForContext.paymentAmount || 599} Verified`
          ]
        };
      }
    }

    const created = createSupportTicket({
      category: selectedCategory,
      subject: customSubject || `${selectedCategory} Inquiry`,
      initialMessage: initialMessageText.trim(),
      attachedContext
    });

    setSelectedTicketId(created.id);
    setActiveView('chat');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    sendMessageToTicket(activeTicket.id, replyText, 'STUDENT', currentUser?.name);
    setReplyText('');
  };

  // Helper for status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">New Request</span>;
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">In Progress</span>;
      case 'WAITING_FOR_STUDENT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Awaiting Your Reply</span>;
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">Resolved</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">Closed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">Active</span>;
    }
  };

  return (
    <>
      {/* ====================================================================
          1. FLOATING SUPPORT TRIGGER BUTTON (Bottom-Right, Sleek Green Pill)
          ==================================================================== */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full bg-[#101828] hover:bg-[#00A86B] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-white/10"
          aria-label="Open PharmNexia Support Desk"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#00D084] group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00D084] animate-pulse"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-tight">Support Desk</span>
            <span className="text-[10px] text-gray-400 group-hover:text-white/90 transition-colors">
              {currentUser ? (currentUser.pharmNexiaId || 'Online') : 'Get Help'}
            </span>
          </div>
        </button>
      </div>

      {/* ====================================================================
          2. SUPPORT DESK MODAL / FLYOUT
          ==================================================================== */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden bg-[#0F172A]/35 backdrop-blur-[4px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white w-full sm:max-w-lg md:max-w-[580px] rounded-t-3xl sm:rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E5E7EB] flex flex-col h-[90vh] sm:h-[650px] max-h-[720px] overflow-hidden text-[#111827] animate-modal-pop"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ----------------- MODAL HEADER ----------------- */}
            <div className="bg-[#101828] text-white px-5 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5 text-[#00D084]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-tight font-heading">PharmNexia Support Desk</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00A86B]/20 text-[#00D084] border border-[#00D084]/30">
                      🟢 Team Active
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    {currentUser 
                      ? `${currentUser.name} • ${currentUser.pharmNexiaId || 'PHN-STU-001247'}`
                      : 'Authenticated Institutional Support'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close Support Desk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ----------------- CASE A: GUEST (NOT SIGNED IN) ----------------- */}
            {!currentUser ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8FAF9]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#00A86B] flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#101828] font-heading mb-1.5">
                  Sign in to chat with PharmNexia Support
                </h4>
                <p className="text-xs text-[#667085] max-w-sm leading-relaxed mb-6">
                  To provide personalized help with your mentorship bookings, application status, or academic roadmaps, please sign in. Your verified student profile and ticket history are automatically identified.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (onOpenAuth) onOpenAuth('login');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white text-xs font-semibold shadow-sm transition active:scale-95"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (onOpenAuth) onOpenAuth('signup');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#00A86B] text-[#111827] text-xs font-semibold transition active:scale-95"
                  >
                    Register Free
                  </button>
                </div>
                <div className="mt-8 pt-6 border-t border-[#E5E7EB] w-full max-w-sm text-[11px] text-[#667085] flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                  <span>No new support account required. Linked to your PharmNexia profile.</span>
                </div>
              </div>
            ) : (
              /* ----------------- CASE B: AUTHENTICATED STUDENT VIEW ----------------- */
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                
                {/* SUB-NAVBAR FOR TICKETS (List vs New vs Chat) */}
                <div className="px-5 py-2.5 bg-[#F8FAF9] border-b border-[#E5E7EB] flex items-center justify-between text-xs flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {activeView !== 'list' && (
                      <button
                        onClick={() => setActiveView('list')}
                        className="inline-flex items-center gap-1 text-[#667085] hover:text-[#00A86B] font-medium"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>All Tickets ({userTickets.length})</span>
                      </button>
                    )}
                    {activeView === 'list' && (
                      <span className="font-semibold text-[#101828]">
                        Your Support Conversations ({userTickets.length})
                      </span>
                    )}
                  </div>
                  {activeView !== 'new_ticket' && (
                    <button
                      onClick={handleStartNewTicket}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-[11px] shadow-xs transition"
                    >
                      <span>+ New Request</span>
                    </button>
                  )}
                </div>

                {/* ---------------- VIEW 1: TICKETS LIST (PERMANENT HISTORY) ---------------- */}
                {activeView === 'list' && (
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Student Identity Card */}
                    <div className="bg-[#E8F8F1] border border-[#00A86B]/20 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white border border-[#00A86B]/30 flex items-center justify-center font-bold text-[#087A52] font-mono text-xs shadow-xs">
                          STU
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#101828]">Hi {currentUser.name}! 👋</div>
                          <div className="text-xs text-[#087A52] flex items-center gap-1.5 font-mono">
                            <span>ID: {currentUser.pharmNexiaId || 'PHN-STU-001247'}</span>
                            <button
                              onClick={() => copyToClipboard(currentUser.pharmNexiaId || 'PHN-STU-001247', 'user-id')}
                              className="text-gray-400 hover:text-[#087A52]"
                              title="Copy ID"
                            >
                              {copiedId === 'user-id' ? <Check className="w-3 h-3 text-[#00A86B]" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#475467] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                        {currentUser.degree || 'B.Pharm'} • {currentUser.year || '3rd Year'}
                      </span>
                    </div>

                    {/* Quick Topics Grid */}
                    <div>
                      <h4 className="text-xs font-bold text-[#475467] uppercase tracking-wider mb-2.5">
                        Start a New Conversation
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SUPPORT_CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSelectedBookingForContext(bookings.length > 0 ? bookings[0] : null);
                              setActiveView('new_ticket');
                            }}
                            className="p-3 rounded-xl border border-[#E5E7EB] hover:border-[#00A86B] hover:bg-[#F8FAF9] text-left transition group flex flex-col justify-between"
                          >
                            <span className="text-xs font-semibold text-[#101828] group-hover:text-[#00A86B]">
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-[#667085] mt-1 line-clamp-1">
                              {cat.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ticket History */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-[#475467] uppercase tracking-wider mb-2.5">
                        Previous Conversations
                      </h4>

                      {userTickets.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-[#E5E7EB] rounded-2xl p-6">
                          <p className="text-xs text-[#667085]">No support tickets opened yet.</p>
                          <button
                            onClick={handleStartNewTicket}
                            className="mt-3 text-xs font-semibold text-[#00A86B] hover:underline"
                          >
                            Start your first query →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {userTickets.map(tkt => {
                            const lastMsg = tkt.messages[tkt.messages.length - 1];
                            return (
                              <div
                                key={tkt.id}
                                onClick={() => {
                                  setSelectedTicketId(tkt.id);
                                  setActiveView('chat');
                                }}
                                className="p-3.5 rounded-2xl border border-[#E5E7EB] hover:border-[#00A86B] hover:bg-[#F8FAF9] cursor-pointer transition flex items-center justify-between group"
                              >
                                <div className="space-y-1 pr-3 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono font-bold text-[#101828]">
                                      {tkt.id}
                                    </span>
                                    <span className="text-[11px] text-[#667085]">• {tkt.category}</span>
                                    {getStatusBadge(tkt.status)}
                                  </div>
                                  <div className="text-xs font-semibold text-[#101828] group-hover:text-[#00A86B] transition-colors truncate">
                                    {tkt.subject}
                                  </div>
                                  {lastMsg && (
                                    <div className="text-[11px] text-[#667085] truncate">
                                      <span className="font-medium text-[#475467]">{lastMsg.senderName}:</span> {lastMsg.text}
                                    </div>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00A86B] flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---------------- VIEW 2: NEW TICKET COMPOSER (SMART CONTEXT) ---------------- */}
                {activeView === 'new_ticket' && (
                  <form onSubmit={handleSubmitNewTicket} className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#101828] mb-1.5">
                        Select Query Topic *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SUPPORT_CATEGORIES.map(cat => (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                              selectedCategory === cat.id
                                ? 'bg-[#00A86B] text-white border-[#00A86B] shadow-xs'
                                : 'bg-[#F8FAF9] text-[#475467] border-[#E5E7EB] hover:border-[#00A86B]'
                            }`}
                          >
                            [{cat.label}]
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Automatic Context Card for Mentor Booking or Payment */}
                    {(selectedCategory === 'Mentor Booking' || selectedCategory === 'Payment Issue') && (
                      <div className="p-3.5 rounded-2xl bg-[#E8F8F1] border border-[#00A86B]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#087A52] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
                            <span>Auto Context Detection</span>
                          </span>
                          <span className="text-[10px] font-semibold text-[#00A86B] bg-white px-2 py-0.5 rounded-md border border-[#00A86B]/20">
                            No manual typing required
                          </span>
                        </div>

                        {bookings.length > 0 ? (
                          <div>
                            <p className="text-[11px] text-[#475467] mb-2">
                              System identified your recent booking. Select one to automatically attach:
                            </p>
                            <div className="space-y-1.5">
                              {bookings.map(b => (
                                <div
                                  key={b.id}
                                  onClick={() => setSelectedBookingForContext(b)}
                                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                                    selectedBookingForContext?.id === b.id
                                      ? 'bg-white border-[#00A86B] text-[#101828] shadow-xs'
                                      : 'bg-white/60 border-emerald-100 text-[#475467] hover:bg-white'
                                  }`}
                                >
                                  <div>
                                    <div className="font-semibold text-xs">
                                      {b.mentorName} • {b.scheduledDate} ({b.scheduledTime})
                                    </div>
                                    <div className="text-[10px] text-[#667085] font-mono">
                                      Booking ID: {b.id} • Payment: {b.paymentStatus}
                                    </div>
                                  </div>
                                  <span className={`text-[11px] font-bold ${selectedBookingForContext?.id === b.id ? 'text-[#00A86B]' : 'text-gray-300'}`}>
                                    ✓
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 bg-white/70 rounded-xl text-[11px] text-[#667085]">
                            No active bookings found on this account. Proceeding with student profile context.
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#101828] mb-1">
                        Subject / Brief Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder={`e.g. Help with ${selectedCategory || 'mentor schedule'}`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#101828] mb-1">
                        Describe your question or issue *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={initialMessageText}
                        onChange={(e) => setInitialMessageText(e.target.value)}
                        placeholder="Type your message here... Our verified support team will respond immediately."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveView('list')}
                        className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#475467] hover:bg-[#F8FAF9]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!selectedCategory || !initialMessageText.trim()}
                        className="px-5 py-2 rounded-xl bg-[#00A86B] hover:bg-[#087A52] disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                      >
                        <span>Start Support Chat</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}

                {/* ---------------- VIEW 3: LIVE CONVERSATION SCREEN ---------------- */}
                {activeView === 'chat' && activeTicket && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* Conversation Header & Status Banner */}
                    <div className="p-3.5 bg-white border-b border-[#E5E7EB] flex items-center justify-between flex-shrink-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#101828]">
                            {activeTicket.id}
                          </span>
                          <button
                            onClick={() => copyToClipboard(activeTicket.id, 'ticket-id')}
                            className="text-gray-400 hover:text-[#00A86B]"
                            title="Copy Ticket ID"
                          >
                            {copiedId === 'ticket-id' ? <Check className="w-3 h-3 text-[#00A86B]" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <span className="text-xs text-[#667085]">• {activeTicket.category}</span>
                          {getStatusBadge(activeTicket.status)}
                        </div>
                        <div className="text-xs font-semibold text-[#101828] truncate max-w-sm mt-0.5">
                          {activeTicket.subject}
                        </div>
                      </div>

                      {activeTicket.assignedAgent && (
                        <div className="flex items-center gap-2 text-right">
                          <img
                            src={activeTicket.assignedAgent.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
                            alt={activeTicket.assignedAgent.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#00A86B]"
                          />
                          <div className="hidden sm:block text-left leading-tight">
                            <div className="text-[11px] font-bold text-[#101828]">{activeTicket.assignedAgent.name}</div>
                            <div className="text-[10px] text-[#00A86B] font-medium">{activeTicket.assignedAgent.pharmNexiaId}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notification Callout */}
                    <div className="bg-[#F8FAF9] px-4 py-2 border-b border-[#E5E7EB] text-[11px] text-[#475467] flex items-center justify-between flex-shrink-0">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B]" />
                        <span>Your support request is being handled by our team.</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#667085]">
                        Updated {new Date(activeTicket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFDFB]">
                      
                      {/* Attached Context Bubble (if present) */}
                      {activeTicket.context?.bookingId && (
                        <div className="p-3 bg-[#E8F8F1] border border-[#00A86B]/30 rounded-2xl max-w-sm text-xs space-y-1 text-[#101828] shadow-xs">
                          <div className="font-bold text-[#087A52] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <Paperclip className="w-3 h-3" />
                            <span>Auto Attached Context</span>
                          </div>
                          <div><span className="text-[#667085]">Issue:</span> {activeTicket.category}</div>
                          <div><span className="text-[#667085]">Booking ID:</span> <span className="font-mono font-semibold">{activeTicket.context.bookingId}</span></div>
                          {activeTicket.context.mentorName && <div><span className="text-[#667085]">Mentor:</span> {activeTicket.context.mentorName}</div>}
                          {activeTicket.context.sessionDate && <div><span className="text-[#667085]">Session:</span> {activeTicket.context.sessionDate}</div>}
                          <div><span className="text-[#667085]">Payment:</span> <span className="font-semibold text-emerald-700">{activeTicket.context.paymentStatus || 'Successful'}</span></div>
                        </div>
                      )}

                      {/* Chat Bubbles */}
                      {activeTicket.messages.map((msg) => {
                        const isStudent = msg.senderRole === 'STUDENT';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1">
                              <span className="text-[10px] font-bold text-[#475467]">
                                {msg.senderName}
                              </span>
                              <span className="text-[9px] text-[#667085]">
                                • {msg.timestamp}
                              </span>
                            </div>
                            <div
                              className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                                isStudent
                                  ? 'bg-[#00A86B] text-white rounded-br-xs shadow-xs'
                                  : 'bg-white border border-[#E5E7EB] text-[#111827] rounded-bl-xs shadow-xs'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 flex-shrink-0">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="p-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] disabled:opacity-40 text-white transition active:scale-95"
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SupportDeskModal;
