import re

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
with open(dash_path, 'r') as f:
    content = f.read()

# Replace the giant mock data block with an import
mock_data_start = content.find("const ICON_MAP")
mock_data_end = content.find("// List of all metrics")

import_statement = """import { WelcomeBanner } from '../components/WelcomeBanner';
import { OperationalHighlights } from '../components/OperationalHighlights';
import { OperationalAnalyticsChart } from '../components/OperationalAnalyticsChart';
import { SummarySubgrid } from '../components/SummarySubgrid';
import { SalesOrderSummary } from '../components/SalesOrderSummary';
import { PendingActionsWidget } from '../components/PendingActionsWidget';
import { MetricsConfigModal } from '../components/MetricsConfigModal';
import { 
  ICON_MAP, 
  DEFAULT_ALL_METRICS, 
  chartData7d, 
  chartData30d, 
  topSellingItems, 
  topStockedItems, 
  salesOrders, 
  topVendors, 
  receiveHistory, 
  dynamicActivities 
} from '../utils/mockData';
"""

# 1. Strip out the mock data
content = content[:mock_data_start] + import_statement + "\n  " + content[mock_data_end:]

# 2. Replace WelcomeBanner
banner_start = content.find('<div style={{')
banner_end = content.find('{/* METRICS BACKLOG ROW')
content = content[:banner_start] + "<WelcomeBanner business={business} loading={loading} refreshData={refreshData} />\n\n        " + content[banner_end:]

# 3. Replace OperationalHighlights
op_high_start = content.find('{/* METRICS BACKLOG ROW')
grid_start = content.find('{/* 12-COLUMN CORE WORKSPACE GRID */}')
content = content[:op_high_start] + "<OperationalHighlights setShowMetricsConfig={setShowMetricsConfig} stats={stats} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />\n\n        " + content[grid_start:]

# 4. Replace OperationalAnalyticsChart
op_chart_start = content.find('{/* NEW GRAPH: OPERATIONAL ANALYTICS CARD */}')
quick_stats_start = content.find('{/* QUICK STATS - SUMMARY SUBGRID */}')
op_chart_tag = "<OperationalAnalyticsChart activeMetric={activeMetric} setActiveMetric={setActiveMetric} chartRange={chartRange} setChartRange={setChartRange} chartData={chartData} maxVal={maxVal} svgWidth={svgWidth} svgHeight={svgHeight} paddingLeft={paddingLeft} paddingRight={paddingRight} paddingTop={paddingTop} paddingBottom={paddingBottom} points={points} fillPath={fillPath} splinePath={splinePath} hoveredIdx={hoveredIdx} setHoveredIdx={setHoveredIdx} />\n\n            "
content = content[:op_chart_start] + op_chart_tag + content[quick_stats_start:]

# 5. Replace SummarySubgrid
quick_stats_start = content.find('{/* QUICK STATS - SUMMARY SUBGRID */}')
sales_summary_start = content.find('{/* A. SALES ORDER SUMMARY')
content = content[:quick_stats_start] + "<SummarySubgrid />\n\n            " + content[sales_summary_start:]

# 6. Replace SalesOrderSummary
sales_summary_start = content.find('{/* A. SALES ORDER SUMMARY')
col_side_start = content.find('<div className="col-side">')
# the closing div of col-main is right before col-side_start
end_col_main = content.rfind('</div>', sales_summary_start, col_side_start)
content = content[:sales_summary_start] + "<SalesOrderSummary activeOrderTab={activeOrderTab} setActiveOrderTab={setActiveOrderTab} salesOrders={salesOrders} />\n\n          </div>\n\n          " + content[col_side_start:]

# 7. Replace PendingActionsWidget
col_side_start = content.find('<div className="col-side">')
pending_start = content.find('{/* 1. UPLOADED CUSTOM WIDGET')
quick_action_start = content.find('{/* 2. QUICK ACTION GRID */}')
content = content[:pending_start] + "<PendingActionsWidget capsuleTab={capsuleTab} setCapsuleTab={setCapsuleTab} topVendors={topVendors} />\n\n            " + content[quick_action_start:]

# 8. Replace MetricsConfigModal
modal_start = content.find('{/* Modern Glassmorphic Metrics Configuration Modal */}')
modal_end = content.find('    </div>\n  );\n};')
modal_tag = """<MetricsConfigModal 
        showMetricsConfig={showMetricsConfig} 
        setShowMetricsConfig={setShowMetricsConfig} 
        activeMetricIds={activeMetricIds} 
        setActiveMetricIds={setActiveMetricIds} 
        allMetrics={allMetrics} 
        setAllMetrics={setAllMetrics} 
        customMetricLabel={customMetricLabel} 
        setCustomMetricLabel={setCustomMetricLabel} 
        customMetricValue={customMetricValue} 
        setCustomMetricValue={setCustomMetricValue} 
        customMetricChange={customMetricChange} 
        setCustomMetricChange={setCustomMetricChange} 
        customMetricIsPositive={customMetricIsPositive} 
        setCustomMetricIsPositive={setCustomMetricIsPositive} 
        customMetricIcon={customMetricIcon} 
        setCustomMetricIcon={setCustomMetricIcon} 
        customMetricColor={customMetricColor} 
        setCustomMetricColor={setCustomMetricColor} 
      />\n"""
content = content[:modal_start] + modal_tag + content[modal_end:]

with open(dash_path, 'w') as f:
    f.write(content)

print("DashboardPage.tsx successfully assembled!")
