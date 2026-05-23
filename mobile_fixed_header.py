import os
import re

app_css_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/styles/App.css'
root_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/app/layouts/RootLayout.tsx'

# 1. Update RootLayout.tsx
with open(root_path, 'r') as f:
    root = f.read()

# Add class to header
root = root.replace('<header style={{', '<header className="top-bar-header" style={{')

# Add class to search container
root = root.replace("<div style={{ position: 'relative', maxWidth: '360px', width: '100%', marginLeft: '48px', marginRight: 'auto' }}>", "<div className=\"top-search-container\" style={{ position: 'relative', maxWidth: '360px', width: '100%', marginLeft: '48px', marginRight: 'auto' }}>")

# Add class to profile dropdown container
root = root.replace("<div style={{ position: 'fixed', top: '20px', right: '32px', zIndex: 1000 }}>", "<div className=\"profile-dropdown-container\" style={{ position: 'fixed', top: '20px', right: '32px', zIndex: 1000 }}>")

# Add class to profile text to hide it on mobile
root = root.replace("<div style={{ textAlign: 'right' }}>", "<div className=\"profile-text\" style={{ textAlign: 'right' }}>")

# Add class to search shortcut to hide it on mobile
root = root.replace("⌘K\n          </div>", "⌘K\n          </div>", 1) # Wait, regex is safer
root = re.sub(r'pointerEvents: \'none\'\n          }}>', r"pointerEvents: 'none'\n          }} className=\"global-search-shortcut\">", root)

# Also ensure main-content padding allows sticky header properly. 
# Previously I added padding: 16px to main-content on mobile. A sticky header inside a padded container will sit inside the padding.
# Better to remove mobile padding from main-content top, or use negative margins.
# I will use negative margins in the CSS.

with open(root_path, 'w') as f:
    f.write(root)

# 2. Update App.css
with open(app_css_path, 'r') as f:
    app_css = f.read()

css_addition = """
  /* Fixed Mobile Header */
  .top-bar-header {
    position: sticky !important;
    top: -16px; /* offset the main-content padding */
    margin: -16px -16px 16px -16px !important;
    padding: 12px 16px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
  }
  
  .top-search-container {
    margin-left: auto !important;
    margin-right: 12px !important;
    width: auto !important;
    flex: 1;
    max-width: 180px !important;
  }
  
  .global-search-shortcut {
    display: none !important;
  }
  
  .profile-dropdown-container {
    position: static !important;
  }
  
  .profile-text {
    display: none !important;
  }
"""

# Insert the css_addition into the @media (max-width: 1024px) block
app_css = app_css.replace('.hide-on-mobile {', css_addition + '\n  .hide-on-mobile {')

with open(app_css_path, 'w') as f:
    f.write(app_css)

print("Mobile sticky header styles applied!")
