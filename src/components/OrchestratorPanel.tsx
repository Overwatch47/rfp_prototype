import { Brain, CheckCircle, Clock, Send, Activity, Download, FileText, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import ChatInterface from './ChatInterface';
import { generateDraftJSON, generatePDFContent, downloadFile, downloadPDF } from '../utils/reportGenerator';
import { RFPReportData } from '../utils/reportGenerator';

interface AgentStatus {
  name: string;
  action: string;
  status: 'completed' | 'processing' | 'pending';
  icon: string;
}

const agentStatuses: AgentStatus[] = [
  {
    name: 'Sales Agent',
    action: 'RFP Identified & Summarized',
    status: 'completed',
    icon: '📡',
  },
  {
    name: 'Technical Agent',
    action: 'Spec Matching Complete',
    status: 'completed',
    icon: '🔍',
  },
  {
    name: 'Pricing Agent',
    action: 'Cost Analysis Finalized',
    status: 'completed',
    icon: '💰',
  },
];

export default function OrchestratorPanel() {
  const [showChat, setShowChat] = useState(false);

  const mockReportData: RFPReportData = {
    rfp: {
      id: '1',
      title: 'Industrial Cable Supply - Mumbai Metro Phase 3',
      source: 'https://mahadiscom.procurement.gov.in',
      due_date: '2025-11-15',
      scope: 'Supply of 11kV XLPE insulated power cables for metro underground sections. Total requirement: 25,000 meters.',
      requirements: 'Voltage: 11kV, Conductor: Copper, Insulation: XLPE, IS 7098 Part 2 compliant, Flame retardant',
      testing_needs: 'Type tests: High voltage test, Partial discharge test, Fire resistance test',
      status: 'matched',
      match_percentage: 94.5,
      total_price: 14781250,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    selectedProducts: [
      {
        sku: 'WC-11000-CU-XLPE',
        quantity: 25000,
        materialCost: 13000000,
        testCost: 15000,
        total: 13015000,
      },
      {
        sku: 'WC-11000-AL-XLPE',
        quantity: 5000,
        materialCost: 1751250,
        testCost: 15000,
        total: 1766250,
      },
    ],
    totalPrice: 14781250,
    matchPercentage: 94.5,
    timestamp: new Date().toISOString(),
  };

  const handleGeneratePDF = () => {
    const htmlContent = generatePDFContent(mockReportData);
    const filename = `RFP_Response_${mockReportData.rfp.title.replace(/\s+/g, '_')}_${new Date().getTime()}.html`;
    downloadFile(htmlContent, filename, 'text/html');

    const printWindow = window.open();
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  const handleSaveDraft = () => {
    const draftContent = generateDraftJSON(mockReportData);
    const filename = `RFP_Draft_${mockReportData.rfp.title.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
    downloadFile(draftContent, filename, 'application/json');
  };

  const handleGenerateFinalResponse = () => {
    const htmlContent = generatePDFContent(mockReportData);
    const filename = `RFP_Final_Response_${mockReportData.rfp.title.replace(/\s+/g, '_')}_${new Date().getTime()}.html`;
    downloadFile(htmlContent, filename, 'text/html');

    const printWindow = window.open();
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/50">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Main Orchestrator Agent</h2>
            <p className="text-sm text-gray-400">Response Consolidation & Coordination</p>
          </div>
          <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-xs font-semibold">
            🟣 ORCHESTRATING
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Agent Collaboration Log</h3>
          </div>

          <div className="space-y-3">
            {agentStatuses.map((agent, index) => (
              <div
                key={agent.name}
                className="flex items-start gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-purple-500/30 transition-all duration-300"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <span className="text-2xl">{agent.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{agent.name}</span>
                    <StatusIcon status={agent.status} />
                  </div>
                  <p className="text-xs text-gray-400">{agent.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Response Summary</h3>
          </div>

          <div className="space-y-3">
            <SummaryItem label="RFP" value="Mumbai Metro Phase 3" />
            <SummaryItem label="Selected Products" value="2 SKUs" />
            <SummaryItem label="Total Quantity" value="30,000 meters" />
            <SummaryItem label="Match Accuracy" value="94.5%" highlight />
            <SummaryItem label="Response Time" value="2.3 minutes" />
            <div className="pt-3 border-t border-slate-700">
              <SummaryItem label="Total Quote" value="₹14,781,250" highlight large />
            </div>
          </div>
        </div>
      </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white mb-1">Submission Deadline</h4>
              <p className="text-xs text-gray-400">Due: November 15, 2025 (30 days remaining)</p>
            </div>
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
              <span className="text-sm font-bold text-emerald-400">Ready</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={handleGenerateFinalResponse} className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              <span>Generate Final RFP Response</span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleGeneratePDF} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-gray-300 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button onClick={handleSaveDraft} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-gray-300 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1">
              <FileText className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-1">AI Insight</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Based on historical data, this configuration has a 92% success probability.
                Consider adding value-added services like expedited delivery for competitive advantage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showChat && <ChatInterface />}

      <button
        onClick={() => setShowChat(!showChat)}
        className={`w-full px-4 py-3 ${
          showChat
            ? 'bg-slate-800/50 border border-slate-700'
            : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30'
        } text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
      >
        <MessageCircle className="w-5 h-5" />
        {showChat ? 'Hide Chat' : 'Open Agent Chat'}
      </button>
    </div>
  );
}

function StatusIcon({ status }: { status: 'completed' | 'processing' | 'pending' }) {
  if (status === 'completed') {
    return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  }
  if (status === 'processing') {
    return (
      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    );
  }
  return <Clock className="w-4 h-4 text-gray-500" />;
}

function SummaryItem({ label, value, highlight = false, large = false }: { label: string; value: string; highlight?: boolean; large?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`font-semibold ${large ? 'text-xl' : 'text-sm'} ${
        highlight ? 'text-purple-400' : 'text-white'
      }`}>
        {value}
      </span>
    </div>
  );
}
