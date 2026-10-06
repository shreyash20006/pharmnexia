import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SUPPORT_AGENTS } from '../utils/idGenerator';

export const SupportDeskAdmin = ({ onNavigate }) => {
  const { 
    currentUser, 
    supportTickets, 
    sendMessageToTicket, 
    updateTicketStatus, 
    assignTicketAgent,
    bookings 
  } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState(supportTickets[0]?.id || null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [agentReplyText, setAgentReplyText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Active ticket
  const activeTicket = supportTickets.find(t => t.id === selectedTicketId) || supportTickets[0] || null;

  // Canned quick responses
  const cannedReplies = [
    "Sure, let me check that for you right away.",
    "I've pulled up your booking record and requested the schedule update.",
    "Your issue has been escalated to our academic council.",
    "The updated confirmation and tax invoice have been dispatched.",
    "We have marked this request as resolved. Feel free to reply if you need further help!"
  ];

  // Filtering tickets
  const filteredTickets = supportTickets.filter(tkt => {
    const matchesStatus = statusFilter === 'ALL' || tkt.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      tkt.id.toLowerCase().includes(query) ||
      tkt.userName.toLowerCase().includes(query) ||
      tkt.userPharmNexiaId.toLowerCase().includes(query) ||
      tkt.category.toLowerCase().includes(query) ||
      tkt.subject.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendAgentReply = (e) => {
    e.preventDefault();
    if (!agentReplyText.trim() || !activeTicket) return;

    const agentName = activeTicket.assignedAgent?.name || currentUser?.name || 'Support Executive';
    sendMessageToTicket(activeTicket.id, agentReplyText.trim(), 'SUPPORT', agentName);
    setAgentReplyText('');
  };

  const handleApplyCannedReply = (text) => {
    setAgentReplyText(text);
  };

  // Helper for status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">NEW</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">ASSIGNED</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">IN PROGRESS</span>;
      case 'WAITING_FOR_STUDENT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">WAITING</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">RESOLVED</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-400 border border-gray-200">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col h-[750px] text-[#111827]">
      
      {/* ----------------- SUPPORT DESK TOPBAR ----------------- */}
      <div className="px-5 py-3.5 bg-[#F8FAF9] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#101828] text-[#00D084] flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#101828] font-heading">
                PharmNexia Support Desk Console
              </h3>
              <span className="text-[10px] font-semibold bg-[#E8F8F1] text-[#087A52] px-2 py-0.5 rounded-full border border-[#00A86B]/20">
                Live Queue: {supportTickets.length} Tickets
              </span>
            </div>
            <p className="text-[11px] text-[#667085]">
              Personalized, ticket-based support desk with role-based privacy and automatic context linking.
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#475467] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
          <span>RLS & Field Privacy Active</span>
        </div>
      </div>

      {/* ----------------- 3-COLUMN MAIN LAYOUT ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ====================================================================
            COLUMN 1: TICKETS QUEUE & FILTERS (Left 320px)
            ==================================================================== */}
        <div className="w-72 lg:w-80 border-r border-[#E5E7EB] flex flex-col bg-[#FBFDFB] flex-shrink-0">
          
          {/* Search Bar */}
          <div className="p-3 border-b border-[#E5E7EB] bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, student ID, name..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#00A86B]"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[11px]">
              {['ALL', 'NEW', 'IN_PROGRESS', 'WAITING_FOR_STUDENT', 'RESOLVED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-[#101828] text-white shadow-xs'
                      : 'bg-[#F8FAF9] text-[#667085] hover:bg-gray-100'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'WAITING_FOR_STUDENT' ? 'Waiting' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Cards Stream */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">
                No tickets match the selected filter.
              </div>
            ) : (
              filteredTickets.map(tkt => {
                const isSelected = activeTicket?.id === tkt.id;
                const lastMsg = tkt.messages[tkt.messages.length - 1];
                return (
                  <div
                    key={tkt.id}
                    onClick={() => setSelectedTicketId(tkt.id)}
                    className={`p-3.5 cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-[#00A86B] shadow-xs'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-[#101828] text-[11px]">
                        {tkt.id}
                      </span>
                      {getStatusBadge(tkt.status)}
                    </div>

                    <div className="font-bold text-[#101828] truncate">
                      {tkt.userName}
                    </div>

                    <div className="text-[10px] text-[#087A52] font-mono mb-1">
                      {tkt.userPharmNexiaId} • {tkt.category}
                    </div>

                    <div className="text-[11px] text-[#667085] line-clamp-1 mb-1.5">
                      {tkt.subject}
                    </div>

                    {lastMsg && (
                      <div className="text-[10px] text-[#475467] bg-gray-50 p-1.5 rounded-lg line-clamp-1">
                        <span className="font-semibold">{lastMsg.senderName}:</span> {lastMsg.text}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ====================================================================
            COLUMN 2: LIVE CONVERSATION & AGENT ACTION CONTROLS (Center)
            ==================================================================== */}
        {activeTicket ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-[#E5E7EB]">
            
            {/* Conversation Header */}
            <div className="px-5 py-3 border-b border-[#E5E7EB] bg-white flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#101828]">
                    {activeTicket.userName}
                  </span>
                  <span className="font-mono text-xs text-[#087A52] bg-[#E8F8F1] px-2 py-0.5 rounded-md font-semibold">
                    {activeTicket.userPharmNexiaId}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online</span>
                  </span>
                </div>
                <div className="text-xs text-[#667085] mt-0.5 flex items-center gap-2">
                  <span>Ticket: <strong className="font-mono text-[#101828]">{activeTicket.id}</strong></span>
                  <span>•</span>
                  <span>Topic: <strong className="text-[#101828]">{activeTicket.category}</strong></span>
                </div>
              </div>

              {/* Status & Agent Controls */}
              <div className="flex items-center gap-2">
                {/* Status Switcher */}
                <select
                  value={activeTicket.status}
                  onChange={(e) => updateTicketStatus(activeTicket.id, e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold bg-[#F8FAF9] focus:outline-none focus:border-[#00A86B]"
                >
                  <option value="NEW">Status: NEW</option>
                  <option value="ASSIGNED">Status: ASSIGNED</option>
                  <option value="IN_PROGRESS">Status: IN PROGRESS</option>
                  <option value="WAITING_FOR_STUDENT">Status: WAITING FOR STUDENT</option>
                  <option value="RESOLVED">Status: RESOLVED</option>
                  <option value="CLOSED">Status: CLOSED</option>
                </select>

                {/* Agent Assignment */}
                <select
                  value={activeTicket.assignedAgent?.id || 'spt-001'}
                  onChange={(e) => assignTicketAgent(activeTicket.id, e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold bg-[#F8FAF9] focus:outline-none focus:border-[#00A86B]"
                >
                  {SUPPORT_AGENTS.map(ag => (
                    <option key={ag.id} value={ag.id}>
                      Assign: {ag.name} ({ag.pharmNexiaId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#FAFBFB]">
              {activeTicket.messages.map(msg => {
                const isStudent = msg.senderRole === 'STUDENT';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[11px] font-bold text-[#475467]">
                        {msg.senderName} ({isStudent ? 'Student' : 'Support Agent'})
                      </span>
                      <span className="text-[10px] text-[#667085]">
                        • {msg.timestamp}
                      </span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                        isStudent
                          ? 'bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-xs shadow-xs'
                          : 'bg-[#101828] text-white rounded-tr-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Canned Responses Chips */}
            <div className="px-4 py-2 bg-white border-t border-[#E5E7EB] flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider whitespace-nowrap">
                Quick Canned:
              </span>
              {cannedReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleApplyCannedReply(reply)}
                  className="px-2.5 py-1 rounded-lg bg-[#F8FAF9] hover:bg-[#E8F8F1] hover:text-[#00A86B] border border-[#E5E7EB] text-xs text-[#475467] whitespace-nowrap transition"
                >
                  {reply.length > 32 ? reply.substring(0, 32) + '...' : reply}
                </button>
              ))}
            </div>

            {/* Agent Reply Input */}
            <form onSubmit={handleSendAgentReply} className="p-3.5 bg-white border-t border-[#E5E7EB] flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                value={agentReplyText}
                onChange={(e) => setAgentReplyText(e.target.value)}
                placeholder={`Reply to ${activeTicket.userName} as ${activeTicket.assignedAgent?.name || 'Support Executive'}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B]"
              />
              <button
                type="submit"
                disabled={!agentReplyText.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] disabled:opacity-40 text-white text-xs font-semibold transition flex items-center gap-1.5 active:scale-95"
              >
                <span>Send Reply</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#667085]">
            Select a ticket from the left queue to open conversation.
          </div>
        )}

        {/* ====================================================================
            COLUMN 3: STUDENT OVERVIEW & PRIVACY CONTEXT CARD (Right 300px)
            ==================================================================== */}
        {activeTicket && (
          <div className="w-72 lg:w-80 p-5 bg-[#F8FAF9] flex flex-col overflow-y-auto space-y-4 flex-shrink-0">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h4 className="text-xs font-bold text-[#101828] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Student Overview</span>
              </h4>
              <span className="text-[10px] font-semibold text-[#087A52] bg-[#E8F8F1] px-2 py-0.5 rounded-md">
                Verified Profile
              </span>
            </div>

            {/* Student ID & Academic Info */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E7EB] space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Student ID</span>
                <span className="font-mono font-bold text-[#087A52] bg-[#E8F8F1] px-2 py-0.5 rounded-md">
                  {activeTicket.userPharmNexiaId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Full Name</span>
                <span className="font-semibold text-[#101828]">{activeTicket.userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Email</span>
                <span className="font-medium text-[#101828] truncate max-w-[150px]">{activeTicket.userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Education</span>
                <span className="font-semibold text-[#101828]">{activeTicket.context?.education || 'B.Pharm — 3rd Year'}</span>
              </div>
              <div>
                <span className="text-[#667085] block mb-1">Career Interests</span>
                <div className="flex flex-wrap gap-1">
                  {(activeTicket.context?.interests || ['Pharmacovigilance', 'Medical Writing']).map((interest, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#F8FAF9] border border-[#E5E7EB] text-[10px] rounded-md font-medium text-[#475467]">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Relevant Booking / Activity Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E7EB] space-y-2.5 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#101828] text-xs">Recent Activity</span>
                <Clock className="w-3.5 h-3.5 text-[#00A86B]" />
              </div>

              {activeTicket.context?.bookingId ? (
                <div className="p-2.5 bg-[#E8F8F1] border border-[#00A86B]/20 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#087A52]">Booking Context</span>
                    <span className="font-mono font-bold text-[#087A52]">{activeTicket.context.bookingId}</span>
                  </div>
                  {activeTicket.context.mentorName && (
                    <div className="text-[11px] text-[#475467]">
                      <strong>Mentor:</strong> {activeTicket.context.mentorName}
                    </div>
                  )}
                  {activeTicket.context.sessionDate && (
                    <div className="text-[11px] text-[#475467]">
                      <strong>Session:</strong> {activeTicket.context.sessionDate}
                    </div>
                  )}
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-between pt-1">
                    <span>Payment: {activeTicket.context.paymentStatus || 'Successful'}</span>
                    {activeTicket.context.paymentAmount && <span>₹{activeTicket.context.paymentAmount}</span>}
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-gray-50 rounded-xl text-[11px] text-[#667085]">
                  No active booking attached to this ticket.
                </div>
              )}

              {/* Activity Bullets */}
              <div className="space-y-1 pt-1">
                {(activeTicket.context?.recentActivity || [
                  'Viewed PV Career Path',
                  'Booked Mentor Session',
                  'Payment: Successful'
                ]).map((act, i) => (
                  <div key={i} className="text-[11px] text-[#475467] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]"></span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Architecture Notice */}
            <div className="bg-[#101828] text-white p-3.5 rounded-2xl text-[11px] space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-xs text-[#00D084]">
                <Lock className="w-3.5 h-3.5" />
                <span>Privacy Architecture</span>
              </div>
              <div className="text-gray-300 text-[10px] leading-relaxed">
                <span className="text-emerald-400 font-semibold">CAN SEE:</span> Student ID, Name, Relevant booking, Payment status, Chat history.
              </div>
              <div className="text-gray-400 text-[10px] leading-relaxed border-t border-white/10 pt-1.5">
                <span className="text-rose-400 font-semibold">CANNOT SEE:</span> Passwords, OAuth tokens, full payment credentials, Aadhaar/PAN, private documents, private mentor calendar.
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default SupportDeskAdmin;
