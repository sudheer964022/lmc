import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { X, Network } from 'lucide-react';

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
    
    if (ref.current) {
      // Clear previous content
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

const MobileWrapper = ({ children }) => {
  const [activeTab, setActiveTab] = useState('wireframe');
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

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

      {/* Left Sidebar (Responsive overlay on mobile, inline on desktop) */}
      {isDesktopSidebarOpen && (
        <div className="flex flex-col w-72 bg-white shadow-2xl lg:shadow-xl p-6 border-r border-slate-200 overflow-y-auto scrollbar-hide absolute lg:relative inset-y-0 left-0 z-[60] lg:z-10 animate-fade-in-up">
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
                if (window.innerWidth < 1024) setIsDesktopSidebarOpen(false); // Auto close on mobile
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
                if (window.innerWidth < 1024) setIsDesktopSidebarOpen(false); // Auto close on mobile
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

      <div className="flex-1 flex relative transition-all duration-300 p-4 sm:p-8 h-screen overflow-y-auto scrollbar-hide">
        {activeTab === 'wireframe' ? (
          /* Mobile Device Constraint */
          <div className="m-auto w-full h-[100dvh] sm:w-[340px] sm:h-[700px] shrink-0 bg-white sm:rounded-[2.5rem] sm:shadow-2xl relative overflow-hidden flex flex-col sm:border-[10px] sm:border-slate-800 animate-fade-in-up">
            {/* Dynamic Island / Notch */}
            <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-[100]"></div>
            
            {children}
          </div>
        ) : (
          /* Workflow Main Body Viewer */
          <div className="w-full h-full max-w-5xl flex flex-col overflow-y-auto scrollbar-hide animate-fade-in-up">
            <div className="flex items-center gap-3 shrink-0 mb-8 mt-8 justify-center px-4 text-center">
              <Network size={24} className="text-blue-600 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">Sample Collection Workflow</h2>
            </div>
            <div className="flex-1 flex justify-center pb-12 px-4">
              <MermaidDiagram chart={workflowChart} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileWrapper;
