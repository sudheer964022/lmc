import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronUp, ShieldCheck, Lock, Eye, Database, Bell, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';

const sections = [
  {
    icon: 'ShieldCheck',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Data We Collect',
    content: `We collect the following types of data to deliver and improve the LMC Portal:

• Personal Information: Full name, employee ID, email address, and phone number provided during registration.
• Location Data: Real-time GPS location during active routes. Location is only recorded while a task is active.
• Device Information: Device model, OS version, and app version for diagnostics.
• Task Activity: Collection timestamps, barcode scan records, OTP verifications, and photo uploads.
• Communication Logs: In-app chat messages with clients stored for audit and support purposes.`
  },
  {
    icon: 'Lock',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'How We Use Your Data',
    content: `Your data is used exclusively for operational and compliance purposes:

• To authenticate your identity and grant access to the LMC Portal.
• To assign, track, and complete sample collection and material delivery tasks.
✢ To generate activity reports for lab management and compliance audits.
✢ To send push notifications for new task assignments and important alerts.
✢ To improve app performance and enhance user experience.
✢ We do NOT sell, share, or rent your personal data to any third party for marketing purposes.`
  },
  {
    icon: 'Eye',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Data Visibility & Access',
    content: `Access to your data is strictly role-based:

• Your supervisor and lab managers can view your task completion records and route history.
✢ Uploaded photos are accessible to authorized lab administrators for quality assurance.
• Client chat history is visible to your team lead for dispute resolution.
✢ You can view your own profile, attendance, and task history within the app at any time.
• Raw GPS coordinates are stored only for active task duration and purged after 90 days.`
  },
  {
    icon: 'Database',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Data Storage & Security',
    content: `We take your data security seriously:

• All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
✢ Servers are hosted on ISO 27001-certified infrastructure within Indian data centers.
• Authentication uses session tokens that expire after 12 hours of inactivity.
• Passkey (biometric) sign-in is supported for enhanced security.
• Uploaded images are stored in secure, access-controlled cloud storage.
• Regular security audits and penetration testing are conducted quarterly.`
  },
  {
    icon: 'Bell',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Push Notifications',
    content: `We may send push notifications for the following reasons:

• New task assignments or route updates.
• Emergency alerts related to sample handling or lab requirements.
• System-level alerts such as app updates or scheduled maintenance.
✢ OTP confirmations for client identity verification.

You can control notification preferences in the Settings screen.`
  },
  {
    icon: 'UserCheck',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Your Rights',
    content: `As a registered LMC Portal user, you have the following rights:

• Right to Access: Request a copy of all personal data we hold about you.
✢ Right to Correction: Request correction of any inaccurate personal information.
✢ Right to Deletion: Request deletion of your account, subject to audit retention requirements.
• Right to Portability: Request an export of your data in a machine-readable format.
• Right to Object: Object to the processing of your data for non-operational purposes.

Contact your lab administrator or email privacy@avmlabs.com to exercise these rights.`
  },
  {
    icon: 'RefreshCw',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'Policy Updates',
    content: `This Privacy Policy may be updated periodically:

✢ You will be notified of significant changes via an in-app notification.
• Continued use of the LMC Portal after a policy update constitutes acceptance of the revised terms.
• Historical versions of this policy are available from your lab administrator upon request.`
  },
];

const iconMap = {
  ShieldCheck: (cls) => <ShieldCheck size={16} className={cls} />,
  Lock: (cls) => <Lock size={16} className={cls} />,
  Eye: (cls) => <Eye size={16} className={cls} />,
  Database: (cls) => <Database size={16} className={cls} />,
  Bell: (cls) => <Bell size={16} className={cls} />,
  UserCheck: (cls) => <UserCheck size={16} className={cls} />,
  RefreshCw: (cls) => <RefreshCw size={16} className={cls} />,
};

const faqs = [
  { q: 'Is my GPS location tracked all the time?', a: 'No. Location tracking is only active when you have an open task in "En Route" or "Near Client" status. GPS is automatically paused when no active task is assigned.' },
  { q: 'Who can see my uploaded photos?', a: 'Photos are only visible to authorized lab administrators and your supervisor. They are used solely for quality assurance and audit purposes.' },
  { q: 'Can I delete my account and data?', a: 'Yes. Request account deletion from your lab administrator. Task logs and audit trails are retained for a minimum of 12 months as per regulatory requirements.' },
  { q: 'Are my in-app chat messages private?', a: 'Chat messages are stored securely and accessible to your team lead for quality checks and dispute resolution. They are not shared outside the organization.' },
  { q: 'How is my biometric / passkey data stored?', a: "Biometric data never leaves your device. The LMC Portal uses your device's secure enclave for authentication. We store only a cryptographic public key, never the biometric itself." },
  { q: 'What happens to my data if I leave the organization?', a: 'Upon account deactivation, your personal profile data is anonymized. Task logs are retained per compliance requirements before being permanently deleted.' },
  { q: 'Is the app DPDPA 2023 compliant?', a: "Yes. The LMC Portal is designed to comply with India's Digital Personal Data Protection Act (DPDPA) 2023, including lawful processing, user consent, and data minimization principles." },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-blue-200 shadow-sm bg-blue-50/30' : 'border-slate-100 bg-white'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left gap-2">
        <span className="text-[11px] font-bold text-slate-700 leading-tight">{q}</span>
        {open ? <ChevronUp size={14} className="text-blue-600 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3">
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{a}</p>
        </div>
      )}
    </div>
  );
};

const PrivacyScreen = ({ setCurrentScreen, setIsSidebarOpen }) => {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="bg-[#1e3a6e] text-white px-5 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 -ml-1 hover:bg-white/10 rounded-full transition-colors">
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-black tracking-tight">Privacy Policy</h1>
          <div className="w-8 h-8" />
        </div>
        <div className="bg-white/10 rounded-xl px-3 py-2 flex items-start gap-2">
          <ShieldCheck size={14} className="text-emerald-300 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-100 leading-tight font-medium">
            AVM Labs is committed to protecting your privacy. This policy outlines how your data is collected, used, and secured within the LMC Portal.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 pb-24 flex flex-col gap-4">
        {/* Last updated */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <AlertCircle size={12} className="text-amber-500 shrink-0" />
          <p className="text-[10px] font-semibold text-amber-700">Last Updated: August 1, 2026 · Effective immediately</p>
        </div>

        {/* Policy Sections */}
        <div className="flex flex-col gap-3">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-slate-50">
                <div className={`w-6 h-6 ${sec.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  {iconMap[sec.icon](sec.color)}
                </div>
                <h3 className="text-[11px] font-black text-slate-800">{sec.title}</h3>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium whitespace-pre-line">{sec.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, idx) => <FaqItem key={idx} q={faq.q} a={faq.a} />)}
          </div>
        </div>

        {/* Contact Footer */}
        <div className="bg-[#1e3a6e]/5 border border-[#1e3a6e]/10 rounded-2xl p-4 flex flex-col gap-1.5">
          <h3 className="text-[11px] font-black text-[#1e3a6e]">Questions or Concerns?</h3>
          <p className="text-[10px] text-slate-500 leading-relaxed">If you have any questions about this policy or your data, reach out to our Data Protection Officer.</p>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-[10px] font-bold text-slate-700">📧 contact@avmlabs.com</p>
            <p className="text-[10px] font-bold text-slate-700">🏢 AVM Labs Pvt Ltd, Coimbatore, Tamil Nadu, India</p>
          </div>
        </div>

        <p className="text-center text-[9px] text-slate-400 font-medium">© 2026 AVM Labs Pvt Ltd. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyScreen;
