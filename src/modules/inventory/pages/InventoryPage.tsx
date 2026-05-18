import { Plus, Search, Filter } from 'lucide-react';

export const Inventory = () => {
  const products = [
    { id: 1, sku: 'SKU-1002', name: 'Ergonomic Office Chair', category: 'Furniture', qty: 23, price: '$299.00' },
    { id: 2, sku: 'SKU-1005', name: 'Mechanical Keyboard', category: 'Electronics', qty: 142, price: '$89.00' },
    { id: 3, sku: 'SKU-1012', name: '4K Monitor', category: 'Electronics', qty: 8, price: '$450.00' },
    { id: 4, sku: 'SKU-1023', name: 'Standing Desk', category: 'Furniture', qty: 15, price: '$549.00' },
    { id: 5, sku: 'SKU-1034', name: 'Webcam HD', category: 'Peripherals', qty: 45, price: '$79.99' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p style={{color: 'var(--text-secondary)'}}>Manage stock levels and item details.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="glass-card" style={{padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px'}}>
        <div style={{
          flex: 1, 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 12px',
          border: '1px solid var(--border-color)'
        }}>
          <Search size={18} style={{color: 'var(--text-secondary)'}} />
          <input 
            type="text" 
            placeholder="Search items by SKU, name, or category..." 
            style={{
              background: 'none',
              border: 'none',
              padding: '12px',
              color: 'white',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
        <button style={{
          padding: '0 16px', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-secondary)'
        }}>
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="glass-card" style={{padding: '0 24px 24px 24px'}}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td style={{fontFamily: 'monospace', color: '#a855f7'}}>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>
                    <span style={{
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem'
                    }}>
                      {item.category}
                    </span>
                  </td>
                  <td>{item.qty}</td>
                  <td style={{fontWeight: 'bold'}}>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
