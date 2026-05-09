import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard':   { title: 'Dashboard',    subtitle: 'Happy Birthday Overview 🎉', emoji: '🏠' },
  '/surprise':    { title: 'Surprise!',    subtitle: 'Your magical birthday moments 🎁', emoji: '🎁' },
  '/cutie-pie':   { title: 'Cutie Pie',    subtitle: 'Photo gallery & memories 📸', emoji: '📸' },
  '/private-pie': { title: 'Private Pie',  subtitle: 'Secret & special moments 🔒', emoji: '🔒' },
};

const headerStyle = {
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(253,244,255,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(216,180,254,0.3)',
    padding: '1rem 2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#7c6b8f',
    marginTop: '2px',
    fontFamily: "'Lato', sans-serif",
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 14px 6px 8px',
    borderRadius: '2rem',
    background: 'rgba(216,180,254,0.2)',
    border: '1px solid rgba(216,180,254,0.4)',
    cursor: 'pointer',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  profileName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4a1a6b',
  },
  dateBadge: {
    padding: '5px 12px',
    borderRadius: '2rem',
    background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))',
    border: '1px solid rgba(168,85,247,0.3)',
    fontSize: '0.78rem',
    color: '#7c3aed',
    fontWeight: '700',
    fontFamily: "'Lato', sans-serif",
  },
};

export default function Header() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/dashboard'];

  return (
    <motion.header
      style={headerStyle.wrapper}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div style={headerStyle.left}>
        <h1 style={headerStyle.title}>{page.emoji} {page.title}</h1>
        <p style={headerStyle.subtitle}>{page.subtitle}</p>
      </div>

      <div style={headerStyle.right}>
        <motion.div
          style={headerStyle.dateBadge}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎂 May 08, 2026
        </motion.div>

        <div style={headerStyle.profile}>
          <div style={headerStyle.avatar}>👸</div>
          <span style={headerStyle.profileName}>Birthday Girl</span>
        </div>
      </div>
    </motion.header>
  );
}
