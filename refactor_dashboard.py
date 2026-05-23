import re
import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
with open(dash_path, 'r') as f:
    content = f.read()

# We need to extract the parts and create new components.
# Let's start with OperationalHighlights
# We need everything from {/* METRICS BACKLOG ROW to {/* 12-COLUMN CORE WORKSPACE GRID */}
op_high_start = content.find("{/* METRICS BACKLOG ROW")
grid_start = content.find("{/* 12-COLUMN CORE WORKSPACE GRID */}")

op_highlights_jsx = content[op_high_start:grid_start].strip()

# Operational Analytics Chart
# From {/* NEW GRAPH: OPERATIONAL ANALYTICS CARD */} to {/* QUICK STATS - SUMMARY SUBGRID */}
op_chart_start = content.find("{/* NEW GRAPH: OPERATIONAL ANALYTICS CARD */}")
quick_stats_start = content.find("{/* QUICK STATS - SUMMARY SUBGRID */}")

op_chart_jsx = content[op_chart_start:quick_stats_start].strip()

# Summary Subgrid
# From {/* QUICK STATS - SUMMARY SUBGRID */} to {/* A. SALES ORDER SUMMARY
sales_summary_start = content.find("{/* A. SALES ORDER SUMMARY")

summary_subgrid_jsx = content[quick_stats_start:sales_summary_start].strip()

# Sales Order Summary
# From {/* A. SALES ORDER SUMMARY to {/* SIDE ZONE: RIGHT COLUMN (4 Columns) */}
# Actually it goes until the end of col-main which is before col-side.
col_side_start = content.find('<div className="col-side">')

sales_summary_jsx = content[sales_summary_start:col_side_start].strip()
# Need to remove the closing </div> of col-main if it got included.
if sales_summary_jsx.endswith('</div>\n\n          </div>'):
    sales_summary_jsx = sales_summary_jsx[:-14].strip()
elif sales_summary_jsx.endswith('</div>\n          </div>'):
    sales_summary_jsx = sales_summary_jsx[:-13].strip()

# Pending Actions Widget
# From {/* 1. UPLOADED CUSTOM WIDGET: PENDING ACTIONS to {/* 2. QUICK ACTION GRID */}
pending_start = content.find("{/* 1. UPLOADED CUSTOM WIDGET: PENDING ACTIONS")
quick_action_start = content.find("{/* 2. QUICK ACTION GRID */}")

pending_jsx = content[pending_start:quick_action_start].strip()

# Metrics Config Modal
# From {/* Modern Glassmorphic Metrics Configuration Modal */} to the end of the return statement
modal_start = content.find("{/* Modern Glassmorphic Metrics Configuration Modal */}")
modal_end = content.find("    </div>\n  );\n};")

modal_jsx = content[modal_start:modal_end].strip()

# Now write the component files
comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

def write_comp(name, imports, props, jsx):
    with open(os.path.join(comp_dir, f"{name}.tsx"), 'w') as f:
        f.write(f"import React from 'react';\n")
        f.write(f"{imports}\n\n")
        f.write(f"interface {name}Props {{\n{props}\n}}\n\n")
        f.write(f"export const {name}: React.FC<{name}Props> = (props) => {{\n")
        f.write(f"  const {{ " + ", ".join([p.split(':')[0].split('?')[0].strip() for p in props.strip().split('\n') if p]) + " }} = props;\n")
        f.write(f"  return (\n    <>\n      {jsx}\n    </>\n  );\n}};\n")

# 1. Operational Highlights
op_high_props = """
  setShowMetricsConfig: (show: boolean) => void;
  stats: any[];
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
"""
write_comp('OperationalHighlights', "import { Settings, TrendingUp, TrendingDown, Plus } from 'lucide-react';", op_high_props, op_highlights_jsx)

# 2. OperationalAnalyticsChart
op_chart_props = """
  activeMetric: 'revenue' | 'orders';
  setActiveMetric: (metric: 'revenue' | 'orders') => void;
  chartRange: '7d' | '30d';
  setChartRange: (range: '7d' | '30d') => void;
  chartData: any[];
  maxVal: number;
  svgWidth: number;
  svgHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  points: any[];
  fillPath: string;
  splinePath: string;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
"""
write_comp('OperationalAnalyticsChart', "import { TrendingUp } from 'lucide-react';", op_chart_props, op_chart_jsx)

# 3. SummarySubgrid
summary_props = """
"""
write_comp('SummarySubgrid', "import { DollarSign, Search, Clock, CheckCircle } from 'lucide-react';", summary_props, summary_subgrid_jsx)

# 4. SalesOrderSummary
sales_props = """
  activeOrderTab: string;
  setActiveOrderTab: (tab: any) => void;
  salesOrders: any[];
"""
write_comp('SalesOrderSummary', "import { Layers, ChevronRight } from 'lucide-react';", sales_props, sales_summary_jsx)

# 5. PendingActionsWidget
pending_props = """
  capsuleTab: 'pending' | 'activities';
  setCapsuleTab: (tab: 'pending' | 'activities') => void;
  topVendors: any[];
"""
write_comp('PendingActionsWidget', "import { Inbox, CheckCircle, TrendingUp, TrendingDown, Star, ChevronRight } from 'lucide-react';\nimport { dynamicActivities } from '../utils/mockData';", pending_props, pending_jsx)

# 6. MetricsConfigModal
modal_props = """
  showMetricsConfig: boolean;
  setShowMetricsConfig: (show: boolean) => void;
  activeMetricIds: string[];
  setActiveMetricIds: React.Dispatch<React.SetStateAction<string[]>>;
  allMetrics: any[];
  setAllMetrics: React.Dispatch<React.SetStateAction<any[]>>;
  customMetricLabel: string;
  setCustomMetricLabel: (val: string) => void;
  customMetricValue: string;
  setCustomMetricValue: (val: string) => void;
  customMetricChange: string;
  setCustomMetricChange: (val: string) => void;
  customMetricIsPositive: boolean;
  setCustomMetricIsPositive: (val: boolean) => void;
  customMetricIcon: string;
  setCustomMetricIcon: (val: string) => void;
  customMetricColor: string;
  setCustomMetricColor: (val: string) => void;
"""
write_comp('MetricsConfigModal', "import { X, AlertTriangle, Trash2, Plus, PieChart, BarChart } from 'lucide-react';\nimport { ICON_MAP } from '../utils/mockData';", modal_props, modal_jsx)

print("Components successfully generated!")
