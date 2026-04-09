import React from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { BarChart3, Zap, ShieldAlert, Activity } from 'lucide-react';
import type { PipelineStep } from '@/lib/types';

interface AnalyticsDashboardProps {
  pipeline: PipelineStep[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300', '#0088FE'];
const RISK_COLORS: Record<string, string> = { low: '#00C49F', medium: '#FFBB28', high: '#FF8042' };

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ pipeline }) => {
  const completedSteps = pipeline.filter(p => p.status === 'completed');
  if (completedSteps.length === 0) return null;

  const totalTokens = completedSteps.reduce((sum, p) => sum + (p.tokensUsed || 0), 0);

  const tokenData = completedSteps.map((p, i) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    value: p.tokensUsed || 0,
    fill: COLORS[i % COLORS.length]
  }));

  const riskCounts = completedSteps.reduce((acc, p) => {
    const r = p.risk || 'medium';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskData = Object.entries(riskCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: RISK_COLORS[name] || RISK_COLORS.medium
  }));

  const confidenceData = completedSteps.map((p, i) => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    confidence: Math.round((p.confidence || 0) * 100),
    fill: COLORS[i % COLORS.length]
  }));

  const radarData = completedSteps.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    Confidence: Math.round((p.confidence || 0) * 100),
    Reliability: Math.round(((p.confidence || 0) * 0.9 + 0.1) * 100),
  }));

  return (
    <div className="bg-card border rounded-lg overflow-hidden my-6">
      <div className="border-b px-4 py-3 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold">Pipeline Analytics</h3>
        </div>
        <div className="text-xs font-mono bg-background border px-2 py-1 rounded">
          {totalTokens.toLocaleString()} total tokens
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-8">
        {/* Token Usage Pie Chart */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-500" /> Token Usage By Step
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tokenData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {tokenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-[10px]">
             {tokenData.map((entry, i) => (
               <div key={i} className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                 {entry.name}
               </div>
             ))}
          </div>
        </div>

        {/* Confidence Bar Chart */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-green-500" /> Confidence Per Step
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(val) => val.substring(0, 10) + '...'} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Risk Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence vs Reliability Radar */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-500" /> Confidence vs Reliability
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Confidence" dataKey="Confidence" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Reliability" dataKey="Reliability" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[10px]">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-sm"/> Confidence</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"/> Reliability</div>
          </div>
        </div>
      </div>

      {/* Footer Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-t bg-muted/10">
        {completedSteps.slice(0, 4).map((p, i) => (
          <div key={p.id} className="p-4 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">{p.name.split(' ').slice(0, 2).join(' ')}</div>
            <div className="font-mono text-sm" style={{ color: COLORS[i % COLORS.length] }}>
              {p.tokensUsed}t
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round((p.confidence || 0) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
