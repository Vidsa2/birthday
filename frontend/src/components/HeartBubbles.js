import React, { useEffect, useState } from 'react';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const HEART_EMOJIS = ['💜', '💗', '💕', '💖', '🌸', '✨', '⭐', '💫'];

export default function HeartBubbles({ count = 12 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const initial = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      left: randomBetween(5, 95),
      size: randomBetween(14, 28),
      duration: randomBetween(8, 18),
      delay: randomBetween(0, 10),
    }));
    setHearts(initial);
  }, [count]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      {hearts.map(h => (
        <span
          key={h.id}
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            opacity: 0.18,
            animation: `rise ${h.duration}s ${h.delay}s linear infinite`,
            userSelect: 'none',
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
