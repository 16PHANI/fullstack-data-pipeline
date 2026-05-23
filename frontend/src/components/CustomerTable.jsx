import { useEffect, useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';

const RISK_COLOR = { Critical:'#ef4444', High:'#f97316', Medium:'#f59e0b', Low:'#10b981' };

const Badge = ({ label }) => (
  <span style={{
    background: RISK_COLOR[label] + '22',
    color: RISK_COLOR[label],
    padding:'2px 8px', borderRadius:99,
    fontSize:11, fontWeight:700,
  }}>{label}</span>
);

export default function CustomerTable() {
  const { customers, meta, loading, error, fetchCustomers, deleteCustomer } = useCustomers();
  const [filters, setFilters] = useState({ page:1, region:'', plan:'', churn:'', search:'' });
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { fetchCustomers(filters); }, [filters]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));
  const setPage   = (p)        => setFilters(f => ({ ...f, page: p }));

  const handleDelete = async (id) => {
    await deleteCustomer(id);
    setConfirm(null);
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input placeholder="Search name / email…"
          style={inputStyle} value={filters.search}
          onChange={e => setFilter('search', e.target.value)} />
        <select style={inputStyle} value={filters.region}
          onChange={e => setFilter('region', e.target.value)}>
          <option value="">All Regions</option>
          {['North','South','East','West','Central'].map(r =>
            <option key={r} value={r}>{r}</option>)}
        </select>
        <select style={inputStyle} value={filters.plan}
          onChange={e => setFilter('plan', e.target.value)}>
          <option value="">All Plans</option>
          {['Basic','Standard','Premium'].map(p =>
            <option key={p} value={p}>{p}</option>)}
        </select>
        <select style={inputStyle} value={filters.churn}
          onChange={e => setFilter('churn', e.target.value)}>
          <option value="">All Churn</option>
          <option value="1">Churned</option>
          <option value="0">Active</option>
        </select>
      </div>

      {/* Table */}
      {loading ? <p style={{ color:'#6b7280' }}>Loading…</p>
        : error ? <p style={{ color:'#ef4444' }}>{error}</p>
        : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                {['ID','Name','Email','Region','Plan','Tenure','Charge/mo','Risk','Churn','Actions'].map(h =>
                  <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background=''}>
                  <td style={tdStyle}>{c.id}</td>
                  <td style={tdStyle}><strong>{c.name}</strong></td>
                  <td style={tdStyle}>{c.email}</td>
                  <td style={tdStyle}>{c.region}</td>
                  <td style={tdStyle}>{c.plan}</td>
                  <td style={tdStyle}>{c.tenure_months} mo</td>
                  <td style={tdStyle}>${c.monthly_charge}</td>
                  <td style={tdStyle}><Badge label={c.risk_label} /></td>
                  <td style={tdStyle}>
                    <span style={{ color: c.churn ? '#ef4444' : '#10b981', fontWeight:600 }}>
                      {c.churn ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => setConfirm(c.id)}
                      style={{ background:'#fee2e2', color:'#dc2626', border:'none',
                               borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16, fontSize:13 }}>
        <span style={{ color:'#6b7280' }}>{meta.total} records</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding:'4px 10px', borderRadius:6, border:'1px solid #e2e8f0',
                       background: filters.page === p ? '#4f46e5' : '#fff',
                       color: filters.page === p ? '#fff' : '#374151',
                       cursor:'pointer', fontSize:13 }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)',
                      display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:12, padding:28, width:320 }}>
            <h3 style={{ marginBottom:12 }}>Delete customer #{confirm}?</h3>
            <p style={{ color:'#6b7280', marginBottom:20, fontSize:14 }}>This action cannot be undone.</p>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setConfirm(null)}
                style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #e2e8f0',
                         background:'#fff', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(confirm)}
                style={{ padding:'8px 16px', borderRadius:8, border:'none',
                         background:'#dc2626', color:'#fff', cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding:'8px 12px', borderRadius:8, border:'1px solid #e2e8f0',
  fontSize:13, background:'#fff', minWidth:140,
};
const thStyle = { padding:'10px 12px', textAlign:'left', fontSize:12,
                  fontWeight:700, color:'#374151', whiteSpace:'nowrap' };
const tdStyle = { padding:'10px 12px', verticalAlign:'middle' };
