import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  LayoutGrid,
  Loader2,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Projects = () => {
  const { user } = useAuth();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/collection/project_allocations`);
      const myAllocations = response.data
        .filter(a => a.employeeID === user.email)
        .sort((a, b) => new Date(b.allocatedAt) - new Date(a.allocatedAt));
      setAllocations(myAllocations);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [user.email]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-container" style={{ gap: '1.5rem', background: '#f8faff', paddingBottom: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>My Projects</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>View your current and past project allotments</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: '600' }}>Fetching allocations...</p>
        </div>
      ) : allocations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px dashed #e2e8f0' }}>
          <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--secondary)' }}>No Projects Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>You haven't been allocated to any projects yet.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {allocations.map((alc, idx) => {
            const isLatest = idx === 0;
            return (
              <motion.div
                key={alc.id}
                variants={itemVariants}
                style={{
                  background: isLatest ? 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' : 'white',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isLatest ? '2px solid var(--primary)' : '1px solid #f1f5f9',
                  boxShadow: isLatest ? '0 10px 30px rgba(0, 90, 226, 0.1)' : '0 2px 8px rgba(0,0,0,0.02)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isLatest && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.5px'
                  }}>
                    Current
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: isLatest ? 'var(--primary)' : 'var(--bg-soft)',
                    color: isLatest ? 'white' : 'var(--primary)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isLatest ? '0 4px 15px rgba(0, 90, 226, 0.2)' : 'none'
                  }}>
                    <Briefcase size={24} />
                  </div> */}

                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '4px' }}>
                        {alc.projectName}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
                        <LayoutGrid size={14} />
                        <span style={{ fontWeight: '600' }}>ID: {alc.projectID}</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      padding: '0.85rem',
                      background: isLatest ? 'rgba(0, 90, 226, 0.03)' : '#fcfdfd',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #f1f5f9'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>ALLOTMENT DATE</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>
                          <Calendar size={14} color="var(--primary)" />
                          {new Date(alc.allocatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>STATUS</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: '#10b981' }}>
                          <CheckCircle2 size={14} />
                          {alc.status?.toUpperCase() || 'ALLOCATED'}
                        </div>
                      </div>
                    </div>

                    {/* {isLatest && (
                      <button style={{
                        marginTop: '1rem',
                        width: '100%',
                        background: 'white',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        View Project Details
                        <ArrowUpRight size={16} />
                      </button>
                    )} */}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Corporate Message */}
      <footer style={{ textAlign: 'center', padding: '1rem 0', opacity: 0.6 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
          Contact HR for any discrepancies in project allotment history.
        </p>
      </footer>
    </div>
  );
};

export default Projects;
