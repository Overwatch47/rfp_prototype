import { Cpu, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Product {
  sku_code: string;
  product_name: string;
  voltage: string;
  conductor_type: string;
  insulation: string;
  match_score: number;
  recommended: boolean;
}

const mockMatches: Product[] = [
  {
    sku_code: 'WC-11000-CU-XLPE',
    product_name: '11kV Copper XLPE Cable',
    voltage: '11kV',
    conductor_type: 'Copper',
    insulation: 'XLPE',
    match_score: 94.5,
    recommended: true,
  },
  {
    sku_code: 'WC-11000-AL-XLPE',
    product_name: '11kV Aluminum XLPE Cable',
    voltage: '11kV',
    conductor_type: 'Aluminum',
    insulation: 'XLPE',
    match_score: 87.2,
    recommended: true,
  },
  {
    sku_code: 'WC-6600-CU-XLPE',
    product_name: '6.6kV Copper XLPE Cable',
    voltage: '6.6kV',
    conductor_type: 'Copper',
    insulation: 'XLPE',
    match_score: 72.8,
    recommended: true,
  },
  {
    sku_code: 'WC-3300-CU-XLPE',
    product_name: '3.3kV Copper XLPE Cable',
    voltage: '3.3kV',
    conductor_type: 'Copper',
    insulation: 'XLPE',
    match_score: 58.5,
    recommended: false,
  },
];

export default function TechnicalAgentPanel() {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-violet-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-violet-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center border border-violet-500/50">
            <Cpu className="w-6 h-6 text-violet-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Technical Agent</h2>
          <p className="text-sm text-gray-400">Specification Matching & SKU Analysis</p>
        </div>
        <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-400 text-xs font-semibold">
          🟡 PROCESSING
        </div>
      </div>

      <div className="mb-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Analyzing RFP:</span>
          <span className="text-sm font-semibold text-violet-400">Mumbai Metro Phase 3</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">SKU Code</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Specs</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Match Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mockMatches.map((product, index) => (
              <tr
                key={product.sku_code}
                className={`hover:bg-slate-800/50 transition-all duration-300 group ${
                  product.recommended ? 'bg-violet-500/5' : ''
                }`}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {product.recommended && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="font-mono text-sm text-cyan-400">{product.sku_code}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-white font-medium">{product.product_name}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    <SpecBadge label={product.voltage} />
                    <SpecBadge label={product.conductor_type} />
                    <SpecBadge label={product.insulation} />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex-1 max-w-[100px]">
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            product.match_score >= 90
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                              : product.match_score >= 70
                              ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}
                          style={{ width: `${product.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${
                        product.match_score >= 90 ? 'text-emerald-400' : 'text-violet-400'
                      }`} />
                      <span className={`text-sm font-bold ${
                        product.match_score >= 90 ? 'text-emerald-400' : 'text-violet-400'
                      }`}>
                        {product.match_score}%
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Top 3 Recommendations Ready</span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50">
            Send to Pricing Agent →
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecBadge({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-gray-300">
      {label}
    </span>
  );
}
