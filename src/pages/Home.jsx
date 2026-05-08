import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Cpu, Shield, Zap, Target, Award,
  Smartphone, Code, Cloud, Layout, ArrowRight,
  MapPin, Mail, Phone, ExternalLink,
  ShoppingBag, HeartPulse, GraduationCap, Banknote, Home as House, Coffee,
  Truck, Factory, Wheat, Lightbulb, Plane, Car, Film, Store, Landmark, Heart, PhoneCall, Microscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-h.png';
import billingImg from '../assets/billing-software.png';
import healthImg from '../assets/healthcare-app.png';
import ecommerceImg from '../assets/ecommerce-platform.png';

const Home = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const allIndustries = [
    { icon: HeartPulse, name: 'Healthcare', color: '#ef4444' },
    { icon: ShoppingBag, name: 'E-commerce', color: '#f59e0b' },
    { icon: GraduationCap, name: 'Education', color: '#3b82f6' },
    { icon: Banknote, name: 'Finance', color: '#10b981' },
    { icon: House, name: 'Real Estate', color: '#8b5cf6' },
    { icon: Coffee, name: 'Hospitality', color: '#ec4899' },
    { icon: Truck, name: 'Logistics', color: '#6366f1' },
    { icon: Factory, name: 'Manufacturing', color: '#64748b' },
    { icon: Wheat, name: 'Agriculture', color: '#22c55e' },
    { icon: Lightbulb, name: 'Energy', color: '#eab308' },
    { icon: Plane, name: 'Travel', color: '#06b6d4' },
    { icon: Car, name: 'Automotive', color: '#475569' },
    { icon: Film, name: 'Entertainment', color: '#d946ef' },
    { icon: Store, name: 'Retail', color: '#f97316' },
    { icon: Landmark, name: 'Government', color: '#1e293b' },
    { icon: Heart, name: 'Non-Profit', color: '#f43f5e' },
    { icon: PhoneCall, name: 'Telecom', color: '#2563eb' },
    { icon: Microscope, name: 'Pharma', color: '#0d9488' },
  ];

  const products = [
    {
      name: 'Gama Billing',
      tag: 'Cloud-Based Invoicing',
      image: billingImg,
      desc: 'Simplify your business finances with our professional billing and inventory management solution.'
    },
    {
      name: 'Gama Health',
      tag: 'Smart Clinic Management',
      image: healthImg,
      desc: 'Comprehensive digital healthcare platform for patient records and doctor scheduling.'
    },
    {
      name: 'Gama Commerce',
      tag: 'B2B & B2C Platform',
      image: ecommerceImg,
      desc: 'Scale your retail business with our powerful and secure e-commerce engine.'
    }
  ];

  return (
    <motion.div
      className="page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ gap: '2.5rem', paddingBottom: '3rem', background: '#f8faff' }}
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} style={{ textAlign: 'center', paddingTop: '1rem' }}>
        {/* <img src={logo} alt="Gamanext" style={{ height: '70px', marginBottom: '1.5rem' }} /> */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: '1.2', marginBottom: '1rem' }}>
          Innovating the <span style={{ color: 'var(--primary)' }}>Future</span> of Software
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '95%', margin: '0 auto' }}>
          Leading the digital transformation journey for businesses with high-end technology and bespoke software products.
        </p>
      </motion.section>

      {/* Industries We Serve - Direct Grid */}
      <section>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--secondary)' }}>Industries We Serve</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Empowering businesses across all major sectors</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          textAlign: 'center'
        }}>
          {allIndustries.map((ind, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'white',
                padding: '1.25rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: `${ind.color}15`,
                color: ind.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <ind.icon size={22} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)' }}>{ind.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Proprietary Products */}
      <section>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--secondary)' }}>Our Software Products</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Ready-to-deploy enterprise solutions</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)' }}>{product.name}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                    ENTERPRISE
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{product.tag.toUpperCase()}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {product.desc}
                </p>
                <button style={{
                  width: '100%',
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(0, 90, 226, 0.2)'
                }}>
                  View Product Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Card */}
      <motion.div
        variants={itemVariants}
        style={{
          background: 'linear-gradient(135deg, var(--secondary) 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          color: 'white',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Target size={32} color="var(--primary)" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Our Vision</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>
          To become the leading software powerhouse in India, empowering businesses through quality-driven products and unmatched technical expertise.
        </p>
      </motion.div>

      {/* Quick Contact Links */}
      <motion.section variants={itemVariants} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)' }}>Connect With Us</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
          <motion.a whileHover={{ y: -5, scale: 1.1 }} href="mailto:info@gamanext.com" style={{ color: 'var(--primary)' }}><Mail size={28} /></motion.a>
          <motion.a whileHover={{ y: -5, scale: 1.1 }} href="tel:+919398638314" style={{ color: 'var(--primary)' }}><Phone size={28} /></motion.a>
          <motion.a whileHover={{ y: -5, scale: 1.1 }} href="https://gamanext.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}><ExternalLink size={28} /></motion.a>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
          © {new Date().getFullYear()} GamaNext Software Solutions
        </p>
      </motion.section>
    </motion.div>
  );
};

export default Home;
