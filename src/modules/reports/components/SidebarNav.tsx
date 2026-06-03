import React from 'react';
import { FileText, Star, Clock, Calendar } from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  activeViewGroup: string;
  setActiveViewGroup: (group: any) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  activeViewGroup,
  setActiveViewGroup,
}) => {
  return (
    <div className="premium-nav-card">
      <div>
        <div className="premium-nav-title">Views</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button 
            onClick={() => { setActiveTab('all'); setActiveViewGroup('all'); }} 
            className={`premium-nav-item ${(activeTab === 'all' && activeViewGroup === 'all') ? 'active' : ''}`}
          >
            <FileText size={15} />
            <span>All Reports</span>
          </button>
          <button 
            onClick={() => { setActiveViewGroup('favorites'); setActiveTab('all'); }} 
            className={`premium-nav-item ${activeViewGroup === 'favorites' ? 'active' : ''}`}
          >
            <Star size={15} />
            <span>Favorites</span>
          </button>
          <button 
            onClick={() => { setActiveViewGroup('shared'); setActiveTab('all'); }} 
            className={`premium-nav-item ${activeViewGroup === 'shared' ? 'active' : ''}`}
          >
            <Clock size={15} />
            <span>Shared Reports</span>
          </button>
          <button 
            onClick={() => { setActiveViewGroup('scheduled'); setActiveTab('all'); }} 
            className={`premium-nav-item ${activeViewGroup === 'scheduled' ? 'active' : ''}`}
          >
            <Calendar size={15} />
            <span>Scheduled</span>
          </button>
        </div>
      </div>

      <div>
        <div className="premium-nav-title">Folders & Categories</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => { setActiveTab('sales'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'sales' ? 'active' : ''}`}>Sales</button>
          <button onClick={() => { setActiveTab('inventory'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}>Inventory</button>
          <button onClick={() => { setActiveTab('inventory-val'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'inventory-val' ? 'active' : ''}`}>Inventory Valuation</button>
          <button onClick={() => { setActiveTab('receivables'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'receivables' ? 'active' : ''}`}>Receivables</button>
          <button onClick={() => { setActiveTab('payments'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'payments' ? 'active' : ''}`}>Payments Received</button>
          <button onClick={() => { setActiveTab('payables'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'payables' ? 'active' : ''}`}>Payables</button>
          <button onClick={() => { setActiveTab('purchases'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'purchases' ? 'active' : ''}`}>Purchases</button>
          <button onClick={() => { setActiveTab('activity'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'activity' ? 'active' : ''}`}>Activity</button>
          <button onClick={() => { setActiveTab('automation'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'automation' ? 'active' : ''}`}>Automation</button>
        </div>
      </div>
    </div>
  );
};
