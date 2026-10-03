import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  QrCode,
  FileCheck
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CertificateViewer } from '../components/CertificateViewer';

export const VerifyCertificatePage = ({ initialCertId = '', onNavigate }) => {
  const { verifyCertificate, certificates } = useApp();

  const [inputCertId, setInputCertId] = useState(initialCertId || 'PHN-2026-000001');
  const [searchedCert, setSearchedCert] = useState(() => {
    return verifyCertificate(initialCertId || 'PHN-2026-000001') || certificates[0];
  });
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputCertId.trim()) return;
    const found = verifyCertificate(inputCertId.trim());
    setSearchedCert(found);
    setHasSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-white text-[#111827]">
      
      {/* Search Banner */}
      <div className="bg-[#F8FAF9] rounded-3xl p-8 sm:p-12 border border-[#E5E7EB] shadow-sm text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8F1] text-[#087A52] text-xs font-semibold border border-[#00A86B]/20">
          <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
          <span>Official Public Credential Registry</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101828] font-heading max-w-xl mx-auto">
          Verify PharmNexia Certificate
        </h1>

        <p className="text-[#667085] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Verify the authenticity of digital credentials issued by the PharmNexia Academic & Career Council.
        </p>

        {/* Verification Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3" />
            <input 
              type="text" 
              required
              value={inputCertId}
              onChange={(e) => setInputCertId(e.target.value)}
              placeholder="e.g. PHN-2026-000001"
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#00A86B] uppercase font-mono tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#087A52] text-white font-semibold text-xs shadow-sm transition whitespace-nowrap"
          >
            Verify Credential
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs text-[#667085]">
          <span>Try sample IDs:</span>
          {certificates.slice(0, 3).map(c => (
            <button
              key={c.certificateId}
              type="button"
              onClick={() => {
                setInputCertId(c.certificateId);
                setSearchedCert(c);
                setHasSearched(true);
              }}
              className="font-mono text-[#087A52] hover:underline px-2.5 py-1 rounded bg-white border border-[#E5E7EB] text-[11px]"
            >
              {c.certificateId}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result State */}
      {hasSearched && (
        <div>
          {searchedCert ? (
            <div className="space-y-6">
              
              {/* Verification Status Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#00A86B]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F8F1] text-[#00A86B] flex items-center justify-center flex-shrink-0 border border-[#00A86B]/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs uppercase font-mono tracking-widest text-[#087A52] font-bold">
                        Status: Authentic & Active
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#101828] mt-0.5 font-heading">
                      Certificate {searchedCert.certificateId} is Verified
                    </h3>
                    <p className="text-xs text-[#667085]">
                      Issued to <strong className="text-[#101828]">{searchedCert.studentName}</strong> by {searchedCert.issuer} on {searchedCert.issueDate}.
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-[10px] uppercase font-mono text-[#667085]">Cryptographic Hash</div>
                  <div className="text-xs font-mono text-[#00A86B] break-all truncate max-w-[200px]">
                    {searchedCert.credentialIdHash?.substring(0, 16)}...
                  </div>
                </div>
              </div>

              {/* Render the Full Certificate Frame */}
              <CertificateViewer certificate={searchedCert} />

            </div>
          ) : (
            <div className="p-12 text-center bg-[#F8FAF9] rounded-2xl border border-rose-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#101828] font-heading">Certificate Record Not Found</h3>
              <p className="text-xs text-[#667085] max-w-md mx-auto">
                No active credential was found matching Certificate ID "<strong>{inputCertId}</strong>". Please verify the code on your issued document or contact the registry.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
