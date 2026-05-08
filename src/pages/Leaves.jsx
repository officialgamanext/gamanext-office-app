import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronRight, 
  Plus, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Loader2,
  X,
  BriefcaseMedical,
  CalendarCheck,
  History,
  Info
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${API_URL}/collection/leaves`);
      const myLeaves = response.data
        .filter(l => l.employeeID === user.email)
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      setLeaves(myLeaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user.email]);

  // Quarterly Limits
  const LIMITS = {
    'Casual Leave': 2,
    'Sick Leave': 4
  };

  const getQuarterlyUsed = (type) => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
    
    return leaves
      .filter(l => 
        l.type === type && 
        new Date(l.fromDate) >= startOfQuarter && 
        l.status === 'Approved'
      )
      .reduce((sum, l) => sum + l.days, 0);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    const { fromDate, toDate, reason, type } = formData;

    if (!fromDate || !toDate || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    if (end < start) {
      toast.error('End date cannot be before start date');
      return;
    }

    const diffTime = Math.abs(end - start);
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const usedDays = getQuarterlyUsed(type);
    const remaining = LIMITS[type] - usedDays;

    // Limit Check
    if (requestedDays > remaining) {
      const confirmLOP = window.confirm(`You only have ${remaining > 0 ? remaining : 0} ${type} days left for this quarter. Applying for ${requestedDays} days will initiate Loss of Pay (LOP) for the exceeded days. Do you want to proceed?`);
      if (!confirmLOP) return;
    }

    setSubmitting(true);
    const loadToast = toast.loading('Submitting leave request...');
    try {
      const leaveID = `LV${Date.now()}`;
      const leaveData = {
        ...formData,
        id: leaveID,
        employeeID: user.email,
        employeeName: `${user.firstName} ${user.lastName}`,
        days: requestedDays,
        status: 'Applied',
        appliedAt: new Date().toISOString()
      };

      await axios.post(`${API_URL}/collection/leaves/${leaveID}`, leaveData);
      toast.success('Leave application submitted!', { id: loadToast });
      setIsModalOpen(false);
      setFormData({ type: 'Casual Leave', fromDate: '', toDate: '', reason: '' });
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to submit leave', { id: loadToast });
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

  const filteredLeaves = leaves.filter(l => statusFilter === 'All' || l.status === statusFilter);

  const used = {
    casual: getQuarterlyUsed('Casual Leave'),
    sick: getQuarterlyUsed('Sick Leave')
  };

  const formatDateShort = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate()
    };
  };

  const getDateRangeDisplay = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    if (start.getTime() === end.getTime()) {
      return start.getDate();
    }
    return `${start.getDate()}-${end.getDate()}`;
  };

  return (
    <div className="page-container" style={{ gap: '1.25rem', background: '#f8faff', paddingBottom: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary)' }}>Leaves</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Track and manage your leave requests</p>
      </header>

      {/* Leave Balance Cards */}
      <div className="glass" style={{ padding: '1.1rem', borderRadius: 'var(--radius-lg)', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Quarterly Tracker</h3>
          <div style={{ color: 'var(--text-light)', fontSize: '0.7rem', fontWeight: '700' }}>Q{Math.floor(new Date().getMonth() / 3) + 1} SUMMARY</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem 0.5rem', background: '#fcfdfd', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '38px', height: '38px', background: '#ecfdf5', color: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem' }}>
              <CalendarCheck size={20} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '0.2rem', fontWeight: '600' }}>Casual Leave</p>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>{used.casual} <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>/ 2</span></h4>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem 0.5rem', background: '#fcfdfd', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '38px', height: '38px', background: '#eff6ff', color: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem' }}>
              <BriefcaseMedical size={20} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '0.2rem', fontWeight: '600' }}>Sick Leave</p>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6' }}>{used.sick} <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>/ 4</span></h4>
          </div>
        </div>
      </div>

      {/* Apply Leave Button - Smaller */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn-primary" 
        style={{ 
          padding: '0.85rem', 
          borderRadius: 'var(--radius-md)', 
          boxShadow: '0 4px 15px rgba(0, 90, 226, 0.15)',
          fontSize: '0.9rem',
          gap: '0.5rem'
        }}
      >
        <Plus size={18} />
        Apply for Leave
      </button>

      {/* Requests List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>My Requests</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9' }}>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: 'none', background: 'none', fontSize: '0.8rem', fontWeight: '700', outline: 'none' }}
            >
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Applied">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader2 size={28} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No records found.</p>
            </div>
          ) : (
            filteredLeaves.map((lv) => {
              const status = getStatusColor(lv.status);
              const dateInfo = formatDateShort(lv.fromDate);
              return (
                <div 
                  key={lv.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.85rem', 
                    padding: '0.85rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'white', 
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#eff6ff', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #dbeafe'
                  }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1px' }}>{dateInfo.month}</span>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>{getDateRangeDisplay(lv.fromDate, lv.toDate)}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '2px' }}>{lv.type}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{lv.days} Days</p>
                  </div>

                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    color: status.text, 
                    background: status.bg, 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '4px',
                    border: `1px solid ${status.border}`
                  }}>
                    {lv.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Apply Leave Modal - Fixed UI Distortion */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(10, 26, 58, 0.5)', backdropFilter: 'blur(4px)' }}
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
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh'
              }}
            >
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Apply for Leave</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} style={{ padding: '1.25rem', overflowY: 'auto' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '0.85rem' }}>Leave Type</label>
                  <select 
                    className="input-field" 
                    style={{ paddingLeft: '1rem', height: '45px', fontSize: '0.9rem' }}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Casual Leave">Casual Leave (2/Quarter)</option>
                    <option value="Sick Leave">Sick Leave (4/Quarter)</option>
                  </select>
                </div>

                {/* Fixed Date Selection - Vertical Stack to prevent cutting */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="input-label" style={{ marginBottom: 0, fontSize: '0.85rem' }}>From Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      style={{ paddingLeft: '1rem', height: '45px' }}
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="input-label" style={{ marginBottom: 0, fontSize: '0.85rem' }}>To Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      style={{ paddingLeft: '1rem', height: '45px' }}
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '0.85rem' }}>Reason</label>
                  <textarea 
                    className="input-field" 
                    style={{ padding: '0.75rem', height: '80px', fontSize: '0.9rem', resize: 'none' }}
                    placeholder="Enter reason..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    style={{ flex: 1, background: '#f1f5f9', color: '#64748b', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '0.9rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submitting}
                    style={{ flex: 2, padding: '0.75rem', fontSize: '0.9rem' }}
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Apply Leave'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves;
