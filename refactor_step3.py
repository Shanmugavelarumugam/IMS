import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

with open(dash_path, 'r') as f:
    content = f.read()

modal_start = content.find('{/* Modern Glassmorphic Metrics Configuration Modal */}')
modal_end = content.find('      })()}\n\n    </div>')

modal_jsx = content[modal_start:modal_end].strip()

# Replace ICON_MAP reference if any
modal_jsx = modal_jsx.replace("ICON_MAP[customMetricIcon]", "ICON_MAP[customMetricIcon as keyof typeof ICON_MAP]")

with open(os.path.join(comp_dir, 'MetricsConfigModal.tsx'), 'w') as f:
    f.write(f"import React from 'react';\nimport {{ X, AlertTriangle, Trash2, Plus, PieChart, BarChart }} from 'lucide-react';\nimport {{ ICON_MAP }} from '../utils/mockData';\n\ninterface MetricsConfigModalProps {{\n  showMetricsConfig: boolean;\n  setShowMetricsConfig: (show: boolean) => void;\n  activeMetricIds: string[];\n  setActiveMetricIds: React.Dispatch<React.SetStateAction<string[]>>;\n  allMetrics: any[];\n  setAllMetrics: React.Dispatch<React.SetStateAction<any[]>>;\n  customMetricLabel: string;\n  setCustomMetricLabel: (val: string) => void;\n  customMetricValue: string;\n  setCustomMetricValue: (val: string) => void;\n  customMetricChange: string;\n  setCustomMetricChange: (val: string) => void;\n  customMetricIsPositive: boolean;\n  setCustomMetricIsPositive: (val: boolean) => void;\n  customMetricIcon: string;\n  setCustomMetricIcon: (val: string) => void;\n  customMetricColor: string;\n  setCustomMetricColor: (val: string) => void;\n}}\n\nexport const MetricsConfigModal: React.FC<MetricsConfigModalProps> = (props) => {{\n  const {{ showMetricsConfig, setShowMetricsConfig, activeMetricIds, setActiveMetricIds, allMetrics, setAllMetrics, customMetricLabel, setCustomMetricLabel, customMetricValue, setCustomMetricValue, customMetricChange, setCustomMetricChange, customMetricIsPositive, setCustomMetricIsPositive, customMetricIcon, setCustomMetricIcon, customMetricColor, setCustomMetricColor }} = props;\n  return (\n    <>\n      {modal_jsx}\n    </>\n  );\n}};\n")

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
      />"""

content = content[:modal_start] + modal_tag + "\n\n" + content[modal_end+14:]

with open(dash_path, 'w') as f:
    f.write(content)

print("MetricsConfigModal refactored!")
