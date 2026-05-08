import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Briefcase, Clock, Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div className="page-container" style={{ gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: '500' }}>Good Morning,</h3>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Siva Krishna 👋</h2>
        </div>
        <button style={{ background: 'var(--bg-soft)', padding: '0.6rem', borderRadius: '50%', color: 'var(--text)' }}>
          <Bell size={20} />
        </button>
      </header>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--primary)', color: 'white' }}>
        <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Attendance Today</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>09:15 AM</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
            Shift: 09:00 - 18:00
          </span>
          <button style={{ background: 'white', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.85rem' }}>
            Check Out
          </button>
        </div>
      </div>

      <section>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <Briefcase size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>24</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Total Tasks</p>
          </div>
          <div style={{ background: 'var(--bg-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <Calendar size={24} color="#f59e0b" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>12</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Leaves Left</p>
          </div>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent Activities</h3>
          <button style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>View All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'white', border: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <Clock size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Check In</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Today, 09:15 AM</p>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--success)' }}>On Time</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
