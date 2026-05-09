import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCard({
  children,
  delay = 0,
  glow = false,
  gradient = false,
  onClick,
  style = {},
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: glow
        ? '0 12px 40px rgba(124,58,237,0.35)'
        : '0 12px 32px rgba(124,58,237,0.18)'
      }}
      onClick={onClick}
      style={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.06))'
          : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(16px)',
        border: glow
          ? '1px solid rgba(168,85,247,0.5)'
          : '1px solid rgba(216,180,254,0.35)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        boxShadow: glow
          ? '0 0 20px rgba(168,85,247,0.25), 0 8px 24px rgba(124,58,237,0.1)'
          : '0 4px 20px rgba(124,58,237,0.08)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
