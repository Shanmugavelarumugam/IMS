import re
import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'

with open(dash_path, 'r') as f:
    content = f.read()

# Replace the giant mock data block with an import
mock_data_start = content.find("const ICON_MAP")
mock_data_end = content.find("// List of all metrics")

if mock_data_start != -1 and mock_data_end != -1:
    import_statement = """import { WelcomeBanner } from '../components/WelcomeBanner';
import { OperationalHighlights } from '../components/OperationalHighlights';
import { OperationalAnalyticsChart } from '../components/OperationalAnalyticsChart';
import { SalesOrderSummary } from '../components/SalesOrderSummary';
import { TopSellingItems } from '../components/TopSellingItems';
import { ReceiveHistory } from '../components/ReceiveHistory';
import { RightSideWidgets } from '../components/RightSideWidgets';
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
    content = content[:mock_data_start] + import_statement + "\n  " + content[mock_data_end:]

    with open(dash_path, 'w') as f:
        f.write(content)

print("Imports added!")
