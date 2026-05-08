import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Building2, MapPin,
  Lock, Bell, ShieldCheck, HelpCircle,
  LogOut, Camera, Briefcase, CreditCard,
  Map, AlertCircle, Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="glass" style={{
      padding: '1.25rem',
      borderRadius: 'var(--radius-lg)',
      background: 'white',
      marginBottom: '1rem',
      border: '1px solid #f1f5f9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
        <Icon size={18} color="var(--primary)" />
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--secondary)' }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', flex: '0 0 40%' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: '600', textAlign: 'right', flex: '1' }}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="page-container" style={{ gap: '1rem', background: '#f8faff', paddingBottom: '2rem' }}>
      {/* <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>Employee Profile</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Detailed information for {user?.firstName}</p>
      </header> */}

      {/* Profile Header Card */}
      <div className="glass" style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--primary)',
        color: 'white',
        marginBottom: '0.5rem',
        boxShadow: '0 10px 20px rgba(0, 90, 226, 0.15)'
      }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.3)',
            backgroundColor: "#fff"
          }}>
            <img
              src={user?.profilePhotoUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.15rem' }}>
              {user?.firstName} {user?.lastName}
            </h2>
            <p style={{ opacity: 0.9, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              {user?.designation}
            </p>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              {user?.employeeID}
            </span>
          </div>
        </div>
      </div>

      {/* Work Details */}
      <InfoSection title="Employment Details" icon={Briefcase}>
        <InfoItem label="Department" value={user?.department} />
        <InfoItem label="Role" value={user?.role} />
        <InfoItem label="Designation" value={user?.designation} />
        <InfoItem label="Date of Joining" value={formatDate(user?.createdAt)} />
        <InfoItem label="Employee ID" value={user?.employeeID} />
      </InfoSection>

      {/* Personal & Contact */}
      <InfoSection title="Contact & Address" icon={MapPin}>
        <InfoItem label="Email" value={user?.email} />
        <InfoItem label="Phone" value={user?.phone} />
        <InfoItem label="Address 1" value={user?.address1} />
        <InfoItem label="Address 2" value={user?.address2} />
        <InfoItem label="City" value={user?.city} />
        <InfoItem label="State" value={user?.state} />
        <InfoItem label="Pincode" value={user?.pincode} />
      </InfoSection>

      {/* Government IDs */}
      <InfoSection title="Identity Details" icon={Fingerprint}>
        <InfoItem label="Aadhar Number" value={user?.aadharNumber} />
        <InfoItem label="PAN Number" value={user?.panNumber} />
      </InfoSection>

      {/* Bank Details */}
      <InfoSection title="Bank Information" icon={CreditCard}>
        <InfoItem label="Bank Name" value={user?.bankName} />
        <InfoItem label="Account Number" value={user?.accountNumber} />
        <InfoItem label="IFSC Code" value={user?.ifscCode} />
      </InfoSection>

      {/* Emergency Contact 1 */}
      <InfoSection title="Emergency Contact 1" icon={AlertCircle}>
        <InfoItem label="Name" value={user?.emergency1?.name} />
        <InfoItem label="Mobile" value={user?.emergency1?.mobile} />
        <InfoItem label="Relation" value={user?.emergency1?.relation} />
      </InfoSection>

      {/* Emergency Contact 2 */}
      <InfoSection title="Emergency Contact 2" icon={AlertCircle}>
        <InfoItem label="Name" value={user?.emergency2?.name} />
        <InfoItem label="Mobile" value={user?.emergency2?.mobile} />
        <InfoItem label="Relation" value={user?.emergency2?.relation} />
      </InfoSection>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: '#fee2e2',
          color: '#ef4444',
          fontWeight: '700',
          border: '1px solid #fecaca',
          marginTop: '1rem',
          width: '100%',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Profile;
