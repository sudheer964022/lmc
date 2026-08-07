import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { X, Network, Key } from 'lucide-react';

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
    
    if (ref.current) {
      ref.current.innerHTML = '';
      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      try {
        mermaid.render(id, chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        }).catch(err => {
          console.error("Mermaid rendering failed:", err);
        });
      } catch (err) {
        console.error("Mermaid rendering error:", err);
      }
    }
  }, [chart]);

  return <div ref={ref} className="w-full flex justify-center" />;
};

const DemoPanel = ({ activeTab, setIsDemoPanelOpen, activeOtps }) => {
  return (
    <div className="absolute top-4 right-2 lg:top-8 lg:right-4 z-50 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg w-full max-w-[280px] md:w-[240px] shrink-0 animate-fade-in-up hidden sm:block">
      <button 
        onClick={() => setIsDemoPanelOpen(false)}
        className="text-slate-400 hover:text-slate-600 transition-colors absolute top-4 right-4"
        title="Hide Info"
      >
        <X size={15} />
      </button>
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5 pr-6">
        🔑 Demo Access Info
      </h3>
      <div className="flex flex-col gap-4 text-[11px]">
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/40">
          <span className="font-bold text-blue-800 block mb-1">Employee Login</span>
          <div className="flex justify-between text-slate-600 mb-1">
            <span>ID:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">LMC0225</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Password:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">12345</span>
          </div>
        </div>
        
        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/40">
          <span className="font-bold text-emerald-800 block mb-1">Phone & OTP Login</span>
          <div className="flex justify-between text-slate-600 mb-2">
            <span>Phone:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">9346335295</span>
          </div>
          <div className={`flex flex-col gap-1.5 pt-1.5 border-t border-slate-100 ${
            activeOtps.login === '------' && activeOtps.register === '------' && activeOtps.forgot === '------' ? 'hidden' : ''
          }`}>
            {activeOtps.login !== '------' && (
              <div className="flex justify-between text-slate-600">
                <span>Login OTP:</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{activeOtps.login}</span>
              </div>
            )}
            {activeOtps.register !== '------' && (
              <div className="flex justify-between text-slate-600">
                <span>Register OTP:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{activeOtps.register}</span>
              </div>
            )}
            {activeOtps.forgot !== '------' && (
              <div className="flex justify-between text-slate-600">
                <span>Forgot OTP:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{activeOtps.forgot}</span>
              </div>
            )}
          </div>
        </div>

        {/* Backend Webhook logs */}
        {activeOtps.backendLog && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 animate-fade-in-up">
            <span className="font-bold text-slate-700 block mb-1.5 uppercase text-[9px] tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
              📡 Backend Hook Activity
            </span>
            <p className="text-[10px] font-mono text-blue-700 bg-white p-2 rounded border border-slate-200 leading-normal break-words">
              {activeOtps.backendLog}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileWrapper = ({ children }) => {
  const [activeTab, setActiveTab] = useState('wireframe');
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState(false);
  const [activeOtps, setActiveOtps] = useState({ login: '------', register: '------', forgot: '------', backendLog: '' });

  useEffect(() => {
    const handleUpdate = () => {
      setActiveOtps({
        login: window.demoLoginOtp || '------',
        register: window.demoRegisterOtp || '------',
        forgot: window.demoForgotOtp || '------',
        backendLog: window.demoBackendLog || '',
      });
      setIsDemoPanelOpen(true); // Automatically slide open the demo info drawer when updates occur
    };
    const handleOpenOnly = () => {
      setIsDemoPanelOpen(true);
    };
    window.addEventListener('demo-otp-updated', handleUpdate);
    window.addEventListener('open-demo-panel', handleOpenOnly);
    return () => {
      window.removeEventListener('demo-otp-updated', handleUpdate);
      window.removeEventListener('open-demo-panel', handleOpenOnly);
    };
  }, []);

  const workflowChart = `
graph TD
    A[Client Creates Sample Request] --> B[Lab Assigns LMC]
    B --> C[LMC Receives Notification]
    C --> D[View Client Details]
    D --> E[Open Maps Navigation]
    E --> F[Reach Client Location]
    F --> G[Scan Sample Barcode]
    G --> H[Verify Sample Details]
    H --> I[Collect Sample]
    I --> J[Update Status]
    J --> K[Sample Delivered to Lab]
    K --> L[Completed]
  `;

  const materialDeliveryChart = `
graph TD
    A[Client Requests Materials] --> B[Lab Reviews & Approves Request]
    B --> C[Create Material Drop Request]
    C --> D[Assign Material to LME]
    D --> E[LME Receives Notification]
    E --> F[View Client & Material Details]
    F --> G[Collect Materials from Lab]
    G --> H[Navigate to Client Location]
    H --> I[Reach Client Location]
    I --> J[Verify Client Identity]
    J --> K[Generate / Send OTP to Client]
    K --> L[Client Shares OTP with LME]
    L --> M{LME Verifies OTP}
    M -->|OTP Valid| N[Deliver Materials]
    M -->|OTP Invalid| O[Retry OTP / Contact Lab Support]
    N --> P[Client Confirms Receipt]
    P --> Q[Capture Photo Optional]
    Q --> R[Capture Digital Signature]
    R --> S[Update Delivery Status]
    S --> T[Material Delivery Completed]
  `;

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 relative">
      
      {/* Sidebar Toggle Button (when sidebar is closed) */}
      {!isDesktopSidebarOpen && (
        <button 
          onClick={() => setIsDesktopSidebarOpen(true)}
          className="absolute top-4 left-4 lg:top-8 lg:left-8 z-50 bg-white p-3 rounded-xl shadow-md border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Network size={24} />
        </button>
      )}

      {/* Left Sidebar */}
      {isDesktopSidebarOpen && (
        <div className="flex flex-col w-72 bg-white shadow-2xl p-6 border-r border-slate-200 overflow-y-auto scrollbar-hide absolute inset-y-0 left-0 z-[60] animate-fade-in-up">
          <button 
            onClick={() => setIsDesktopSidebarOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold text-slate-800 mb-6 px-2 pr-6">Project Workflows</h2>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setActiveTab('wireframe');
                if (window.innerWidth < 1024) setIsDesktopSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full border font-medium py-3 px-4 rounded-xl transition-all text-left shadow-sm active:scale-95 ${
                activeTab === 'wireframe' 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-slate-200 hover:border-blue-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              <span className="text-sm leading-tight">LMC Wireframe</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('sample_collection');
                if (window.innerWidth < 1024) setIsDesktopSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full border font-medium py-3 px-4 rounded-xl transition-all text-left shadow-sm active:scale-95 ${
                activeTab === 'sample_collection' 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-slate-200 hover:border-blue-200'
              }`}
            >
              <Network size={18} className="text-blue-600 shrink-0" />
              <span className="text-sm leading-tight">Sample Collection Workflow</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('material_delivery');
                if (window.innerWidth < 1024) setIsDesktopSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full border font-medium py-3 px-4 rounded-xl transition-all text-left shadow-sm active:scale-95 ${
                activeTab === 'material_delivery' 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-slate-200 hover:border-blue-200'
              }`}
            >
              <Network size={18} className="text-blue-600 shrink-0" />
              <span className="text-sm leading-tight">Material Delivery Workflow</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay background for mobile when sidebar is open */}
      {isDesktopSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[50]"
          onClick={() => setIsDesktopSidebarOpen(false)}
        />
      )}

      {/* Floating Demo Info Restore Button (Visible when closed) */}
      {!isDemoPanelOpen && activeTab === 'wireframe' && (
        <button 
          onClick={() => setIsDemoPanelOpen(true)}
          className="absolute top-4 right-2 lg:top-8 lg:right-4 z-50 bg-white px-4 py-2.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-slate-50 transition-all hidden sm:flex items-center gap-1.5 active:scale-95"
          style={{ animation: 'fade-in-up 0.3s ease' }}
        >
          <Key size={14} />
          Show Demo Info
        </button>
      )}

      <div className="flex-1 flex relative transition-all duration-300 p-4 sm:p-8 h-screen overflow-y-auto scrollbar-hide">
        {activeTab === 'wireframe' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Mobile Device Constraint (Centered) */}
            <div className="m-auto w-full h-[100dvh] sm:w-[340px] sm:h-[700px] shrink-0 bg-white sm:rounded-[2rem] sm:shadow-2xl relative overflow-hidden flex flex-col sm:border-[10px] sm:border-slate-800 animate-fade-in-up">
              {/* Android Hole Punch Camera */}
              <div className="hidden sm:block absolute top-3.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rounded-full z-[100]" style={{ boxShadow: 'inset 0 0 2px rgba(255,255,255,0.4)' }}></div>
              
              {children}
            </div>

            {/* Demo Credentials Panel (Floating Absolute - Top Right) */}
            {isDemoPanelOpen && (
              <DemoPanel activeTab={activeTab} setIsDemoPanelOpen={setIsDemoPanelOpen} activeOtps={activeOtps} />
            )}
          </div>
        ) : (
          /* Workflow Main Body Viewer */
          <div className="w-full h-full max-w-5xl mx-auto flex flex-col overflow-y-auto scrollbar-hide animate-fade-in-up">
            <div className="flex items-center gap-3 shrink-0 mb-8 mt-8 justify-center px-4 text-center">
              <Network size={24} className="text-blue-600 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                {activeTab === 'sample_collection' ? 'Sample Collection Workflow' : 'Material Delivery Workflow'}
              </h2>
            </div>
            <div className="flex-1 flex justify-center pb-12 px-4">
              <MermaidDiagram chart={activeTab === 'sample_collection' ? workflowChart : materialDeliveryChart} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileWrapper;
