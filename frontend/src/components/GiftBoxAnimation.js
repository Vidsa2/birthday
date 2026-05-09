import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GiftBoxAnimation({ message = "Happy Birthday! 🎉", onOpen }) {
  const [opened, setOpened] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  function handleClick() {
    if (opened) return;
    setOpened(true);
    setTimeout(() => setShowMessage(true), 800);
    onOpen?.();
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: opened ? 'default' : 'pointer' }}
      onClick={handleClick}
    >
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {/* Box body */}
        <motion.div
          animate={opened ? { y: 10, opacity: 0.6 } : { y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10px',
            width: '100px',
            height: '80px',
            borderRadius: '0 0 16px 16px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: '4px',
            height: '100%',
            background: 'rgba(255,255,255,0.3)',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }} />
        </motion.div>

        {/* Lid */}
        <motion.div
          animate={opened ? { y: -60, rotate: -20, opacity: 0 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          style={{
            position: 'absolute',
            top: '20px',
            left: 0,
            width: '120px',
            height: '30px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ec4899, #f9a8d4)',
            boxShadow: '0 4px 15px rgba(236,72,153,0.4)',
          }}
        />

        {/* Ribbon */}
        <motion.div
          animate={opened ? { scale: 0, opacity: 0 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2rem',
          }}
        >
          🎀
        </motion.div>

        {/* Stars burst on open */}
        <AnimatePresence>
          {opened && (
            <>
              {['⭐', '✨', '💜', '🌸', '💫'].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 60, y: 60, scale: 0, opacity: 1 }}
                  animate={{
                    x: 60 + (Math.cos(i * 72 * Math.PI / 180) * 80),
                    y: 60 + (Math.sin(i * 72 * Math.PI / 180) * 80),
                    scale: 1.5,
                    opacity: 0,
                  }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ position: 'absolute', fontSize: '1.3rem', pointerEvents: 'none' }}
                >
                  {emoji}
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {!opened && (
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: '#7c3aed',
            fontSize: '1rem',
          }}
        >
          Tap to open! 🎁
        </motion.p>
      )}

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1))',
              border: '2px solid rgba(168,85,247,0.4)',
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              textAlign: 'center',
              maxWidth: '280px',
            }}
          >
            <p style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1.1rem',
              color: '#7c3aed',
              lineHeight: 1.5,
            }}>
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
