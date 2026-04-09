import type { ChatSession } from './types';

const STORAGE_KEY = 'echo-plot-chat-history';

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(title: string): ChatSession {
  return {
    id: crypto.randomUUID(),
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
