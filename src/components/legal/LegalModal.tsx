import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { legalContent } from './content';

interface LegalModalProps {
  pageId: string;
  onClose: () => void;
}

export function LegalModal({ pageId, onClose }: LegalModalProps) {
  const content = legalContent[pageId];

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-terminal-black rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-terminal-black p-4 border-b-2 border-terminal-green flex items-center justify-between">
          <h2 className="text-xl font-bold">{content.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {content.sections.map((section, index) => (
            <div key={index}>
              {section.title && (
                <h3 className="text-lg font-bold mb-3">{section.title}</h3>
              )}
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-sm opacity-75 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          <div className="text-sm opacity-75 pt-6 border-t-2 border-terminal-green/20">
            Last updated: {content.lastUpdated}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}