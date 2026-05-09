import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FINISH_POSITION = 31;
const GIFT_DAY = 8;
const ROLL_TIME = 5000;
const MOVE_STEP_TIME = 1000;

const diceFaces = {
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function shuffleArray(array = []) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getPhotoUrl(photo) {
  return (
    photo?.imageUrl ||
    photo?.aiImageUrl ||
    photo?.url ||
    photo?.secure_url ||
    photo?.photoUrl ||
    photo?.normalImageUrl ||
    ""
  );
}

function isLessThanTenPhoto(photo) {
  const value = String(photo?.ageRange || "").toLowerCase();

  return (
    value === "less-than-10" ||
    value === "less than 10" ||
    (value.includes("less") && value.includes("10"))
  );
}

function actionButtonStyle(disabled = false) {
  return {
    border: "none",
    borderRadius: "18px",
    padding: "0.95rem 1.25rem",
    background: disabled
      ? "rgba(124,58,237,0.35)"
      : "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "#fff",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 14px 28px rgba(124,58,237,0.24)",
  };
}

function smallButtonStyle(bg = "#7c3aed") {
  return {
    border: "none",
    borderRadius: "14px",
    padding: "0.7rem 1rem",
    background: bg,
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  };
}

function PlayerPiece({ type, image }) {
  if (type === "her") {
    return (
      <motion.div
        layout
        animate={{ y: [0, -5, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid #ec4899",
          background: "#fff",
          boxShadow: "0 8px 18px rgba(236,72,153,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
        }}
        title="Harunica"
      >
        {image ? (
          <img
            src={image}
            alt="Harunica"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          "💜"
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "3px solid #7c3aed",
        background: "linear-gradient(135deg, #ede9fe, #fce7f3)",
        boxShadow: "0 8px 18px rgba(124,58,237,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
      }}
      title="AI opponent"
    >
      🤖
    </motion.div>
  );
}

function BoardCell({
  number,
  herPosition,
  aiPosition,
  playerImage,
  backgroundImage,
}) {
  const hasHer = herPosition === number;
  const hasAi = aiPosition === number;
  const isGift = number === GIFT_DAY;
  const isFinish = number === FINISH_POSITION;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: hasHer || hasAi ? [1, 1.06, 1] : 1,
        y: hasHer || hasAi ? [0, -4, 0] : 0,
      }}
      transition={{
        duration: hasHer || hasAi ? 1.2 : 0.35,
        repeat: hasHer || hasAi ? Infinity : 0,
      }}
      whileHover={{ scale: 1.06 }}
      style={{
        minHeight: "82px",
        borderRadius: "18px",
        border: isGift
          ? "3px solid rgba(245,158,11,0.95)"
          : isFinish
          ? "3px solid rgba(236,72,153,0.75)"
          : "1px solid rgba(168,85,247,0.25)",
        boxShadow: isGift
          ? "0 14px 30px rgba(245,158,11,0.28)"
          : isFinish
          ? "0 14px 30px rgba(236,72,153,0.18)"
          : "0 10px 22px rgba(124,58,237,0.08)",
        position: "relative",
        overflow: "hidden",
        padding: "0.55rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: isGift
          ? "linear-gradient(135deg, rgba(255,244,214,0.95), rgba(255,255,255,0.92))"
          : "rgba(255,255,255,0.92)",
      }}
    >
      {backgroundImage && !isGift && (
        <img
          src={backgroundImage}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.78,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isGift
            ? "linear-gradient(135deg, rgba(255,244,214,0.55), rgba(255,255,255,0.25))"
            : "rgba(255,255,255,0.18)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontWeight: 1000,
            color: isGift ? "#92400e" : "#4a1a6b",
            fontSize: "1.05rem",
            textShadow: "0 2px 8px rgba(255,255,255,0.95)",
          }}
        >
          {number}
        </div>

        {isFinish && <div style={{ fontSize: "1.2rem" }}>🏁</div>}
      </div>

      {isGift && (
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            filter: "drop-shadow(0 8px 16px rgba(245,158,11,0.5))",
          }}
        >
          🎁
        </motion.div>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          gap: "0.25rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {hasHer && <PlayerPiece type="her" image={playerImage} />}
        {hasAi && <PlayerPiece type="ai" />}
      </div>
    </motion.div>
  );
}

export default function Ludo({ photos = [] }) {
  const audioContextRef = useRef(null);

  const eligiblePhotos = useMemo(() => {
    return photos.filter((photo) => !isLessThanTenPhoto(photo));
  }, [photos]);

  const tenImages = useMemo(() => {
    return eligiblePhotos.map(getPhotoUrl).filter(Boolean).slice(0, 10);
  }, [eligiblePhotos]);

  const boardImages = useMemo(() => {
    if (!tenImages.length) return [];

    const repeated = [];

    if (tenImages.length >= 10) {
      tenImages.forEach((url) => {
        repeated.push(url, url, url);
      });
    } else {
      while (repeated.length < 30) {
        tenImages.forEach((url) => {
          if (repeated.length < 30) repeated.push(url);
        });
      }
    }

    return shuffleArray(repeated).slice(0, 30);
  }, [tenImages]);

  const playerImage = tenImages[0] || "";

  const [herPosition, setHerPosition] = useState(0);
  const [aiPosition, setAiPosition] = useState(0);
  const [turn, setTurn] = useState("her");
  const [rolling, setRolling] = useState(false);
  const [moving, setMoving] = useState(false);
  const [rollingFor, setRollingFor] = useState("");
  const [diceValue, setDiceValue] = useState(null);
  const [message, setMessage] = useState(
    "Harunica starts first. Roll the dice to begin 💜"
  );
  const [winner, setWinner] = useState("");
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftPlayer, setGiftPlayer] = useState("");
  const [giftOpenedFor, setGiftOpenedFor] = useState({
    her: false,
    ai: false,
  });

  const herNeed = FINISH_POSITION - herPosition;
  const aiNeed = FINISH_POSITION - aiPosition;

  function getAudioContext() {
    if (typeof window === "undefined") return null;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  }

  function playTone(frequency = 440, duration = 0.08, type = "sine", volume = 0.05) {
    try {
      const context = getAudioContext();
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch (error) {
      // Sound is optional. Ignore browser audio errors.
    }
  }

  function playDiceSound() {
    playTone(300 + Math.random() * 350, 0.045, "square", 0.025);
  }

  function playMoveSound(step) {
    playTone(480 + step * 35, 0.09, "sine", 0.045);
  }

  function playGiftSound() {
    playTone(660, 0.12, "sine", 0.06);
    setTimeout(() => playTone(780, 0.12, "sine", 0.06), 130);
    setTimeout(() => playTone(920, 0.16, "sine", 0.06), 260);
  }

  function openGiftSurprise(player) {
    if (giftOpenedFor[player]) return;

    setGiftOpenedFor((prev) => ({
      ...prev,
      [player]: true,
    }));

    setGiftPlayer(player === "her" ? "Harunica" : "AI");
    setGiftOpen(true);
    playGiftSound();
  }

  async function animatePieceMove(player, startPosition, steps) {
    setMoving(true);

    for (let step = 1; step <= steps; step += 1) {
      const nextPosition = startPosition + step;

      if (player === "her") {
        setHerPosition(nextPosition);
      } else {
        setAiPosition(nextPosition);
      }

      setMessage(
        `${player === "her" ? "Harunica" : "AI"} moves to ${nextPosition}...`
      );

      playMoveSound(step);

      await sleep(MOVE_STEP_TIME);
    }

    setMoving(false);
  }

  async function runRoll(player) {
    if (rolling || moving || winner || giftOpen) return;

    setRolling(true);
    setRollingFor(player);
    setDiceValue(randomDice());

    const playerName = player === "her" ? "Harunica" : "AI";
    setMessage(`${playerName} is rolling the dice for 5 seconds... 🎲`);

    const interval = setInterval(() => {
      setDiceValue(randomDice());
      playDiceSound();
    }, 150);

    await sleep(ROLL_TIME);

    clearInterval(interval);

    const finalRoll = randomDice();
    setDiceValue(finalRoll);
    playTone(540, 0.13, "triangle", 0.06);

    setRolling(false);
    setRollingFor("");

    const current = player === "her" ? herPosition : aiPosition;
    const need = FINISH_POSITION - current;

    if (current === FINISH_POSITION) return;

    if (finalRoll > need) {
      setMessage(
        `${playerName} rolled ${finalRoll}, but needs exactly ${need} to finish. Piece stays at ${current}.`
      );

      setTurn(player === "her" ? "ai" : "her");
      return;
    }

    setMessage(`${playerName} rolled ${finalRoll}. Moving step by step... 💜`);

    await animatePieceMove(player, current, finalRoll);

    const finalPosition = current + finalRoll;

    if (finalPosition === GIFT_DAY) {
      openGiftSurprise(player);
    }

    if (finalPosition === FINISH_POSITION) {
      setWinner(player);
      setMessage(
        player === "her"
          ? "Harunica reached 31 exactly and won the game! 👑💜"
          : "AI reached 31 exactly and won this round 🤖"
      );
      return;
    }

    setMessage(`${playerName} reached ${finalPosition}.`);

    setTurn(player === "her" ? "ai" : "her");
  }

  useEffect(() => {
    if (turn !== "ai") return;
    if (rolling || moving || winner || giftOpen) return;

    const timer = setTimeout(() => {
      runRoll("ai");
    }, 900);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, rolling, moving, winner, giftOpen, herPosition, aiPosition]);

  function handleHerRoll() {
    if (rolling || moving || winner || turn !== "her" || giftOpen) return;
    runRoll("her");
  }

  function resetGame() {
    setHerPosition(0);
    setAiPosition(0);
    setTurn("her");
    setRolling(false);
    setMoving(false);
    setRollingFor("");
    setDiceValue(null);
    setWinner("");
    setGiftOpen(false);
    setGiftPlayer("");
    setGiftOpenedFor({
      her: false,
      ai: false,
    });
    setMessage("New game started. Harunica rolls first 💜");
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "26px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,235,255,0.94))",
        border: "1px solid rgba(216,180,254,0.45)",
        boxShadow: "0 16px 35px rgba(124,58,237,0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.55rem",
              color: "#4a1a6b",
              marginBottom: "0.3rem",
            }}
          >
            🎲 Birthday Calendar Game
          </h2>

          <p style={{ color: "#7c6b8f", fontSize: "0.9rem" }}>
            Harunica vs AI. Reach 31 exactly to win. Number 8 has a gift box 🎁
          </p>
        </div>

        <button type="button" onClick={resetGame} style={smallButtonStyle("#a855f7")}>
          Reset Game ✨
        </button>
      </div>

      <div
        style={{
          borderRadius: "20px",
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(216,180,254,0.45)",
          padding: "0.9rem 1rem",
          marginBottom: "1.2rem",
        }}
      >
        <div
          style={{
            fontWeight: 900,
            color: "#4a1a6b",
            marginBottom: "0.45rem",
          }}
        >
          📜 Rules
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.65rem",
            flexWrap: "wrap",
            color: "#6b4e88",
            fontSize: "0.86rem",
            lineHeight: 1.5,
          }}
        >
          <span>• Board has 31 calendar blocks.</span>
          <span>• Harunica rolls first.</span>
          <span>• AI rolls automatically after her.</span>
          <span>• You must land exactly on 31.</span>
          <span>• If the roll goes above 31, the piece does not move.</span>
          <span>• Landing on 8 opens the birthday gift surprise.</span>
          <span>• Photos from “Less than 10” are not used.</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1.25fr) minmax(280px, 0.75fr)",
          gap: "1.2rem",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(250,232,255,0.72))",
            border: "1px solid rgba(216,180,254,0.45)",
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          <div style={{ marginBottom: "0.9rem" }}>
            <h3
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.35rem",
                color: "#4a1a6b",
              }}
            >
              📅 MAY Calendar
            </h3>

            <p
              style={{
                margin: "0.3rem 0 0",
                color: "#7c6b8f",
                fontSize: "0.88rem",
              }}
            >
              10 beautiful photos are shuffled across the calendar blocks 💜
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(72px, 1fr))",
              gap: "0.65rem",
            }}
          >
            {Array.from({ length: FINISH_POSITION }, (_, index) => {
              const number = index + 1;

              const photoIndex =
                number < GIFT_DAY
                  ? number - 1
                  : number > GIFT_DAY
                  ? number - 2
                  : -1;

              const backgroundImage =
                number === GIFT_DAY ? "" : boardImages[photoIndex] || "";

              return (
                <BoardCell
                  key={number}
                  number={number}
                  herPosition={herPosition}
                  aiPosition={aiPosition}
                  playerImage={playerImage}
                  backgroundImage={backgroundImage}
                />
              );
            })}
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.8rem",
            }}
          >
            <div
              style={{
                borderRadius: "18px",
                background: "rgba(255,255,255,0.78)",
                padding: "0.85rem",
                border: "1px solid rgba(216,180,254,0.45)",
              }}
            >
              <strong style={{ color: "#4a1a6b" }}>Harunica Start:</strong>{" "}
              {herPosition === 0 ? "Waiting at start 💜" : `Block ${herPosition}`}
            </div>

            <div
              style={{
                borderRadius: "18px",
                background: "rgba(255,255,255,0.78)",
                padding: "0.85rem",
                border: "1px solid rgba(216,180,254,0.45)",
              }}
            >
              <strong style={{ color: "#4a1a6b" }}>AI Start:</strong>{" "}
              {aiPosition === 0 ? "Waiting at start 🤖" : `Block ${aiPosition}`}
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(250,232,255,0.82))",
            border: "1px solid rgba(216,180,254,0.45)",
            padding: "1.2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "520px",
          }}
        >
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.8rem",
                marginBottom: "1.2rem",
              }}
            >
              <div
                style={{
                  borderRadius: "18px",
                  padding: "0.9rem",
                  background:
                    turn === "her"
                      ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))"
                      : "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(216,180,254,0.45)",
                }}
              >
                <div style={{ fontWeight: 900, color: "#4a1a6b" }}>
                  Harunica 💜
                </div>
                <div style={{ color: "#7c6b8f", fontSize: "0.85rem" }}>
                  Position: {herPosition}/31
                </div>
                <div style={{ color: "#7c3aed", fontSize: "0.82rem" }}>
                  Needs: {herNeed}
                </div>
              </div>

              <div
                style={{
                  borderRadius: "18px",
                  padding: "0.9rem",
                  background:
                    turn === "ai"
                      ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))"
                      : "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(216,180,254,0.45)",
                }}
              >
                <div style={{ fontWeight: 900, color: "#4a1a6b" }}>
                  AI Opponent 🤖
                </div>
                <div style={{ color: "#7c6b8f", fontSize: "0.85rem" }}>
                  Position: {aiPosition}/31
                </div>
                <div style={{ color: "#7c3aed", fontSize: "0.82rem" }}>
                  Needs: {aiNeed}
                </div>
              </div>
            </div>

            <div
              style={{
                minHeight: "220px",
                borderRadius: "26px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(248,235,255,0.86))",
                border: "1px solid rgba(216,180,254,0.45)",
                boxShadow: "0 15px 35px rgba(124,58,237,0.12)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
                marginBottom: "1.2rem",
              }}
            >
              <motion.div
                key={diceValue || "empty"}
                animate={
                  rolling
                    ? {
                        rotate: [0, 20, -20, 360],
                        scale: [1, 1.15, 0.95, 1.08],
                      }
                    : { rotate: 0, scale: 1 }
                }
                transition={{
                  duration: rolling ? 0.35 : 0.2,
                  repeat: rolling ? Infinity : 0,
                }}
                style={{
                  fontSize: "5rem",
                  lineHeight: 1,
                  filter: "drop-shadow(0 10px 18px rgba(124,58,237,0.25))",
                }}
              >
                {diceValue ? diceFaces[diceValue] : "🎲"}
              </motion.div>

              <div
                style={{
                  marginTop: "0.8rem",
                  fontWeight: 900,
                  color: "#4a1a6b",
                  fontSize: "1.05rem",
                }}
              >
                {rolling
                  ? `${rollingFor === "her" ? "Harunica" : "AI"} is rolling for 5 seconds...`
                  : moving
                  ? "Piece is moving block by block..."
                  : diceValue
                  ? `Dice value: ${diceValue}`
                  : "Dice value will show here"}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  borderRadius: "18px",
                  padding: "0.95rem 1rem",
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(216,180,254,0.45)",
                  color: "#6b4e88",
                  fontWeight: 700,
                  lineHeight: 1.6,
                  minHeight: "70px",
                }}
              >
                {message}
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ marginTop: "1.2rem" }}>
            {winner ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  borderRadius: "20px",
                  background:
                    winner === "her"
                      ? "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(236,72,153,0.18))"
                      : "rgba(255,255,255,0.8)",
                  color: "#4a1a6b",
                  fontWeight: 900,
                  marginBottom: "0.9rem",
                }}
              >
                {winner === "her"
                  ? "Harunica wins the birthday calendar game! 👑💜"
                  : "AI wins this round 🤖"}
              </motion.div>
            ) : null}

            <button
              type="button"
              onClick={handleHerRoll}
              disabled={rolling || moving || turn !== "her" || Boolean(winner) || giftOpen}
              style={{
                ...actionButtonStyle(
                  rolling || moving || turn !== "her" || Boolean(winner) || giftOpen
                ),
                width: "100%",
                fontSize: "1rem",
              }}
            >
              {rolling
                ? "Rolling..."
                : moving
                ? "Moving..."
                : turn === "her"
                ? "Roll Dice for Harunica 🎲"
                : "AI is playing..."}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {giftOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGiftOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(45, 23, 66, 0.65)",
              display: "grid",
              placeItems: "center",
              padding: "1rem",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "560px",
                borderRadius: "28px",
                padding: "1.8rem",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,240,252,0.97))",
                boxShadow: "0 28px 70px rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.65)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ rotate: -18, scale: 0.8 }}
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
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
                Happy 23rd Birthday Harunica! 🎂💜
              </h2>

              <p
                style={{
                  margin: "0.9rem 0 0.6rem",
                  color: "#6d28d9",
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                {giftPlayer} landed on the special number 8 gift box, so the
                birthday surprise opened automatically! 🌸✨
              </p>

              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.76)",
                  color: "#7c6b8f",
                  lineHeight: 1.8,
                  fontWeight: 700,
                }}
              >
                Wishing you a beautiful birthday filled with smiles, cute memories,
                sweet surprises, and magical happiness! 🎉🎈🎀
              </div>

              <button
                type="button"
                onClick={() => setGiftOpen(false)}
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
                Continue Game 💫
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}