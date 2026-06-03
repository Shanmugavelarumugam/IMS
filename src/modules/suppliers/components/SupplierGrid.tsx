import React from 'react';
import { Star, UserRound, Mail, MapPin } from 'lucide-react';
import type { Supplier } from '../types';

interface SupplierGridProps {
  suppliers: Supplier[];
  onSelectSupplier: (sup: Supplier) => void;
}

export const SupplierGrid: React.FC<SupplierGridProps> = ({
  suppliers,
  onSelectSupplier
}) => {
  return (
    <div className="supplier-grid">
      {suppliers.map((sup) => {
        const isOem = ['OEM Manufacturer', 'Technology OEM', 'Raw Materials'].includes(sup.type);
        const isLogistics = ['Third-Party Logistics', 'Logistics Broker'].includes(sup.type);
        
        return (
          <div 
            key={sup.id} 
            className="supplier-card-premium"
            onClick={() => onSelectSupplier(sup)}
          >
            {/* Header info in card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ 
                height: '52px', 
                width: '52px', 
                background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#4F46E5', 
                fontWeight: 900, 
                fontSize: '1.35rem',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.05)'
              }}>
                {sup.name.charAt(0).toUpperCase()}
              </div>
              
              {/* Category badge */}
              <span className={`type-pill ${isOem ? 'type-oem' : isLogistics ? 'type-logistics' : 'type-other'}`}>
                {sup.type}
              </span>
            </div>

            {/* Vendor details */}
            <h3 style={{ fontWeight: 850, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{sup.name}</h3>
            
            {/* Rating display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#d97706', fontWeight: 700, marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '1px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={13} 
                    fill={i < Math.floor(sup.rating) ? '#f59e0b' : 'transparent'} 
                    color="#f59e0b" 
                  />
                ))}
              </div>
              <span>{sup.rating.toFixed(1)}</span>
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>• {sup.outstandingOrders} Outstanding POs</span>
            </div>

            {/* Quick Info Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '18px', marginBottom: '22px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                 <UserRound size={16} color="#94a3b8" /> {sup.contactPerson}
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                 <Mail size={16} color="#94a3b8" /> <span style={{ wordBreak: 'break-all' }}>{sup.email || 'N/A'}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                 <MapPin size={16} color="#94a3b8" /> 
                 <span style={{ overflowX: 'auto', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                   {sup.address || 'Global Sourcing'}
                 </span>
               </div>
            </div>

            {/* Liability Card Segment */}
            <div className="debt-pill-premium">
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Outstanding Amount</span>
                 <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Pending Payment</span>
               </div>
               <div className={`debt-value ${sup.currentBalance > 0 ? 'positive' : 'neutral'}`}>
                 ₹{sup.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
