import React from 'react';
import { motion } from 'framer-motion';
import { PerspectiveCard } from './PerspectiveCard';
import { PipelineViewer } from './PipelineViewer';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ModelInfoPanel } from './ModelInfoPanel';
import type { ChatMessage } from '@/lib/types';
import { Paperclip, ShieldAlert } from 'lucide-react';

interface MessageViewProps {
  message: ChatMessage;
}

export const MessageView: React.FC<MessageViewProps> = ({ message }) => {
  const isBlocked = message.perspectives.length === 1 && message.perspectives[0].type === 'technical' && message.perspectives[0].content.startsWith('⚠️');

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* User prompt */}
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm">{message.prompt}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.attachments.map((a, i) => (
                <span key={i} className="text-[10px] bg-primary-foreground/20 rounded px-2 py-0.5 flex items-center gap-1">
                  <Paperclip className="w-2.5 h-2.5" />{a.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blocked message */}
      {isBlocked && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">Prompt Blocked</p>
            <p className="text-xs text-muted-foreground mt-1">{message.perspectives[0].content}</p>
          </div>
        </div>
      )}

      {!isBlocked && (
        <>
          {/* Model Info */}
          {message.pipeline.length > 0 && <ModelInfoPanel />}

          {/* Pipeline */}
          {message.pipeline.length > 0 && <PipelineViewer steps={message.pipeline} />}

          {/* Analytics Dashboard */}
          {message.pipeline.length > 0 && <AnalyticsDashboard pipeline={message.pipeline} />}

          {/* Perspectives */}
          {message.perspectives.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider">5 Perspectives</h4>
              {message.perspectives.map((p, i) => (
                <PerspectiveCard key={p.type} perspective={p} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
