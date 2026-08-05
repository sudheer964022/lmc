import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, MapPin, Navigation, ScanBarcode, 
  Camera, CheckCircle2, Package, Clock, Phone,
  ParkingSquare, Bike, AlertCircle, Bell
} from 'lucide-react';

// ─── Bike Status Steps ────────────────────────────────────────────────────────
const STEPS = [
  { id: 'going',   label: 'Going',     fullLabel: 'Going to Client', subLabel: 'En route',       icon: Bike,         bgClass: 'bg-blue-600',    lightBg: 'bg-blue-50',    textClass: 'text-blue-700',    borderClass: 'border-blue-500',    ringClass: 'ring-blue-400',    glowColor: '37,99,235'  },
  { id: 'near',    label: 'Near',      fullLabel: 'Near Client',     subLabel: '< 200m away',    icon: MapPin,       bgClass: 'bg-amber-500',   lightBg: 'bg-amber-50',   textClass: 'text-amber-700',   borderClass: 'border-amber-500',   ringClass: 'ring-amber-400',   glowColor: '245,158,11' },
  { id: 'stop',    label: 'Stop',      fullLabel: 'Stop Bike',       subLabel: 'Park & secure',  icon: ParkingSquare,bgClass: 'bg-orange-500',  lightBg: 'bg-orange-50',  textClass: 'text-orange-700',  borderClass: 'border-orange-500',  ringClass: 'ring-orange-400',  glowColor: '249,115,22' },
  { id: 'collect', label: 'Collect',   fullLabel: 'Collect Sample',  subLabel: 'Scan & verify',  icon: Package,      bgClass: 'bg-emerald-600', lightBg: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-500', ringClass: 'ring-emerald-400', glowColor: '5,150,105'  },
  { id: 'done',    label: 'Done',      fullLabel: 'Collected',       subLabel: 'Complete!',      icon: CheckCircle2, bgClass: 'bg-green-600',   lightBg: 'bg-green-50',   textClass: 'text-green-700',   borderClass: 'border-green-500',   ringClass: 'ring-green-400',   glowColor: '22,163,74'  },
];

// ─── Smooth eased lerp helper ─────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

// ─── Bike Map with Rich Animations ───────────────────────────────────────────
const BikeMap = ({ client, stepId, onClick }) => {
  const [bearing, setBearing]   = useState(42);
  const [smoothBearing, setSmoothBearing] = useState(42);
  const [eta, setEta]           = useState(client.distance ? Math.round(client.distance * 4) : 8);
  const [progress, setProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [trail, setTrail]       = useState([]);
  const [dashOffset, setDashOffset] = useState(0);
  const targetBearing  = useRef(42);
  const targetProgress = useRef(0);
  const frameRef       = useRef(null);
  const tickRef        = useRef(null);

  // ── target progress per step ──
  const stepTarget = { going: 62, near: 82, stop: 92, collect: 100, done: 100 };

  // ── rAF smooth interpolation loop ──
  const raf = useCallback(() => {
    setSmoothBearing(b => {
      const diff = targetBearing.current - b;
      const norm = ((diff + 180) % 360) - 180;
      return b + norm * 0.03; // slower lerp
    });
    setSmoothProgress(p => lerp(p, targetProgress.current, 0.012)); // slower progress
    frameRef.current = requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frameRef.current);
  }, [raf]);

  // ── tick: update targets & ETA ──
  useEffect(() => {
    targetProgress.current = stepTarget[stepId] ?? 0;

    // When stop/collect/done: lock bearing to 0 (stopped, no wobble)
    if (stepId === 'stop' || stepId === 'collect' || stepId === 'done') {
      targetBearing.current = 0;
      return;
    }

    tickRef.current = setInterval(() => {
      // Gentle bearing wobble — small angle, slow interval
      const wobble = (Math.random() - 0.5) * 4;
      targetBearing.current = targetBearing.current + wobble;

      // ETA countdown while going
      if (stepId === 'going') {
        setEta(e => Math.max(0, e - 0.015));
      }

      // Animated dash offset for route line (slow)
      setDashOffset(d => (d + 1) % 24);
    }, 500);
    return () => clearInterval(tickRef.current);
  }, [stepId]);

  const mapRotation = (smoothBearing - 42) * 0.25;
  const bikeX = Math.min(15 + smoothProgress * 0.72, 87);
  const bikeY = (() => {
    // follow a curved path: y = 78 - sin(x/100 * π) * 38
    const t = Math.min(smoothProgress / 100, 1);
    return 78 - Math.sin(t * Math.PI) * 36;
  })();

  const etaLabel = eta < 1 ? '< 1 min' : `${Math.ceil(eta)} min`;
  const statusEmoji = { going: '🚴', near: '📍', stop: '🅿️', collect: '📦', done: '✅' }[stepId];
  const statusText  = { going: `Heading to ${client.clientName}`, near: `Near ${client.clientName}`, stop: 'Parking bike', collect: 'Collecting sample', done: 'Sample collected!' }[stepId];

  return (
    <div onClick={onClick} className="relative w-full overflow-hidden cursor-pointer" style={{ height: 168 }}>

      {/* ── Map tile — rotates with heading ── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${mapRotation}deg) scale(1.25)`,
          transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
          transformOrigin: 'center center',
        }}
      >
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=80.18%2C13.02%2C80.28%2C13.08&layer=mapnik"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ border: 0, opacity: 0.85 }}
          title="Location Map"
        />
      </div>

      {/* ── Overlay to hide iframe zoom controls + tint ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(30,64,175,0.06) 0%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.04) 100%)',
        zIndex: 2,
      }} />
      {/* Cover right-side zoom controls from iframe */}
      <div className="absolute top-0 right-0 w-12 h-full pointer-events-none" style={{
        background: 'linear-gradient(to left, rgba(241,245,249,0.95) 0%, rgba(241,245,249,0) 100%)',
        zIndex: 2,
      }} />

      {/* ── SVG: route + trail ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1d4ed8" stopOpacity="1" />
            <stop offset="50%"  stopColor="#3b82f6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Ghost full route (dashed, animated offset) */}
        <path
          d="M 15 78 C 35 65, 55 30, 87 30"
          stroke="#475569"
          strokeWidth="1.8"
          strokeDasharray="4 3"
          strokeDashoffset={dashOffset}
          fill="none"
          opacity="0.3"
        />

        {/* Completed solid route with glow */}
        <path
          d={`M 15 78 C ${15 + smoothProgress * 0.35} ${78 - smoothProgress * 0.28}, ${15 + smoothProgress * 0.5} ${78 - smoothProgress * 0.38}, ${bikeX} ${bikeY}`}
          stroke="url(#rg)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          opacity="0.95"
        />
      </svg>

      {/* ── Destination pin with label ── */}
      <div className="absolute pointer-events-none flex flex-col items-center" style={{ right: '10%', top: '12%', zIndex: 5 }}>
        {/* Name label */}
        <div
          className="bg-white text-[8px] font-black text-red-600 px-1.5 py-[2px] rounded-md shadow-md mb-0.5 whitespace-nowrap border border-red-100"
          style={{ boxShadow: '0 2px 8px rgba(220,38,38,0.2)' }}
        >
          📍 {client?.clientName?.split(' ').slice(0,2).join(' ') ?? 'Destination'}
        </div>
        {/* Pin */}
        <div
          className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
          style={{
            boxShadow: '0 0 0 3px rgba(239,68,68,0.25), 0 3px 12px rgba(239,68,68,0.5)',
            animation: 'bounce-subtle 2.5s ease-in-out infinite',
          }}
        >
          <MapPin size={13} className="text-white" />
        </div>
        <div className="w-1.5 h-2 bg-red-500 rounded-b-full -mt-0.5" />
        {/* Ripple */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-red-400 opacity-20 animate-ping-slow" />
      </div>

      {/* ── Rider marker — Rapido style ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${bikeX}%`,
          top:  `${bikeY}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 6,
          transition: 'left 0.15s linear, top 0.15s linear',
        }}
      >
        {/* Pulse rings */}
        {stepId === 'going' && (
          <>
            <div className="absolute -inset-3 rounded-full opacity-20 animate-ping-slow"
              style={{ backgroundColor: `rgb(${STEPS[0].glowColor})` }} />
            <div className="absolute -inset-2 rounded-full opacity-15 animate-ping-fast"
              style={{ backgroundColor: `rgb(${STEPS[0].glowColor})`, animationDelay: '0.5s' }} />
          </>
        )}
        {stepId === 'near' && (
          <div className="absolute -inset-3 rounded-full opacity-25 animate-ping-slow"
            style={{ backgroundColor: `rgb(${STEPS[1].glowColor})` }} />
        )}

        {/* Collector callout bubble (above rider) */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div
            className="bg-white text-[8px] font-black px-1.5 py-[2px] rounded-md shadow-md border flex items-center gap-0.5"
            style={{
              borderColor: stepId === 'going' ? 'rgba(37,99,235,0.3)' :
                          stepId === 'near' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              color: stepId === 'going' ? '#1d4ed8' :
                     stepId === 'near' ? '#b45309' : '#15803d',
            }}
          >
            <span style={{ fontSize: 7 }}>🚴</span>
            <span>Collector</span>
          </div>
          {/* Tail arrow */}
          <div className="w-1.5 h-1.5 bg-white border-r border-b rotate-45 mx-auto -mt-[1px] shadow-sm"
            style={{
              borderColor: stepId === 'going' ? 'rgba(37,99,235,0.3)' :
                          stepId === 'near' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)',
            }}
          />
        </div>

        {/* Main rider avatar */}
        <div
          className={`relative flex items-center justify-center border-[2.5px] border-white ${
            stepId === 'going'   ? 'bg-blue-600'    :
            stepId === 'near'    ? 'bg-amber-500'   :
            stepId === 'stop'    ? 'bg-orange-500'  :
            stepId === 'collect' ? 'bg-emerald-600' : 'bg-green-600'
          }`}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50% 50% 50% 10%',
            boxShadow: `0 0 0 2px rgba(${
              stepId === 'going'   ? STEPS[0].glowColor :
              stepId === 'near'    ? STEPS[1].glowColor :
              stepId === 'stop'    ? STEPS[2].glowColor :
              stepId === 'collect' ? STEPS[3].glowColor : STEPS[4].glowColor
            },0.4), 0 4px 14px rgba(0,0,0,0.25)`,
            animation: stepId === 'going' ? 'bike-bob 1.6s ease-in-out infinite' :
                       stepId === 'near'  ? 'bounce-subtle 1.2s ease-in-out infinite' : 'none',
            transform: `rotate(${
              (stepId === 'stop' || stepId === 'collect' || stepId === 'done') ? 0 : smoothBearing * 0.3
            }deg)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          {(stepId === 'stop' || stepId === 'collect' || stepId === 'done')
            ? <ParkingSquare size={16} className="text-white" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
            : <Bike size={16} className="text-white" style={{ transform: 'scaleX(-1)', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
          }
        </div>
      </div>

      {/* ── ETA chip (top-left) ── */}
      {(stepId === 'going' || stepId === 'near') && (
        <div className="absolute top-2 left-2 pointer-events-none" style={{ zIndex: 7 }}>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-white text-[10px] font-black shadow-lg backdrop-blur-sm"
            style={{
              background: stepId === 'going'
                ? 'linear-gradient(135deg,#1e40af,#2563eb)'
                : 'linear-gradient(135deg,#b45309,#f59e0b)',
              boxShadow: stepId === 'going'
                ? '0 3px 12px rgba(37,99,235,0.4)'
                : '0 3px 12px rgba(245,158,11,0.4)',
            }}
          >
            <Clock size={10}/>
            {stepId === 'going' ? etaLabel : 'Nearby'}
          </div>
        </div>
      )}

      {/* ── Progress bar at bottom of map ── */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10 pointer-events-none" style={{ zIndex: 7 }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${smoothProgress}%`,
            background: 'linear-gradient(90deg,#2563eb,#10b981)',
            boxShadow: '0 0 8px rgba(37,99,235,0.6)',
          }}
        />
      </div>

      {/* ── Full Map hint ── */}
      <div className="absolute bottom-3 left-2 pointer-events-none" style={{ zIndex: 7 }}>
        <div className="bg-white/85 backdrop-blur-sm text-slate-600 text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
          <Navigation size={9} /> Full Map
        </div>
      </div>
    </div>
  );
};

// ─── Animated Stepper ─────────────────────────────────────────────────────────
const StatusStepper = ({ currentStepIndex }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
    {STEPS.map((step, idx) => {
      const done   = idx < currentStepIndex;
      const active = idx === currentStepIndex;
      const Icon   = step.icon;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-0.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                done   ? 'bg-green-500' :
                active ? step.bgClass   : 'bg-slate-100'
              }`}
              style={{
                boxShadow: active
                  ? `0 0 0 3px rgba(${step.glowColor},0.25), 0 2px 8px rgba(${step.glowColor},0.4)`
                  : done ? '0 2px 6px rgba(34,197,94,0.3)' : 'none',
                animation: active ? 'glow-pulse 2s ease-in-out infinite' : done ? 'step-done 0.4s both' : 'none',
                transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {done
                ? <CheckCircle2 size={14} className="text-white animate-step-done" />
                : <Icon size={13} className={active ? 'text-white' : 'text-slate-400'} />
              }
            </div>
            <span className={`text-[8px] font-bold leading-none text-center ${
              active ? step.textClass : done ? 'text-green-600' : 'text-slate-400'
            }`} style={{ transition: 'color 0.3s ease' }}>
              {step.label}
            </span>
          </div>

          {idx < STEPS.length - 1 && (
            <div className="flex-1 h-[3px] mx-1 rounded-full overflow-hidden bg-slate-100" style={{ position: 'relative' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: done ? '100%' : active ? '50%' : '0%',
                  background: done
                    ? 'linear-gradient(90deg,#4ade80,#22c55e)'
                    : 'linear-gradient(90deg,#93c5fd,#3b82f6)',
                  transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: done ? '0 0 6px rgba(34,197,94,0.5)' : '0 0 6px rgba(37,99,235,0.4)',
                }}
              />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Notification Toast ───────────────────────────────────────────────────────
const NotificationToast = ({ step, client, prevStepId }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [step.id]);

  const messages = {
    going:   `Collector is heading to ${client.clientName}`,
    near:    `Collector arrived near ${client.clientName}`,
    stop:    `Bike parked — entering ${client.clientName}`,
    collect: `Collecting sample at ${client.clientName}`,
    done:    `Sample collected from ${client.clientName}!`,
  };
  const emojis = { going: '🚴', near: '📍', stop: '🅿️', collect: '📦', done: '✅' };
  const gradients = {
    going:   'linear-gradient(135deg,#1e40af,#2563eb)',
    near:    'linear-gradient(135deg,#b45309,#f59e0b)',
    stop:    'linear-gradient(135deg,#c2410c,#f97316)',
    collect: 'linear-gradient(135deg,#065f46,#10b981)',
    done:    'linear-gradient(135deg,#15803d,#22c55e)',
  };
  const glows = {
    going:   '37,99,235', near: '245,158,11', stop: '249,115,22', collect: '16,185,129', done: '34,197,94',
  };

  return (
    // Full-width flat banner — no margin, no border radius
    <div
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        className="text-white px-4 py-2.5 flex items-center gap-2.5"
        style={{
          background: gradients[step.id],
          boxShadow: `0 4px 16px rgba(${glows[step.id]},0.35)`,
        }}
      >
        {/* Animated icon bubble */}
        <div
          className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm"
          style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}
        >
          {emojis[step.id]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-wider opacity-75 leading-none mb-0.5">Live Update</p>
          <p className="text-[11px] font-semibold leading-tight truncate">{messages[step.id]}</p>
        </div>
        {/* Animated dot indicator */}
        <div className="shrink-0 flex gap-0.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-white"
              style={{ opacity: 0.6, animation: `bike-bob 1s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main ClientDetails ───────────────────────────────────────────────────────
const ClientDetails = ({ client, onClose, setCurrentScreen }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [prevStepId, setPrevStepId] = useState(null);

  if (!client) return null;

  const currentStep = STEPS[stepIndex];
  const isLastStep  = stepIndex === STEPS.length - 1;

  const advanceStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setPrevStepId(currentStep.id);
      setStepIndex(i => i + 1);
    }
  };

  const handleCollect = () => {
    setCurrentScreen('scan');
    setTimeout(() => {
      setScanned(true);
      setPrevStepId(currentStep.id);
      setStepIndex(STEPS.length - 1);
    }, 800);
  };

  const getActionButton = () => {
    switch (currentStep.id) {
      case 'going':   return { label: "I'm Near the Client",  sublabel: 'Tap when < 200m away',    onClick: advanceStep,   gradient: 'linear-gradient(135deg,#b45309,#f59e0b)', glow: '245,158,11' };
      case 'near':    return { label: 'Stop Bike & Enter',    sublabel: 'Park bike securely',       onClick: advanceStep,   gradient: 'linear-gradient(135deg,#c2410c,#f97316)', glow: '249,115,22' };
      case 'stop':    return { label: 'Collect Sample',       sublabel: 'Scan barcode to verify',   onClick: handleCollect, gradient: 'linear-gradient(135deg,#065f46,#10b981)', glow: '16,185,129' };
      case 'collect': return { label: 'Sample Collected ✅',  sublabel: 'Tap to confirm collection',onClick: advanceStep,   gradient: 'linear-gradient(135deg,#15803d,#22c55e)', glow: '34,197,94'  };
      case 'done':    return { label: 'Complete Pickup 🎉',   sublabel: 'All steps finished',       onClick: onClose,       gradient: 'linear-gradient(135deg,#1e40af,#2563eb)', glow: '37,99,235'  };
      default: return null;
    }
  };

  const actionBtn = getActionButton();

  return (
    <div className="absolute inset-0 bg-slate-50 z-[60] flex flex-col overflow-hidden" style={{ animation: 'slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-12 pb-3 shadow-sm z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onClose} className="p-2 -ml-2 shrink-0 text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-slate-800 truncate leading-tight">{client.clientName}</h1>
            <span className="text-[10px] text-slate-500 font-medium">{client.location}</span>
          </div>
        </div>

        {/* Animated live status badge */}
        <div
          className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 ${currentStep.lightBg} ${currentStep.textClass}`}
          style={{
            boxShadow: `0 0 0 2px rgba(${currentStep.glowColor},0.2)`,
            transition: 'all 0.3s ease',
          }}
        >
          <span
            className={`w-2 h-2 rounded-full ${currentStep.bgClass}`}
            style={{ animation: currentStep.id !== 'done' ? 'ping-slow 1.8s ease infinite' : 'none' }}
          />
          {currentStep.fullLabel}
        </div>
      </div>

      {/* ── Stepper ── */}
      <StatusStepper currentStepIndex={stepIndex} />

      {/* ── Notification toast ── */}
      <NotificationToast step={currentStep} client={client} prevStepId={prevStepId} />

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 mt-3 flex flex-col gap-3">

        {/* Map card */}
        <div className="mx-4 rounded-3xl overflow-hidden border border-slate-200"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <BikeMap client={client} stepId={currentStep.id} onClick={() => setCurrentScreen('routes')} />

          {/* Distance strip */}
          <div
            className={`${currentStep.lightBg} px-4 py-2 flex items-center justify-between`}
            style={{ borderTop: `2px solid rgba(${currentStep.glowColor},0.12)` }}
          >
            <div className={`flex items-center gap-1.5 ${currentStep.textClass}`}>
              <Bike size={13} style={{ animation: currentStep.id === 'going' ? 'bounce-subtle 1.8s ease-in-out infinite' : 'none' }} />
              <span className="text-[11px] font-bold">
                {client.distance ? `${client.distance} km` : '2.5 km'} away
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Navigation size={11} />
              <span className="text-[10px] font-semibold">{client.location}</span>
            </div>
          </div>
        </div>

        {/* Client info card */}
        <div className="mx-4 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden" style={{ animation: 'slide-up 0.4s 0.1s both' }}>
          <div className="px-4 py-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-base font-black text-slate-800 mb-0.5">{client.clientName}</h2>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <MapPin size={11} />
                  <span>{client.location}</span>
                </div>
              </div>
              <button className="bg-blue-50 text-blue-600 p-2.5 rounded-full hover:bg-blue-100 transition-colors shrink-0"
                style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.15)' }}>
                <Phone size={16} />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Package size={13} /> Sample Requirements
              </h3>
              <p className="text-xs text-slate-600 mb-2">{client.description}</p>
              {client.samples && client.samples.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {client.samples.map((s, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm"
                      style={{ animation: `slide-up 0.3s ${0.05 * idx}s both` }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium bg-amber-50 p-2.5 rounded-2xl border border-amber-100 text-amber-800">
              <Clock size={14} className="text-amber-500 shrink-0" />
              <span>Requested at {client.time}</span>
            </div>
          </div>
        </div>

        {/* Scan/photo actions (stop → done) */}
        {(currentStep.id === 'stop' || currentStep.id === 'collect' || currentStep.id === 'done') && (
          <div className="mx-4 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden" style={{ animation: 'slide-up 0.4s 0.15s both' }}>
            <div className="px-4 py-4">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Collection Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setCurrentScreen('scan'); setTimeout(() => { setScanned(true); setStepIndex(STEPS.length - 1); }, 600); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                    scanned ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-blue-500 bg-blue-50 text-blue-700'
                  }`}
                  style={{ boxShadow: scanned ? '0 4px 16px rgba(16,185,129,0.2)' : '0 4px 16px rgba(37,99,235,0.15)' }}
                >
                  {scanned
                    ? <CheckCircle2 size={22} className="mb-1.5" style={{ animation: 'step-done 0.4s both' }} />
                    : <ScanBarcode  size={22} className="mb-1.5" />
                  }
                  <span className="font-bold text-[11px]">{scanned ? 'Scanned ✓' : 'Scan Barcode'}</span>
                </button>

                <button
                  onClick={() => setCurrentScreen('scan')}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 active:scale-95 transition-all"
                >
                  <Camera size={22} className="mb-1.5" />
                  <span className="font-bold text-[11px] text-center">Upload Photo</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold mt-0.5 text-slate-400">Optional</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guidance card */}
        {!isLastStep && (
          <div
            className={`mx-4 ${currentStep.lightBg} border ${currentStep.borderClass}/30 rounded-2xl p-3 flex items-start gap-2.5`}
            style={{ animation: 'slide-up 0.4s 0.2s both' }}
          >
            <AlertCircle size={15} className={`${currentStep.textClass} shrink-0 mt-0.5`} />
            <div>
              <p className={`text-[11px] font-bold ${currentStep.textClass} leading-tight mb-0.5`}>
                {currentStep.fullLabel} — {currentStep.subLabel}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {currentStep.id === 'going'   && 'Tap the button below once you are within 200m of the client.'}
                {currentStep.id === 'near'    && 'Confirm your arrival and securely park your bike before entering.'}
                {currentStep.id === 'stop'    && 'Scan the sample barcode to verify the collected specimens.'}
                {currentStep.id === 'collect' && 'Confirm all samples are bagged. Tap to mark as collected.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 bg-white border-t border-slate-100"
        style={{ boxShadow: '0 -12px 40px rgba(0,0,0,0.06)' }}>
        {actionBtn && (
          <button
            onClick={actionBtn.onClick}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex flex-col items-center active:scale-[0.97] transition-transform"
            style={{
              background: actionBtn.gradient,
              boxShadow: `0 6px 28px rgba(${actionBtn.glow},0.45)`,
              animation: 'btn-glow 2.5s ease-in-out infinite',
            }}
          >
            <span>{actionBtn.label}</span>
            <span className="text-[9px] font-semibold opacity-75 mt-0.5">{actionBtn.sublabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
