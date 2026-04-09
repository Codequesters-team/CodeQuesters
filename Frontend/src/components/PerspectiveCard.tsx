import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { PerspectiveResponse } from '@/lib/types';
import { PERSPECTIVES } from '@/lib/types';

interface PerspectiveCardProps {
  perspective: PerspectiveResponse;
  index: number;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({ perspective, index }) => {
  const [expanded, setExpanded] = useState(true);
  const config = PERSPECTIVES.find(p => p.type === perspective.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`border-l-4 rounded-lg p-4 ${config?.color || 'perspective-technical'}`}
    >
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-2">
          <span className="text-lg">{perspective.icon}</span>
          <span className="font-heading font-semibold text-sm text-foreground">{perspective.label}</span>
          {perspective.isStreaming && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="mt-3 prose prose-sm max-w-none text-foreground/90">
          <ReactMarkdown>{perspective.content || 'Generating...'}</ReactMarkdown>
        </div>
      )}
    </motion.div>
  );
};
