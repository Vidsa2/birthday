import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCard from "../components/AnimatedCard";
import PhotoGallery from "../components/PhotoGallery";

const SESSION_KEY = "birthday_private_unlocked";
const SESSION_PASSWORD_KEY = "birthday_private_password";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PRIVATE_NOTES = [
  {
    emoji: "💌",
    title: "A Note Just For You",
    content:
      "This private space is for the most special birthday memories, sweet notes, and meaningful moments. 💜",
  },
  {
    emoji: "🌙",
    title: "A Gentle Reminder",
    content:
      "You are special, valued, and appreciated. May this birthday remind you how much happiness you bring to others.",
  },
  {
    emoji: "🌸",
    title: "Birthday Blessing",
    content:
      "May your 23rd year bring peace, success, confidence, and many reasons to smile. 🎂",
  },
];

function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, "1");
        sessionStorage.setItem(SESSION_PASSWORD_KEY, password);
        onUnlock(password);
      } else {
        setError(data.error || "Incorrect password 🥺");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setPassword("");
      }
    } catch (error) {
      setError("Could not reach the server. Is the backend running? 💜");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(216,180,254,0.5)",
            borderRadius: "2rem",
            padding: "3rem 2.5rem",
            textAlign: "center",
            boxShadow:
              "0 0 60px rgba(124,58,237,0.2), 0 20px 40px rgba(124,58,237,0.1)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              margin: "0 auto 1.5rem",
              boxShadow: "0 0 30px rgba(124,58,237,0.4)",
            }}
          >
            🔒
          </motion.div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.6rem",
              color: "#4a1a6b",
              marginBottom: "0.4rem",
            }}
          >
            Private Pie
          </h2>

          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: "#7c6b8f",
              fontSize: "1rem",
              marginBottom: "2rem",
            }}
          >
            This space holds special birthday memories 🌸
          </p>

          <form onSubmit={handleSubmit}>
            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter the secret password 💜"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.85rem 1.2rem",
                  borderRadius: "1rem",
                  border: error
                    ? "2px solid #ec4899"
                    : "2px solid rgba(168,85,247,0.4)",
                  background: "rgba(255,255,255,0.8)",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.95rem",
                  color: "#4a1a6b",
                  outline: "none",
                  textAlign: "center",
                  letterSpacing: "0.15em",
                  marginBottom: "0.75rem",
                  boxSizing: "border-box",
                }}
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ color: "#ec4899", fontSize: "0.82rem", marginBottom: "0.75rem" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: loading
                  ? "rgba(168,85,247,0.4)"
                  : "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "#fff",
                border: "none",
                borderRadius: "1rem",
                fontFamily: "'Lato', sans-serif",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: loading || !password ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? "Checking... 💜" : "🔓 Unlock"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function PrivateContent({ password }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemories() {
      try {
        const res = await fetch(`${API_BASE}/api/private-content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });

        const data = await res.json();

        if (data.success) {
          setMemories(data.memories || []);
        }
      } catch (error) {
        console.error("Failed to load private memories:", error);
      }

      setLoading(false);
    }

    if (password) {
      loadMemories();
    }
  }, [password]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <AnimatedCard delay={0} glow style={{ textAlign: "center", padding: "2.5rem", background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.08))" }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            margin: "0 auto 1.25rem",
            boxShadow: "0 0 40px rgba(124,58,237,0.5)",
          }}
        >
          🔓
        </motion.div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.4rem",
          }}
        >
          Welcome to the Secret Space 💜
        </h1>

        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.2rem", color: "#7c6b8f" }}>
          A private place for special birthday memories 🌸
        </p>
      </AnimatedCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        {PRIVATE_NOTES.map((note, index) => (
          <AnimatedCard key={index} delay={0.15 + index * 0.1} glow gradient>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}
            >
              {note.emoji}
            </motion.div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#4a1a6b", marginBottom: "0.5rem" }}>
              {note.title}
            </h3>

            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: "#7c6b8f", lineHeight: 1.6 }}>
              {note.content}
            </p>
          </AnimatedCard>
        ))}
      </div>

      {!loading && memories.length > 0 && (
        <AnimatedCard delay={0.4}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#4a1a6b", marginBottom: "1.25rem" }}>
            💫 Private Memories
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08 }}
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(216,180,254,0.4)",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                }}
              >
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#7c3aed", marginBottom: "4px", fontSize: "0.95rem" }}>
                  {memory.title || "Memory"}
                </h4>

                <p style={{ fontFamily: "'Dancing Script', cursive", color: "#4a1a6b", fontSize: "1rem", lineHeight: 1.5 }}>
                  {memory.content}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      )}

      <AnimatedCard delay={0.45} style={{ padding: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#4a1a6b", marginBottom: "1.25rem" }}>
          🌸 Private Photos
        </h2>

        <PhotoGallery collectionName="private_photos" />
      </AnimatedCard>
    </motion.div>
  );
}

export default function PrivatePie() {
  const [unlocked, setUnlocked] = useState(false);
  const [unlockedPassword, setUnlockedPassword] = useState("");

  useEffect(() => {
    const savedUnlocked = sessionStorage.getItem(SESSION_KEY);
    const savedPassword = sessionStorage.getItem(SESSION_PASSWORD_KEY);

    if (savedUnlocked && savedPassword) {
      setUnlocked(true);
      setUnlockedPassword(savedPassword);
    }
  }, []);

  function handleUnlock(password) {
    setUnlockedPassword(password);
    setUnlocked(true);
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div key="lock" exit={{ opacity: 0, scale: 0.9 }}>
            <LockScreen onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PrivateContent password={unlockedPassword} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}