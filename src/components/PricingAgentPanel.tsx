import { DollarSign, PieChart, BarChart3 } from 'lucide-react';

interface PricingBreakdown {
  sku: string;
  quantity: number;
  materialPrice: number;
  testCost: number;
  total: number;
}

const mockPricing: PricingBreakdown[] = [
  {
    sku: 'WC-11000-CU-XLPE',
    quantity: 25000,
    materialPrice: 13000000,
    testCost: 15000,
    total: 13015000,
  },
  {
    sku: 'WC-11000-AL-XLPE',
    quantity: 5000,
    materialPrice: 1751250,
    testCost: 15000,
    total: 1766250,
  },
];

export default function PricingAgentPanel() {
  const grandTotal = mockPricing.reduce((sum, item) => sum + item.total, 0);
  const totalMaterial = mockPricing.reduce((sum, item) => sum + item.materialPrice, 0);
  const totalTest = mockPricing.reduce((sum, item) => sum + item.testCost, 0);

  const materialPercentage = (totalMaterial / grandTotal) * 100;
  const testPercentage = (totalTest / grandTotal) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/50">
            <DollarSign className="w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Pricing Agent</h2>
          <p className="text-sm text-gray-400">Cost Analysis & Quote Generation</p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 text-xs font-semibold">
          🟢 ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Cost Breakdown</h3>
          </div>

          <div className="space-y-4">
            <CostItem
              label="Material Cost"
              value={totalMaterial}
              percentage={materialPercentage}
              color="blue"
            />
            <CostItem
              label="Testing Cost"
              value={totalTest}
              percentage={testPercentage}
              color="cyan"
            />
            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Grand Total</span>
                <span className="text-2xl font-bold text-emerald-400">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Distribution</h3>
          </div>

          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={`${materialPercentage * 4.4} 440`}
                  className="text-blue-500 transition-all duration-1000"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={`${testPercentage * 4.4} 440`}
                  strokeDashoffset={`-${materialPercentage * 4.4}`}
                  className="text-cyan-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Material ({materialPercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Testing ({testPercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Material</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Testing</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mockPricing.map((item, index) => (
              <tr
                key={item.sku}
                className="hover:bg-slate-800/50 transition-all duration-300"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-cyan-400">{item.sku}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gray-300">{item.quantity.toLocaleString()} m</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-white font-medium">₹{item.materialPrice.toLocaleString('en-IN')}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-white font-medium">₹{item.testCost.toLocaleString('en-IN')}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-emerald-400 font-bold">₹{item.total.toLocaleString('en-IN')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
          Forward to Orchestrator Agent →
        </button>
      </div>
    </div>
  );
}

function CostItem({ label, value, percentage, color }: { label: string; value: number; percentage: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-white">₹{value.toLocaleString('en-IN')}</span>
      </div>
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</div>
    </div>
  );
}
