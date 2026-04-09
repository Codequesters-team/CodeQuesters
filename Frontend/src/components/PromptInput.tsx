import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FileAttachment } from '@/lib/types';

interface PromptInputProps {
  onSubmit: (prompt: string, attachments: FileAttachment[]) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!prompt.trim() && attachments.length === 0) return;
    onSubmit(prompt.trim(), attachments);
    setPrompt('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: FileAttachment[] = [];
    for (const file of Array.from(files)) {
      const content = await file.text().catch(() => undefined);
      newAttachments.push({ name: file.name, type: file.type, size: file.size, content });
    }
    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {attachments.map((att, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
              <span className="max-w-[120px] truncate">{att.name}</span>
              <button onClick={() => removeAttachment(i)} className="hover:text-foreground transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 p-3">
        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} accept=".txt,.md,.json,.csv,.pdf,.png,.jpg,.jpeg" />
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="text-muted-foreground hover:text-primary shrink-0">
          <Paperclip className="w-5 h-5" />
        </Button>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything — get 5 perspectives with full pipeline analytics..."
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[120px] py-2"
          rows={1}
          disabled={isLoading}
        />
        <Button onClick={handleSubmit} disabled={isLoading || (!prompt.trim() && attachments.length === 0)} size="icon" className="shrink-0 rounded-full bg-primary hover:bg-primary/90">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
