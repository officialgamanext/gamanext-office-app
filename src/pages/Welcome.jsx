import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import logo from '../assets/logo-h.png';
import illustration from '../assets/welcome-illustration.png';

const Welcome = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="page-container" style={{ justifyContent: 'space-between', paddingBottom: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginTop: '1rem' }}
      >
        <img src={logo} alt="Gamanext Logo" style={{ height: '84px', marginBottom: '1.5rem' }} />
        
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          Welcome to <br /> <span style={{ color: 'var(--primary)' }}>Gamanext</span>
        </h1>
        
        <p style={{ color: 'var(--text-light)', fontSize: '1rem', maxWidth: '90%', margin: '0 auto' }}>
          Manage your work, time, and team effortlessly, all in one place.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}
      >
        <img 
          src={illustration} 
          alt="Welcome Illustration" 
          style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} 
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <button className="btn-primary" onClick={() => navigate('/login')}>
          Get Started
        </button>

        {isInstallable && (
          <button 
            className="btn-secondary" 
            onClick={handleInstallClick}
            style={{ 
              background: 'white', 
              color: 'var(--primary)', 
              border: '1.5px solid var(--primary)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={20} />
            Install App
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Welcome;
