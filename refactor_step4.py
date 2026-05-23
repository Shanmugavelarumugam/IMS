import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

with open(dash_path, 'r') as f:
    content = f.read()

side_start = content.find('{/* 1. UPLOADED CUSTOM WIDGET: PENDING ACTIONS')
side_end = content.find('<MetricsConfigModal')

if side_start != -1 and side_end != -1:
    side_jsx = content[side_start:side_end].strip()
    
    # We must trim the closing </div> of col-side which might be right before MetricsConfigModal.
    # We know the last tag before MetricsConfigModal is the </div> of col-side.
    if side_jsx.endswith('</div>\n          </div>'):
        side_jsx = side_jsx[:-14].strip()
    elif side_jsx.endswith('</div>'):
        side_jsx = side_jsx[:-6].strip()

    with open(os.path.join(comp_dir, 'RightSideWidgets.tsx'), 'w') as f:
        f.write(f"import React from 'react';\nimport {{ ShoppingCart, ChevronRight, ShoppingBag, Package, DollarSign, AlertTriangle, PieChart }} from 'lucide-react';\nimport {{ dynamicActivities, receiveHistory, salesOrders, topSellingItems, topStockedItems }} from '../utils/mockData';\n\ninterface RightSideWidgetsProps {{\n  capsuleTab: 'pending' | 'activities';\n  setCapsuleTab: (tab: 'pending' | 'activities') => void;\n  hoveredSlice: number | null;\n  setHoveredSlice: (idx: number | null) => void;\n}}\n\nexport const RightSideWidgets: React.FC<RightSideWidgetsProps> = (props) => {{\n  const {{ capsuleTab, setCapsuleTab, hoveredSlice, setHoveredSlice }} = props;\n  return (\n    <>\n      {side_jsx}\n    </>\n  );\n}};\n")

    content = content[:side_start] + "<RightSideWidgets capsuleTab={capsuleTab} setCapsuleTab={setCapsuleTab} hoveredSlice={hoveredSlice} setHoveredSlice={setHoveredSlice} />\n\n          </div>\n\n        " + content[side_end:]

    with open(dash_path, 'w') as f:
        f.write(content)
    
    print("RightSideWidgets refactored!")
