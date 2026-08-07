import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Scan as ScanIcon, Zap, Image as ImageIcon } from 'lucide-react';

const ScanScreen = ({ setCurrentScreen }) => {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedItems, setScannedItems] = useState([]);
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
        setStreamError(true);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate a scan after 3 seconds for demo purposes
  useEffect(() => {
    if ((hasPermission || streamError) && isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        const randomId = `SPL-${Math.floor(100000 + Math.random() * 900000)}`;
        setScannedItems(prev => [...prev, {
          id: randomId,
          client: 'Apollo Hospitals',
          test: 'Complete Blood Count'
        }]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hasPermission, streamError, isScanning]);

  return (
    <div className="flex-1 w-full bg-black flex flex-col relative overflow-hidden">
      {/* Header */ }
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pt-12 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={ () => setCurrentScreen('home') }
          className="text-white p-2 rounded-full bg-white/20 backdrop-blur-md"
        >
          <X size={ 24 } />
        </button>
        <div className="flex gap-4">
          <button className="text-white p-2 rounded-full bg-white/20 backdrop-blur-md">
            <Zap size={ 20 } />
          </button>
          <button className="text-white p-2 rounded-full bg-white/20 backdrop-blur-md">
            <ImageIcon size={ 20 } />
          </button>
        </div>
      </div>

      {/* Camera Feed */ }
      <div className="flex-1 relative bg-slate-900">
        { !streamError ? (
          <video
            ref={ videoRef }
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500">
            <Camera size={ 48 } className="mb-4 opacity-30" />
            <p className="text-sm">Camera preview unavailable.</p>
            <p className="text-xs mt-1">Simulating scan anyway...</p>
          </div>
        ) }

        {/* Scanner Overlay */ }
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          {/* Dark Overlay around scanner */ }
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-20 w-64 h-64 border-2 border-white/30 rounded-2xl overflow-hidden">
            {/* Corner Markers */ }
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>

            {/* Animated Laser Line */ }
            { isScanning && (
              <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.7)] animate-scan"></div>
            ) }

            {/* Success State Overlay */ }
            { !isScanning && scannedItems.length > 0 && (
              <div className="absolute inset-0 bg-emerald-500/30 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300">
                <div className="bg-emerald-500 text-white rounded-full p-4 mb-2 animate-bounce">
                  <ScanIcon size={ 36 } />
                </div>
                <span className="text-white font-bold text-xl shadow-sm">Success</span>
              </div>
            ) }
          </div>

          <p className="relative z-20 text-white/90 mt-8 text-sm font-semibold tracking-wide">
            { isScanning ? 'Align barcode within frame to scan' : 'Processing barcode...' }
          </p>
        </div>
      </div>

      {/* Result Panel (slides up when scanned) */ }
      <div className={ `absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.12)] z-30 transition-transform duration-500 ${!isScanning && scannedItems.length > 0 ? 'translate-y-0' : 'translate-y-full'}` }>
        <div className="p-4 pb-4">
          <div className="flex justify-center mb-2.5">
            <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
          </div>

          { scannedItems.length > 0 && (
            <div className="space-y-2.5">
              {/* Title row */ }
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Samples Scanned ({ scannedItems.length })</h2>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  ✓ Verified
                </span>
              </div>

              {/* Data cards container */ }
              <div className="max-h-56 overflow-y-auto space-y-2 p-2 border border-slate-200 rounded-2xl scrollbar-hide">
                { scannedItems.map((item, idx) => (
                  <div key={ idx } className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 relative">
                    <div className="absolute top-3 right-3 text-xs font-bold text-slate-300">#{ idx + 1 }</div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Barcode ID</p>
                      <p className="text-xs font-bold text-slate-800">{ item.id }</p>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
                        <p className="text-[10px] font-semibold text-slate-800 truncate">{ item.client }</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Test Required</p>
                        <p className="text-[10px] font-semibold text-slate-800 truncate">{ item.test }</p>
                      </div>
                    </div>
                  </div>
                )) }
              </div>

              {/* Action buttons */ }
              <div className="flex gap-2 pt-1.5">
                <button
                  onClick={ () => setIsScanning(true) }
                  className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={ () => {
                    window.demoBackendLog = 'WhatsApp API triggered for Client and Lab regarding collected samples.';
                    window.dispatchEvent(new Event('demo-otp-updated'));
                    setCurrentScreen('home');
                  } }
                  className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/15"
                >
                  Confirm & Collect All
                </button>
              </div>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default ScanScreen;
