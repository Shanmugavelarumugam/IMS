import re

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'

with open(dash_path, 'r') as f:
    content = f.read()

# 1. Add class to main wrapper
content = content.replace(
    "<div style={{ fontFamily: \"'Outfit', sans-serif\", padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '100vh' }}>",
    "<div className=\"dashboard-wrapper\" style={{ fontFamily: \"'Outfit', sans-serif\", padding: '24px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '100vh' }}>"
)

# 2. Add class to welcome banner
content = re.sub(
    r"(<div style=\{\{\n\s*background: 'linear-gradient\(135deg, rgba\(255, 255, 255, 0\.85\) 0%, rgba\(248, 250, 252, 0\.8\) 100%\)',\n\s*backdropFilter: 'blur\(20px\)',.*? gap: '20px'\n\s*\}\})>",
    r'\1 className="welcome-banner">',
    content,
    flags=re.DOTALL
)

# 3. Add classes to text
content = content.replace("<h1 style={{ fontSize: '1.9rem',", "<h1 className=\"welcome-title\" style={{ fontSize: '1.9rem',")
content = content.replace("<p style={{ color: '#475569', fontSize: '0.88rem',", "<p className=\"welcome-desc\" style={{ color: '#475569', fontSize: '0.88rem',")

# 4. Add class to action row
content = content.replace(
    "<div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2 }}>",
    "<div className=\"welcome-banner-actions\" style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2, flexWrap: 'wrap' }}>"
)

# 5. Inject CSS into the <style> block
css_injection = """
        @media (max-width: 768px) {
          .dashboard-wrapper {
            padding: 12px 10px !important;
          }
          .welcome-banner {
            padding: 20px 16px !important;
            border-radius: 18px !important;
            gap: 16px !important;
            margin-bottom: 24px !important;
          }
          .welcome-title {
            font-size: 1.5rem !important;
          }
          .welcome-desc {
            font-size: 0.84rem !important;
          }
          .welcome-banner-actions {
            width: 100%;
          }
          .welcome-banner-actions button {
            flex: 1;
            justify-content: center;
          }
          .luxury-glass-card {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .stats-grid {
            gap: 12px !important;
            margin-bottom: 20px !important;
          }
          .dashboard-layout-grid {
            gap: 16px !important;
            margin-top: 16px !important;
          }
          /* Fix large value fonts on mobile */
          .luxury-glass-card > div > div > div:nth-child(2) {
             font-size: 1.6rem !important;
          }
        }
"""

content = content.replace("/* Stunning Luxury Dashboard Theme */", "/* Stunning Luxury Dashboard Theme */" + css_injection)

with open(dash_path, 'w') as f:
    f.write(content)

print("Dashboard mobile styling applied!")
