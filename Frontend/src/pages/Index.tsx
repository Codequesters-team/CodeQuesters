import React, { useState, useRef, useEffect, useCallback } from 'react';
import { History, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromptInput } from '@/components/PromptInput';
import { MessageView } from '@/components/MessageView';
import { HistorySidebar } from '@/components/HistorySidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { processPrompt } from '@/lib/aiProcessor';
import { loadSessions, saveSessions, createSession } from '@/lib/chatStorage';
import type { ChatMessage, ChatSession, FileAttachment } from '@/lib/types';
import { PERSPECTIVES } from '@/lib/types';

const Index = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('echo-plot-theme');
    return saved === 'dark';
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('echo-plot-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (activeSession) {
      setCurrentMessages(activeSession.messages);
    }
  }, [activeSessionId]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const handleNewSession = () => {
    setActiveSessionId(null);
    setCurrentMessages([]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setCurrentMessages([]);
    }
  };

  const currentMessagesRef = useRef(currentMessages);
  useEffect(() => {
    currentMessagesRef.current = currentMessages;
  }, [currentMessages]);

  const handleSubmit = useCallback(async (prompt: string, attachments: FileAttachment[]) => {
    setIsLoading(true);

    const msgId = crypto.randomUUID();
    const newMessage: ChatMessage = {
      id: msgId,
      prompt,
      attachments,
      perspectives: PERSPECTIVES.map(p => ({
        type: p.type, label: p.label, icon: p.icon, content: '', isStreaming: false,
      })),
      pipeline: [],
      timestamp: new Date(),
    };

    setCurrentMessages(prev => [...prev, newMessage]);

    try {
      const { perspectives, pipeline } = await processPrompt(prompt, attachments, currentMessagesRef.current, (persp, pipe) => {
        setCurrentMessages(prev =>
          prev.map(m => m.id === msgId ? { ...m, perspectives: persp, pipeline: pipe } : m)
        );
      });

      const finalMessage: ChatMessage = { ...newMessage, perspectives, pipeline };

      setCurrentMessages(prev => prev.map(m => m.id === msgId ? finalMessage : m));

      // Save to session
      let sessionId = activeSessionId;
      if (!sessionId) {
        const newSession = createSession(prompt.substring(0, 50) || 'New Chat');
        newSession.messages = [finalMessage];
        setSessions(prev => [newSession, ...prev]);
        sessionId = newSession.id;
        setActiveSessionId(sessionId);
      } else {
        setSessions(prev =>
          prev.map(s =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, finalMessage], updatedAt: new Date() }
              : s
          )
        );
      }
    } catch (err) {
      console.error('Processing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(true)} className="text-muted-foreground hover:text-foreground">
            <History className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading font-bold text-lg">AI Execution Visualizer</h1>
            <p className="text-[10px] text-muted-foreground">Single prompt → 5 perspectives · Full pipeline analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentMessages.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleNewSession} className="hidden sm:flex items-center gap-1">
              <PlusCircle className="w-4 h-4" />
              New Chat
            </Button>
          )}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        </div>
      </header>

      {/* History Sidebar */}
      <HistorySidebar
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={id => { setActiveSessionId(id); }}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="font-heading font-bold text-xl mb-2">AI Multi-Perspective Chat</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask anything! One prompt generates <strong>5 perspectives</strong> (Technical, Educational, Creative, Business & Scientific) with full <strong>pipeline execution analytics</strong>, risk assessment, and token tracking.
              </p>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                📎 Attach documents or images for context-aware responses
              </p>
            </div>
          )}
          {currentMessages.map(msg => (
            <MessageView key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input */}
        <div className="sticky bottom-0 px-4 py-4 bg-gradient-to-t from-background via-background to-transparent">
          <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;
