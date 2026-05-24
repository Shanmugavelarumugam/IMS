import os

filepath = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/app/layouts/RootLayout.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update Sidebar component to include onResizeMouseDown
sidebar_orig = "const Sidebar = ({ onClose }: { onClose?: () => void }) => {"
sidebar_new = "const Sidebar = ({ onClose, onResizeMouseDown }: { onClose?: () => void, onResizeMouseDown?: (e: React.MouseEvent) => void }) => {"
content = content.replace(sidebar_orig, sidebar_new)

# Add the resizer div before the closing </aside>
resizer_orig = "    </aside>\n  );\n};"
resizer_new = """      <div 
        className={`sidebar-resizer`}
        onMouseDown={onResizeMouseDown} 
        onClick={(e) => e.stopPropagation()}
      />
    </aside>
  );
};"""
content = content.replace(resizer_orig, resizer_new)

# 2. Update RootLayout component to manage sidebarWidth
layout_orig = """const RootLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);"""

layout_new = """const RootLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : 260;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 450) newWidth = 450;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = '';
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.documentElement.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.documentElement.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };"""

content = content.replace(layout_orig, layout_new)

# 3. Pass onResizeMouseDown to Sidebar
render_orig = "        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />"
render_new = "        <Sidebar onClose={() => setIsMobileMenuOpen(false)} onResizeMouseDown={handleResizeMouseDown} />"
content = content.replace(render_orig, render_new)

# 4. Add is-resizing class to root container to ensure UI styles apply
app_layout_orig = """    <div className="app-layout">"""
app_layout_new = """    <div className={`app-layout ${isResizing ? 'is-resizing' : ''}`}>"""
content = content.replace(app_layout_orig, app_layout_new)

with open(filepath, 'w') as f:
    f.write(content)
print("RootLayout patched.")
