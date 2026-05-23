import os

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'
comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

with open(dash_path, 'r') as f:
    content = f.read()

# 1. Welcome Banner
banner_start = content.find('<div style={{')
banner_end = content.find('{/* METRICS BACKLOG ROW')
banner_jsx = content[banner_start:banner_end].strip()

with open(os.path.join(comp_dir, 'WelcomeBanner.tsx'), 'w') as f:
    f.write(f"import React from 'react';\nimport {{ RefreshCw, Calendar }} from 'lucide-react';\n\ninterface WelcomeBannerProps {{\n  business: any;\n  loading: boolean;\n  refreshData: () => void;\n}}\n\nexport const WelcomeBanner: React.FC<WelcomeBannerProps> = ({{ business, loading, refreshData }}) => {{\n  return (\n    <>\n      {banner_jsx}\n    </>\n  );\n}};\n")

# Replace in content
content = content[:banner_start] + "<WelcomeBanner business={business} loading={loading} refreshData={refreshData} />\n\n        " + content[banner_end:]

# Write back to check
with open(dash_path, 'w') as f:
    f.write(content)

print("WelcomeBanner refactored!")
