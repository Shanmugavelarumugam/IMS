import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

with open(dash_path, 'r') as f:
    content = f.read()

op_high_start = content.find('{/* METRICS BACKLOG ROW')
grid_start = content.find('{/* 12-COLUMN CORE WORKSPACE GRID */}')

op_jsx = content[op_high_start:grid_start].strip()

with open(os.path.join(comp_dir, 'OperationalHighlights.tsx'), 'w') as f:
    f.write(f"import React from 'react';\nimport {{ Settings, TrendingUp, TrendingDown, Plus }} from 'lucide-react';\n\ninterface OperationalHighlightsProps {{\n  setShowMetricsConfig: (v: boolean) => void;\n  stats: any[];\n  hoveredCard: string | null;\n  setHoveredCard: (id: string | null) => void;\n}}\n\nexport const OperationalHighlights: React.FC<OperationalHighlightsProps> = ({{ setShowMetricsConfig, stats, hoveredCard, setHoveredCard }}) => {{\n  return (\n    <>\n      {op_jsx}\n    </>\n  );\n}};\n")

content = content[:op_high_start] + "<OperationalHighlights setShowMetricsConfig={setShowMetricsConfig} stats={stats} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />\n\n        " + content[grid_start:]

with open(dash_path, 'w') as f:
    f.write(content)

print("OperationalHighlights refactored!")
