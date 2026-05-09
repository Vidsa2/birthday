import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import GiftBoxAnimation from "../components/GiftBoxAnimation";
import AnimatedCard from "../components/AnimatedCard";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/*
  Surprise page lock date.
  Page opens automatically on May 15, 2026.
*/
const UNLOCK_DATE = new Date("2026-05-15T00:00:00");

const SURPRISE_BLOCKS = [
  {
    id: "welcome",
    emoji: "🌟",
    title: "Welcome, Birthday Princess!",
    content:
      "Today is all about your special day. Get ready for a magical birthday experience made with care! 👸",
    color: "#7c3aed",
  },
  {
    id: "age",
    emoji: "🎂",
    title: "You are Turning 23!",
    content:
      "23 years of smiles, memories, and beautiful moments. Here is to the next wonderful chapter! ✨",
    color: "#ec4899",
  },
  {
    id: "message",
    emoji: "💌",
    title: "A Special Message",
    content:
      "May this birthday bring happiness, peace, success, and many unforgettable memories. 💜",
    color: "#a855f7",
  },
  {
    id: "wish",
    emoji: "🌸",
    title: "Birthday Wish",
    content:
      "May every dream in your heart come true. May this year be full of light and joy. Happy Birthday! 🎊",
    color: "#f59e0b",
  },
];

const BALLOON_COLORS = [
  "#7c3aed",
  "#ec4899",
  "#a855f7",
  "#f9a8d4",
  "#c084fc",
  "#fbbf24",
];

function getTimeLeft(targetDate) {
  const total = targetDate.getTime() - new Date().getTime();

  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function Balloons() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {BALLOON_COLORS.map((color, index) => (
        <motion.div
          key={index}
          initial={{ y: "110vh", x: `${10 + index * 14}vw` }}
          animate={{ y: "-20vh" }}
          transition={{
            duration: 6 + index * 0.8,
            repeat: Infinity,
            delay: index * 1.2,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: "50px",
            height: "65px",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: color,
            opacity: 0.6,
            boxShadow: `0 0 20px ${color}88`,
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "50%",
              width: "1px",
              height: "30px",
              background: `${color}88`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function CountdownBox({ label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        minWidth: "86px",
        padding: "1rem 0.75rem",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(216,180,254,0.45)",
        boxShadow: "0 12px 28px rgba(124,58,237,0.1)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "1.9rem",
          fontWeight: 900,
          color: "#7c3aed",
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, "0")}
      </div>

      <div
        style={{
          marginTop: "0.45rem",
          fontSize: "0.75rem",
          color: "#7c6b8f",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function LockedSurpriseScreen({ timeLeft, onBypass }) {
  return (
    <div
      style={{
        minHeight: "70vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      <Balloons />

      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "12%",
          left: "12%",
          fontSize: "2.4rem",
          opacity: 0.6,
        }}
      >
        🎁
      </motion.div>

      <motion.div
        animate={{ y: [0, -22, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: "12%",
          right: "12%",
          fontSize: "2.5rem",
          opacity: 0.6,
        }}
      >
        💜
      </motion.div>

      <AnimatedCard
        delay={0}
        glow
        style={{
          width: "min(900px, 100%)",
          textAlign: "center",
          padding: "3rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: "4rem", marginBottom: "1rem" }}
        >
          🔒🎀
        </motion.div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.6rem)",
            background: "linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.7rem",
          }}
        >
          Surprise Is Not Ready Yet 💜
        </h1>

        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "1.35rem",
            color: "#7c6b8f",
            marginBottom: "0.8rem",
          }}
        >
          Wait one more week for the real birthday surprise ✨
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.2rem",
            borderRadius: "999px",
            background: "rgba(124,58,237,0.1)",
            color: "#7c3aed",
            fontWeight: 900,
            marginBottom: "1.5rem",
          }}
        >
          🎂 Opens on May 15, 2026
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.8rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <CountdownBox label="Days" value={timeLeft.days} />
          <CountdownBox label="Hours" value={timeLeft.hours} />
          <CountdownBox label="Minutes" value={timeLeft.minutes} />
          <CountdownBox label="Seconds" value={timeLeft.seconds} />
        </div>

        <p
          style={{
            color: "#6b4e88",
            lineHeight: 1.7,
            maxWidth: "580px",
            margin: "0 auto",
            fontWeight: 600,
          }}
        >
          Today is May 08, but this page is still preparing a bigger magical
          moment. Come back on May 15 to unlock the full surprise page 🎁✨
        </p>
      </AnimatedCard>

      {/* Hidden bypass button - right bottom corner */}
      <button
        type="button"
        onClick={onBypass}
        aria-label="Hidden bypass"
        title=""
        style={{
          position: "fixed",
          right: "14px",
          bottom: "14px",
          width: "42px",
          height: "42px",
          border: "none",
          borderRadius: "50%",
          background: "transparent",
          color: "transparent",
          opacity: 0.01,
          cursor: "default",
          zIndex: 999,
        }}
      >
        .
      </button>
    </div>
  );
}

function CakeAnimation() {
  const [candles, setCandles] = useState([true, true, true]);
  const allOut = candles.every((candle) => !candle);

  return (
    <div style={{ textAlign: "center" }}>
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: "5rem", marginBottom: "0.5rem" }}
      >
        🎂
      </motion.div>

      <p
        style={{
          fontFamily: "'Dancing Script', cursive",
          color: "#7c3aed",
          fontSize: "1.1rem",
          marginBottom: "0.75rem",
        }}
      >
        {allOut
          ? "🎉 Wish made! Dreams come true!"
          : "Tap the candles to blow them out!"}
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {candles.map((lit, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const next = [...candles];
              next[index] = false;
              setCandles(next);
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              cursor: lit ? "pointer" : "default",
              filter: lit ? "none" : "grayscale(1)",
              transition: "all 0.3s",
            }}
          >
            {lit ? "🕯️" : "🌑"}
          </motion.button>
        ))}
      </div>

      {allOut && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ marginTop: "1rem", fontSize: "2rem" }}
        >
          🌟✨🎊
        </motion.div>
      )}
    </div>
  );
}

export default function Surprise() {
  const [confetti, setConfetti] = useState(false);
  const [showBlocks, setShowBlocks] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [slidePhotos, setSlidePhotos] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(UNLOCK_DATE));
  const [bypassUnlocked, setBypassUnlocked] = useState(false);
  const [bypassOpening, setBypassOpening] = useState(false);

  const audioRef = useRef(null);

  const pageUnlocked = useMemo(() => {
    return timeLeft.total <= 0 || bypassUnlocked;
  }, [timeLeft.total, bypassUnlocked]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(UNLOCK_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!pageUnlocked) return;

    const timers = SURPRISE_BLOCKS.map((_, index) =>
      setTimeout(() => setShowBlocks(index + 1), index * 800 + 400)
    );

    return () => timers.forEach(clearTimeout);
  }, [pageUnlocked]);

  useEffect(() => {
    if (!pageUnlocked) return;

    async function loadPhotos() {
      try {
        const res = await fetch(`${API_BASE}/api/photos?collectionName=photos`);
        const data = await res.json();

        if (res.ok) {
          setSlidePhotos(data.photos || []);
        }
      } catch (error) {
        console.error("Surprise photo load error:", error);
      }
    }

    loadPhotos();
  }, [pageUnlocked]);

  useEffect(() => {
    if (!pageUnlocked) return;
    if (slidePhotos.length === 0) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slidePhotos.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [pageUnlocked, slidePhotos]);

  async function toggleAudio() {
    if (!audioRef.current) return;

    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (error) {
      console.error("Audio play error:", error);
    }
  }

  function handleGiftOpen() {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 5000);
  }

  function handleBypass() {
    if (bypassOpening || bypassUnlocked) return;

    setBypassOpening(true);

    const randomDelay = Math.floor(Math.random() * 1800) + 700;

    setTimeout(() => {
      setBypassUnlocked(true);
      setBypassOpening(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
    }, randomDelay);
  }

  if (!pageUnlocked) {
    return (
      <>
        <LockedSurpriseScreen timeLeft={timeLeft} onBypass={handleBypass} />

        <AnimatePresence>
          {bypassOpening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                background: "rgba(45, 23, 66, 0.65)",
                display: "grid",
                placeItems: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  padding: "2rem",
                  borderRadius: "28px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,240,252,0.97))",
                  textAlign: "center",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ fontSize: "4rem", marginBottom: "0.7rem" }}
                >
                  🎁
                </motion.div>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#7c3aed",
                    margin: 0,
                  }}
                >
                  Secret bypass opening...
                </h2>

                <p style={{ color: "#7c6b8f", marginTop: "0.6rem" }}>
                  Preparing a random surprise unlock ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        position: "relative",
      }}
    >
      {confetti && (
        <Confetti
          numberOfPieces={250}
          colors={[
            "#7c3aed",
            "#ec4899",
            "#a855f7",
            "#f9a8d4",
            "#fbbf24",
            "#fff",
          ]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 200 }}
        />
      )}

      <audio ref={audioRef} src="/audio/birthday.mp3" loop />

      <AnimatedCard
        delay={0}
        glow
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "180px",
        }}
      >
        <Balloons />

        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.h1
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              background: "linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}
          >
            🎉 Surprise! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "1.3rem",
              color: "#7c6b8f",
            }}
          >
            Your magical birthday journey begins here ✨
          </motion.p>

          {bypassUnlocked && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "0.75rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                background: "rgba(236,72,153,0.1)",
                color: "#ec4899",
                fontWeight: 900,
                fontSize: "0.82rem",
              }}
            >
              Secret bypass unlocked ✨
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              display: "block",
              margin: "1rem auto 0",
              background: playing
                ? "linear-gradient(135deg, #ec4899, #f9a8d4)"
                : "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              border: "none",
              borderRadius: "2rem",
              padding: "0.6rem 1.4rem",
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              fontWeight: "700",
              fontSize: "0.85rem",
              boxShadow: "0 4px 15px rgba(124,58,237,0.3)",
            }}
          >
            {playing ? "⏸ Pause Music" : "🎵 Play Birthday Music"}
          </motion.button>
        </div>
      </AnimatedCard>

      <AnimatedCard
        delay={0.2}
        gradient
        style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}
      >
        <GiftBoxAnimation
          message="You are special, appreciated, and celebrated today. Happy 23rd Birthday! 💜🎊"
          onOpen={handleGiftOpen}
        />
      </AnimatedCard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {SURPRISE_BLOCKS.slice(0, showBlocks).map((block, index) => (
          <AnimatedCard key={block.id} delay={0}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
              style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}
            >
              {block.emoji}
            </motion.div>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                color: block.color,
                marginBottom: "0.5rem",
              }}
            >
              {block.title}
            </h3>

            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1rem",
                color: "#4a1a6b",
                lineHeight: 1.6,
              }}
            >
              {block.content}
            </p>
          </AnimatedCard>
        ))}
      </div>

      <AnimatedCard delay={0.5} style={{ padding: "2rem" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            color: "#4a1a6b",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          🕯️ Make a Wish!
        </h2>

        <CakeAnimation />
      </AnimatedCard>

      {slidePhotos.length > 0 && (
        <AnimatedCard delay={0.6} glow style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              color: "#4a1a6b",
              marginBottom: "1rem",
            }}
          >
            📸 Memory Slideshow
          </h2>

          <div
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              aspectRatio: "16/9",
              background: "#f3e8ff",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={slidePhotos[slideIndex]?.publicId}
                src={slidePhotos[slideIndex]?.imageUrl}
                alt={slidePhotos[slideIndex]?.name || "Birthday memory"}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </AnimatePresence>

            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "6px",
              }}
            >
              {slidePhotos.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setSlideIndex(index)}
                  style={{
                    width: index === slideIndex ? "20px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background:
                      index === slideIndex ? "#fff" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </AnimatedCard>
      )}

      <AnimatedCard
        delay={0.7}
        glow
        gradient
        style={{ textAlign: "center", padding: "3rem 2rem" }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: "4rem", marginBottom: "1rem" }}
        >
          💜
        </motion.div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            color: "#4a1a6b",
            marginBottom: "0.75rem",
          }}
        >
          A Beautiful Birthday Memory
        </h2>

        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "1.2rem",
            color: "#7c6b8f",
            lineHeight: 1.7,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          Today is your day. May every moment bring happiness, every smile become
          a memory, and every wish move closer to coming true. Happy Birthday!
          🌸🎊
        </p>
      </AnimatedCard>
    </div>
  );
}