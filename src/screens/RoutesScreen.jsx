import React, { useState } from 'react';
import { Navigation, MapPin, ChevronLeft, Menu, CornerUpRight, Play, X, ArrowUpRight, Bike, AlertCircle, CheckCircle2, ParkingSquare, Package, List } from 'lucide-react';
import { emergencyPickups, newSamples } from '../data/mockData';
import ClientDetails from '../components/ClientDetails';

const RoutesScreen = ({ setCurrentScreen, setIsSidebarOpen }) => {
  const [selectedClient, setSelectedClient] = useState(() => {
    if (window.forceRouteClientDone && window.lastSelectedClient) {
      // 2 is the 'collect' step for collection tasks
      const client = { ...window.lastSelectedClient, initialStepIndex: 2, initialScannedState: true };
      window.forceRouteClientDone = false;
      return client;
    }
    return window.lastSelectedClient || null;
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showNearbyClients, setShowNearbyClients] = useState(false);
  const [navState, setNavState] = useState('idle'); // 'idle', 'directions', 'navigating'
  const [navStep, setNavStep] = useState('going'); // 'going', 'near', 'stop'

  // Auto GPS transition from going to near
  React.useEffect(() => {
    if (navState === 'navigating' && navStep === 'going') {
      const timer = setTimeout(() => {
        setNavStep('near');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [navState, navStep]);

  // Draggable Map Canvas States
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pinchScale, setPinchScale] = useState(1);
  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [initialPinchScale, setInitialPinchScale] = useState(1);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setInitialTouchDistance(null);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialTouchDistance(dist);
      setInitialPinchScale(pinchScale);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      setPanOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && initialTouchDistance) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialTouchDistance;
      const newScale = Math.min(2.2, Math.max(0.6, initialPinchScale * factor));
      setPinchScale(newScale);
    }
  };

  const resetPan = () => {
    setPanOffset({ x: 0, y: 0 });
    setPinchScale(1);
  };

  // Combine, filter, and sort by distance to get "Nearby Clients"
  const nearbyClients = [...emergencyPickups, ...newSamples]
    .filter(client => client.distance !== undefined)
    .sort((a, b) => a.distance - b.distance); // Show all pending sample locations

  if (selectedClient) {
    return (
      <ClientDetails
        client={ selectedClient }
        onClose={ () => setSelectedClient(null) }
        setCurrentScreen={ setCurrentScreen }
      />
    );
  }

  // Advanced Algorithm: Traffic-adjusted ETA calculation based on real distance
  const calculateRouteDetails = (distanceStr) => {
    if (!distanceStr) return { mins: 12, arrival: '10:45 AM' };
    const dist = parseFloat(distanceStr);
    const speedKmh = 18; // Simulated real-time city traffic speed
    const mins = Math.max(1, Math.ceil((dist / speedKmh) * 60));

    // Calculate arrival time dynamically
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + mins);
    const arrival = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return { mins, arrival };
  };

  const routeDetails = calculateRouteDetails(selectedLocation?.distance);

  const targetX = selectedLocation?.mapX || '75%';
  const targetY = selectedLocation?.mapY || '60%';

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Top Map View Area */ }
      <div
        className="flex-1 bg-slate-200 relative overflow-hidden flex flex-col cursor-grab active:cursor-grabbing select-none touch-none"
        style={ { perspective: '1000px' } }
        onMouseDown={ handleMouseDown }
        onMouseMove={ handleMouseMove }
        onMouseUp={ handleMouseUp }
        onMouseLeave={ handleMouseUp }
        onTouchStart={ handleTouchStart }
        onTouchMove={ handleTouchMove }
        onTouchEnd={ handleMouseUp }
      >
        {/* Unified Draggable Map Canvas */ }
        <div
          className="absolute origin-center transition-transform duration-75"
          style={ {
            width: '300%',
            height: '300%',
            left: '-100%',
            top: '-100%',
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${pinchScale})`,
          } }
        >
          {/* Map background */ }
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=76.90%2C10.95%2C77.05%2C11.05&amp;layer=mapnik"
            className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
            style={ { border: 0 } }
            title="Routes Map"
          ></iframe>

          {/* GPS Route lines */ }
          { navState === 'idle' ? (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="routeGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Dynamic routes to all nearby clients */}
              {nearbyClients.map((client) => {
                const tx = parseFloat(client.mapX || '50');
                const ty = parseFloat(client.mapY || '50');
                // Calculate a smooth control point for the curve
                const cx = 50 + (tx - 50) * 0.2;
                const cy = 50 + (ty - 50) * 0.8;
                
                // Only highlight the route if the user explicitly selected this location
                const isSelected = selectedLocation && selectedLocation.id === client.id && selectedLocation.clientName === client.clientName;
                
                if (isSelected) {
                  return (
                    <path key={client.id} d={`M 50 50 Q ${cx} ${cy}, ${tx} ${ty}`}
                      stroke="url(#routeGradMain)" strokeWidth="4" strokeLinecap="round" fill="none"
                      vectorEffect="non-scaling-stroke" strokeDasharray="8 5" className="animate-route-dash" />
                  );
                }
                
                // Render faint lines for the rest
                return (
                  <path key={client.id} d={`M 50 50 Q ${cx} ${cy}, ${tx} ${ty}`}
                    stroke="#cbd5e1" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeDasharray="5 4" fill="none" opacity="0.6" />
                );
              })}
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="routeGradNav" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d={ `M 50 50 Q 55 45, ${parseFloat(targetX)} ${parseFloat(targetY)}` }
                stroke="url(#routeGradNav)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={ `M 50 50 Q 55 45, ${parseFloat(targetX)} ${parseFloat(targetY)}` }
                stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
                strokeDasharray="10 10" className="animate-route-dash" opacity="0.7" vectorEffect="non-scaling-stroke" />
            </svg>
          ) }

          {/* Current Location Marker — Bike */ }
          <div
            onClick={ (e) => { e.stopPropagation(); setShowNearbyClients(true); } }
            className="absolute flex flex-col items-center z-20 cursor-pointer pointer-events-auto transition-all duration-[4000ms] ease-in-out transform -translate-x-1/2 -translate-y-1/2"
            style={ {
              top: navState === 'navigating' && navStep === 'near' ? targetY : '50%',
              left: navState === 'navigating' && navStep === 'near' ? targetX : '50%',
            } }
          >
            <div
              className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center border-[2.5px] border-white active:scale-95 transition-transform"
              style={ {
                boxShadow: '0 0 0 4px rgba(37,99,235,0.25), 0 4px 16px rgba(37,99,235,0.5)',
                animation: navState === 'navigating' ? 'bike-bob 1.4s ease-in-out infinite' : 'glow-pulse 2.5s ease-in-out infinite',
              } }
            >
              <Bike size={ 20 } className="text-white" style={ { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' } } />
            </div>
          </div>

          {/* Client Markers (Always visible to let LMC view all locations simultaneously) */ }
          { nearbyClients.map((client) => {
            const isSelected = selectedLocation && selectedLocation.id === client.id && selectedLocation.clientName === client.clientName;

            // Hide standard pin in directions/navigating modes so it doesn't overlap the bouncing target pin
            if (isSelected && (navState === 'directions' || navState === 'navigating')) return null;

            return (
              <div
                key={ `${client.id}-${client.clientName}` }
                onClick={ (e) => {
                  e.stopPropagation();
                  setSelectedLocation(client);
                } }
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer z-10 transition-transform active:scale-95"
                style={ {
                  left: client.mapX || '50%',
                  top: client.mapY || '50%'
                } }
              >
                <div className="drop-shadow-md mb-0.5">
                  <MapPin
                    size={ 24 }
                    fill={ client.badge === 'High' || client.badge === 'Urgent' ? "#ef4444" : "#3b82f6" }
                    color="white"
                    strokeWidth={ 1.5 }
                  />
                </div>
                <div className="bg-white px-2 py-0.5 rounded shadow text-[9px] font-bold text-slate-700 whitespace-nowrap border border-slate-100">
                  { client.clientName }
                </div>
              </div>
            );
          }) }

          {/* Selected Destination Marker (Only shown in directions/navigating) */ }
          { (navState === 'directions' || navState === 'navigating') && selectedLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
              style={ {
                left: targetX,
                top: targetY
              } }
            >
              <div className="mb-0 animate-bounce drop-shadow-xl z-10">
                <MapPin
                  size={ 40 }
                  fill="#ef4444"
                  color="white"
                  strokeWidth={ 1.5 }
                />
              </div>
              <div className="relative bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-bold text-slate-800 whitespace-nowrap border border-slate-200 mt-0.5">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45"></div>
                { selectedLocation.clientName }
              </div>
            </div>
          ) }
        </div>

        {/* Floating Zoom Controls */ }
        <div className="absolute right-4 top-24 flex flex-col gap-2 z-30 pointer-events-auto">
          <button
            onClick={ (e) => {
              e.stopPropagation();
              setPinchScale(s => Math.min(2.2, s + 0.25));
            } }
            className="w-9 h-9 bg-white/95 backdrop-blur-sm hover:bg-white text-slate-800 rounded-full shadow-md flex items-center justify-center font-black text-base border border-slate-100 transition-all active:scale-90"
          >
            +
          </button>
          <button
            onClick={ (e) => {
              e.stopPropagation();
              setPinchScale(s => Math.max(0.6, s - 0.25));
            } }
            className="w-9 h-9 bg-white/95 backdrop-blur-sm hover:bg-white text-slate-800 rounded-full shadow-md flex items-center justify-center font-black text-base border border-slate-100 transition-all active:scale-90"
          >
            −
          </button>
        </div>

        {/* Interactive overlay to close popups */ }
        { navState === 'idle' && (
          <div
            className="absolute inset-0 bg-slate-500/5 pointer-events-none"
            onClick={ () => {
              setShowNearbyClients(false);
              setSelectedLocation(null);
            } }
          ></div>
        ) }

        {/* Header over Map */ }
        { navState !== 'navigating' && (
          <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between pointer-events-none transition-opacity">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={ () => {
                  if (navState === 'directions') {
                    setNavState('idle');
                    resetPan();
                  } else {
                    setIsSidebarOpen(true);
                  }
                } }
                className="p-2 -ml-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white rounded-full shadow-sm transition-colors"
              >
                { navState === 'directions' ? <ChevronLeft size={ 20 } /> : <Menu size={ 20 } /> }
              </button>
              { navState === 'idle' && (
                <button
                  onClick={ () => {
                    setCurrentScreen('home');
                    resetPan();
                  } }
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white rounded-full shadow-sm transition-colors"
                >
                  <ChevronLeft size={ 20 } />
                </button>
              ) }
            </div>

            { navState === 'idle' && (
              <button
                onClick={ (e) => {
                  e.stopPropagation();
                  setShowNearbyClients(true);
                } }
                className="p-2 -mr-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white rounded-full shadow-sm transition-colors pointer-events-auto"
              >
                <List size={ 20 } />
              </button>
            ) }
          </div>
        ) }

        {/* Live Navigation Header */ }
        <div className={ `absolute top-0 left-0 right-0 z-40 text-white shadow-lg transition-all duration-500 ${navState === 'navigating' ? 'translate-y-0' : '-translate-y-full'
          } ${navStep === 'going' ? 'bg-emerald-600' : 'bg-amber-600'
          }` }>
          <div className="pt-8 pb-3 px-4 flex items-center gap-3">
            <div className="shrink-0">
              { navStep === 'going' && <ArrowUpRight size={ 22 } strokeWidth={ 3 } /> }
              { navStep === 'near' && <MapPin size={ 22 } strokeWidth={ 2.5 } /> }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold leading-tight">
                { navStep === 'going' && '300 m' }
                { navStep === 'near' && 'Arrived Near' }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Clients Bottom Sheet (Google Maps Style - Light Theme) */ }
      <div className={ `absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 max-h-[70%] ${showNearbyClients && navState === 'idle' ? 'translate-y-0' : 'translate-y-full'}` }>
        <div
          className="flex justify-center pt-3 pb-1 cursor-pointer"
          onClick={ () => setShowNearbyClients(false) }
        >
          <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
        </div>

        <div className="px-5 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-base font-black text-slate-800">Nearby Clients</h2>
          <span className="bg-blue-100 text-blue-750 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
            { nearbyClients.length } Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide flex flex-col gap-2.5">
          { nearbyClients.map(client => (
            <div
              key={ `${client.id}-${client.clientName}` }
              onClick={ () => setSelectedLocation(client) }
              className="border border-slate-100 bg-white shadow-sm p-3 rounded-xl flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${client.taskType === 'delivery' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                {client.taskType === 'delivery' ? <Package size={ 15 } /> : <Bike size={ 15 } />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-xs truncate">{ client.clientName }</h3>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-slate-500">
                  <MapPin size={ 10 } className="text-slate-400 shrink-0" />
                  <span className="truncate">{ client.location }</span>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap border border-emerald-100 shrink-0">
                { client.distance } km
              </div>
            </div>
          )) }
        </div>
      </div>

      {/* Selected Location Bottom Sheet (Google Maps Style - Light Theme) */ }
      <div className={ `absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 ${selectedLocation && navState === 'idle' ? 'translate-y-0' : 'translate-y-full'}` }>
        <div
          className="flex justify-center pt-3 pb-1.5 cursor-pointer"
          onClick={ () => setSelectedLocation(null) }
        >
          <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
        </div>

        { selectedLocation && (
          <div className="px-4 pb-6 pt-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">{ selectedLocation.clientName }</h2>
                  {selectedLocation.taskType === 'delivery' && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[9px] font-bold">Delivery</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-bold">{ selectedLocation.distance } km • { selectedLocation.location }</p>
              </div>
            </div>

            <div className="flex gap-2.5 mt-2">
              <button
                onClick={ () => {
                  setNavState('directions');
                } }
                className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap active:scale-95 transition-transform flex-1 border border-slate-200"
              >
                <CornerUpRight size={ 16 } />
                Directions
              </button>

              <button
                onClick={ () => {
                  setNavState('navigating');
                  setNavStep('going');
                } }
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap active:scale-95 transition-transform shadow-md shadow-blue-600/30 flex-1"
              >
                <Play size={ 16 } fill="currentColor" />
                Start
              </button>
            </div>
          </div>
        ) }
      </div>

      {/* Directions Route Preview Bottom Sheet */ }
      <div className={ `absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 ${navState === 'directions' ? 'translate-y-0' : 'translate-y-full'}` }>
        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-2xl font-black text-emerald-600">{ routeDetails.mins } min</div>
              <div className="text-[11px] text-slate-500 font-bold">{ selectedLocation?.distance } km • Fastest route</div>
            </div>
            <button
              onClick={ () => {
                setNavState('navigating');
                setNavStep('going');
              } }
              className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-sm whitespace-nowrap active:scale-95 transition-transform shadow-md shadow-emerald-600/35"
            >
              <Play size={ 16 } fill="currentColor" />
              Start
            </button>
          </div>
        </div>
      </div>

      {/* Live Navigation Bottom Sheet */ }
      <div className={ `absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 ${navState === 'navigating' ? 'translate-y-0' : 'translate-y-full'}` }>
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-100">
          <div>
            <div className="text-lg font-bold text-slate-800">
              { navStep === 'going' ? `${routeDetails.mins} min` : 'Arrived' }
            </div>
            <div className="text-[11px] text-slate-500 font-medium">{ routeDetails.arrival } • { selectedLocation?.distance } km</div>
          </div>
          <button
            onClick={ () => {
              setNavState('idle');
              setNavStep('going');
            } }
            className="flex items-center justify-center bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap active:scale-95 transition-transform"
          >
            <X size={ 14 } />
            Exit
          </button>
        </div>

        {/* Guidance Alert Banner */ }
        <div className="px-4 py-2">
          <div className={ `p-2 rounded-xl border flex items-start gap-2 ${navStep === 'going' ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'
            }` }>
            <AlertCircle size={ 14 } className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold leading-tight mb-0.5">
                { navStep === 'going' 
                    ? 'Going to Client — En route' 
                    : selectedLocation?.taskType === 'delivery'
                        ? 'Arrived Near — Verify Delivery'
                        : 'Arrived Near — Collect Sample' }
              </p>
              <p className="text-[9px] text-slate-500 font-medium">
                { navStep === 'going' 
                    ? 'Tap the button below once you are within 200m of the client.' 
                    : selectedLocation?.taskType === 'delivery'
                        ? 'Enter OTP and optionally upload a snapshot to complete.'
                        : 'Scan the sample barcode to verify the collected specimens.' }
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Action Button */ }
        <div className="px-4 pb-4 pt-1">
          { navStep === 'going' ? (
            <button
              disabled={ true }
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex flex-col items-center opacity-75 cursor-not-allowed transition-all"
              style={ {
                background: 'linear-gradient(135deg,#64748b,#94a3b8)',
              } }
            >
              <span>En Route (GPS Auto-Tracking)</span>
              <span className="text-[8px] font-semibold opacity-75 mt-0.5">Auto-arriving when &lt; 200m away...</span>
            </button>
          ) : selectedLocation?.taskType === 'delivery' ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-center tracking-[0.2em]"
                  maxLength={6}
                />
                <a href="#" className="text-[10px] font-bold text-purple-600 hover:text-purple-700 whitespace-nowrap shrink-0 px-2 py-2 underline underline-offset-2">
                  Send OTP
                </a>
              </div>
              <button
                onClick={ () => {
                  setSelectedClient({ ...selectedLocation, initialStepIndex: 4 });
                  setNavState('idle');
                  setNavStep('going');
                } }
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex flex-col items-center active:scale-[0.97] transition-all"
                style={ {
                  background: 'linear-gradient(135deg,#6b21a8,#9333ea)',
                  boxShadow: '0 4px 16px rgba(147,51,234,0.3)',
                } }
              >
                <span>Verify OTP & Deliver</span>
                <span className="text-[8px] font-semibold opacity-75 mt-0.5">
                  Optional: Upload Snapshot
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={ () => {
                setCurrentScreen('scan');
                setNavState('idle');
                setNavStep('going');
              } }
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex flex-col items-center active:scale-[0.97] transition-all"
              style={ {
                background: 'linear-gradient(135deg,#065f46,#10b981)',
                boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
              } }
            >
              <span>Collect Sample</span>
              <span className="text-[8px] font-semibold opacity-75 mt-0.5">
                Scan barcode to verify
              </span>
            </button>
          ) }
        </div>
      </div>
    </div>
  );
};

export default RoutesScreen;

