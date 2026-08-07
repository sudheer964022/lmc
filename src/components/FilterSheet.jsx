import React, { useState } from 'react';
import { X, Calendar, Map, CheckCircle2 } from 'lucide-react';

const FilterSheet = ({ isOpen, onClose, onApply, initialFilter = 'date' }) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  // Update internal state if the prop changes
  React.useEffect(() => {
    setSelectedFilter(initialFilter);
  }, [initialFilter, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(selectedFilter);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Filter By</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setSelectedFilter('date')}
            className={`flex items-center gap-3 p-3 border-2 rounded-2xl transition-colors text-left ${
              selectedFilter === 'date' 
                ? 'border-blue-500 bg-blue-50/50' 
                : 'border-slate-100 hover:bg-slate-50 active:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-lg flex items-center justify-center ${selectedFilter === 'date' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'bg-blue-100 text-blue-600'}`}>
              <img src="https://cdn-icons-png.flaticon.com/512/591/591576.png" alt="Date" className="w-[20px] h-[20px] object-contain" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold text-slate-800 text-[13px] leading-tight">Date & Time</span>
              <span className="text-[11px] text-slate-500">Filter tasks by scheduled time</span>
            </div>
            {selectedFilter === 'date' && (
              <CheckCircle2 size={20} className="text-blue-500 ml-auto shrink-0 animate-fade-in" />
            )}
          </button>
          
          <button 
            onClick={() => setSelectedFilter('distance')}
            className={`flex items-center gap-3 p-3 border-2 rounded-2xl transition-colors text-left ${
              selectedFilter === 'distance' 
                ? 'border-emerald-500 bg-emerald-50/50' 
                : 'border-slate-100 hover:bg-slate-50 active:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-lg flex items-center justify-center ${selectedFilter === 'distance' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-emerald-100 text-emerald-600'}`}>
              <img src="https://cdn-icons-png.flaticon.com/512/3710/3710274.png" alt="Distance" className="w-[20px] h-[20px] object-contain" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold text-slate-800 text-[13px] leading-tight">Distance</span>
              <span className="text-[11px] text-slate-500">Sort by distance from your place</span>
            </div>
            {selectedFilter === 'distance' && (
              <CheckCircle2 size={20} className="text-emerald-500 ml-auto shrink-0 animate-fade-in" />
            )}
          </button>
        </div>

        <button 
          onClick={handleApply}
          className="w-full mt-6 bg-slate-800 text-white text-sm font-bold py-3.5 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-slate-200"
        >
          Apply Filters
        </button>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FilterSheet;
