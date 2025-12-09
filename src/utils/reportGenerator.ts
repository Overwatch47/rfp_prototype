import { RFP } from '../lib/supabase';

export interface RFPReportData {
  rfp: RFP;
  selectedProducts: {
    sku: string;
    quantity: number;
    materialCost: number;
    testCost: number;
    total: number;
  }[];
  totalPrice: number;
  matchPercentage: number;
  timestamp: string;
}

export function generateDraftJSON(reportData: RFPReportData): string {
  const draft = {
    metadata: {
      generatedAt: reportData.timestamp,
      version: '1.0',
      status: 'draft',
    },
    rfpDetails: {
      title: reportData.rfp.title,
      source: reportData.rfp.source,
      dueDate: reportData.rfp.due_date,
      scope: reportData.rfp.scope,
      requirements: reportData.rfp.requirements,
      testingNeeds: reportData.rfp.testing_needs,
    },
    proposedSolution: {
      matchAccuracy: `${reportData.matchPercentage}%`,
      selectedSKUs: reportData.selectedProducts,
      totalQuantity: reportData.selectedProducts.reduce((sum, p) => sum + p.quantity, 0),
    },
    pricing: {
      totalMaterialCost: reportData.selectedProducts.reduce((sum, p) => sum + p.materialCost, 0),
      totalTestingCost: reportData.selectedProducts.reduce((sum, p) => sum + p.testCost, 0),
      totalPrice: reportData.totalPrice,
      currency: 'INR',
    },
    agentNotes: [
      'All selected SKUs are in stock and can be delivered within 30 days',
      'Recommended products have highest technical compatibility and cost efficiency',
      'Includes comprehensive testing as per RFP requirements',
      'Competitive pricing based on volume discounts',
    ],
  };

  return JSON.stringify(draft, null, 2);
}

export function generatePDFContent(reportData: RFPReportData): string {
  const totalMaterial = reportData.selectedProducts.reduce((sum, p) => sum + p.materialCost, 0);
  const totalTest = reportData.selectedProducts.reduce((sum, p) => sum + p.testCost, 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header .company { font-size: 14px; opacity: 0.9; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
        .info-item { background: #f5f5f5; padding: 12px; border-radius: 4px; }
        .info-label { font-size: 12px; color: #666; font-weight: bold; margin-bottom: 5px; }
        .info-value { font-size: 14px; color: #333; }
        .products-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .products-table th { background: #0f172a; color: white; padding: 12px; text-align: left; font-size: 12px; }
        .products-table td { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 13px; }
        .products-table tr:nth-child(even) { background: #f9f9f9; }
        .pricing-summary { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin-bottom: 15px; }
        .pricing-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .pricing-row.total { border-top: 1px solid #0ea5e9; padding-top: 10px; font-weight: bold; font-size: 14px; color: #0f172a; }
        .notes { background: #f5f5f5; padding: 12px; border-radius: 4px; font-size: 12px; }
        .notes li { margin-left: 20px; margin-bottom: 5px; }
        .footer { text-align: center; font-size: 11px; color: #999; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
        .match-badge { display: inline-block; background: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RFP Response Proposal</h1>
          <p class="company">Asian Paints - Wires & Cables Division</p>
          <p style="font-size: 12px; margin-top: 5px;">Generated on ${new Date(reportData.timestamp).toLocaleString()}</p>
        </div>

        <div class="section">
          <div class="section-title">RFP Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Project Title</div>
              <div class="info-value">${reportData.rfp.title}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Due Date</div>
              <div class="info-value">${new Date(reportData.rfp.due_date).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Scope</div>
            <div class="info-value">${reportData.rfp.scope}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Technical Requirements</div>
            <div class="info-value">${reportData.rfp.requirements}</div>
          </div>
          <div class="info-item" style="margin-top: 10px;">
            <div class="info-label">Testing Requirements</div>
            <div class="info-value">${reportData.rfp.testing_needs}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Proposed Solution <span class="match-badge">${reportData.matchPercentage}% Match</span></div>
          <table class="products-table">
            <thead>
              <tr>
                <th>SKU Code</th>
                <th>Quantity</th>
                <th>Material Cost</th>
                <th>Testing Cost</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.selectedProducts.map(product => `
                <tr>
                  <td>${product.sku}</td>
                  <td>${product.quantity} m</td>
                  <td>₹${product.materialCost.toLocaleString('en-IN')}</td>
                  <td>₹${product.testCost.toLocaleString('en-IN')}</td>
                  <td><strong>₹${product.total.toLocaleString('en-IN')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Pricing Summary</div>
          <div class="pricing-summary">
            <div class="pricing-row">
              <span>Total Material Cost:</span>
              <span>₹${totalMaterial.toLocaleString('en-IN')}</span>
            </div>
            <div class="pricing-row">
              <span>Total Testing Cost:</span>
              <span>₹${totalTest.toLocaleString('en-IN')}</span>
            </div>
            <div class="pricing-row total">
              <span>TOTAL PROPOSAL VALUE:</span>
              <span>₹${reportData.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Agent Recommendations</div>
          <ul class="notes">
            <li>All selected SKUs meet or exceed the technical specifications mentioned in the RFP</li>
            <li>Products are certified to Indian Standards (IS) and international compliance</li>
            <li>Delivery timeline: 30 days from order confirmation</li>
            <li>Includes comprehensive testing and quality certification</li>
            <li>Volume-based pricing offers competitive cost advantage</li>
            <li>Our technical team is available for post-delivery support and troubleshooting</li>
          </ul>
        </div>

        <div class="footer">
          <p>This is an AI-generated proposal by the Agentic AI RFP Optimizer System</p>
          <p>For inquiries, contact: sales@asianpaints.com | +91-XXXX-XXXX-XXXX</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function downloadPDF(htmlContent: string, filename: string) {
  const link = document.createElement('a');
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.onload = function () {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      const printWindow = iframe.contentWindow;
      printWindow?.print();
    }
  };

  const printHTML = `
    <html>
      <head>
        <title>${filename}</title>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          }
        </script>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;

  const printBlob = new Blob([printHTML], { type: 'text/html' });
  const printUrl = window.URL.createObjectURL(printBlob);
  link.href = printUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
