import re

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'

with open(dash_path, 'r') as f:
    content = f.read()

# 1. Add class to the Operational Highlights header row
content = content.replace(
    "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '8px', flexWrap: 'wrap', gap: '12px' }}>",
    "<div className=\"op-highlights-header\" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '8px', flexWrap: 'wrap', gap: '12px' }}>"
)

# 2. Update the @media (max-width: 640px) block for .stats-grid to use 2 columns
# First, let's find the existing media query for 640px in the main CSS block:
content = re.sub(
    r'@media \(max-width: 640px\) \{\n\s*\.stats-grid \{\n\s*grid-template-columns: 1fr !important;\n\s*\}\n\s*\}',
    r'@media (max-width: 640px) {\n          .stats-grid {\n            grid-template-columns: repeat(2, 1fr) !important;\n            gap: 10px !important;\n          }\n        }',
    content
)

# 3. Add the beautiful mobile CSS to the @media (max-width: 768px) block at the top
css_addition = """
          .op-highlights-header {
            flex-wrap: nowrap !important;
            gap: 8px !important;
          }
          .op-highlights-header h3 {
            font-size: 0.75rem !important;
          }
          .op-highlights-header button {
            padding: 6px 12px !important;
            font-size: 0.7rem !important;
          }
          
          /* Cards inside 2-column grid need compact styling */
          .stats-grid {
            gap: 10px !important;
          }
          .luxury-glass-card {
            padding: 14px !important;
          }
          .luxury-glass-card > div > div:first-child > span {
            font-size: 0.65rem !important;
            letter-spacing: 0.02em !important;
          }
          .luxury-glass-card > div > div > div:nth-child(2) {
             font-size: 1.3rem !important;
             margin-top: 4px !important;
             letter-spacing: -0.02em !important;
          }
          .luxury-glass-card > div > div:last-child {
             padding: 8px !important;
             border-radius: 10px !important;
          }
          .luxury-glass-card > div > div:last-child > svg {
             width: 14px;
             height: 14px;
          }
          .luxury-glass-card > div:nth-child(2) {
             margin: 10px 0 8px 0 !important;
          }
          .luxury-glass-card > div:last-child > span:last-child {
             display: none !important; /* Hide "vs last week" on mobile to save space */
          }
"""

# Inject into the 768px media query right before the closing brace
content = content.replace("          .refresh-btn-mobile-hide {\n            display: none !important;\n          }\n        }", "          .refresh-btn-mobile-hide {\n            display: none !important;\n          }\n" + css_addition + "        }")

with open(dash_path, 'w') as f:
    f.write(content)

print("Dashboard beautiful mobile styling applied!")
