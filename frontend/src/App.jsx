import { useState } from 'react';
import Analytics     from './components/Analytics';
import CustomerTable from './components/CustomerTable';
import AddCustomer   from './components/AddCustomer';

const NAV = ['Analytics', 'Customers'];

export default function App() {
  const [tab,     setTab]     = useState('Analytics');
  const [refresh, setRefresh] = useState(0);

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8' }}>
      {/* Header */}
      <header style={{ background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,.08)',
                       padding:'0 32px', display:'flex', alignItems:'center', height:60 }}>
        <div style={{ fontWeight:800, fontSize:18, color:'#4f46e5', marginRight:40 }}>
          📊 Customer Pipeline
        </div>
        <nav style={{ display:'flex', gap:4 }}>
          {NAV.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:'8px 18px', borderRadius:8, border:'none', cursor:'pointer',
                       background: tab === t ? '#4f46e5' : 'transparent',
                       color:      tab === t ? '#fff'    : '#374151',
                       fontWeight: tab === t ? 700       : 400,
                       fontSize:14 }}>
              {t}
            </button>
          ))}
        </nav>
        {tab === 'Customers' && (
          <div style={{ marginLeft:'auto' }}>
            <AddCustomer onAdded={() => setRefresh(r => r + 1)} />
          </div>
        )}
      </header>

      {/* Main */}
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px' }}>
        <h1 style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>{tab}</h1>
        {tab === 'Analytics' ? (
          <Analytics key={refresh} />
        ) : (
          <div style={{ background:'#fff', borderRadius:12, padding:20,
                        boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
            <CustomerTable key={refresh} />
          </div>
        )}
      </main>
    </div>
  );
}
