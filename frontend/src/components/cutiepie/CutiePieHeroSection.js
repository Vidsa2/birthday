import React, { useRef, useState } from "react";
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

const BALLOON_DATA = [
  { id: 1, left: "8%", color: "#ec4899" },
  { id: 2, left: "20%", color: "#7c3aed" },
  { id: 3, left: "32%", color: "#f59e0b" },
  { id: 4, left: "68%", color: "#8b5cf6" },
  { id: 5, left: "80%", color: "#db2777" },
  { id: 6, left: "92%", color: "#9333ea" },
];

function pickRandom(items = []) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function smallChipStyle() {
  return {
    borderRadius: "999px",
    padding: "0.55rem 1rem",
    border: "1px solid rgba(168,85,247,0.25)",
    background: "rgba(255,255,255,0.72)",
    color: "#7c3aed",
    fontWeight: 700,
    fontSize: "0.92rem",
  };
}

function getPhotoTitle(photo) {
  return (
    photo?.note ||
    photo?.title ||
    photo?.caption ||
    photo?.name ||
    "A beautiful memory 💜"
  );
}

function getRandomPhotoItem(photos = []) {
  const items = [];

  photos.forEach((photo) => {
    const normalUrl =
      photo?.imageUrl ||
      photo?.url ||
      photo?.secure_url ||
      photo?.photoUrl ||
      photo?.normalImageUrl;

    const aiUrl =
      photo?.aiImageUrl ||
      photo?.aiUrl ||
      photo?.aiPhotoUrl ||
      photo?.editedImageUrl;

    if (normalUrl) {
      items.push({
        url: normalUrl,
        title: getPhotoTitle(photo),
        type: "Normal Picture",
      });
    }

    if (aiUrl) {
      items.push({
        url: aiUrl,
        title: getPhotoTitle(photo),
        type: "AI Picture",
      });
    }
  });

  return pickRandom(items);
}

function SpinningWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultText, setResultText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  function spinWheel() {
    if (spinning) return;

    setShowResult(false);
    setResultText("");
    setSpinning(true);

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
      setSpinning(false);
      setResultText(pickRandom(WHEEL_ANSWERS));
      setShowResult(true);

      setTimeout(() => {
        setShowResult(false);
        setResultText("");
      }, 5000);
    }, 4300);
  }

  return (
    <div
      style={{
        height: "100%",
        minHeight: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        textAlign: "center",
      }}
    >
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

      <div
        style={{
          position: "relative",
          width: "280px",
          height: "280px",
          margin: "0 auto",
        }}
      >
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
  );
}

export default function CutiePieHeroSection({
  photos = [],
  candles,
  toggleCandle,
  resetFun,
  currentBirthdaySong,
  goNextBirthdaySong,
  onDeleteBirthdaySong,
}) {
  const lastTapRef = useRef({ id: null, time: 0 });

  const [visibleBalloonIds, setVisibleBalloonIds] = useState(
    BALLOON_DATA.map((item) => item.id)
  );
  const [randomPhoto, setRandomPhoto] = useState(null);
  const [photoPopupOpen, setPhotoPopupOpen] = useState(false);
  const [candleSurprise, setCandleSurprise] = useState(false);

  function hideBalloon(id) {
    setVisibleBalloonIds((prev) => prev.filter((item) => item !== id));
  }

  function handleBalloonTouch(id) {
    const now = Date.now();

    if (
      lastTapRef.current.id === id &&
      now - lastTapRef.current.time <= 350
    ) {
      hideBalloon(id);
      lastTapRef.current = { id: null, time: 0 };
      return;
    }

    lastTapRef.current = { id, time: now };
  }

  function showAllBalloons() {
    setVisibleBalloonIds(BALLOON_DATA.map((item) => item.id));
  }

  function openRandomPhotoPopup() {
    const selected = getRandomPhotoItem(photos);

    if (!selected) {
      setRandomPhoto({
        url: "",
        title: "Upload a photo first to unlock this surprise 💜",
        type: "No Photo",
      });
      setPhotoPopupOpen(true);
      return;
    }

    setRandomPhoto(selected);
    setPhotoPopupOpen(true);
  }

  function showAnotherRandomPhoto() {
    const selected = getRandomPhotoItem(photos);

    if (!selected) {
      setRandomPhoto({
        url: "",
        title: "Upload a photo first to unlock this surprise 💜",
        type: "No Photo",
      });
      return;
    }

    setRandomPhoto(selected);
  }

  function handleCandleClick(index) {
    const nextCandles = candles.map((item, i) => (i === index ? !item : item));

    toggleCandle(index);

    if (nextCandles.every((item) => !item)) {
      setCandleSurprise(true);

      setTimeout(() => {
        setCandleSurprise(false);
      }, 5000);
    }
  }

  return (
    <div
      style={{
        padding: "1.6rem",
        borderRadius: "26px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,235,255,0.94))",
        border: "1px solid rgba(216,180,254,0.45)",
        boxShadow: "0 16px 35px rgba(124,58,237,0.12)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.2rem",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "28px",
            border: "1px solid rgba(216,180,254,0.45)",
            minHeight: "360px",
            padding: "1.6rem",
            background: "rgba(255,255,255,0.45)",
            overflow: "hidden",
          }}
        >
          {BALLOON_DATA.map((balloon, index) => {
            const isVisible = visibleBalloonIds.includes(balloon.id);

            return (
              <AnimatePresence key={balloon.id}>
                {isVisible && (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ y: [0, -16, 0], scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      y: {
                        duration: 3 + index,
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                      scale: { duration: 0.2 },
                      opacity: { duration: 0.2 },
                    }}
                    onDoubleClick={() => hideBalloon(balloon.id)}
                    onTouchEnd={(event) => {
                      event.preventDefault();
                      handleBalloonTouch(balloon.id);
                    }}
                    style={{
                      position: "absolute",
                      top: `${22 + (index % 2) * 10}px`,
                      left: balloon.left,
                      width: "42px",
                      height: "58px",
                      borderRadius: "50% 50% 45% 45%",
                      background: balloon.color,
                      boxShadow: `0 8px 18px ${balloon.color}66`,
                      cursor: "pointer",
                      zIndex: 2,
                      opacity: 1,
                    }}
                    title="Double tap to hide"
                  >
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-26px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "2px",
                        height: "26px",
                        background: balloon.color,
                        opacity: 1,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "330px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            <motion.button
              type="button"
              onClick={openRandomPhotoPopup}
              animate={{ rotate: [0, 10, -10, 0], y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                fontSize: "3rem",
                marginBottom: "0.6rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Tap to see a random photo"
            >
              📸
            </motion.button>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.6rem",
                lineHeight: 1.15,
              }}
            >
              Cutie Pie Gallery
            </h1>

            <motion.button
              type="button"
              onClick={showAllBalloons}
              whileTap={{ scale: 0.9 }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                marginBottom: "0.7rem",
                padding: 0,
              }}
              title="Show all balloons"
            >
              <div style={{ fontSize: "2.9rem", lineHeight: 1 }}>💜</div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#7c3aed",
                  fontWeight: 800,
                  marginTop: "2px",
                }}
              >
                show balloons
              </div>
            </motion.button>

            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.2rem",
                color: "#7c6b8f",
                marginBottom: "1rem",
              }}
            >
              Every photo tells a beautiful story 🌸
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              {["Beautiful Memories", "Cute Looks", "Purple Vibes"].map(
                (tag) => (
                  <span key={tag} style={smallChipStyle()}>
                    {tag}
                  </span>
                )
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(216,180,254,0.45)",
                  padding: "0.7rem 1rem",
                  borderRadius: "16px",
                }}
              >
                <span style={{ fontWeight: 800, color: "#4a1a6b" }}>
                  Candles:
                </span>

                {candles.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCandleClick(index)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "1.4rem",
                    }}
                    title="Tap candle"
                  >
                    {item ? "🕯️" : "🌑"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={resetFun}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "0.8rem 1.15rem",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(124,58,237,0.2)",
                }}
              >
                Reset Fun ✨
              </button>
            </div>

            <AnimatePresence>
              {candleSurprise && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  style={{
                    marginTop: "0.8rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.12))",
                    color: "#6d28d9",
                    fontWeight: 900,
                    boxShadow: "0 10px 25px rgba(124,58,237,0.12)",
                  }}
                >
                  23 candles of happiness unlocked for the birthday queen 🎂👑💜
                </motion.div>
              )}
            </AnimatePresence>

            <div
              style={{
                marginTop: "1rem",
                width: "100%",
                maxWidth: "520px",
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(216,180,254,0.45)",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.8rem",
                  flexWrap: "wrap",
                  marginBottom: currentBirthdaySong ? "0.55rem" : 0,
                }}
              >
                <div
                  style={{
                    color: "#4a1a6b",
                    fontWeight: 900,
                    fontSize: "0.95rem",
                  }}
                >
                  🎵 Birthday Music
                </div>

                {currentBirthdaySong && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={goNextBirthdaySong}
                      style={{
                        border: "none",
                        borderRadius: "999px",
                        padding: "0.45rem 0.8rem",
                        background:
                          "linear-gradient(135deg, #7c3aed, #ec4899)",
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Next →
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteBirthdaySong(currentBirthdaySong)}
                      style={{
                        border: "none",
                        borderRadius: "999px",
                        padding: "0.45rem 0.8rem",
                        background: "#ef4444",
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {currentBirthdaySong ? (
                <>
                  <div
                    style={{
                      color: "#6d28d9",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      marginBottom: "0.45rem",
                    }}
                  >
                    Birthday song is ready 🎶
                  </div>

                  <audio
                    key={currentBirthdaySong.url}
                    controls
                    onEnded={goNextBirthdaySong}
                    style={{ width: "100%" }}
                  >
                    <source src={currentBirthdaySong.url} />
                  </audio>
                </>
              ) : (
                <div style={{ color: "#7c6b8f", fontSize: "0.86rem" }}>
                  No birthday songs uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(216,180,254,0.45)",
            minHeight: "360px",
            padding: "1.4rem",
            background: "rgba(255,255,255,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpinningWheel />
        </div>
      </div>

      <AnimatePresence>
        {photoPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhotoPopupOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(25, 10, 40, 0.82)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(92vw, 720px)",
                borderRadius: "28px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(250,232,255,0.98))",
                border: "1px solid rgba(216,180,254,0.45)",
                boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => setPhotoPopupOpen(false)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.6rem 0.85rem",
                  background: "rgba(255,255,255,0.92)",
                  color: "#7c3aed",
                  fontWeight: 900,
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                Minimize
              </button>

              {randomPhoto?.url ? (
                <img
                  src={randomPhoto.url}
                  alt={randomPhoto.title}
                  style={{
                    width: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                    display: "block",
                    background: "#fff",
                  }}
                />
              ) : (
                <div
                  style={{
                    minHeight: "260px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#7c3aed",
                    fontWeight: 900,
                    padding: "2rem",
                  }}
                >
                  {randomPhoto?.title || "No photo found 💜"}
                </div>
              )}

              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#4a1a6b",
                  fontWeight: 900,
                }}
              >
                {randomPhoto?.type || "Random Picture"} ✨
              </div>

              <div
                style={{
                  padding: "0 1rem 1.2rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={showAnotherRandomPhoto}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.75rem 1.15rem",
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(124,58,237,0.18)",
                  }}
                >
                  Show another picture ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}