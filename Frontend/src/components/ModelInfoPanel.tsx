import React from 'react';
import { AI_MODELS } from '@/lib/types';
import { Layers } from 'lucide-react';

export const ModelInfoPanel: React.FC = () => {
  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Layers className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-lg">Multi-Model Pipeline Architecture</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Each pipeline step uses a <strong>different AI model</strong> optimized for its task. The edge function (<code className="text-xs bg-muted px-1 py-0.5 rounded">ai-chat</code>) dynamically routes to the correct model per step.
      </p>
      
      <div className="space-y-3">
        {AI_MODELS.map(m => (
          <div key={m.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{m.displayName}</span>
                <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                  {m.provider}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
              <div className="text-[10px] text-muted-foreground/70 font-mono mt-2">
                Model ID: {m.id} • Key: {m.apiKeyUsed}
              </div>
            </div>
            
            <div className="shrink-0 text-right">
              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full border">
                {m.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
