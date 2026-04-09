export type PerspectiveType = 'technical' | 'educational' | 'creative' | 'business' | 'scientific';

export interface PerspectiveResponse {
  type: PerspectiveType;
  label: string;
  icon: string;
  content: string;
  isStreaming: boolean;
}

export interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  model: string;
  startTime?: number;
  endTime?: number;
  tokensUsed?: number;
  confidence?: number;
  risk?: 'low' | 'medium' | 'high';
  rawJson?: Record<string, unknown>;
  output?: string;
}

export interface ChatMessage {
  id: string;
  prompt: string;
  attachments?: FileAttachment[];
  perspectives: PerspectiveResponse[];
  pipeline: PipelineStep[];
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  content?: string;
}

export const PERSPECTIVES: { type: PerspectiveType; label: string; icon: string; color: string }[] = [
  { type: 'technical', label: 'Technical', icon: '⚙️', color: 'perspective-technical' },
  { type: 'educational', label: 'Educational', icon: '📚', color: 'perspective-educational' },
  { type: 'creative', label: 'Creative', icon: '🎨', color: 'perspective-creative' },
  { type: 'business', label: 'Business', icon: '💼', color: 'perspective-business' },
  { type: 'scientific', label: 'Scientific', icon: '🔬', color: 'perspective-scientific' },
];

export const PIPELINE_STEPS_TEMPLATE: Omit<PipelineStep, 'id'>[] = [
  { name: 'Input Analysis & Preprocessing', status: 'pending', model: 'gemini-2.5-flash' },
  { name: 'Context Enrichment & Expansion', status: 'pending', model: 'gemini-2.5-flash-lite' },
  { name: 'Output Generation', status: 'pending', model: 'gemini-3-flash-preview' },
  { name: 'Multi-Perspective Generation', status: 'pending', model: 'gemini-3-flash-preview' },
  { name: 'Quality & Completeness Analysis', status: 'pending', model: 'gemini-2.5-pro' },
  { name: 'Validation & Confidence Scoring', status: 'pending', model: 'gpt-5-mini' },
  { name: 'Advanced Reasoning & Synthesis', status: 'pending', model: 'gpt-5' },
  { name: 'Final Review & Risk Assessment', status: 'pending', model: 'gemini-3.1-pro-preview' },
];

export interface ModelInfo {
  id: string;
  displayName: string;
  provider: string;
  role: string;
  description: string;
  apiKeyUsed: string;
}

export const AI_MODELS: ModelInfo[] = [
  { id: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', provider: 'Google', role: 'Input Analyzer', description: 'Fast preprocessing, intent detection, and topic extraction', apiKeyUsed: 'LOVABLE_API_KEY' },
  { id: 'gemini-2.5-flash-lite', displayName: 'Gemini 2.5 Flash Lite', provider: 'Google', role: 'Context Enricher', description: 'Lightweight context expansion, semantic analysis, and query augmentation', apiKeyUsed: 'LOVABLE_API_KEY' },
  { id: 'gemini-3-flash-preview', displayName: 'Gemini 3 Flash Preview', provider: 'Google', role: 'Output Generator', description: 'Primary response generation and multi-perspective content creation', apiKeyUsed: 'LOVABLE_API_KEY' },
  { id: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro', provider: 'Google', role: 'Quality Analyzer', description: 'Deep analysis of output quality, completeness, and coherence', apiKeyUsed: 'LOVABLE_API_KEY' },
  { id: 'gpt-5-mini', displayName: 'GPT-5 Mini', provider: 'OpenAI', role: 'Validator & Scorer', description: 'Cross-model validation, confidence scoring, and risk assessment', apiKeyUsed: 'LOVABLE_API_KEY' },
  { id: 'gpt-5', displayName: 'GPT-5', provider: 'OpenAI', role: 'Advanced Reasoner', description: 'Complex reasoning, deep synthesis of all perspectives into a unified analysis', apiKeyUsed: 'LOVABLE_API_KEY' },
  { id: 'gemini-3.1-pro-preview', displayName: 'Gemini 3.1 Pro Preview', provider: 'Google', role: 'Final Reviewer', description: 'Final review pass, risk assessment, and overall pipeline quality gate', apiKeyUsed: 'LOVABLE_API_KEY' },
];
