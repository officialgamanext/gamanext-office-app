import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Plus, 
  X, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const WFH = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: '',
    reason: ''
  });

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/collection/wfh_requests`);
      const myRequests = response.data
        .filter(r => r.employeeID === user.email)
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      setRequests(myRequests);
    } catch (error) {
      console.error('Error fetching WFH requests:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user.email]);

  const handleApplyWFH = async (e) => {
    e.preventDefault();
    const { fromDate, toDate, reason } = formData;

    if (!fromDate || !toDate || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error('Start date cannot be in the past');
      return;
    }

    if (end < start) {
      toast.error('End date cannot be before start date');
      return;
    }

    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (days > 30) {
      toast.error('WFH duration cannot exceed 30 days');
      return;
    }

    setSubmitting(true);
    const loadToast = toast.loading('Submitting request...');
    try {
      const wfhID = `WFH${Date.now()}`;
      const wfhData = {
        id: wfhID,
        employeeID: user.email,
        employeeName: `${user.firstName} ${user.lastName}`,
        fromDate,
        toDate,
        reason,
        days,
        status: 'Applied',
        appliedAt: new Date().toISOString()
      };

      await axios.post(`${API_URL}/collection/wfh_requests/${wfhID}`, wfhData);
      toast.success('WFH request submitted!', { id: loadToast });
      setIsModalOpen(false);
      setFormData({ fromDate: new Date().toISOString().split('T')[0], toDate: '', reason: '' });
      fetchRequests();
    } catch (error) {
      toast.error('Submission failed', { id: loadToast });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return { bg: '#ecfdf5', text: '#10b981', border: '#d1fae5' };
      case 'Rejected': return { bg: '#fff1f2', text: '#e11d48', border: '#ffe4e6' };
      default: return { bg: '#fffbeb', text: '#f59e0b', border: '#fef3c7' };
    }
  };

  return (
    <div className="page-container" style={{ gap: '1.25rem', background: '#f8faff', paddingBottom: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary)' }}>Work From Home</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Request and track your remote work days</p>
      </header>

      {/* Summary Card */}
      <div className="glass" style={{ padding: '1.1rem', borderRadius: 'var(--radius-lg)', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '45px', height: '45px', background: 'rgba(0, 90, 226, 0.1)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Home size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)' }}>Remote Productivity</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500' }}>Policy allows up to 30 days per request.</p>
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn-primary" 
        style={{ padding: '0.85rem', fontSize: '0.9rem', gap: '0.5rem', borderRadius: 'var(--radius-md)' }}
      >
        <Plus size={18} />
        New WFH Request
      </button>

      {/* List Section */}
      <section>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Request History</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader2 size={28} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed #e2e8f0' }}>
              <AlertCircle size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No remote work history found.</p>
            </div>
          ) : (
            requests.map((r) => {
              const status = getStatusColor(r.status);
              return (
                <div 
                  key={r.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'white', 
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--secondary)' }}>
                        {new Date(r.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(r.toDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.75rem' }}>
                      <Clock size={12} />
                      <span>{r.days} Days requested</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.75rem', marginTop: '4px' }}>
                      <AlertCircle size={12} />
                      <span style={{ fontStyle: 'italic' }}>{r.reason}</span>
                    </div>
                  </div>

                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    color: status.text, 
                    background: status.bg, 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px',
                    border: `1px solid ${status.border}`
                  }}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(10, 26, 58, 0.6)', backdropFilter: 'blur(6px)' }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ 
                position: 'relative', 
                background: 'white', 
                width: '100%', 
                maxWidth: '400px', 
                borderRadius: 'var(--radius-xl)', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Apply for WFH</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleApplyWFH} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="input-label" style={{ marginBottom: 0, fontSize: '0.85rem' }}>Start Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      style={{ height: '45px' }}
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="input-label" style={{ marginBottom: 0, fontSize: '0.85rem' }}>End Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      style={{ height: '45px' }}
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '0.85rem' }}>Reason for Remote Work</label>
                  <textarea 
                    className="input-field" 
                    style={{ padding: '0.75rem', height: '100px', fontSize: '0.9rem', resize: 'none' }}
                    placeholder="Briefly explain why you need to work remotely..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
                >
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WFH;
