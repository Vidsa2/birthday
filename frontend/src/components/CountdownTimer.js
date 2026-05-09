import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function getTimeLeft() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 4, 8); // May 8
  if (now > target) target.setFullYear(target.getFullYear() + 1);
  const diff = target - now;
  if (diff <= 0) return null; // It's her birthday!
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

const boxStyle = {
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(216,180,254,0.5)',
  borderRadius: '16px',
  padding: '1rem 1.2rem',
  textAlign: 'center',
  minWidth: '72px',
  boxShadow: '0 4px 20px rgba(124,58,237,0.12)',
};

const numStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '2rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  lineHeight: 1,
};

const labelStyle = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#7c6b8f',
  fontWeight: '700',
  marginTop: '4px',
};

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: '1.5rem',
          fontFamily: "'Dancing Script', cursive",
          fontSize: '2rem',
          color: '#7c3aed',
        }}
      >
        🎉 Today is her BIRTHDAY! 🎉
      </motion.div>
    );
  }

  const units = [
    { value: time.days,    label: 'Days' },
    { value: time.hours,   label: 'Hours' },
    { value: time.minutes, label: 'Minutes' },
    { value: time.seconds, label: 'Seconds' },
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {units.map(({ value, label }) => (
        <motion.div
          key={label}
          style={boxStyle}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <motion.div
            key={value}
            style={numStyle}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(value).padStart(2, '0')}
          </motion.div>
          <div style={labelStyle}>{label}</div>
        </motion.div>
      ))}
    </div>
  );
}
