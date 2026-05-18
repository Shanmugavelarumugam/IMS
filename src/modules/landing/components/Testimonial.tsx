 
import { Star } from 'lucide-react';
import { colors } from '../theme';

export const Testimonial = () => {
  return (
    <section style={{ padding: '80px 80px', background: '#F3F4F6', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px', gap: '4px' }}>
          {[1,2,3,4,5].map(i => <Star key={i} fill="#F59E0B" size={20} />)}
        </div>
        <blockquote style={{ fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4, color: colors.primary, marginBottom: '24px' }}>
          "This IMS reduced our inventory mistakes by 80%. Setting up warehouses took minutes, and automated POs practically runs our business now."
        </blockquote>
        <cite style={{ fontStyle: 'normal', fontWeight: 700 }}>— John Doe, Operations Manager at Apex</cite>
      </div>
    </section>
  );
};
