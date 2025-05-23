import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface AffiliateButtonProps {
  onClick: () => void;
  className?: string;
}

export function AffiliateButton({ onClick, className }: AffiliateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-4 py-2",
        "bg-terminal-darkGreen rounded hover:bg-terminal-green/20",
        "border-2 border-terminal-green",
        className
      )}
    >
      <Users className="w-4 h-4" />
      <span>Join Affiliate Program</span>
    </button>
  );
}