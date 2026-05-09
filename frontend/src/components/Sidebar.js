import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/dashboard',   label: 'Dashboard',   icon: '🏠', desc: 'Overview' },
  { path: '/surprise',    label: 'Surprise',    icon: '🎁', desc: 'Birthday Magic' },
  { path: '/cutie-pie',   label: 'Cutie Pie',   icon: '📸', desc: 'Photo Gallery' },
  { path: '/private-pie', label: 'Private Pie', icon: '🔒', desc: 'Secret Space' },
];

const sidebarStyles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '260px',
    height: '100vh',
    background: 'linear-gradient(180deg, #1a0530 0%, #2d0a4a 50%, #1a0530 100%)',
    borderRight: '1px solid rgba(168,85,247,0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflowY: 'auto',
    boxShadow: '4px 0 30px rgba(124,58,237,0.15)',
  },
  logo: {
    padding: '1.8rem 1.4rem 1.2rem',
    borderBottom: '1px solid rgba(168,85,247,0.15)',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
  },
  appName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: 1.2,
  },
  appSub: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: '0.8rem',
    color: '#c084fc',
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.75rem 1rem',
    borderRadius: '14px',
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  navIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
    transition: 'all 0.25s ease',
  },
  navText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  navLabel: {
    fontSize: '0.88rem',
    fontWeight: '700',
    letterSpacing: '0.01em',
  },
  navDesc: {
    fontSize: '0.72rem',
    opacity: 0.7,
  },
  footer: {
    margin: '0.75rem',
    padding: '1rem',
    borderRadius: '14px',
    background: 'rgba(168,85,247,0.08)',
    border: '1px solid rgba(168,85,247,0.2)',
    textAlign: 'center',
  },
  footerEmoji: {
    fontSize: '1.3rem',
    display: 'block',
    marginBottom: '4px',
  },
  footerTitle: {
    color: '#c084fc',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  footerSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.65rem',
    marginTop: '2px',
  },
};

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      style={sidebarStyles.sidebar}
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
    >
      {/* Logo */}
      <div style={sidebarStyles.logo}>
        <motion.div
          style={sidebarStyles.logoIcon}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
        >
          🎂
        </motion.div>
        <div style={sidebarStyles.appName}>Birthday Memories</div>
        <div style={sidebarStyles.appSub}>✨ May 08 Special Surprise ✨</div>
      </div>

      {/* Navigation */}
      <nav style={sidebarStyles.nav}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                ...sidebarStyles.navItem,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(236,72,153,0.3))'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(168,85,247,0.4)'
                  : '1px solid transparent',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    width: '3px',
                    height: '60%',
                    borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #7c3aed, #ec4899)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div style={{
                ...sidebarStyles.navIcon,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(236,72,153,0.3))'
                  : 'rgba(255,255,255,0.05)',
              }}>
                {item.icon}
              </div>

              <div style={sidebarStyles.navText}>
                <span style={{
                  ...sidebarStyles.navLabel,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                }}>
                  {item.label}
                </span>
                <span style={{
                  ...sidebarStyles.navDesc,
                  color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                }}>
                  {item.desc}
                </span>
              </div>

              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#c084fc' }}
                >
                  ✦
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={sidebarStyles.footer}>
        <motion.span
          style={sidebarStyles.footerEmoji}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💜
        </motion.span>
        <div style={sidebarStyles.footerTitle}>Birthday App v1.0.0</div>
        <div style={sidebarStyles.footerSub}>Made with love 🌸</div>
      </div>
    </motion.aside>
  );
}
