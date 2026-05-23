import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'

with open(dash_path, 'r') as f:
    lines = f.readlines()

imports = """import { 
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

# Lines are 0-indexed, so line 31 is index 30, line 326 is index 325
new_lines = lines[:30] + [imports] + lines[325:]

with open(dash_path, 'w') as f:
    f.writelines(new_lines)

print("Mock data extracted!")
