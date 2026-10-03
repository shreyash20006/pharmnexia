import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Video, 
  Sparkles, 
  AlertCircle,
  Mail,
  User,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../store/AppContext';

export const BookingModal = ({ mentor, onClose, onNavigateToDashboard }) => {
  const { currentUser, createBooking } = useApp();

  const [step, setStep] = useState(1); // 1: Session & Date, 2: Student Notes, 3: Payment Simulation, 4: Confirmed
  const [duration, setDuration] = useState(30);
  const [selectedDay, setSelectedDay] = useState(mentor?.availableDays?.[0] || "Saturday");
  const [selectedSlot, setSelectedSlot] = useState(mentor?.availableSlots?.[0] || "07:00 PM - 07:30 PM");
  
  // Dynamic next upcoming date calculation based on selected day
  const getNextDateForDay = (dayName) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    const today = new Date();
    const currentDayIndex = today.getDay();
    let distance = targetDayIndex - currentDayIndex;
    if (distance <= 0) distance += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + distance);
    return nextDate.toISOString().split('T')[0];
  };

  const calculatedDate = getNextDateForDay(selectedDay);

  const [studentName, setStudentName] = useState(currentUser?.name || "");
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || "");
  const [studentCollege, setStudentCollege] = useState(currentUser?.college || "Pharmacy Institute");
  const [agendaNotes, setAgendaNotes] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("UPI"); // 'UPI' | 'CARD' | 'NETBANKING'
  const [upiId, setUpiId] = useState("student@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const price = duration === 30 ? mentor.price30 : mentor.price60;
  const isFreeOrHonorarium = price === 0;

  const handleConfirmPaymentAndBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const booking = createBooking({
        mentorId: mentor.id,
        sessionDuration: duration,
        scheduledDate: calculatedDate,
        scheduledTime: selectedSlot,
        notes: agendaNotes,
        paymentAmount: price,
        studentInfo: {
          name: studentName || "Student Aspirant",
          email: studentEmail || "student@pharmnexia.in",
          college: studentCollege
        }
      });

      setConfirmedBooking(booking);
      setIsProcessing(false);
      setStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E5E7EB] overflow-hidden animate-fadeIn text-[#111827]">
        
        {/* Header */}
        <div className="bg-[#F8FAF9] p-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <img 
              src={mentor.avatarUrl} 
              alt={mentor.name} 
              className="w-11 h-11 rounded-full object-cover border-2 border-[#00A86B]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[#101828] text-base leading-tight font-heading">{mentor.name}</h3>
                {mentor.verifiedBadge && (
                  <ShieldCheck className="w-4 h-4 text-[#00A86B]" title="Verified Credentials" />
                )}
              </div>
              <p className="text-xs text-[#667085] truncate max-w-xs">{mentor.currentRole}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="bg-[#F8FAF9]/80 px-6 py-2.5 border-b border-[#E5E7EB] flex items-center justify-between text-xs font-medium text-[#667085]">
          <span className={step >= 1 ? "text-[#087A52] font-bold" : ""}>1. Slot & Timing</span>
          <span>→</span>
          <span className={step >= 2 ? "text-[#087A52] font-bold" : ""}>2. Topic & Details</span>
          <span>→</span>
          <span className={step >= 3 ? "text-[#087A52] font-bold" : ""}>3. {isFreeOrHonorarium ? 'Confirmation' : 'Payment'}</span>
          <span>→</span>
          <span className={step === 4 ? "text-[#087A52] font-bold" : ""}>4. Ready</span>
        </div>

        {/* Step 1: Session Duration, Day & Time Slot */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2 font-mono">
                Choose Session Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDuration(30)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    duration === 30 
                      ? 'border-[#00A86B] bg-[#E8F8F1] ring-1 ring-[#00A86B]' 
                      : 'border-[#E5E7EB] bg-[#F8FAF9] hover:border-[#00A86B]/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[#101828] text-sm">
                    <span>30 Minutes</span>
                    <span className="text-[#087A52] font-mono">
                      {mentor.price30 === 0 ? 'FREE' : `₹${mentor.price30}`}
                    </span>
                  </div>
                  <div className="text-xs text-[#667085] mt-1">Quick guidance & roadmapping</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDuration(60)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    duration === 60 
                      ? 'border-[#00A86B] bg-[#E8F8F1] ring-1 ring-[#00A86B]' 
                      : 'border-[#E5E7EB] bg-[#F8FAF9] hover:border-[#00A86B]/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[#101828] text-sm">
                    <span>60 Minutes</span>
                    <span className="text-[#087A52] font-mono">
                      {mentor.price60 === 0 ? 'FREE' : `₹${mentor.price60}`}
                    </span>
                  </div>
                  <div className="text-xs text-[#667085] mt-1">Deep-dive review & mock interview</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2 font-mono">
                Available Day
              </label>
              <div className="flex flex-wrap gap-2">
                {mentor.availableDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                      selectedDay === day 
                        ? 'bg-[#00A86B] text-white border-[#00A86B]' 
                        : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-[#00A86B]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#667085] mt-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Next slot date: <strong className="text-[#101828]">{calculatedDate}</strong></span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2 font-mono">
                Select Time Slot (IST)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mentor.availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-lg text-xs font-medium border text-center transition flex items-center justify-center gap-2 ${
                      selectedSlot === slot 
                        ? 'border-[#00A86B] bg-[#E8F8F1] text-[#087A52] font-bold' 
                        : 'border-[#E5E7EB] bg-white text-[#111827] hover:border-[#00A86B]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#00A86B]" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
              >
                Proceed to Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Student Details & Agenda */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <h4 className="font-bold text-[#101828] text-sm font-heading">Tell your mentor what you want to achieve</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#667085] mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Patel"
                  className="w-full text-xs p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#667085] mb-1">Email (For Meeting Link)</label>
                <input 
                  type="email" 
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. aarav@student.edu"
                  className="w-full text-xs p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1">College & Degree</label>
              <input 
                type="text" 
                value={studentCollege}
                onChange={(e) => setStudentCollege(e.target.value)}
                placeholder="e.g. Bombay College of Pharmacy - 3rd Year B.Pharm"
                className="w-full text-xs p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1">
                Discussion Agenda / Specific Questions
              </label>
              <textarea 
                rows="3"
                value={agendaNotes}
                onChange={(e) => setAgendaNotes(e.target.value)}
                placeholder="e.g. Want guidance on preparing for CAT alongside B.Pharm, reviewing my resume for PV roles, or discussing GPAT score cutoff strategy."
                className="w-full text-xs p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] focus:bg-white"
              />
            </div>

            {/* Privacy note */}
            <div className="p-3 bg-[#E8F8F1] rounded-xl border border-[#00A86B]/20 text-[11px] text-[#087A52] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#087A52]">Privacy Guaranteed:</strong> Your personal contact details and academic notes are encrypted under Indian DPDP Act standards.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:text-[#111827] transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
              >
                {isFreeOrHonorarium ? 'Review & Confirm' : `Continue to Payment (₹${price})`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment & Escrow Guarantee */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E5E7EB] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#667085]">
                <span>Session:</span>
                <strong className="text-[#101828]">{duration} Minutes 1-on-1 Mentorship</strong>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>Date & Time:</span>
                <strong className="text-[#101828]">{calculatedDate} at {selectedSlot}</strong>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>Mentor:</span>
                <strong className="text-[#101828]">{mentor.name}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#101828] pt-2.5 border-t border-[#E5E7EB]">
                <span>Total Amount:</span>
                <span className="text-[#087A52] font-mono">{isFreeOrHonorarium ? '₹0 (Free Session)' : `₹${price}`}</span>
              </div>
            </div>

            {!isFreeOrHonorarium && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] font-mono">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition ${
                      paymentMethod === "UPI" ? 'border-[#00A86B] bg-[#E8F8F1] text-[#087A52]' : 'border-[#E5E7EB] bg-white text-[#111827]'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition ${
                      paymentMethod === "CARD" ? 'border-[#00A86B] bg-[#E8F8F1] text-[#087A52]' : 'border-[#E5E7EB] bg-white text-[#111827]'
                    }`}
                  >
                    Debit / Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("NETBANKING")}
                    className={`p-2.5 rounded-lg border text-center text-xs font-semibold transition ${
                      paymentMethod === "NETBANKING" ? 'border-[#00A86B] bg-[#E8F8F1] text-[#087A52]' : 'border-[#E5E7EB] bg-white text-[#111827]'
                    }`}
                  >
                    NetBanking
                  </button>
                </div>

                {paymentMethod === "UPI" && (
                  <div>
                    <label className="block text-xs text-[#667085] mb-1">Enter UPI ID</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#00A86B] focus:bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="text-[11px] text-[#667085] bg-[#F8FAF9] p-3 rounded-lg border border-[#E5E7EB] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00A86B] flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#101828]">PharmNexia Escrow Guarantee:</strong> Payment is held securely and only settled to the mentor after the mentorship video session is successfully completed.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:text-[#111827] transition"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPaymentAndBooking}
                className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Securing Session...</span>
                ) : (
                  <span>{isFreeOrHonorarium ? 'Confirm Session' : `Authorize ₹${price}`}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success & Confirmation */}
        {step === 4 && confirmedBooking && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F8F1] text-[#087A52] flex items-center justify-center mx-auto border border-[#00A86B]/20">
              <CheckCircle2 className="w-9 h-9 text-[#00A86B]" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#087A52] font-bold">
                Booking Confirmed
              </span>
              <h3 className="text-xl font-extrabold text-[#101828] mt-1 font-heading">
                You're Connected With {mentor.name}!
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                Booking Reference: <strong className="font-mono text-[#00A86B]">{confirmedBooking.bookingCode}</strong>
              </p>
            </div>

            <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E5E7EB] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2.5 text-[#111827]">
                <Calendar className="w-4 h-4 text-[#00A86B]" />
                <span>Date: <strong className="text-[#101828]">{confirmedBooking.scheduledDate}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827]">
                <Clock className="w-4 h-4 text-[#00A86B]" />
                <span>Time: <strong className="text-[#101828]">{confirmedBooking.scheduledTime} ({confirmedBooking.sessionDuration} mins)</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827]">
                <Video className="w-4 h-4 text-[#00A86B]" />
                <span>Meeting Room: <strong className="text-[#087A52]">Secured Virtual Room</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827]">
                <Mail className="w-4 h-4 text-[#00A86B]" />
                <span>Calendar Invite sent to: <strong className="text-[#101828]">{confirmedBooking.studentEmail}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDashboard('/dashboard');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition"
              >
                Go to Student Dashboard
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#111827] font-semibold text-xs hover:bg-[#F8FAF9] transition"
              >
                Close & Browse More
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
