import React from 'react';
import { mediSparkOfficialLogo } from '../assets/images';

interface MediSparkLogoProps {
  variant?: 'full' | 'compact' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const MediSparkLogo: React.FC<MediSparkLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick,
}) => {
  const heightClass =
    size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-10 md:h-11';

  return (
    <div
      id="medispark-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2 cursor-pointer select-none group transition-transform duration-200 active:scale-98 ${className}`}
      aria-label="MediSpark — Together we Achieve Dream"
    >
      {/* Official MediSpark Stethoscope Logo */}
      <div className="relative flex items-center shrink-0">
        <div className="rounded-xl bg-black/90 p-1 shadow-[0_0_20px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_28px_rgba(229,9,20,0.7)] transition-all overflow-hidden border border-red-950/40">
          <img
            src={mediSparkOfficialLogo}
            alt="MediSpark — Together we Achieve Dream"
            referrerPolicy="no-referrer"
            className={`${heightClass} w-auto object-contain rounded-lg`}
          />
        </div>
      </div>
    </div>
  );
};

