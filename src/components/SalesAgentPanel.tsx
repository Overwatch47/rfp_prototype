import { useState } from 'react';
import { FileSearch, Calendar, Globe, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { RFP } from '../lib/supabase';

interface SalesAgentPanelProps {
  rfps: RFP[];
}

export default function SalesAgentPanel({ rfps }: SalesAgentPanelProps) {
  const [expandedRfp, setExpandedRfp] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRfp(expandedRfp === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/50">
            <FileSearch className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Sales Agent</h2>
          <p className="text-sm text-gray-400">RFP Detection & Identification</p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 text-xs font-semibold">
          🟢 ACTIVE
        </div>
      </div>

      <div className="space-y-3">
        {rfps.map((rfp) => (
          <div
            key={rfp.id}
            className="bg-slate-950/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(rfp.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                    {rfp.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs">{new URL(rfp.source).hostname}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Due: {new Date(rfp.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={rfp.status} />
                  {expandedRfp === rfp.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedRfp === rfp.id && (
              <div className="px-4 pb-4 space-y-3 animate-slideDown">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400">AI Summary</span>
                </div>

                <InfoSection label="Scope" content={rfp.scope} />
                <InfoSection label="Requirements" content={rfp.requirements} />
                <InfoSection label="Testing Needs" content={rfp.testing_needs} />

                <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50">
                  Forward to Technical Agent →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    detected: { color: 'yellow', label: 'Detected' },
    analyzed: { color: 'blue', label: 'Analyzed' },
    matched: { color: 'purple', label: 'Matched' },
    priced: { color: 'cyan', label: 'Priced' },
    submitted: { color: 'green', label: 'Submitted' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.detected;

  return (
    <span className={`px-3 py-1 bg-${config.color}-500/20 border border-${config.color}-500/50 rounded-full text-${config.color}-400 text-xs font-semibold`}>
      {config.label}
    </span>
  );
}

function InfoSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
      <h4 className="text-xs font-semibold text-gray-400 mb-1">{label}</h4>
      <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
}
