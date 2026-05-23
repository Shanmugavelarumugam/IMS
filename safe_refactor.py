import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'

with open(dash_path, 'r') as f:
    content = f.read()

# 1. Replace Mock Data
mock_start = content.find("const ICON_MAP")
mock_end = content.find("// List of all metrics")

if mock_start != -1 and mock_end != -1:
    imports = """import { MetricsConfigModal } from '../components/MetricsConfigModal';
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
    content = content[:mock_start] + imports + "\n  " + content[mock_end:]

# 2. Extract Modal
modal_start = content.find('{/* Modern Glassmorphic Metrics Configuration Modal */}')
modal_end = content.find('      })()}\n\n    </div>')

if modal_start != -1 and modal_end != -1:
    modal_jsx = content[modal_start:modal_end].strip()
    
    # Replace with component tag
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

print("Safe refactor applied!")
