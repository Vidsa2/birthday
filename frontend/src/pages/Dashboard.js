import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import AnimatedCard from "../components/AnimatedCard";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const QUICK_LINKS = [
  {
    path: "/surprise",
    icon: "🎁",
    label: "Open Surprises",
    color: "#7c3aed",
    bg: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.06))",
  },
  {
    path: "/cutie-pie",
    icon: "📸",
    label: "View Photos",
    color: "#ec4899",
    bg: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(249,168,212,0.06))",
  },
  {
    path: "/private-pie",
    icon: "🔒",
    label: "Private Memories",
    color: "#f59e0b",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(252,211,77,0.06))",
  },
];

const STATS = [
  { label: "Turning", value: "23", emoji: "🎂", color: "#7c3aed" },
  { label: "Born", value: "2003", emoji: "🌸", color: "#ec4899" },
  { label: "Birthday", value: "May 08", emoji: "🎉", color: "#a855f7" },
  { label: "Star Sign", value: "Taurus", emoji: "♉", color: "#f59e0b" },
];

const WISHES = [
  "May your 23rd year be filled with endless joy 🌸",
  "May your birthday be as bright and beautiful as your smile 💜",
  "Here is to dreams, happiness, and beautiful memories ✨",
  "Wishing you love, peace, and birthday magic 🎁",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [latestPhotos, setLatestPhotos] = useState([]);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const res = await fetch(`${API_BASE}/api/photos?collectionName=photos`);
        const data = await res.json();

        if (res.ok) {
          setLatestPhotos(data.photos || []);
        }
      } catch (error) {
        console.error("Dashboard photo load error:", error);
      }
    }

    loadPhotos();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <AnimatedCard delay={0} glow style={{ textAlign: "center", padding: "2.5rem" }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}
        >
          🎂
        </motion.div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            background: "linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          Happy 23rd Birthday!
        </h1>

        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "1.4rem",
            color: "#7c6b8f",
            marginBottom: "1.5rem",
          }}
        >
          Wishing you the most magical day ever 🌟
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          {QUICK_LINKS.map((link) => (
            <motion.button
              key={link.path}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(link.path)}
              style={{
                background: `linear-gradient(135deg, ${link.color}, ${link.color}bb)`,
                color: "#fff",
                border: "none",
                borderRadius: "2rem",
                padding: "0.7rem 1.5rem",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontWeight: "700",
                fontSize: "0.9rem",
                boxShadow: `0 4px 15px ${link.color}44`,
              }}
            >
              {link.icon} {link.label}
            </motion.button>
          ))}
        </div>
      </AnimatedCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
        {STATS.map((stat, index) => (
          <AnimatedCard key={stat.label} delay={0.1 + index * 0.05} gradient>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
              style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
            >
              {stat.emoji}
            </motion.div>

            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem",
                fontWeight: "700",
                color: stat.color,
                marginBottom: "2px",
              }}
            >
              {stat.value}
            </div>

            <div style={{ fontSize: "0.75rem", color: "#7c6b8f", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {stat.label}
            </div>
          </AnimatedCard>
        ))}
      </div>

      <AnimatedCard delay={0.25}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            color: "#4a1a6b",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ⏰ Countdown to May 08
        </h2>

        <CountdownTimer />
      </AnimatedCard>

      <AnimatedCard delay={0.3} gradient>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            color: "#4a1a6b",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          💌 Birthday Wishes
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {WISHES.map((wish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(216,180,254,0.35)",
                borderRadius: "12px",
                padding: "0.85rem 1.1rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>💜</span>
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.05rem", color: "#4a1a6b", lineHeight: 1.4 }}>
                {wish}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>

      {latestPhotos.length > 0 && (
        <AnimatedCard delay={0.35}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              color: "#4a1a6b",
              marginBottom: "1rem",
            }}
          >
            🌸 Latest Memories
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem" }}>
            {latestPhotos.slice(0, 6).map((photo) => (
              <img
                key={photo.publicId}
                src={photo.imageUrl}
                alt={photo.name || "Birthday memory"}
                style={{
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  border: "3px solid rgba(168,85,247,0.35)",
                  boxShadow: "0 4px 18px rgba(124,58,237,0.16)",
                }}
              />
            ))}
          </div>
        </AnimatedCard>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {QUICK_LINKS.map((link, index) => (
          <AnimatedCard
            key={link.path}
            delay={0.4 + index * 0.08}
            onClick={() => navigate(link.path)}
            style={{ cursor: "pointer", background: link.bg }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              style={{ fontSize: "3rem", marginBottom: "0.75rem" }}
            >
              {link.icon}
            </motion.div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: link.color, marginBottom: "4px" }}>
              {link.label}
            </h3>

            <p style={{ fontSize: "0.8rem", color: "#7c6b8f" }}>
              {link.path === "/surprise" && "Animations, music & gifts"}
              {link.path === "/cutie-pie" && "Upload & view photos"}
              {link.path === "/private-pie" && "Password-protected memories"}
            </p>

            <div
              style={{
                marginTop: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: link.color,
                fontWeight: "700",
                fontSize: "0.8rem",
              }}
            >
              Visit →
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}