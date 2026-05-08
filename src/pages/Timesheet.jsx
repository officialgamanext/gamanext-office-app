import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Save,
  Briefcase,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Timesheet = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timesheets, setTimesheets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [hours, setHours] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const fetchData = async () => {
    try {
      const [tsRes, alcRes, lvRes, holRes] = await Promise.all([
        axios.get(`${API_URL}/collection/timesheets`),
        axios.get(`${API_URL}/collection/project_allocations`),
        axios.get(`${API_URL}/collection/leaves`),
        axios.get(`${API_URL}/collection/holidays`)
      ]);

      const myTS = tsRes.data.filter(t => t.employeeID === user.email);
      const myALC = alcRes.data
        .filter(a => a.employeeID === user.email)
        .sort((a, b) => new Date(b.allocatedAt) - new Date(a.allocatedAt));
      const myLV = lvRes.data.filter(l => l.employeeID === user.email);

      setTimesheets(myTS);
      setAllocations(myALC);
      setLeaves(myLV);
      setHolidays(holRes.data || []);
      if (myALC.length > 0) setActiveProject(myALC[0]);
    } catch (error) {
      console.error('Error fetching timesheet data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.email]);

  const alreadySubmittedToday = timesheets.some(t => t.date === todayStr);
  const isHolidayToday = holidays.some(h => h.date === todayStr) || now.getDay() === 0 || now.getDay() === 6;
  const isOnLeaveToday = leaves.some(l => todayStr >= l.fromDate && todayStr <= l.toDate && l.status === 'Approved');

  const handleSave = async () => {
    if (isHolidayToday) {
      toast.error('Cannot add timesheet on a holiday');
      return;
    }
    if (isOnLeaveToday) {
      toast.error('Cannot add timesheet while on approved leave');
      return;
    }
    if (!hours || hours <= 0 || hours > 24) {
      toast.error('Please enter valid billing hours (1-24)');
      return;
    }
    if (!activeProject) {
      toast.error('No active project found');
      return;
    }

    setSubmitting(true);
    const loadToast = toast.loading('Saving timesheet...');
    try {
      const tsID = `TS${Date.now()}`;
      const tsData = {
        id: tsID,
        employeeID: user.email,
        employeeName: `${user.firstName} ${user.lastName}`,
        date: todayStr,
        projectName: activeProject.projectName,
        projectID: activeProject.projectID,
        hours: parseFloat(hours),
        status: 'Submitted',
        appliedAt: new Date().toISOString()
      };

      await axios.post(`${API_URL}/collection/timesheets/${tsID}`, tsData);
      toast.success('Timesheet saved for today!', { id: loadToast });
      fetchData();
    } catch (error) {
      toast.error('Failed to save timesheet', { id: loadToast });
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar Logic
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const days = [];
  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const getDayStatus = (day) => {
    if (!day) return null;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check Approved Leave
    const approvedLeave = leaves.find(l => dateStr >= l.fromDate && dateStr <= l.toDate && l.status === 'Approved');
    if (approvedLeave) return 'approved-leave';

    // Check Applied Leave
    const appliedLeave = leaves.find(l => dateStr >= l.fromDate && dateStr <= l.toDate && l.status === 'Applied');
    if (appliedLeave) return 'applied-leave';

    // Check Holiday
    const holiday = holidays.find(h => h.date === dateStr);
    const d = new Date(currentYear, currentMonth, day);
    if (holiday || d.getDay() === 0 || d.getDay() === 6) return 'holiday';

    // Check Timesheet
    const ts = timesheets.find(t => t.date === dateStr);
    if (ts) return 'added';

    // Check Today
    if (dateStr === todayStr) return 'today';

    // Check if in past
    if (new Date(dateStr) < new Date(todayStr)) return 'not-added';
    
    return 'future';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'added': return '#10b981'; // Green
      case 'holiday': return '#94a3b8'; // Grey
      case 'applied-leave': return '#f59e0b'; // Orange
      case 'approved-leave': return '#8b5cf6'; // Purple
      case 'not-added': return '#ef4444'; // Red
      case 'today': return 'var(--primary)';
      default: return '#f1f5f9';
    }
  };

  const legendItems = [
    { label: 'Submitted', color: '#10b981' },
    { label: 'Holiday/Off', color: '#94a3b8' },
    { label: 'Leave Pending', color: '#f59e0b' },
    { label: 'Leave Approved', color: '#8b5cf6' },
    { label: 'Missed Log', color: '#ef4444' },
    { label: 'Today', color: 'var(--primary)' }
  ];

  if (loading) {
    return (
      <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ gap: '1.25rem', background: '#f8faff', paddingBottom: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary)' }}>Timesheet</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Daily work log tracker</p>
      </header>

      {/* Date Selector */}
      <div 
        onClick={() => setShowCalendar(true)}
        style={{ 
          background: 'white', 
          padding: '1rem', 
          borderRadius: 'var(--radius-lg)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', background: 'rgba(0, 90, 226, 0.08)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>LOGGING FOR</p>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)' }}>
              {now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>History</span>
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Main Entry Card */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid #f1f5f9' }}>
        {isHolidayToday || isOnLeaveToday ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ width: '60px', height: '60px', background: '#fff1f2', color: '#e11d48', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <ShieldAlert size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
              {isHolidayToday ? 'Today is a Holiday' : 'You are on Leave'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
              {isHolidayToday 
                ? 'Timesheet logging is not required for holidays or weekends. Enjoy your day off!' 
                : 'Timesheet logging is disabled during your approved leave period.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Briefcase size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Active Allocation</h3>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>CURRENT PROJECT</p>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--secondary)' }}>
                {activeProject ? activeProject.projectName : 'No Active Project'}
              </h4>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontSize: '0.75rem' }}>Daily Billing Hours</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#94a3b8' }} />
                <input 
                  type="number" 
                  step="0.5"
                  className="input-field" 
                  placeholder="Enter hours (max 24)"
                  disabled={alreadySubmittedToday || !activeProject}
                  value={alreadySubmittedToday ? timesheets.find(t => t.date === todayStr).hours : hours}
                  onChange={(e) => setHours(e.target.value)}
                  style={{ paddingLeft: '2.75rem', height: '50px', fontSize: '1.1rem', fontWeight: '700' }}
                />
              </div>
            </div>

            {alreadySubmittedToday ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', background: '#ecfdf5', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid #d1fae5', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
                <span style={{ fontWeight: '800', fontSize: '1rem' }}>Today's Log Saved</span>
              </div>
            ) : (
              <button 
                onClick={handleSave}
                disabled={submitting || !activeProject}
                className="btn-primary" 
                style={{ width: '100%', padding: '1.1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem' }}
              >
                {submitting ? <Loader2 size={22} className="animate-spin" /> : <><Save size={22} /> Save Timesheet</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mini Legend for Main Page */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '0 0.5rem' }}>
        {legendItems.slice(0, 3).map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b' }}>{item.label}</span>
          </div>
        ))}
        <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800', marginLeft: 'auto' }} onClick={() => setShowCalendar(true)}>View All →</span>
      </div>

      {/* Calendar Overlay */}
      <AnimatePresence>
        {showCalendar && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10002, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendar(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(10, 26, 58, 0.5)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ 
                position: 'relative', 
                background: 'white', 
                width: '100%', 
                maxWidth: '450px', 
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', 
                padding: '1.75rem',
                boxShadow: '0 -25px 50px rgba(0,0,0,0.15)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                    {now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>Your monthly activity tracker</p>
                </div>
                <button onClick={() => setShowCalendar(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <XCircle size={22} />
                </button>
              </div>

              {/* Legend inside Modal */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', border: '1px solid #f1f5f9' }}>
                {legendItems.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', marginBottom: '0.75rem' }}>{d}</div>
                ))}
                {days.map((day, idx) => {
                  const status = getDayStatus(day);
                  const color = getStatusColor(status);
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '800',
                        color: day ? (['added', 'approved-leave', 'today'].includes(status) ? 'white' : 'var(--secondary)') : 'transparent',
                        background: day ? color : 'transparent',
                        borderRadius: '12px',
                        boxShadow: (status === 'today' && day) ? '0 4px 10px rgba(0, 90, 226, 0.2)' : 'none'
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowCalendar(false)}
                style={{ width: '100%', marginTop: '2rem', padding: '1rem', background: 'var(--secondary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '800', fontSize: '1rem', boxShadow: '0 4px 15px rgba(10, 26, 58, 0.2)' }}
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timesheet;
