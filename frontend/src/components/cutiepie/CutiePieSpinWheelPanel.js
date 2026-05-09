import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WHEEL_SEGMENTS = [
  { label: "Harunica", emoji: "👑", type: "harunica" },
  { label: "Others", emoji: "😂", type: "others" },
  { label: "Harunica", emoji: "💜", type: "harunica" },
  { label: "Others", emoji: "🤭", type: "others" },
  { label: "Harunica", emoji: "🌸", type: "harunica" },
  { label: "Others", emoji: "🙈", type: "others" },
  { label: "Harunica", emoji: "✨", type: "harunica" },
  { label: "Others", emoji: "😅", type: "others" },
];

const WHEEL_ANSWERS = [
  "Obviously... Harunica is the prettiest girl in the world 😊💜",
  "No competition at all... Harunica wins with that beautiful smile 🌸💜",
  "The wheel knows the truth... it is always Harunica 👑✨",
  "Even the stars agree... Harunica is the prettiest today 🌟💜",
  "Result confirmed... Harunica is the birthday queen 👑🎂",
  "The world voted quietly... Harunica wins beautifully 😊🌸",
  "Every spin says the same thing... Harunica is special 💜✨",
  "The cutest answer is ready... Harunica, of course 🤭💖",
  "Pretty, sweet, and shining... Harunica takes the crown 👑💜",
  "Final answer from the magic wheel... Harunica forever wins 🌷✨",
];

const NAME_LETTERS = ["H", "A", "R", "U", "N", "I", "C", "A"];

function pickRandom(items = []) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray(array = []) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function createGiftBoxes() {
  const letterBoxes = NAME_LETTERS.map((letter, index) => ({
    id: `letter-${index}-${Date.now()}`,
    type: "letter",
    letter,
    opened: false,
    visible: true,
  }));

  const emptyBoxes = Array.from({ length: 8 }, (_, index) => ({
    id: `empty-${index}-${Date.now()}`,
    type: "empty",
    letter: "",
    opened: false,
    visible: true,
  }));

  return shuffleArray([...letterBoxes, ...emptyBoxes]);
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
}

function playTone(frequency = 440, duration = 0.08, type = "sine", volume = 0.04) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    // sound is optional
  }
}

function playSpinTick() {
  playTone(260 + Math.random() * 260, 0.035, "square", 0.025);
}

function playPopSound() {
  playTone(740, 0.055, "triangle", 0.05);
  setTimeout(() => playTone(980, 0.06, "sine", 0.04), 60);
}

function playLetterSound() {
  playTone(520, 0.08, "sine", 0.045);
  setTimeout(() => playTone(720, 0.08, "triangle", 0.045), 90);
}

function playBirthdaySound() {
  playTone(660, 0.12, "sine", 0.06);
  setTimeout(() => playTone(760, 0.12, "sine", 0.06), 140);
  setTimeout(() => playTone(920, 0.16, "triangle", 0.06), 280);
}

export default function CutiePieSpinWheelPanel() {
  const spinSoundRef = useRef(null);

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultText, setResultText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [giftBoxes, setGiftBoxes] = useState(() => createGiftBoxes());
  const [birthdayPopup, setBirthdayPopup] = useState(false);

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  const openedLetters = useMemo(() => {
    return giftBoxes
      .filter((box) => box.type === "letter" && box.opened)
      .map((box) => box.letter);
  }, [giftBoxes]);

  function startSpinSound() {
    stopSpinSound();
    spinSoundRef.current = setInterval(playSpinTick, 120);
  }

  function stopSpinSound() {
    if (spinSoundRef.current) {
      clearInterval(spinSoundRef.current);
      spinSoundRef.current = null;
    }
  }

  function spinWheel() {
    if (spinning) return;

    setShowResult(false);
    setResultText("");
    setSpinning(true);
    startSpinSound();

    const harunicaIndexes = [0, 2, 4, 6];
    const pickedIndex = pickRandom(harunicaIndexes);
    const targetCenterAngle = pickedIndex * segmentAngle + segmentAngle / 2;

    setRotation((previousRotation) => {
      const currentRotation = ((previousRotation % 360) + 360) % 360;
      const neededRotation =
        (360 - targetCenterAngle - currentRotation + 360) % 360;

      return previousRotation + 360 * 8 + neededRotation;
    });

    setTimeout(() => {
      stopSpinSound();
      playPopSound();

      setSpinning(false);
      setResultText(pickRandom(WHEEL_ANSWERS));
      setShowResult(true);

      setTimeout(() => {
        setShowResult(false);
        setResultText("");
      }, 5000);
    }, 4300);
  }

  function handleGiftClick(boxId) {
    setGiftBoxes((prev) => {
      const clicked = prev.find((box) => box.id === boxId);
      if (!clicked || !clicked.visible || clicked.opened) return prev;

      if (clicked.type === "empty") {
        playPopSound();

        return prev.map((box) =>
          box.id === boxId ? { ...box, visible: false } : box
        );
      }

      playLetterSound();

      const next = prev.map((box) =>
        box.id === boxId ? { ...box, opened: true } : box
      );

      const openedCount = next.filter(
        (box) => box.type === "letter" && box.opened
      ).length;

      if (openedCount === 8) {
        setTimeout(() => {
          playBirthdaySound();
          setBirthdayPopup(true);
        }, 350);
      }

      return next;
    });
  }

  function resetGifts() {
    playPopSound();
    setBirthdayPopup(false);
    setGiftBoxes(createGiftBoxes());
  }

  return (
    <div className="cutie-wheel-panel">
      <div className="spin-wheel-section">
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#4a1a6b",
            fontSize: "1.2rem",
            marginBottom: "0.4rem",
          }}
        >
          Who is the prettiest girl in the world? 🤭
        </h3>

        <div className="wheel-wrap">
          <div
            style={{
              position: "absolute",
              top: "-7px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "18px solid transparent",
              borderRight: "18px solid transparent",
              borderTop: "32px solid #ec4899",
              zIndex: 10,
              filter: "drop-shadow(0 4px 8px rgba(236,72,153,0.35))",
            }}
          />

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4.25, ease: [0.18, 0.78, 0.25, 1] }}
            style={{
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              position: "relative",
              overflow: "hidden",
              border: "10px solid rgba(255,255,255,0.9)",
              boxShadow:
                "0 18px 45px rgba(124,58,237,0.25), inset 0 0 18px rgba(255,255,255,0.45)",
              background:
                "conic-gradient(from 0deg, #ec4899 0deg 45deg, #f59e0b 45deg 90deg, #8b5cf6 90deg 135deg, #06b6d4 135deg 180deg, #a855f7 180deg 225deg, #fb7185 225deg 270deg, #7c3aed 270deg 315deg, #22c55e 315deg 360deg)",
            }}
          >
            {WHEEL_SEGMENTS.map((item, index) => {
              const cssCenterAngle = index * segmentAngle + segmentAngle / 2;
              const mathAngle = cssCenterAngle - 90;
              const radius = 92;

              const x = 140 + radius * Math.cos((mathAngle * Math.PI) / 180);
              const y = 140 + radius * Math.sin((mathAngle * Math.PI) / 180);

              return (
                <div
                  key={`${item.label}-${index}`}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                    width: "58px",
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "0.64rem",
                    lineHeight: 1.15,
                    textShadow: "0 2px 5px rgba(0,0,0,0.35)",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ fontSize: "1.12rem", marginBottom: "2px" }}>
                    {item.emoji}
                  </div>
                  <div>{item.label}</div>
                </div>
              );
            })}

            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 8px 22px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                border: "5px solid rgba(255,255,255,0.9)",
              }}
            >
              💜
            </div>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning}
          style={{
            width: "180px",
            margin: "0 auto",
            border: "none",
            borderRadius: "16px",
            padding: "0.85rem 1.25rem",
            background: spinning
              ? "rgba(124,58,237,0.45)"
              : "linear-gradient(135deg, #7c3aed, #ec4899)",
            color: "#fff",
            fontWeight: 900,
            cursor: spinning ? "not-allowed" : "pointer",
            boxShadow: "0 12px 25px rgba(124,58,237,0.22)",
          }}
        >
          {spinning ? "Spinning..." : "Spin Wheel ✨"}
        </button>

        <div style={{ minHeight: "48px" }}>
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                style={{
                  color: "#6d28d9",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                {resultText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="gift-name-game">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.7rem",
            marginBottom: "0.75rem",
          }}
        >
          <div>
            <div style={{ color: "#4a1a6b", fontWeight: 900 }}>
              🎁 Name Gift Boxes
            </div>
            <div style={{ color: "#7c6b8f", fontSize: "0.78rem" }}>
              Find 8 letters. Empty boxes disappear.
            </div>
          </div>

          <button
            type="button"
            onClick={resetGifts}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "0.5rem 0.8rem",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              color: "#fff",
              fontWeight: 900,
              cursor: "pointer",
              fontSize: "0.78rem",
            }}
          >
            Reset
          </button>
        </div>

        <div className="gift-grid">
          {giftBoxes.map((box) => (
            <AnimatePresence key={box.id}>
              {box.visible && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleGiftClick(box.id)}
                  className="gift-box-btn"
                >
                  {box.opened ? box.letter : "🎁"}
                </motion.button>
              )}
            </AnimatePresence>
          ))}
        </div>

        <div
          style={{
            marginTop: "0.7rem",
            color: "#7c3aed",
            fontWeight: 900,
            fontSize: "0.85rem",
          }}
        >
          Opened: {openedLetters.join(" ")}
        </div>
      </div>

      <AnimatePresence>
        {birthdayPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBirthdayPopup(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(45, 23, 66, 0.68)",
              backdropFilter: "blur(8px)",
              display: "grid",
              placeItems: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(92vw, 560px)",
                borderRadius: "28px",
                padding: "2rem",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,240,252,0.97))",
                boxShadow: "0 28px 70px rgba(0,0,0,0.22)",
                textAlign: "center",
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ fontSize: "4rem", marginBottom: "0.6rem" }}
              >
                🎁
              </motion.div>

              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  color: "#7c3aed",
                }}
              >
                HARUNICA Unlocked! 💜
              </h2>

              <p
                style={{
                  margin: "1rem 0 0",
                  color: "#6d28d9",
                  lineHeight: 1.8,
                  fontWeight: 800,
                }}
              >
                Happy Birthday, Harunica! May your 23rd year be filled with
                smiles, surprises, soft memories, and beautiful dreams 🎂🌸✨
              </p>

              <button
                type="button"
                onClick={() => setBirthdayPopup(false)}
                style={{
                  marginTop: "1.2rem",
                  border: "none",
                  borderRadius: "16px",
                  padding: "0.85rem 1.35rem",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Close 💫
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}