import { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { customerAPI } from '../services/api';

const COLORS = ['#4f46e5','#06b6d4','#10b981','#f59e0b','#ef4444'];
const RISK_COLORS = { Critical:'#ef4444', High:'#f97316', Medium:'#f59e0b', Low:'#10b981' };

const StatCard = ({ label, value, sub, color = '#4f46e5' }) => (
  <div style={{
    background:'#fff', borderRadius:12, padding:'20px 24px',
    boxShadow:'0 1px 4px rgba(0,0,0,.08)',
    borderLeft: `4px solid ${color}`,
  }}>
    <div style={{ fontSize:28, fontWeight:700, color }}>{value}</div>
    <div style={{ fontSize:14, fontWeight:600, marginTop:4 }}>{label}</div>
    {sub && <div style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>{sub}</div>}
  </div>
);

export default function Analytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    customerAPI.analytics()
      .then(res => setData(res.data))
      .catch(e  => setError(e.message))
      .finally(()=> setLoading(false));
  }, []);

  if (loading) return <p style={{ padding:24, color:'#6b7280' }}>Loading analytics…</p>;
  if (error)   return <p style={{ padding:24, color:'#ef4444' }}>Error: {error}</p>;
  if (!data)   return null;

  const { summary, regional, plans, risk } = data;

  return (
    <div style={{ padding:'0 0 32px' }}>
      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
        <StatCard label="Total Customers"  value={summary.total_customers}
                  sub={`Avg tenure: ${summary.avg_tenure_months} mo`} color="#4f46e5" />
        <StatCard label="Churned"           value={summary.churned_count}
                  sub={`Churn rate: ${(summary.churn_rate*100).toFixed(1)}%`} color="#ef4444" />
        <StatCard label="High Risk"         value={summary.high_risk_count}
                  sub={`${(summary.high_risk_rate*100).toFixed(1)}% of base`} color="#f97316" />
        <StatCard label="Avg Monthly Charge" value={`$${summary.avg_monthly_charge}`}
                  color="#10b981" />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24 }}>
        {/* Regional churn bar chart */}
        <div style={{ background:'#fff', borderRadius:12, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
          <h3 style={{ marginBottom:16, fontSize:15, fontWeight:600 }}>Churn by Region</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regional}>
              <XAxis dataKey="region" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total"   name="Total"   fill="#4f46e5" radius={[4,4,0,0]} />
              <Bar dataKey="churned" name="Churned" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk distribution pie */}
        <div style={{ background:'#fff', borderRadius:12, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
          <h3 style={{ marginBottom:16, fontSize:15, fontWeight:600 }}>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={risk} dataKey="count" nameKey="risk_label" cx="50%" cy="50%"
                   outerRadius={80} label={({ risk_label, percent }) =>
                     `${risk_label} ${(percent*100).toFixed(0)}%`}>
                {risk.map(entry => (
                  <Cell key={entry.risk_label} fill={RISK_COLORS[entry.risk_label] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan breakdown */}
      <div style={{ background:'#fff', borderRadius:12, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
        <h3 style={{ marginBottom:16, fontSize:15, fontWeight:600 }}>Plan Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={plans}>
            <XAxis dataKey="plan" tick={{ fontSize:12 }} />
            <YAxis tick={{ fontSize:12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total"   name="Total"        fill="#06b6d4" radius={[4,4,0,0]} />
            <Bar dataKey="churned" name="Churned"       fill="#f97316" radius={[4,4,0,0]} />
            <Bar dataKey="avg_charge" name="Avg Charge" fill="#10b981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
