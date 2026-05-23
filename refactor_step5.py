import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

with open(dash_path, 'r') as f:
    content = f.read()

chart_start = content.find('{/* NEW GRAPH: OPERATIONAL ANALYTICS CARD */}')
sales_start = content.find('{/* A. SALES ORDER SUMMARY')
selling_start = content.find('{/* B. TOP SELLING ITEMS')
grn_start = content.find('{/* C. RECEIVE HISTORY')
col_side = content.find('<div className="col-side">')

if chart_start != -1 and sales_start != -1:
    chart_jsx = content[chart_start:sales_start].strip()
    with open(os.path.join(comp_dir, 'OperationalAnalyticsChart.tsx'), 'w') as f:
        f.write(f"import React from 'react';\nimport {{ TrendingUp }} from 'lucide-react';\n\ninterface OperationalAnalyticsChartProps {{\n  activeMetric: 'revenue' | 'orders';\n  setActiveMetric: (metric: 'revenue' | 'orders') => void;\n  chartRange: '7d' | '30d';\n  setChartRange: (range: '7d' | '30d') => void;\n  chartData: any[];\n  maxVal: number;\n  svgWidth: number;\n  svgHeight: number;\n  paddingLeft: number;\n  paddingRight: number;\n  paddingTop: number;\n  paddingBottom: number;\n  points: any[];\n  fillPath: string;\n  splinePath: string;\n  hoveredIdx: number | null;\n  setHoveredIdx: (idx: number | null) => void;\n}}\n\nexport const OperationalAnalyticsChart: React.FC<OperationalAnalyticsChartProps> = (props) => {{\n  const {{ activeMetric, setActiveMetric, chartRange, setChartRange, chartData, maxVal, svgWidth, svgHeight, paddingLeft, paddingRight, paddingTop, paddingBottom, points, fillPath, splinePath, hoveredIdx, setHoveredIdx }} = props;\n  return (\n    <>\n      {chart_jsx}\n    </>\n  );\n}};\n")

if sales_start != -1 and selling_start != -1:
    sales_jsx = content[sales_start:selling_start].strip()
    with open(os.path.join(comp_dir, 'SalesOrderSummary.tsx'), 'w') as f:
        f.write(f"import React from 'react';\nimport {{ Layers, CheckCircle, Clock }} from 'lucide-react';\nimport {{ salesOrders }} from '../utils/mockData';\n\ninterface SalesOrderSummaryProps {{\n  activeOrderTab: string;\n  setActiveOrderTab: (tab: any) => void;\n}}\n\nexport const SalesOrderSummary: React.FC<SalesOrderSummaryProps> = (props) => {{\n  const {{ activeOrderTab, setActiveOrderTab }} = props;\n  const filteredOrders = activeOrderTab === 'All' ? salesOrders : salesOrders.filter(o => o.status === activeOrderTab);\n  return (\n    <>\n      {sales_jsx}\n    </>\n  );\n}};\n")

if selling_start != -1 and grn_start != -1:
    selling_jsx = content[selling_start:grn_start].strip()
    with open(os.path.join(comp_dir, 'TopSellingItems.tsx'), 'w') as f:
        f.write(f"import React from 'react';\nimport {{ TrendingUp }} from 'lucide-react';\nimport {{ topSellingItems }} from '../utils/mockData';\n\ninterface TopSellingItemsProps {{\n  topSellingSort: 'sold' | 'revenue';\n  setTopSellingSort: (s: 'sold' | 'revenue') => void;\n}}\n\nexport const TopSellingItems: React.FC<TopSellingItemsProps> = (props) => {{\n  const {{ topSellingSort, setTopSellingSort }} = props;\n  const sortedSellingItems = [...topSellingItems].sort((a, b) => topSellingSort === 'sold' ? b.sold - a.sold : b.revenue - a.revenue);\n  return (\n    <>\n      {selling_jsx}\n    </>\n  );\n}};\n")

if grn_start != -1 and col_side != -1:
    grn_jsx = content[grn_start:col_side].strip()
    if grn_jsx.endswith('</div>'):
        grn_jsx = grn_jsx[:-6].strip()
        
    with open(os.path.join(comp_dir, 'ReceiveHistory.tsx'), 'w') as f:
        f.write(f"import React from 'react';\nimport {{ Inbox, Search }} from 'lucide-react';\nimport {{ receiveHistory }} from '../utils/mockData';\n\ninterface ReceiveHistoryProps {{\n  receiveSearch: string;\n  setReceiveSearch: (v: string) => void;\n}}\n\nexport const ReceiveHistory: React.FC<ReceiveHistoryProps> = (props) => {{\n  const {{ receiveSearch, setReceiveSearch }} = props;\n  const filteredGRN = receiveHistory.filter(r => r.product.toLowerCase().includes(receiveSearch.toLowerCase()) || r.batch.toLowerCase().includes(receiveSearch.toLowerCase()));\n  return (\n    <>\n      {grn_jsx}\n    </>\n  );\n}};\n")


content = content[:chart_start] + """<OperationalAnalyticsChart activeMetric={activeMetric} setActiveMetric={setActiveMetric} chartRange={chartRange} setChartRange={setChartRange} chartData={chartData} maxVal={maxVal} svgWidth={svgWidth} svgHeight={svgHeight} paddingLeft={paddingLeft} paddingRight={paddingRight} paddingTop={paddingTop} paddingBottom={paddingBottom} points={points} fillPath={fillPath} splinePath={splinePath} hoveredIdx={hoveredIdx} setHoveredIdx={setHoveredIdx} />
            <SalesOrderSummary activeOrderTab={activeOrderTab} setActiveOrderTab={setActiveOrderTab} />
            <TopSellingItems topSellingSort={topSellingSort} setTopSellingSort={setTopSellingSort} />
            <ReceiveHistory receiveSearch={receiveSearch} setReceiveSearch={setReceiveSearch} />
          </div>
          """ + content[col_side:]

with open(dash_path, 'w') as f:
    f.write(content)

print("Remaining components extracted!")
