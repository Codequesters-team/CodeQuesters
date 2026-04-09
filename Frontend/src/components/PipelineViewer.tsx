import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, AlertTriangle, ChevronDown, ChevronUp, Shield, Activity, Zap } from 'lucide-react';
import type { PipelineStep } from '@/lib/types';

interface PipelineViewerProps {
  steps: PipelineStep[];
}

const StatusIcon: React.FC<{ status: PipelineStep['status'] }> = ({ status }) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-4 h-4 text-success" />;
    case 'running': return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default: return <Circle className="w-4 h-4 text-muted-foreground" />;
  }
};

const RiskBadge: React.FC<{ risk: PipelineStep['risk'] }> = ({ risk }) => {
  if (!risk) return null;
  const colors = { low: 'bg-success/15 text-success', medium: 'bg-warning/15 text-warning', high: 'bg-destructive/15 text-destructive' };
  return <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${colors[risk]}`}>{risk.toUpperCase()}</span>;
};

export const PipelineViewer: React.FC<PipelineViewerProps> = ({ steps }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const totalTokens = steps.reduce((sum, s) => sum + (s.tokensUsed || 0), 0);
  const avgConfidence = steps.filter(s => s.confidence).length > 0
    ? (steps.reduce((sum, s) => sum + (s.confidence || 0), 0) / steps.filter(s => s.confidence).length * 100).toFixed(1)
    : '—';

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Pipeline Execution
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{totalTokens} tokens</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{avgConfidence}% conf</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
            >
              <span className="text-xs text-muted-foreground font-mono w-5">{i + 1}</span>
              <StatusIcon status={step.status} />
              <span className="text-sm font-medium flex-1">{step.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{step.model}</span>
              {step.tokensUsed && <span className="text-[10px] font-mono text-muted-foreground">{step.tokensUsed}t</span>}
              <RiskBadge risk={step.risk} />
              {expandedStep === step.id ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {expandedStep === step.id && step.rawJson && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 pl-12">
                    <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Tokens</span>
                        <p className="font-mono font-semibold text-foreground">{step.tokensUsed || 0}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Confidence</span>
                        <p className="font-mono font-semibold text-foreground">{step.confidence ? `${(step.confidence * 100).toFixed(1)}%` : '—'}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <span className="text-muted-foreground">Duration</span>
                        <p className="font-mono font-semibold text-foreground">
                          {step.startTime && step.endTime ? `${((step.endTime - step.startTime) / 1000).toFixed(2)}s` : '—'}
                        </p>
                      </div>
                    </div>
                    <details className="group">
                      <summary className="text-[10px] font-mono text-muted-foreground cursor-pointer hover:text-foreground">Raw Analytics JSON</summary>
                      <pre className="mt-1 text-[10px] font-mono bg-foreground/5 rounded-lg p-3 overflow-x-auto text-foreground/80 max-h-[200px] overflow-y-auto">
                        {JSON.stringify(step.rawJson, null, 2)}
                      </pre>
                    </details>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
