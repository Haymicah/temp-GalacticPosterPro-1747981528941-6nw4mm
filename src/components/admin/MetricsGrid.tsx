import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.FC<{ className?: string }>;
  color?: string;
}

function MetricCard({ title, value, change, icon: Icon, color = 'terminal-green' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-terminal-darkGreen p-4 rounded-lg",
        "border border-terminal-green/20"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 text-${color}`} />
        {typeof change !== 'undefined' && (
          <div className={cn(
            "flex items-center space-x-1 text-xs px-2 py-1 rounded",
            change >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {change >= 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm opacity-75">{title}</h3>
      <div className="text-xl font-bold mt-1">{value}</div>
    </motion.div>
  );
}

interface MetricsGridProps {
  metrics: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.FC<{ className?: string }>;
    color?: string;
  }[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}