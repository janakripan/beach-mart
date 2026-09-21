import { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer   = setTimeout(() => setExiting(true), 2000);
    const finishTimer = setTimeout(() => onFinish(), 2700);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        @keyframes splashSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes splashPulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1;    }
        }

        /* Rotating arc of light — conic gradient masked into a thin ring */
        .sp-arc {
          animation: splashSpin 3s linear infinite;
          background: conic-gradient(
            from 0deg,
            rgba(52, 199, 89, 0.0)  0%,
            rgba(52, 199, 89, 0.5) 30%,
            rgba(52, 199, 89, 1.0) 50%,
            rgba(52, 199, 89, 0.5) 70%,
            rgba(52, 199, 89, 0.0) 100%
          );
          /* Mask: hide interior, keep only the outer ring band */
          -webkit-mask: radial-gradient(circle, transparent calc(100% - 4px), black calc(100% - 4px));
                  mask: radial-gradient(circle, transparent calc(100% - 4px), black calc(100% - 4px));
        }

        /* Soft ambient glow ring that breathes */
        .sp-glow {
          animation: splashPulse 2.5s ease-in-out infinite;
          border-radius: 50%;
          box-shadow:
            0 0 18px 6px  rgba(52, 199, 89, 0.18),
            0 0 40px 12px rgba(52, 199, 89, 0.08);
        }

        /* Second arc — counter-spin, dimmer, adds depth */
        .sp-arc-inner {
          animation: splashSpin 5s linear infinite reverse;
          background: conic-gradient(
            from 120deg,
            rgba(52, 199, 89, 0.0) 0%,
            rgba(52, 199, 89, 0.3) 40%,
            rgba(52, 199, 89, 0.0) 80%
          );
          -webkit-mask: radial-gradient(circle, transparent calc(100% - 3px), black calc(100% - 3px));
                  mask: radial-gradient(circle, transparent calc(100% - 3px), black calc(100% - 3px));
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
          exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Logo + orbital rings container */}
        <div className="relative flex items-center justify-center">

          {/* Ambient glow — sits just outside the logo */}
          <div className="sp-glow absolute rounded-full w-[116px] h-[116px] md:w-[248px] md:h-[248px]" />

          {/* Primary rotating arc */}
          <div className="sp-arc absolute rounded-full w-[124px] h-[124px] md:w-[258px] md:h-[258px]" />

          {/* Secondary counter-rotating arc — slightly larger */}
          <div className="sp-arc-inner absolute rounded-full w-[138px] h-[138px] md:w-[276px] md:h-[276px]" />

          {/* Logo — sits above all rings */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Mobile (< md): Logo.png */}
            <img
              src="/Logo.png"
              alt="Beach Mart"
              className="block md:hidden w-20 h-auto object-contain"
              draggable="false"
            />
            {/* Tablet & desktop (≥ md): logo-big.svg */}
            <img
              src="/logo-big.svg"
              alt="Beach Mart"
              className="hidden md:block w-[200px] h-auto object-contain"
              draggable="false"
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default SplashScreen;
