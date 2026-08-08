import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, MapPin, Navigation, ScanBarcode, 
  Camera, CheckCircle2, Package, Clock, Phone, MessageSquare,
  ParkingSquare, Bike, AlertCircle, Bell, Paperclip, CheckCheck,
  FileText, Image as ImageIcon, ShieldCheck, PenTool, X
} from 'lucide-react';

// ─── Bike Status Steps ────────────────────────────────────────────────────────
const COLLECTION_STEPS = [
  { id: 'going',   label: 'Going',     fullLabel: 'Going to Client', subLabel: 'En route',       icon: Bike,         bgClass: 'bg-blue-600',    lightBg: 'bg-blue-50',    textClass: 'text-blue-700',    borderClass: 'border-blue-500',    ringClass: 'ring-blue-400',    glowColor: '37,99,235'  },
  { id: 'near',    label: 'Near',      fullLabel: 'Near Client',     subLabel: 'Scan & verify',  icon: MapPin,       bgClass: 'bg-amber-500',   lightBg: 'bg-amber-50',   textClass: 'text-amber-700',   borderClass: 'border-amber-500',   ringClass: 'ring-amber-400',   glowColor: '245,158,11' },
  { id: 'collect', label: 'Collect',   fullLabel: 'Collect Sample',  subLabel: 'Confirm bagged', icon: Package,      bgClass: 'bg-emerald-600', lightBg: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-500', ringClass: 'ring-emerald-400', glowColor: '5,150,105'  },
  { id: 'done',    label: 'Done',      fullLabel: 'Collected',       subLabel: 'Complete!',      icon: CheckCircle2, bgClass: 'bg-green-600',   lightBg: 'bg-green-50',   textClass: 'text-green-700',   borderClass: 'border-green-500',   ringClass: 'ring-green-400',   glowColor: '22,163,74'  },
];

const DELIVERY_STEPS = [
  { id: 'collect_lab',label: 'Collect',   fullLabel: 'Collect from Lab', subLabel: 'At Lab',         icon: Package,      bgClass: 'bg-indigo-600',  lightBg: 'bg-indigo-50',  textClass: 'text-indigo-700',  borderClass: 'border-indigo-500',  ringClass: 'ring-indigo-400',  glowColor: '79,70,229' },
  { id: 'going',   label: 'Going',     fullLabel: 'Going to Client', subLabel: 'En route',       icon: Bike,         bgClass: 'bg-blue-600',    lightBg: 'bg-blue-50',    textClass: 'text-blue-700',    borderClass: 'border-blue-500',    ringClass: 'ring-blue-400',    glowColor: '37,99,235'  },
  { id: 'near',    label: 'Near',      fullLabel: 'Near Client',     subLabel: 'Arrived',        icon: MapPin,       bgClass: 'bg-amber-500',   lightBg: 'bg-amber-50',   textClass: 'text-amber-700',   borderClass: 'border-amber-500',   ringClass: 'ring-amber-400',   glowColor: '245,158,11' },
  { id: 'verify',  label: 'Verify',    fullLabel: 'Verify Client',   subLabel: 'Enter OTP',      icon: ShieldCheck,  bgClass: 'bg-purple-600',  lightBg: 'bg-purple-50',  textClass: 'text-purple-700',  borderClass: 'border-purple-500',  ringClass: 'ring-purple-400',  glowColor: '147,51,234' },
  { id: 'deliver', label: 'Deliver',   fullLabel: 'Deliver Item',    subLabel: 'Snapshot & Handover',icon: Package,      bgClass: 'bg-emerald-600', lightBg: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-500', ringClass: 'ring-emerald-400', glowColor: '5,150,105'  },
  { id: 'done',    label: 'Done',      fullLabel: 'Delivered',       subLabel: 'Complete!',      icon: CheckCircle2, bgClass: 'bg-green-600',   lightBg: 'bg-green-50',   textClass: 'text-green-700',   borderClass: 'border-green-500',   ringClass: 'ring-green-400',   glowColor: '22,163,74'  },
];

// ─── Smooth eased lerp helper ─────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

// ─── Bike Map with Rich Animations ───────────────────────────────────────────
const BikeMap = ({ client, stepId, onClick, onNear, steps }) => {
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
  const stepTarget = { collect_lab: 20, going: 62, near: 90, verify: 90, collect: 100, deliver: 100, done: 100 };

  const hasTriggeredRef = useRef(false);

  // ── rAF smooth interpolation loop ──
  const raf = useCallback(() => {
    setSmoothBearing(b => {
      const diff = targetBearing.current - b;
      const norm = ((diff + 180) % 360) - 180;
      return b + norm * 0.03; // slower lerp
    });
    setSmoothProgress(p => {
      const nextP = lerp(p, targetProgress.current, 0.005); // slower progress
      if (stepId === 'going' && nextP >= 60 && onNear && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        // Defer execution out of the render loop to avoid the setState warning
        setTimeout(() => onNear(), 0);
      }
      return nextP;
    });
    frameRef.current = requestAnimationFrame(raf);
  }, [stepId, onNear]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frameRef.current);
  }, [raf]);

  // ── tick: update targets & ETA ──
  useEffect(() => {
    targetProgress.current = stepTarget[stepId] ?? 0;

    // When near/collect/done: lock bearing to 0 (stopped, no wobble)
    if (stepId === 'near' || stepId === 'collect' || stepId === 'done') {
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
  const statusEmoji = { going: '🚴', near: '📍', collect: '📦', done: '✅' }[stepId];
  const statusText  = { going: `Heading to ${client.clientName}`, near: `Near ${client.clientName}`, collect: 'Collecting sample', done: 'Sample collected!' }[stepId];

  return (
    <div onClick={onClick} className="relative w-full overflow-hidden cursor-pointer" style={{ height: 100 }}>

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
          className="absolute opacity-85 pointer-events-auto"
          style={{
            border: 0,
            top: -40,
            left: -40,
            width: 'calc(100% + 80px)',
            height: 'calc(100% + 80px)'
          }}
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
          className="bg-white text-[10px] font-black text-red-600 px-1.5 py-[2px] rounded-md shadow-md mb-0.5 whitespace-nowrap border border-red-100"
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
              style={{ backgroundColor: `rgb(${steps.find(s=>s.id==='going').glowColor})` }} />
            <div className="absolute -inset-2 rounded-full opacity-15 animate-ping-fast"
              style={{ backgroundColor: `rgb(${steps.find(s=>s.id==='going').glowColor})`, animationDelay: '0.5s' }} />
          </>
        )}
        {stepId === 'near' && (
          <div className="absolute -inset-3 rounded-full opacity-25 animate-ping-slow"
            style={{ backgroundColor: `rgb(${steps.find(s=>s.id==='near').glowColor})` }} />
        )}

        {/* Collector callout bubble (above rider) */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div
            className="bg-white text-[9px] font-black px-1.5 py-[2px] rounded-md shadow-md border flex items-center gap-0.5"
            style={{
              borderColor: stepId === 'going' ? 'rgba(37,99,235,0.3)' :
                          stepId === 'near' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              color: stepId === 'going' ? '#1d4ed8' :
                     stepId === 'near' ? '#b45309' : '#15803d',
            }}
          >
            <span style={{ fontSize: 8 }}>🚴</span>
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
            steps.find(s => s.id === stepId)?.bgClass || 'bg-slate-600'
          }`}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50% 50% 50% 10%',
            boxShadow: `0 0 0 2px rgba(${
              steps.find(s => s.id === stepId)?.glowColor || '0,0,0'
            },0.4), 0 4px 14px rgba(0,0,0,0.25)`,
            animation: stepId === 'going' ? 'bike-bob 1.6s ease-in-out infinite' :
                       stepId === 'near'  ? 'bounce-subtle 1.2s ease-in-out infinite' : 'none',
            transform: `rotate(${
              (stepId === 'near' || stepId === 'collect' || stepId === 'deliver' || stepId === 'verify' || stepId === 'done') ? 0 : smoothBearing * 0.3
            }deg)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          {(stepId === 'near' || stepId === 'collect' || stepId === 'deliver' || stepId === 'verify' || stepId === 'done')
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

      {/* Floating Open Routes Button (Bottom Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(); // Opens routes screen
        }}
        className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 shadow-md transition-all active:scale-95 z-10"
        style={{
          borderRadius: '5px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
        }}
      >
        Open Routes
      </button>
    </div>
  );
};

// ─── Animated Stepper ─────────────────────────────────────────────────────────
const StatusStepper = ({ currentStepIndex, steps }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
    {steps.map((step, idx) => {
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

          {idx < steps.length - 1 && (
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
    collect_lab: `Collecting materials from Lab`,
    going:   `Executive is heading to ${client.clientName}`,
    near:    `Executive arrived near ${client.clientName}`,
    verify:  `Verifying identity at ${client.clientName}`,
    collect: `Collecting sample at ${client.clientName}`,
    deliver: `Delivering items to ${client.clientName}`,
    done:    `Task completed at ${client.clientName}!`,
  };
  const emojis = { collect_lab: '🏢', going: '🚴', near: '📍', verify: '🛡️', collect: '📦', deliver: '🤝', done: '✅' };
  const gradients = {
    collect_lab: 'linear-gradient(135deg,#4338ca,#6366f1)',
    going:   'linear-gradient(135deg,#1e40af,#2563eb)',
    near:    'linear-gradient(135deg,#b45309,#f59e0b)',
    verify:  'linear-gradient(135deg,#7e22ce,#a855f7)',
    collect: 'linear-gradient(135deg,#065f46,#10b981)',
    deliver: 'linear-gradient(135deg,#065f46,#10b981)',
    done:    'linear-gradient(135deg,#15803d,#22c55e)',
  };
  const glows = {
    collect_lab: '99,102,241', going: '37,99,235', near: '245,158,11', verify: '168,85,247', collect: '16,185,129', deliver: '16,185,129', done: '34,197,94',
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
  const [stepIndex, setStepIndex] = useState(client.initialStepIndex || 0);
  const [prevStepId, setPrevStepId] = useState(null);
  const [scanned, setScanned] = useState(client.initialScannedState || false);
  const [showScanner, setShowScanner] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [otp, setOtp] = useState('');
  const [signature, setSignature] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeSteps = client?.taskType === 'delivery' ? DELIVERY_STEPS : COLLECTION_STEPS;

  const [chatHistory, setChatHistory] = useState(
    client?.chatHistory || [
      { sender: 'client', text: `Hi, when will you arrive at ${client?.clientName}?`, time: '10:45 AM' },
      { sender: 'me', text: 'I am on my way, arriving in 5 mins.', time: '10:46 AM', status: 'read' }
    ]
  );

  useEffect(() => {
    if (client) {
      setChatHistory(
        client.chatHistory || [
          { sender: 'client', text: `Hi, when will you arrive at ${client.clientName}?`, time: '10:45 AM' },
          { sender: 'me', text: 'I am on my way, arriving in 5 mins.', time: '10:46 AM', status: 'read' }
        ]
      );
    }
  }, [client]);

  const handleClose = () => {
    window.lastSelectedClient = null;
    onClose();
  };

  if (!client) return null;

  // Safe fallback if out of bounds
  const currentStep = activeSteps[stepIndex] || activeSteps[activeSteps.length - 1];
  const isLastStep  = stepIndex >= activeSteps.length - 1;

  const advanceStep = () => {
    setStepIndex(currentIndex => {
      if (currentIndex < activeSteps.length - 1) {
        setPrevStepId(activeSteps[currentIndex].id);
        return currentIndex + 1;
      }
      return currentIndex;
    });
  };

  const handleNear = () => {
    setStepIndex(currentIndex => {
      if (activeSteps[currentIndex]?.id === 'going') {
        setPrevStepId(activeSteps[currentIndex].id);
        return currentIndex + 1;
      }
      return currentIndex;
    });
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      setOtpError(false);
      advanceStep();
    } else {
      setOtpError(true);
    }
  };

  const handleCollect = () => {
    window.lastSelectedClient = client;
    setCurrentScreen('scan');
  };

  const handleCompletePickup = () => {
    if (client?.taskType === 'delivery') {
      window.demoBackendLog = `WhatsApp confirmation sent to ${client.clientName} & Central Lab`;
      window.dispatchEvent(new Event('demo-otp-updated'));
      handleClose();
    } else {
      handleClose();
    }
  };

  const getActionButton = () => {
    switch (currentStep.id) {
      case 'collect_lab': return { label: 'Collect Materials', sublabel: 'At Lab', onClick: advanceStep, gradient: 'linear-gradient(135deg,#4338ca,#6366f1)', glow: '99,102,241' };
      case 'going':   return { label: 'En Route (GPS Auto-Tracking)', sublabel: 'Auto-arriving when < 200m...', onClick: null, disabled: true, gradient: 'linear-gradient(135deg,#64748b,#94a3b8)', glow: '148,163,184' };
      case 'near':    return { label: client?.taskType === 'delivery' ? 'Verify Identity' : 'Collect Sample', sublabel: client?.taskType === 'delivery' ? 'Proceed to OTP' : 'Scan barcode to verify', onClick: client?.taskType === 'delivery' ? advanceStep : handleCollect, gradient: 'linear-gradient(135deg,#065f46,#10b981)', glow: '16,185,129' };
      case 'verify':  return null; // Handled inline by OTP form
      case 'deliver': return { label: 'Confirm Delivery', sublabel: !uploadedImage ? 'Photo upload required' : 'Tap to complete handover', onClick: () => { advanceStep(); }, disabled: !uploadedImage, gradient: 'linear-gradient(135deg,#15803d,#22c55e)', glow: '34,197,94'  };
      case 'collect': return { label: 'Sample Collected ✅',  sublabel: !uploadedImage ? 'Photo upload required' : 'Tap to confirm collection', onClick: advanceStep, disabled: !uploadedImage, gradient: 'linear-gradient(135deg,#15803d,#22c55e)', glow: '34,197,94'  };
      case 'done':    return { label: client?.taskType === 'delivery' ? 'Complete Delivery 🎉' : 'Complete Pickup 🎉',   sublabel: 'All steps finished',       onClick: handleCompletePickup, gradient: 'linear-gradient(135deg,#1e40af,#2563eb)', glow: '37,99,235'  };
      default: return null;
    }
  };

  const actionBtn = getActionButton();

  return (
    <div className="absolute inset-0 bg-slate-50 z-[60] flex flex-col overflow-hidden" style={{ animation: 'slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-12 pb-3 shadow-sm z-10 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <button onClick={handleClose} className="p-2 -ml-2 shrink-0 text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-black text-slate-800 truncate leading-tight">{client.clientName}</h1>
            <span className="text-[11px] text-slate-500 font-bold mt-0.5">{client.location}</span>
          </div>
        </div>

        {/* Animated live status badge */}
        <div
          className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 ${currentStep.lightBg} ${currentStep.textClass}`}
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
      <StatusStepper currentStepIndex={stepIndex} steps={activeSteps} />

      {/* ── Notification toast ── */}
      <NotificationToast step={currentStep} client={client} prevStepId={prevStepId} />

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-44 mt-3 flex flex-col gap-3">

        {/* Map card */}
        <div className="mx-4 rounded-[5px] overflow-hidden border border-slate-200 shrink-0"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <BikeMap client={client} stepId={currentStep.id} onClick={() => setCurrentScreen('routes')} onNear={handleNear} steps={activeSteps} />

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
        <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden shrink-0" style={{ animation: 'slide-up 0.4s 0.1s both' }}>
          <div className="px-4 py-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-sm font-black text-slate-800 mb-0.5">{client.clientName}</h2>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <MapPin size={10} />
                  <span>{client.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => setShowChat(true)}
                  className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                  <img src="https://cdn-icons-png.flaticon.com/512/7637/7637102.png" alt="Chat" className="w-[24px] h-[24px] object-contain drop-shadow-sm" />
                </button>
                <a 
                  href={`tel:${client.phone || '+1234567890'}`}
                  className="p-1.5 rounded-full hover:bg-slate-50 transition-colors flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/9946/9946341.png" alt="Call" className="w-[24px] h-[24px] object-contain drop-shadow-sm" />
                </a>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
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

            <div className="flex items-center gap-2 text-xs font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-amber-800">
              <Clock size={14} className="text-amber-500 shrink-0" />
              <span>Requested at {client.time}</span>
            </div>
          </div>
        </div>

        {/* Scan/photo actions (stop → done) */}
        {client?.taskType !== 'delivery' && (currentStep.id === 'stop' || currentStep.id === 'collect' || currentStep.id === 'done') && (
          <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden shrink-0" style={{ animation: 'slide-up 0.4s 0.15s both' }}>
            <div className="px-4 py-4">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Collection Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { 
                    window.lastSelectedClient = client;
                    setCurrentScreen('scan'); 
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95 ${
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
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all active:scale-95 ${
                    uploadedImage ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                  style={{ boxShadow: uploadedImage ? '0 4px 16px rgba(16,185,129,0.2)' : 'none' }}
                >
                  {uploadedImage ? <CheckCircle2 size={22} className="mb-1.5" /> : <Camera size={22} className="mb-1.5" />}
                  <span className="font-bold text-[11px] text-center">{uploadedImage ? 'Photo Added ✓' : 'Upload Photo'}</span>
                  {!uploadedImage && <span className="text-[9px] uppercase tracking-wider font-bold mt-0.5 text-rose-500">Mandatory</span>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OTP Verification UI */}
        {currentStep.id === 'verify' && (
          <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden shrink-0 px-3 py-2.5" style={{ animation: 'slide-up 0.4s 0.15s both' }}>
            <h2 className="text-[13px] font-bold text-slate-800 mb-0.5">Verify Identity</h2>
            <p className="text-[10px] text-slate-500 mb-1.5 leading-tight">Enter the 4-digit OTP shared by the client.</p>
            <div className="flex flex-col gap-1.5">
              <input 
                type="text" 
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="____" 
                className={`text-center text-lg font-black tracking-[0.5em] py-1.5 rounded-lg border-2 outline-none transition-colors ${otpError ? 'border-red-400 bg-red-50 text-red-600 focus:border-red-500' : 'border-slate-200 focus:border-blue-500 bg-slate-50'}`}
              />
              {otpError && <p className="text-[10px] font-bold text-red-500 text-center -mt-1">Invalid OTP, try 1234</p>}
              <button 
                onClick={handleVerifyOtp}
                disabled={otp.length !== 4}
                className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold text-[11px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                style={{ boxShadow: otp.length === 4 ? '0 2px 8px rgba(147,51,234,0.3)' : 'none' }}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {/* Delivery Snapshot UI */}
        {currentStep.id === 'deliver' && (
          <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden shrink-0 p-3" style={{ animation: 'slide-up 0.4s 0.15s both' }}>
            <h2 className="text-[13px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Camera size={14} className="text-emerald-600" /> Delivery Snapshot
            </h2>
            <p className="text-[10px] text-slate-500 mb-2.5 leading-tight">Mandatory to upload a photo of the delivered materials at the client location.</p>
            {uploadedImage ? (
              <div className="relative w-full h-24 rounded-xl overflow-hidden border border-emerald-200 shadow-sm mt-1 mb-2">
                <img src={uploadedImage} alt="Uploaded snapshot" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                  <CheckCircle2 size={24} className="text-emerald-400 mb-1 shadow-sm" />
                  <span className="text-[10px] font-bold">Photo Uploaded</span>
                </div>
                <button 
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-black/70 text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl py-4 flex flex-col items-center justify-center text-slate-400 transition-colors active:scale-[0.98]"
                >
                  <Camera size={22} className="mb-1 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Tap to Upload Photo</span>
                  <span className="text-[8px] uppercase tracking-wider font-bold mt-0.5 text-slate-400">Optional</span>
                </button>
              </div>
            )}
            <button 
              onClick={() => { advanceStep(); }}
              className="mt-2.5 w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs active:scale-[0.98] transition-all"
              style={{ boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}
            >
              Confirm Delivery
            </button>
          </div>
        )}

        {/* Guidance card */}
        {!isLastStep && (
          <div
            className={`mx-4 ${currentStep.lightBg} border ${currentStep.borderClass}/30 rounded-2xl p-3 flex items-start gap-2.5 shrink-0`}
            style={{ animation: 'slide-up 0.4s 0.2s both' }}
          >
            <AlertCircle size={15} className={`${currentStep.textClass} shrink-0 mt-0.5`} />
            <div>
              <p className={`text-[11px] font-bold ${currentStep.textClass} leading-tight mb-0.5`}>
                {currentStep.fullLabel} — {currentStep.subLabel}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {currentStep.id === 'collect_lab' && 'Verify materials at the lab before departing.'}
                {currentStep.id === 'going'   && 'Tap the button below once you are within 200m of the client.'}
                {currentStep.id === 'near'    && 'Confirm your arrival and securely park your bike before entering.'}
                {currentStep.id === 'stop'    && 'Scan the sample barcode to verify the collected specimens.'}
                {currentStep.id === 'verify'  && 'Ask the client for the OTP sent to their registered mobile number.'}
                {currentStep.id === 'deliver' && 'Ensure all items are handed over securely. You may take an optional snapshot.'}
                {currentStep.id === 'collect' && 'Confirm all samples are bagged. Tap to mark as collected.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 bg-white border-t border-slate-100 flex flex-col gap-2"
        style={{ boxShadow: '0 -12px 40px rgba(0,0,0,0.06)' }}>
        
        {(currentStep.id === 'near' || currentStep.id === 'collect') && client?.taskType !== 'delivery' && (
          <button 
            onClick={() => {
              window.lastSelectedClient = client;
              setCurrentScreen('scan');
            }}
            className="w-full py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 active:scale-95 transition-all shadow-sm"
          >
            <ScanBarcode size={16} />
            <span>Scan Barcode</span>
          </button>
        )}

        {actionBtn && (
          <button
            onClick={actionBtn.onClick}
            disabled={actionBtn.disabled}
            className={`w-full py-3 rounded-xl font-bold text-xs text-white flex flex-col items-center transition-all ${
              actionBtn.disabled ? 'opacity-75 cursor-not-allowed scale-100' : 'active:scale-[0.97]'
            }`}
            style={{
              background: actionBtn.gradient,
              boxShadow: actionBtn.disabled ? 'none' : `0 6px 28px rgba(${actionBtn.glow},0.45)`,
              animation: actionBtn.disabled ? 'none' : 'btn-glow 2.5s ease-in-out infinite',
            }}
          >
            <span>{actionBtn.label}</span>
            <span className="text-[8px] font-semibold opacity-75 mt-0.5">{actionBtn.sublabel}</span>
          </button>
        )}
      </div>

      {/* ── Chat Modal ── */}
      {showChat && (
        <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-3 pt-12 pb-4 px-4 bg-blue-600 border-b border-blue-700 shadow-sm shrink-0">
            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-blue-700 rounded-full transition-colors shrink-0">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm text-white leading-tight truncate">{client.clientName}</h2>
              <p className="text-[10px] text-blue-100 font-medium">Online</p>
            </div>
            <a href={`tel:${client.phone || '+1234567890'}`} className="p-1.5 hover:bg-blue-700 rounded-full transition-colors">
              <img src="https://cdn-icons-png.flaticon.com/512/9946/9946341.png" alt="Call" className="w-[24px] h-[24px] object-contain drop-shadow-sm brightness-110" />
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[80%] ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-3 py-2 rounded-2xl shadow-sm text-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[9px] text-slate-400 font-medium">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <CheckCheck size={12} className={msg.status === 'read' ? 'text-blue-500' : 'text-slate-400'} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0 pb-6 relative">
            {showAttachMenu && (
              <div className="absolute bottom-full left-4 mb-2 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-2 flex flex-col gap-1 w-44 animate-fade-in-up z-10 origin-bottom-left">
                <button 
                  onClick={() => setShowAttachMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 text-sm font-medium w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  Document
                </button>
                <button 
                  onClick={() => setShowAttachMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 text-sm font-medium w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <ImageIcon size={16} />
                  </div>
                  Photos
                </button>
                <button 
                  onClick={() => setShowAttachMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 text-sm font-medium w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Camera size={16} />
                  </div>
                  Camera
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-2 py-1.5 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all relative z-20">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-1.5 rounded-full transition-colors shrink-0 ${showAttachMenu ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <Paperclip size={18} />
              </button>
              <input 
                type="text"
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder-slate-400 w-full min-w-0 px-1"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMsg.trim()) {
                    setChatHistory([...chatHistory, { sender: 'me', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' }]);
                    setChatMsg('');
                  }
                }}
              />
              <button 
                onClick={() => {
                  if (chatMsg.trim()) {
                    setChatHistory([...chatHistory, { sender: 'me', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' }]);
                    setChatMsg('');
                  }
                }}
                className={`p-2 rounded-full transition-colors shrink-0 ${chatMsg.trim() ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" xmlSpace="preserve" className="w-[16px] h-[16px] ml-0.5">
                  <path d="M2.1,44.5l4.4-16.3h18.6c0.5,0,1-0.5,1-1v-2c0-0.5-0.5-1-1-1H6.5l-4.3-16l0,0C2.1,8,2,7.7,2,7.4
                    C2,6.7,2.7,6,3.5,6.1c0.2,0,0.3,0.1,0.5,0.1l0,0l0,0l0,0l45,18.5c0.6,0.2,1,0.8,1,1.4s-0.4,1.1-0.9,1.3l0,0L4,46.4l0,0
                    c-0.2,0.1-0.4,0.1-0.6,0.1C2.6,46.4,2,45.8,2,45C2,44.8,2,44.7,2.1,44.5L2.1,44.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── WhatsApp Success Modal ── rendered here where state is in scope ── */}
      {showWhatsAppModal && (
        <div className="absolute inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#25D366]"></div>
            <div className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 relative">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#25D366]" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 size={18} className="text-[#25D366]" />
              </div>
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Delivery Confirmed! ✅</h2>
            <p className="text-sm font-medium text-slate-500 mb-5 leading-relaxed">
              WhatsApp notification sent to <strong className="text-slate-700">{client.clientName}</strong> &amp; <strong className="text-slate-700">Central Lab</strong>.
            </p>
            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Client Received Confirmation</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Lab Received Handover Status</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
