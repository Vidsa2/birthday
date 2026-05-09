import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BALLOON_DATA = [
  { id: 1, left: "7%", color: "#ec4899" },
  { id: 2, left: "18%", color: "#7c3aed" },
  { id: 3, left: "29%", color: "#f59e0b" },
  { id: 4, left: "40%", color: "#db2777" },
  { id: 5, left: "58%", color: "#8b5cf6" },
  { id: 6, left: "69%", color: "#ec4899" },
  { id: 7, left: "80%", color: "#7c3aed" },
  { id: 8, left: "90%", color: "#f59e0b" },
];

const FUNNY_PHOTO_TEXTS = [
  "Caught by the cute camera 📸💜",
  "This smile should be illegal 😄✨",
  "Aiyo... too much beauty in one frame 🌸",
  "Random queen moment unlocked 👑💖",
  "Camera says: semma cute! 📸",
  "Beauty level: overload 💜✨",
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
  return photo?.note || photo?.title || photo?.caption || photo?.name || "Cute memory";
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
    // Sound is optional.
  }
}

function playPopSound() {
  playTone(720, 0.05, "triangle", 0.05);
  setTimeout(() => playTone(980, 0.06, "sine", 0.04), 60);
}

function playCameraMagicSound() {
  playTone(320, 0.05, "square", 0.035);
  setTimeout(() => playTone(500, 0.05, "triangle", 0.04), 80);
  setTimeout(() => playTone(740, 0.09, "sine", 0.04), 170);
}

function playCandleOffSound() {
  playTone(420, 0.06, "triangle", 0.05);
  setTimeout(() => playTone(260, 0.07, "sine", 0.04), 70);
}

function playCandleOnSound() {
  playTone(480, 0.05, "sine", 0.04);
  setTimeout(() => playTone(650, 0.05, "triangle", 0.04), 60);
}

export default function CutiePieGalleryFunPanel({
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
  const [cameraLoading, setCameraLoading] = useState(false);
  const [funnyText, setFunnyText] = useState("");
  const [candleSurprise, setCandleSurprise] = useState(false);
  const [balloonMessage, setBalloonMessage] = useState(false);

  useEffect(() => {
    if (visibleBalloonIds.length === 0) {
      setBalloonMessage(true);

      const timer = setTimeout(() => {
        setBalloonMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visibleBalloonIds]);

  function hideBalloon(id) {
    playPopSound();
    setVisibleBalloonIds((prev) => prev.filter((item) => item !== id));
  }

  function handleBalloonTouch(id) {
    const now = Date.now();

    if (lastTapRef.current.id === id && now - lastTapRef.current.time <= 350) {
      hideBalloon(id);
      lastTapRef.current = { id: null, time: 0 };
      return;
    }

    lastTapRef.current = { id, time: now };
  }

  function showAllBalloons() {
    playPopSound();
    setVisibleBalloonIds(BALLOON_DATA.map((item) => item.id));
    setBalloonMessage(false);
  }

  function openRandomPhotoPopup() {
    if (cameraLoading) return;

    setCameraLoading(true);
    playCameraMagicSound();

    setTimeout(() => {
      const selected = getRandomPhotoItem(photos);
      setFunnyText(pickRandom(FUNNY_PHOTO_TEXTS));

      if (!selected) {
        setRandomPhoto({
          url: "",
          title: "Upload a photo first to unlock this surprise 💜",
          type: "No Photo",
        });
      } else {
        setRandomPhoto(selected);
      }

      setPhotoPopupOpen(true);
      setCameraLoading(false);
    }, 900);
  }

  function showAnotherRandomPhoto() {
    playCameraMagicSound();

    const selected = getRandomPhotoItem(photos);
    setFunnyText(pickRandom(FUNNY_PHOTO_TEXTS));

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

  function candleIcon(item, index) {
    if (item) return "🕯️";

    if (index === 1) return "2";
    if (index === 2) return "3";

    return "⚫";
  }

  function handleCandleClick(index) {
    const currentlyOn = candles[index];

    if (currentlyOn) {
      playCandleOffSound();
    } else {
      playCandleOnSound();
    }

    const nextCandles = candles.map((item, i) => (i === index ? !item : item));

    toggleCandle(index);

    if (nextCandles.every((item) => !item)) {
      setCandleSurprise(true);
      setTimeout(() => setCandleSurprise(false), 5000);
    }
  }

  return (
    <div className="cutie-left-panel">
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "14px",
          zIndex: 5,
          fontSize: "0.7rem",
          fontWeight: 800,
          color: "#7c3aed",
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(216,180,254,0.45)",
          borderRadius: "999px",
          padding: "0.32rem 0.6rem",
          whiteSpace: "nowrap",
        }}
      >
        double tap to pop 🎈
      </div>

      {BALLOON_DATA.map((balloon, index) => {
        const isVisible = visibleBalloonIds.includes(balloon.id);

        return (
          <AnimatePresence key={balloon.id}>
            {isVisible && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ y: [0, -14, 0], scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  y: {
                    duration: 3 + index * 0.35,
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                  scale: { duration: 0.18 },
                  opacity: { duration: 0.18 },
                }}
                onDoubleClick={() => hideBalloon(balloon.id)}
                onTouchEnd={(event) => {
                  event.preventDefault();
                  handleBalloonTouch(balloon.id);
                }}
                style={{
                  position: "absolute",
                  top: `${18 + (index % 2) * 10}px`,
                  left: balloon.left,
                  width: "40px",
                  height: "56px",
                  borderRadius: "50% 50% 45% 45%",
                  background: balloon.color,
                  boxShadow: `0 8px 18px ${balloon.color}66`,
                  cursor: "pointer",
                  zIndex: 2,
                }}
                title="Double tap to pop"
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "25px",
                    background: balloon.color,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}

      <div
        className="cutie-left-content"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "330px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "120px",
        }}
      >
        <motion.button
          type="button"
          onClick={openRandomPhotoPopup}
          animate={{ rotate: [0, 10, -10, 0], y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            fontSize: "3rem",
            marginBottom: "0.55rem",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
          title="Tap to see a random photo"
        >
          {cameraLoading ? "🧪" : "📸"}
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
          <div style={{ fontSize: "2.4rem", lineHeight: 1 }}>💜</div>
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

        <AnimatePresence>
          {balloonMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              style={{
                marginBottom: "0.85rem",
                padding: "0.7rem 1rem",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.12))",
                color: "#6d28d9",
                fontWeight: 900,
                boxShadow: "0 10px 25px rgba(124,58,237,0.12)",
              }}
            >
              You popped 8 balloons like your born date 🎈💜
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          {["Beautiful Memories", "Cute Looks", "Purple Vibes"].map((tag) => (
            <span key={tag} style={smallChipStyle()}>
              {tag}
            </span>
          ))}
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
              gap: "0.7rem",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(216,180,254,0.45)",
              padding: "0.7rem 1rem",
              borderRadius: "16px",
            }}
          >
            <span style={{ fontWeight: 800, color: "#4a1a6b" }}>Candles:</span>

            {candles.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCandleClick(index)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: item
                    ? "1.35rem"
                    : index === 1 || index === 2
                    ? "1.9rem"
                    : "1.25rem",
                  color: index === 1 || index === 2 ? "#7c3aed" : "#000",
                  fontWeight: 900,
                  minWidth: "22px",
                  lineHeight: 1,
                }}
                title="Tap candle"
              >
                {candleIcon(item, index)}
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
              23 birthday magic unlocked 🎂💜
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
            <div style={{ color: "#4a1a6b", fontWeight: 900, fontSize: "0.95rem" }}>
              🎵 Birthday Music
            </div>

            {currentBirthdaySong && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={goNextBirthdaySong}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.45rem 0.8rem",
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
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
              alignItems: "flex-start",
              padding: "90px 20px 20px",
              backdropFilter: "blur(8px)",
              overflowY: "auto",
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
                maxHeight: "calc(100vh - 120px)",
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

              <div
                style={{
                  padding: "1rem 4.5rem 0.8rem 1rem",
                  textAlign: "center",
                  color: "#7c3aed",
                  fontWeight: 900,
                }}
              >
                {funnyText}
              </div>

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
                  Shake again 🧪✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}