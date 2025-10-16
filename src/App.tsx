import { useEffect, useState } from 'react';
import { supabase, RFP } from './lib/supabase';
import DashboardHeader from './components/DashboardHeader';
import SalesAgentPanel from './components/SalesAgentPanel';
import TechnicalAgentPanel from './components/TechnicalAgentPanel';
import PricingAgentPanel from './components/PricingAgentPanel';
import OrchestratorPanel from './components/OrchestratorPanel';

export default function App() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRfps();
  }, []);

  const fetchRfps = async () => {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRfps(data || []);
    } catch (error) {
      console.error('Error fetching RFPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRfps = rfps.length;
  const analyzedRfps = rfps.filter(rfp => ['analyzed', 'matched', 'priced', 'submitted'].includes(rfp.status)).length;
  const submittedRfps = rfps.filter(rfp => rfp.status === 'submitted').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading AI Agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMWUzZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6TTAgMTZjMC00LjQxOCAzLjU4Mi04IDgtOHM4IDMuNTgyIDggOC0zLjU4MiA4LTggOC04LTMuNTgyLTgtOHptMCAxOGMwLTQuNDE4IDMuNTgyLTggOC04czggMy41ODIgOCA4LTMuNTgyIDgtOCA4LTgtMy41ODItOC04em0zNiAwYzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6bS0xOCAwYzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader
          totalRfps={totalRfps}
          analyzedRfps={analyzedRfps}
          submittedRfps={submittedRfps}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesAgentPanel rfps={rfps} />
          <TechnicalAgentPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PricingAgentPanel />
          <OrchestratorPanel />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-20">
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
