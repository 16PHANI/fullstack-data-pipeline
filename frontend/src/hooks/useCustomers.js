import { useState, useCallback } from 'react';
import { customerAPI } from '../services/api';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [meta,      setMeta]      = useState({ total: 0, page: 1, pages: 1 });
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const fetchCustomers = useCallback(async (filters = {}) => {
    setLoading(true); setError(null);
    try {
      // Strip empty string params — empty strings fail server-side isIn() validation
      const clean = Object.fromEntries(
        Object.entries({ limit: 20, ...filters }).filter(([, v]) => v !== '')
      );
      const res = await customerAPI.list(clean);
      setCustomers(res.data);
      setMeta({ total: res.total, page: res.page, pages: res.pages });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (data) => {
    const res = await customerAPI.create(data);
    return res.data;
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    await customerAPI.remove(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  return { customers, meta, loading, error, fetchCustomers, createCustomer, deleteCustomer };
}