import { Activity, Zap } from 'lucide-react';

interface DashboardHeaderProps {
  totalRfps: number;
  analyzedRfps: number;
  submittedRfps: number;
}

export default function DashboardHeader({ totalRfps, analyzedRfps, submittedRfps }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Zap className="w-12 h-12 text-cyan-400 animate-pulse" />
          <div className="absolute inset-0 blur-xl bg-cyan-400/30 animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Agentic AI RFP <span className="text-cyan-400">Optimizer</span>
          </h1>
          <p className="text-gray-400 mt-1">Asian Paints - Wires & Cables Division</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="RFPs Detected"
          value={totalRfps}
          color="cyan"
          icon="📡"
        />
        <MetricCard
          label="Analyzed & Matched"
          value={analyzedRfps}
          color="violet"
          icon="🔍"
        />
        <MetricCard
          label="Submitted"
          value={submittedRfps}
          color="emerald"
          icon="✓"
        />
      </div>

      <div className="mt-6 flex items-center gap-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-sm">
        <Activity className="w-8 h-8 text-cyan-400" />
        <div className="flex-1 flex items-center gap-3">
          <PipelineStep label="Identify" active />
          <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
          <PipelineStep label="Analyze" active />
          <div className="flex-1 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500"></div>
          <PipelineStep label="Match" active />
          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <PipelineStep label="Price" />
          <div className="flex-1 h-0.5 bg-slate-700"></div>
          <PipelineStep label="Submit" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    violet: 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
    emerald: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className={`text-4xl font-bold text-${color}-400`}>{value}</span>
      </div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  );
}

function PipelineStep({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
        active
          ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/50'
          : 'bg-slate-800 border-slate-600'
      }`}>
        {active && <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-cyan-400' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
