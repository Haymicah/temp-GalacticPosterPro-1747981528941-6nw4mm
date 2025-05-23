import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { SystemHealth } from '../../types/admin';
import { cn } from '../../lib/utils';

interface SystemStatusProps {
  health?: SystemHealth;
}

export function SystemStatus({ health }: SystemStatusProps) {
  const status = health?.status || 'healthy';
  
  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          transition: { duration: 2, repeat: Infinity }
        }}
        className={cn(
          "w-3 h-3 rounded-full",
          status === 'healthy' && "bg-green-500",
          status === 'degraded' && "bg-yellow-500",
          status === 'critical' && "bg-red-500"
        )}
      />
      
      <div className="absolute -top-1 -right-1">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "w-5 h-5 rounded-full",
            status === 'healthy' && "bg-green-500",
            status === 'degraded' && "bg-yellow-500",
            status === 'critical' && "bg-red-500"
          )}
        />
      </div>
    </div>
  );
}