import React from 'react';

interface SpotCounterProps {
  spotsClaimed: number;
  totalSpots: number | null; // null for unlimited
  className?: string;
  size?: 'small' | 'large';
}

export function SpotCounter({ spotsClaimed, totalSpots, className = "", size = "small" }: SpotCounterProps) {
  const displayText = totalSpots === null ? `${spotsClaimed}/∞` : `${spotsClaimed}/${totalSpots}`;

  return (
    <div className="bg-light-pink border-2 border-pink rounded-[30px] px-3 py-1 inline-block">
      <span className={`font-bungee ${size === 'large' ? 'text-6xl' : 'text-2xl'} ${className}`}>
        {displayText}
      </span>
    </div>
  );
}