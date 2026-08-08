import React, { useState } from 'react';
import { Menu, Search, ChevronDown, ChevronUp, MessageSquare, HelpCircle, AlertTriangle, Send, CheckCircle2, PhoneCall, Wallet } from 'lucide-react';

const faqs = [
  {
    category: 'Communication',
    items: [
      { q: 'How do I contact my supervisor?', a: 'You can use the Message Center tab here to send a direct message, or call the emergency contact number provided in your profile.' },
      { q: 'Will I get notified for new tasks?', a: 'Yes, push notifications are sent for all new assignments. Ensure notifications are enabled in your device settings.' },
      { q: 'Can I chat with other team members?', a: 'Currently, direct messaging is restricted to supervisors and the support team to maintain privacy and streamline task communication.' },
      { q: 'How quickly will support respond to my messages?', a: 'Our support team typically responds to Message Center inquiries within 1-2 hours during regular business hours.' },
      { q: 'Can I send attachments in the Message Center?', a: 'Yes, you can attach images and small documents (up to 5MB) by clicking the attachment icon in the Message Center.' }
    ]
  },
  {
    category: 'How to Use',
    items: [
      { q: 'How do I mark a task as complete?', a: 'Go to the Tasks screen, select your active task, and tap the "Complete" button after uploading necessary proof.' },
      { q: 'What happens if I lose internet connection?', a: 'The app works offline for active tasks. Data will sync automatically once you are back online.' },
      { q: 'How do I update my profile details?', a: 'Navigate to the Profile screen using the bottom navigation bar to update your contact information and preferences.' },
      { q: 'Can I view my past completed tasks?', a: 'Yes, you can view your task history by going to the Tasks screen and selecting the "Completed" filter.' },
      { q: 'How do I change my password?', a: 'Go to the Profile screen, select "Security & Privacy", and tap on "Change Password". You will need your current password to set a new one.' },
      { q: 'How can I change the app language?', a: 'Go to Settings from the main menu and select your preferred language under "Language Preferences".' }
    ]
  },
  {
    category: 'Problem Solutions',
    items: [
      { q: 'The app is frozen or crashing', a: 'Try force closing the app and reopening it. If the problem persists, check for updates in the app store or contact support via the Message Center.' },
      { q: 'I cannot upload a photo', a: 'Ensure the app has camera and storage permissions. Also, check that your photo size is under the 5MB limit.' },
      { q: 'My GPS location is not accurate', a: 'Ensure you are outdoors or near a window, and verify that High Accuracy location mode is enabled in your device settings.' },
      { q: 'I forgot my password', a: 'Log out of the app and use the "Forgot Password" link on the login screen to receive reset instructions via email or SMS.' },
      { q: 'I did not receive the OTP', a: 'Wait for 60 seconds and click "Resend OTP". If you still do not receive it, ensure your registered mobile number is active and has network coverage.' },
      { q: 'Tasks are not syncing', a: 'Check your internet connection. You can also manually trigger a sync by pulling down on the Tasks list screen.' }
    ]
  },
  {
    category: 'Payments & Earnings',
    items: [
      { q: 'When do I get paid for completed tasks?', a: 'Payments are processed weekly for all tasks completed and approved by Sunday midnight. Funds typically reflect in your account by Wednesday.' },
      { q: 'How can I view my earnings history?', a: 'Go to the "Earnings" tab from the main menu to see a detailed breakdown of your past and pending payments.' },
      { q: 'What if there is a discrepancy in my payment?', a: 'Please contact support through the Message Center within 7 days of the payment date, selecting "Payment Issue" as the subject.' }
    ]
  }
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-blue-200 shadow-sm bg-blue-50/30' : 'border-slate-100 bg-white'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left gap-2 hover:bg-slate-50 transition-colors">
        <span className="text-[11px] font-bold text-slate-700 leading-tight pr-4">{q}</span>
        {open ? <ChevronUp size={14} className="text-blue-600 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 animate-fade-in-up">
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{a}</p>
        </div>
      )}
    </div>
  );
};

const HelpScreen = ({ setCurrentScreen, setIsSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Message Center State
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageSubject || !messageBody) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setMessageSubject('');
      setMessageBody('');
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="bg-[#1e3a6e] text-white px-5 pt-12 pb-4 sticky top-0 z-10 rounded-b-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 -ml-1 hover:bg-white/10 rounded-full transition-colors">
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-black tracking-tight">Help & Support</h1>
          <div className="w-8 h-8" />
        </div>
        
        {/* Tabs */}
        <div className="flex bg-black/20 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'faq' ? 'bg-white text-[#1e3a6e] shadow-sm' : 'text-white/80 hover:text-white'}`}
          >
            <HelpCircle size={14} />
            FAQs
          </button>
          <button 
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'message' ? 'bg-white text-[#1e3a6e] shadow-sm' : 'text-white/80 hover:text-white'}`}
          >
            <MessageSquare size={14} />
            Message Center
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'faq' ? (
          <div className="p-4 flex flex-col gap-5 pb-24">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-[11px] rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow shadow-sm font-medium"
              />
            </div>

            {/* FAQ Categories */}
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((category, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                    {category.category === 'Problem Solutions' && <AlertTriangle size={12} />}
                    {category.category === 'How to Use' && <HelpCircle size={12} />}
                    {category.category === 'Communication' && <MessageSquare size={12} />}
                    {category.category === 'Payments & Earnings' && <Wallet size={12} />}
                    {category.category}
                  </h2>
                  <div className="flex flex-col gap-2">
                    {category.items.map((item, itemIdx) => (
                      <FaqItem key={itemIdx} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center opacity-60">
                <Search size={32} className="text-slate-300 mb-3" />
                <p className="text-xs font-bold text-slate-500">No results found</p>
                <p className="text-[10px] text-slate-400 mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4 pb-24 animate-fade-in-up">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <div className="bg-blue-100 p-2 rounded-full h-fit shrink-0">
                <PhoneCall size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-blue-900 mb-1">Emergency Support</h3>
                <p className="text-[10px] text-blue-700/80 leading-relaxed font-medium mb-2">Need immediate assistance while on duty? Call our 24/7 hotline.</p>
                <button className="bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-sm">
                  Call Now
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 mb-1">Send a Message</h3>
              <p className="text-[10px] text-slate-500 font-medium mb-4">Describe your issue or query below and our team will get back to you shortly.</p>
              
              {isSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col items-center justify-center text-center animate-fade-in-up">
                  <div className="bg-emerald-100 p-3 rounded-full mb-3">
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-800 mb-1">Message Sent!</h4>
                  <p className="text-[10px] text-emerald-600 font-medium">We've received your message and will respond soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 ml-1">Subject / Category</label>
                    <select 
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[11px] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium appearance-none"
                    >
                      <option value="" disabled>Select a topic</option>
                      <option value="app_issue">App Issue / Bug</option>
                      <option value="task_help">Help with a Task</option>
                      <option value="account">Account / Profile</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 ml-1">Your Message</label>
                    <textarea 
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      required
                      placeholder="Please provide details..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[11px] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium resize-none"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#1e3a6e] text-white text-[11px] font-bold py-3 rounded-xl shadow-md hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        Submit Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpScreen;
