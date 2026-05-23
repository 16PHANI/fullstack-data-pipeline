import { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';

const REGIONS = ['North','South','East','West','Central'];
const PLANS   = ['Basic','Standard','Premium'];

export default function AddCustomer({ onAdded }) {
  const { createCustomer } = useCustomers();
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [form,    setForm]    = useState({
    name:'', email:'', phone:'', region:'Central',
    plan:'Basic', tenure_months:'', monthly_charge:'',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError('Name and email required'); return; }
    setSaving(true); setError(null);
    try {
      await createCustomer(form);
      setOpen(false);
      setForm({ name:'', email:'', phone:'', region:'Central',
                plan:'Basic', tenure_months:'', monthly_charge:'' });
      onAdded?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ padding:'10px 20px', background:'#4f46e5', color:'#fff',
                 border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>
        + Add Customer
      </button>

      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)',
                      display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:12, padding:28, width:440,
                        maxHeight:'90vh', overflowY:'auto' }}>
            <h2 style={{ marginBottom:20, fontSize:18 }}>Add Customer</h2>

            {error && <p style={{ color:'#ef4444', marginBottom:12, fontSize:13 }}>{error}</p>}

            {[
              { label:'Full Name *', key:'name',           type:'text'   },
              { label:'Email *',     key:'email',          type:'email'  },
              { label:'Phone',       key:'phone',          type:'text'   },
              { label:'Tenure (months)', key:'tenure_months', type:'number' },
              { label:'Monthly Charge ($)', key:'monthly_charge', type:'number' },
            ].map(({ label, key, type }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, display:'block', marginBottom:4 }}>{label}</label>
                <input type={type} value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  style={{ width:'100%', padding:'8px 12px', borderRadius:8,
                           border:'1px solid #e2e8f0', fontSize:13 }} />
              </div>
            ))}

            {[
              { label:'Region', key:'region', options: REGIONS },
              { label:'Plan',   key:'plan',   options: PLANS   },
            ].map(({ label, key, options }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, display:'block', marginBottom:4 }}>{label}</label>
                <select value={form[key]} onChange={e => set(key, e.target.value)}
                  style={{ width:'100%', padding:'8px 12px', borderRadius:8,
                           border:'1px solid #e2e8f0', fontSize:13 }}>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:20 }}>
              <button onClick={() => setOpen(false)}
                style={{ padding:'8px 16px', borderRadius:8,
                         border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={saving}
                style={{ padding:'8px 20px', borderRadius:8, border:'none',
                         background:'#4f46e5', color:'#fff', cursor:'pointer', fontWeight:600 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
