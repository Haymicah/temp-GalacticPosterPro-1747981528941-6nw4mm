import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Prediction } from '../../types/admin';
import { cn } from '../../lib/utils';

interface PredictionsListProps {
  predictions: Prediction[];
}

export function PredictionsList({ predictions }: PredictionsListProps) {
  return (
    <div className="space-y-4">
      {predictions.map((prediction, index) => (
        <motion.div
          key={prediction.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "p-4 rounded-lg",
            "bg-terminal-black/20 hover:bg-terminal-black/40 transition-colors"
          )}
        >
          <div className="flex items-start space-x-4">
            <div className={cn(
              "p-2 rounded-full",
              prediction.confidence >= 80 && "bg-green-900/20 text-green-500",
              prediction.confidence >= 50 && prediction.confidence < 80 && "bg-yellow-900/20 text-yellow-500",
              prediction.confidence < 50 && "bg-red-900/20 text-red-500"
            )}>
              {prediction.confidence >= 80 && <CheckCircle className="w-5 h-5" />}
              {prediction.confidence >= 50 && prediction.confidence < 80 && <TrendingUp className="w-5 h-5" />}
              {prediction.confidence < 50 && <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">{prediction.type}</h4>
                <div className="text-sm opacity-75">
                  Confidence: {prediction.confidence}%
                </div>
              </div>
              <p className="text-sm mt-1 opacity-75">
                {typeof prediction.prediction === 'string' 
                  ? prediction.prediction 
                  : JSON.stringify(prediction.prediction)}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs opacity-50">
                <span>Generated: {format(new Date(prediction.created_at), 'PPp')}</span>
                <span>Valid until: {format(new Date(prediction.valid_until), 'PPp')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}