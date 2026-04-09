import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatSession } from '@/lib/types';

interface HistorySidebarProps {
  open: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  open, onClose, sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground z-40" onClick={onClose} />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading font-semibold text-sm">Chat History</h2>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
            <div className="p-3">
              <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={onNewSession}>
                <Plus className="w-4 h-4" /> New Chat
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sessions.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No chat history yet</p>
              )}
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => { onSelectSession(session.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors group ${
                    activeSessionId === session.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {session.messages.length} messages · {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteSession(session.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
