import React from 'react';
import { Award, ShieldCheck, Download, Printer, CheckCircle, ExternalLink, QrCode } from 'lucide-react';

export const CertificateViewer = ({ certificate }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 space-y-4">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between no-print bg-white p-3.5 rounded-xl border border-[#E5E7EB] shadow-sm text-[#111827]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8F1] text-[#087A52] border border-[#00A86B]/20">
            <CheckCircle className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Cryptographically Verified Credential</span>
          </span>
          <span className="text-xs text-[#667085] font-mono hidden sm:inline">
            ID: {certificate.certificateId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#00A86B] bg-[#F8FAF9] hover:bg-white text-xs font-semibold text-[#111827] transition"
          >
            <Printer className="w-3.5 h-3.5 text-[#00A86B]" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Official Certificate Frame */}
      <div className="relative bg-[#FFFFFF] text-[#111827] p-8 sm:p-12 rounded-2xl border-8 border-double border-[#00A86B]/40 shadow-xl overflow-hidden font-sans">
        
        {/* Subtle Watermark Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#00A86B_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Certificate Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-200 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00A86B] flex items-center justify-center text-white shadow-sm">
              <Award className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-black tracking-tight text-[#101828] font-serif">
                Pharm<span className="text-[#00A86B]">Nexia</span>
              </h2>
              <p className="text-[11px] uppercase tracking-widest text-[#667085] font-mono font-medium">
                Academic & Career Council of India
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Certificate Number</div>
            <div className="text-sm font-bold font-mono text-[#00A86B]">{certificate.certificateId}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Issue Date: {certificate.issueDate}</div>
          </div>
        </div>

        {/* Certificate Main Wording */}
        <div className="text-center space-y-4 my-8">
          <div className="text-xs uppercase tracking-widest text-[#00A86B] font-bold font-mono">
            Certificate of Accomplishment & Skill Mastery
          </div>

          <p className="text-sm text-slate-600 font-serif italic">
            This is to officially certify that
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight font-serif underline decoration-[#00D084]/60 underline-offset-8">
            {certificate.studentName}
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
            has successfully completed all rigorous theoretical coursework, practical cohort evaluations, and capstone assessments for:
          </p>

          <div className="inline-block p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-lg">
            <div className="text-lg font-bold text-slate-900">{certificate.programName}</div>
            {certificate.grade && (
              <div className="text-xs font-semibold text-[#00A86B] mt-1 font-mono">Evaluation Outcome: {certificate.grade}</div>
            )}
          </div>

          {/* Acquired Skills Pills */}
          {certificate.skillsAcquired && (
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">Verified Competencies</div>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
                {certificate.skillsAcquired.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-[#E8F8F1] border border-[#00A86B]/20 text-[#087A52] font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certificate Footer with Signatures & Seal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-end pt-8 mt-8 border-t-2 border-slate-200 gap-6 text-center sm:text-left">
          
          {/* Signatory 1 */}
          <div>
            <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 w-44 mx-auto sm:mx-0">
              {certificate.signatoryName}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">{certificate.signatoryTitle}</div>
            <div className="text-[10px] text-slate-400">PharmNexia Council</div>
          </div>

          {/* Center Official Gold Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border-2 border-amber-600 shadow-md flex items-center justify-center text-[#101828] font-mono text-[9px] font-extrabold uppercase text-center p-1">
              Official Verifiable Credential
            </div>
          </div>

          {/* Verification QR Hash */}
          <div className="text-center sm:text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Public Verification</div>
            <div className="text-[11px] font-mono font-medium text-slate-600 break-all truncate max-w-xs ml-auto">
              Hash: {certificate.credentialIdHash?.substring(0, 18)}...
            </div>
            <a 
              href={`/verify-certificate/${certificate.certificateId}`}
              className="text-xs text-[#00A86B] hover:underline font-semibold mt-1 inline-flex items-center gap-1 font-mono"
            >
              <span>pharmnexia.in/verify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
