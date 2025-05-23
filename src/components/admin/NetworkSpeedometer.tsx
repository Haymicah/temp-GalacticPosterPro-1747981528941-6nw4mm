import React from 'react';
import { motion } from 'framer-motion';

interface NetworkSpeedometerProps {
  value: number;
  maxValue: number;
  size: number;
}

export function NetworkSpeedometer({ value, maxValue, size }: NetworkSpeedometerProps) {
  const radius = size / 2;
  const strokeWidth = size / 20;
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  
  // Calculate the color based on the value
  const getColor = (percent: number) => {
    if (percent <= 30) return '#00FF00'; // Green
    if (percent <= 60) return '#FFFF00'; // Yellow
    if (percent <= 80) return '#FFA500'; // Orange
    return '#FF0000'; // Red
  };

  const circumference = 2 * Math.PI * (radius - strokeWidth);
  const dash = (percentage / 100) * circumference;
  const gap = circumference - dash;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress arc */}
        <motion.circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gap}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${dash} ${gap}` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Value display */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ fontSize: size / 8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-bold"
          style={{ color: getColor(percentage) }}
        >
          {value.toFixed(1)}
        </motion.div>
        <div className="text-sm opacity-75">Difficulty</div>
      </div>

      {/* Tick marks */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 left-0"
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = radius + (radius - strokeWidth * 2) * Math.cos(angle);
          const y1 = radius + (radius - strokeWidth * 2) * Math.sin(angle);
          const x2 = radius + (radius - strokeWidth * 4) * Math.cos(angle);
          const y2 = radius + (radius - strokeWidth * 4) * Math.sin(angle);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#666"
              strokeWidth={2}
            />
          );
        })}
      </svg>
    </div>
  );
}