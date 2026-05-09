import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import AnimatedCard from "./AnimatedCard";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_DRESSES = ["Saree", "Salwar", "Jeans", "Frock"];

const AGE_RANGES = [
  { label: "Less than 10", value: "less-than-10" },
  { label: "Teen Age", value: "teen-age" },
  { label: "After 20s", value: "after-20s" },
];

const KAVITHAI_LIST = [
  "உன் கண்ணக்குழிக்கும், வெக்கத்திற்கும் தொடர்பு உண்டு! அதில் தொலைந்து போனவர்கள் ஆயிரம் உண்டு! 💜",
  "கூந்தல் நெளிவில் எழில் கோலச்சரிவில் கர்வம் அழிந்ததடி... என் கர்வம் அழிந்ததடி! 🌸",
  "நான் கவிதை எழுத முயற்சித்தால், உன் விழிகள், இதழ்கள் என்னை மயக்கிய உன் அங்கங்கள் எல்லாம், என் மண்டைக்குள் வந்து போகிறது! ✨",
  "மருதாணியின் கன்னங்கள் சிவக்கும், மஞ்சள் உன்னை பூசிக்கொள்ளும், குங்குமமும் குலுங்கி சிரிக்கும், தொட்டால் சிணுங்கியும் சிணுங்கும், பெண்மையின் பிறப்பிடமான உன்னைக் கண்டால்! 💖",
  "யாரும் அவளளவுக்கு அழகாகவும் இல்லை, அவளளவுக்கு, அளவாகவும் இல்லை! 😍",
  "வானில் ஜொலிக்கும் நட்சத்திரங்கள் தன் இருப்பிடத்தை மாற்றியமைத்து விட்டதோ என நினைக்க தோன்றுகிறது உந்தன் கன்னத்தில் மின்னும் பருக்களை காண்கையில்! 🌟",
  "இவ்வுலகில் ரசிப்பதற்கு ஆயிரம் இருந்தாலும், நான் ரசித்தது உன்னுடன் உறவாடிய நாட்களைத் தான்! 💕",
  "நீ சேலைகட்டிய அழகில், பட்டும் பாட்டு பாடும், கதிரும் கைதட்டி இரசிக்கும்! சேலைக்கட்டி நடந்து வரும் சோலையே! 🌺",
  "வாரிமுடிந்த கூந்தலும், வளைந்திருக்கும் புருவமும், எமனின் ஆயுதமோ என்று எண்ணினேன்! ஆனால், என்னை ஆட்டிப் படைக்கும் உன்னுடையது! 💫",
  "அழகான அவளை மேலும் அழகுப்படுத்த அவர்கள் தவறாமல் வந்துவிடுகிறார்கள் - முகப்பருக்கள்! 😘",
  "உன்னைக் கண்டவுடன் புரிந்தேன் நீ என்னவள் என்று! ஆனால் நீ, என்னைக் கண்டவுடன் திரும்பிக் கொண்டாய், எவனோ என்று! 💘",
  "என்னவளின் பேச்சு சர்க்கரை பாகோ? பேச பேச இனிமை கூடுது... அதிகம் ருசித்துவிட்டேன் அன்பே! உடம்பில் சர்க்கரை கூடுமென சிறிதே மறந்துவிட்டேன்! 🍭",
];

const WHEEL_SEGMENTS = [
  { label: "Harunica", emoji: "👑", type: "harunica" },
  { label: "Others", emoji: "😅", type: "others" },
  { label: "Harunica", emoji: "💜", type: "harunica" },
  { label: "Others", emoji: "🤭", type: "others" },
  { label: "Harunica", emoji: "🌸", type: "harunica" },
  { label: "Others", emoji: "🙈", type: "others" },
  { label: "Harunica", emoji: "😘", type: "harunica" },
  { label: "Others", emoji: "😂", type: "others" },
];

function capitalizeFirst(text = "") {
  const trimmed = String(text).trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function hashString(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPoemForPhoto(publicId = "") {
  const index = hashString(publicId) % KAVITHAI_LIST.length;
  return KAVITHAI_LIST[index];
}

function pickRandom(items = []) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function UploadDropBox({ label, file, previewUrl, onDrop, onRemove, icon = "📷" }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: isDragActive
          ? "2px dashed #ec4899"
          : "2px dashed rgba(168,85,247,0.45)",
        borderRadius: "22px",
        padding: "1.2rem",
        minHeight: "210px",
        background: isDragActive
          ? "rgba(236,72,153,0.08)"
          : "rgba(255,255,255,0.9)",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <input {...getInputProps()} />

      {previewUrl ? (
        <>
          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto 0.8rem",
              borderRadius: "18px",
              overflow: "hidden",
              border: "3px solid rgba(168,85,247,0.22)",
              boxShadow: "0 10px 25px rgba(124,58,237,0.12)",
              background: "#fff",
            }}
          >
            <img
              src={previewUrl}
              alt={label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              color: "#7c3aed",
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "0.3rem",
            }}
          >
            {label}
          </div>

          <div
            style={{
              color: "#6b4e88",
              fontSize: "0.85rem",
              marginBottom: "0.8rem",
              wordBreak: "break-word",
            }}
          >
            {file?.name}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={smallChipStyle}>Click to change</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.45rem 0.8rem",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: "2.1rem", marginBottom: "0.45rem" }}>{icon}</div>
          <div
            style={{
              color: "#7c3aed",
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: "0.3rem",
            }}
          >
            {label}
          </div>
          <div style={{ color: "#6b4e88", fontSize: "0.86rem", marginBottom: "0.2rem" }}>
            Drag & drop or click to choose a photo
          </div>
          <div style={{ color: "#7c6b8f", fontSize: "0.76rem" }}>JPG, PNG, GIF, WEBP</div>
        </>
      )}
    </div>
  );
}

function AudioDropBox({ file, onDrop, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".ogg"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: isDragActive
          ? "2px dashed #ec4899"
          : "2px dashed rgba(168,85,247,0.45)",
        borderRadius: "18px",
        padding: "1rem",
        minHeight: "150px",
        background: isDragActive
          ? "rgba(236,72,153,0.08)"
          : "rgba(255,255,255,0.9)",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <input {...getInputProps()} />

      <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>🎵</div>
      <div style={{ color: "#7c3aed", fontWeight: 800, marginBottom: "0.3rem" }}>
        Upload Music
      </div>

      {file ? (
        <>
          <div style={{ color: "#6b4e88", fontSize: "0.88rem", marginBottom: "0.8rem" }}>
            {file.name}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={smallChipStyle}>Click to change</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "0.45rem 0.8rem",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ color: "#6b4e88", fontSize: "0.86rem", marginBottom: "0.2rem" }}>
            Drag & drop or click to choose music
          </div>
          <div style={{ color: "#7c6b8f", fontSize: "0.76rem" }}>MP3, WAV, M4A, OGG</div>
        </>
      )}
    </div>
  );
}

function SpinningWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultText, setResultText] = useState("Obviously... Harunica is the prettiest girl in the world 😊💜");

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    const harunicaIndexes = [0, 2, 4, 6];
    const pickedIndex = pickRandom(harunicaIndexes);

    const targetCenterAngle = pickedIndex * segmentAngle + segmentAngle / 2;
    const finalRotation = 360 * 6 + (360 - targetCenterAngle);

    setRotation((prev) => prev + finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResultText("Obviously... Harunica is the prettiest girl in the world 😊💜");
    }, 4300);
  };

  return (
    <div
      style={{
        height: "100%",
        minHeight: "320px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#4a1a6b",
            fontSize: "1.15rem",
            marginBottom: "0.5rem",
          }}
        >
          Who is the prettiest girl in the world? 🤭
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "0.6rem 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-8px",
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "24px solid #ec4899",
            zIndex: 3,
          }}
        />

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4.2, ease: [0.18, 0.78, 0.25, 1] }}
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            border: "10px solid rgba(124,58,237,0.18)",
            position: "relative",
            boxShadow: "0 14px 35px rgba(124,58,237,0.18)",
            background:
              "conic-gradient(#ec4899 0deg 45deg, #f59e0b 45deg 90deg, #8b5cf6 90deg 135deg, #06b6d4 135deg 180deg, #a855f7 180deg 225deg, #fb7185 225deg 270deg, #7c3aed 270deg 315deg, #22c55e 315deg 360deg)",
          }}
        >
          {WHEEL_SEGMENTS.map((item, index) => {
            const angle = index * segmentAngle + segmentAngle / 2 - 90;
            const radius = 92;
            const x = 125 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 125 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={`${item.label}-${index}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  width: "60px",
                  lineHeight: 1.1,
                  textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                }}
              >
                <div style={{ fontSize: "1rem", marginBottom: "2px" }}>{item.emoji}</div>
                <div>{item.label}</div>
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              inset: "50% auto auto 50%",
              transform: "translate(-50%, -50%)",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.96)",
              border: "5px solid rgba(255,255,255,0.9)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.7rem",
            }}
          >
            💜
          </div>
        </motion.div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning}
          style={{
            border: "none",
            borderRadius: "16px",
            padding: "0.85rem 1.25rem",
            background: spinning
              ? "rgba(124,58,237,0.45)"
              : "linear-gradient(135deg, #7c3aed, #ec4899)",
            color: "#fff",
            fontWeight: 800,
            cursor: spinning ? "not-allowed" : "pointer",
            boxShadow: "0 12px 25px rgba(124,58,237,0.2)",
          }}
        >
          {spinning ? "Spinning..." : "Spin Wheel ✨"}
        </button>

        <div
          style={{
            marginTop: "0.8rem",
            color: "#6d28d9",
            fontWeight: 700,
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          {resultText}
        </div>
      </div>
    </div>
  );
}

function HeroSplitBox({ candles, toggleCandle, resetFun }) {
  const balloons = [
    { id: 1, left: "8%", color: "#ec4899" },
    { id: 2, left: "20%", color: "#7c3aed" },
    { id: 3, left: "32%", color: "#f59e0b" },
    { id: 4, left: "68%", color: "#a855f7" },
    { id: 5, left: "80%", color: "#ec4899" },
    { id: 6, left: "92%", color: "#7c3aed" },
  ];

  return (
    <AnimatedCard delay={0} glow style={{ padding: "1.6rem" }}>
      <div
        style={{
          borderRadius: "30px",
          border: "1px solid rgba(216,180,254,0.45)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,235,255,0.92), rgba(255,240,247,0.94))",
          padding: "1.3rem",
          overflow: "hidden",
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
          {/* Left side */}
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
            {balloons.map((balloon, index) => (
              <motion.div
                key={balloon.id}
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 3 + index, repeat: Infinity }}
                style={{
                  position: "absolute",
                  top: `${22 + (index % 2) * 10}px`,
                  left: balloon.left,
                  width: "42px",
                  height: "58px",
                  borderRadius: "50% 50% 45% 45%",
                  background: balloon.color,
                  boxShadow: `0 8px 18px ${balloon.color}55`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "-26px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "26px",
                    background: `${balloon.color}88`,
                  }}
                />
              </motion.div>
            ))}

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
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ fontSize: "3rem", marginBottom: "0.6rem" }}
              >
                📸
              </motion.div>

              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "0.45rem",
                  lineHeight: 1.15,
                }}
              >
                Cutie Pie Gallery 💜
              </h1>

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
                {["Beautiful Memories", "Cute Looks", "Purple Vibes", "Play & Smile"].map((tag) => (
                  <span key={tag} style={smallChipStyle}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
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
                  <span style={{ fontWeight: 800, color: "#4a1a6b" }}>Candles:</span>
                  {candles.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleCandle(index)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "1.4rem",
                      }}
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
            </div>
          </div>

          {/* Right side */}
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
      </div>
    </AnimatedCard>
  );
}

export default function PhotoGallery({ collectionName = "photos" }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [selectedAiPhotoFile, setSelectedAiPhotoFile] = useState(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState("");
  const [selectedAiPhotoPreview, setSelectedAiPhotoPreview] = useState("");

  const [note, setNote] = useState("");
  const [dress, setDress] = useState("");
  const [ageRange, setAgeRange] = useState("");

  const [customDressInput, setCustomDressInput] = useState("");
  const [customDressOptions, setCustomDressOptions] = useState([]);
  const [showDressDeleteBox, setShowDressDeleteBox] = useState(false);

  const [dressFilter, setDressFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [viewMode, setViewMode] = useState("normal");
  const [editingHeading, setEditingHeading] = useState(false);
  const [editHeadingValue, setEditHeadingValue] = useState("");
  const [savingHeading, setSavingHeading] = useState(false);

  const [candles, setCandles] = useState([true, true, true]);

  // music states
  const [selectedMusicFile, setSelectedMusicFile] = useState(null);
  const [musicUploadType, setMusicUploadType] = useState("birthday");
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [birthdaySongs, setBirthdaySongs] = useState([]);
  const [picSongs, setPicSongs] = useState([]);
  const [currentBirthdaySong, setCurrentBirthdaySong] = useState(null);
  const [currentPicSong, setCurrentPicSong] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("birthday_custom_dresses");
    if (saved) {
      try {
        setCustomDressOptions(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load custom dresses:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("birthday_custom_dresses", JSON.stringify(customDressOptions));
  }, [customDressOptions]);

  useEffect(() => {
    if (!selectedPhotoFile) {
      setSelectedPhotoPreview("");
      return;
    }
    const url = URL.createObjectURL(selectedPhotoFile);
    setSelectedPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedPhotoFile]);

  useEffect(() => {
    if (!selectedAiPhotoFile) {
      setSelectedAiPhotoPreview("");
      return;
    }
    const url = URL.createObjectURL(selectedAiPhotoFile);
    setSelectedAiPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedAiPhotoFile]);

  const allDressOptions = useMemo(() => {
    const merged = [...DEFAULT_DRESSES, ...customDressOptions.map((item) => capitalizeFirst(item))];
    return [...new Set(merged)];
  }, [customDressOptions]);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/photos?collectionName=${encodeURIComponent(collectionName)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load photos");
      setPhotos(data.photos || []);
    } catch (error) {
      console.error(error);
      setMessage("Could not load photos. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const fetchMusicByType = useCallback(async (type) => {
    try {
      const res = await fetch(`${API_BASE}/api/music?type=${encodeURIComponent(type)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load music");
      return data.music || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const fetchAllMusic = useCallback(async () => {
    const [birthday, pic] = await Promise.all([
      fetchMusicByType("birthday"),
      fetchMusicByType("pic"),
    ]);
    setBirthdaySongs(birthday);
    setPicSongs(pic);
  }, [fetchMusicByType]);

  useEffect(() => {
    fetchPhotos();
    fetchAllMusic();
  }, [fetchPhotos, fetchAllMusic]);

  useEffect(() => {
    if (birthdaySongs.length && !currentBirthdaySong) {
      setCurrentBirthdaySong(pickRandom(birthdaySongs));
    }
  }, [birthdaySongs, currentBirthdaySong]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const dressOk = dressFilter === "all" ? true : (photo.dress || "") === dressFilter;
      const ageOk = ageFilter === "all" ? true : (photo.ageRange || "") === ageFilter;
      return dressOk && ageOk;
    });
  }, [photos, dressFilter, ageFilter]);

  useEffect(() => {
    if (activeIndex >= filteredPhotos.length) setActiveIndex(0);
  }, [filteredPhotos, activeIndex]);

  const currentPhoto = filteredPhotos[activeIndex] || null;

  useEffect(() => {
    if (currentPhoto) {
      setEditHeadingValue(currentPhoto.note || "");
      setViewMode("normal");
      setEditingHeading(false);
      if (picSongs.length) {
        setCurrentPicSong(pickRandom(picSongs));
      }
    }
  }, [currentPhoto?.publicId, picSongs]);

  const displayedImage = currentPhoto
    ? viewMode === "ai" && currentPhoto.aiImageUrl
      ? currentPhoto.aiImageUrl
      : currentPhoto.imageUrl
    : "";

  const addCustomDress = () => {
    const cleaned = capitalizeFirst(customDressInput);
    if (!cleaned) return;
    const exists = allDressOptions.some((item) => item.toLowerCase() === cleaned.toLowerCase());
    if (exists) {
      setMessage("This dress already exists.");
      setCustomDressInput("");
      return;
    }
    setCustomDressOptions((prev) => [...prev, cleaned]);
    setDress(cleaned);
    setCustomDressInput("");
    setMessage(`"${cleaned}" added successfully.`);
  };

  const removeCustomDress = (value) => {
    if (DEFAULT_DRESSES.includes(value)) return;
    setCustomDressOptions((prev) => prev.filter((item) => item !== value));
    if (dress === value) setDress("");
    if (dressFilter === value) setDressFilter("all");
  };

  const handleMainDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setSelectedPhotoFile(file);
    setMessage("");
  }, []);

  const handleAiDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setSelectedAiPhotoFile(file);
    setMessage("");
  }, []);

  const handleMusicDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setSelectedMusicFile(file);
    setMessage("");
  }, []);

  const handleUpload = async () => {
    if (!selectedPhotoFile) {
      setMessage("Please select the main photo first.");
      return;
    }

    try {
      setMessage("Uploading beautiful memory... 💜");

      const formData = new FormData();
      formData.append("photo", selectedPhotoFile);
      if (selectedAiPhotoFile) {
        formData.append("aiPhoto", selectedAiPhotoFile);
      }
      formData.append("collectionName", collectionName);
      formData.append("note", capitalizeFirst(note));
      formData.append("dress", capitalizeFirst(dress));
      formData.append("ageRange", ageRange);

      const res = await fetch(`${API_BASE}/api/photos/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setPhotos((prev) => [data.photo, ...prev]);
      setSelectedPhotoFile(null);
      setSelectedAiPhotoFile(null);
      setNote("");
      setDress("");
      setAgeRange("");
      setMessage("Photo uploaded successfully 🌸");
      setActiveIndex(0);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Upload failed.");
    }
  };

  const handleUploadMusic = async () => {
    if (!selectedMusicFile) {
      setMessage("Please choose a music file first.");
      return;
    }

    try {
      setUploadingMusic(true);
      setMessage("Uploading music... 🎵");

      const formData = new FormData();
      formData.append("audio", selectedMusicFile);
      formData.append("type", musicUploadType);

      const res = await fetch(`${API_BASE}/api/music/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Music upload failed");

      setSelectedMusicFile(null);
      setMessage("Music uploaded successfully 🎶");

      await fetchAllMusic();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Music upload failed.");
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleDelete = async (photo) => {
    if (!photo) return;
    const ok = window.confirm("Do you want to delete this photo?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: photo.publicId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setPhotos((prev) => prev.filter((item) => item.publicId !== photo.publicId));
      setMessage("Photo deleted successfully.");
      setFullscreenOpen(false);
      setActiveIndex(0);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Delete failed.");
    }
  };

  const saveHeading = async () => {
    if (!currentPhoto) return;

    try {
      setSavingHeading(true);
      const finalHeading = capitalizeFirst(editHeadingValue);

      const res = await fetch(`${API_BASE}/api/photos/heading`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: currentPhoto.publicId,
          note: finalHeading,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Heading update failed");

      setPhotos((prev) =>
        prev.map((item) =>
          item.publicId === currentPhoto.publicId ? { ...item, note: finalHeading } : item
        )
      );

      setEditingHeading(false);
      setMessage("Heading updated successfully ✨");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Heading update failed.");
    } finally {
      setSavingHeading(false);
    }
  };

  const goNext = () => {
    if (!filteredPhotos.length) return;
    setActiveIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const goPrev = () => {
    if (!filteredPhotos.length) return;
    setActiveIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  const toggleCandle = (index) => {
    setCandles((prev) => prev.map((item, i) => (i === index ? !item : item)));
  };

  const resetFun = () => {
    setCandles([true, true, true]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <HeroSplitBox candles={candles} toggleCandle={toggleCandle} resetFun={resetFun} />

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(216,180,254,0.45)",
            borderRadius: "18px",
            padding: "0.95rem 1rem",
            color: "#6d28d9",
            fontWeight: 700,
          }}
        >
          {message}
        </motion.div>
      )}

      {/* viewing */}
      <AnimatedCard delay={0.12} style={{ padding: "1.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <h3 style={sectionTitleStyle}>Dress Filter</h3>
            <div style={barWrapStyle}>
              <button type="button" onClick={() => setDressFilter("all")} style={filterButtonStyle(dressFilter === "all")}>
                All
              </button>
              {allDressOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDressFilter(item)}
                  style={filterButtonStyle(dressFilter === item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 style={sectionTitleStyle}>Age Filter</h3>
            <div style={barWrapStyle}>
              <button type="button" onClick={() => setAgeFilter("all")} style={filterButtonStyle(ageFilter === "all")}>
                All
              </button>
              {AGE_RANGES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setAgeFilter(item.value)}
                  style={filterButtonStyle(ageFilter === item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ ...sectionTitleStyle, fontSize: "1.35rem", marginBottom: 0 }}>
              🌸 Beautiful Viewing Gallery
            </h2>
            <div style={{ color: "#7c6b8f", fontWeight: 700 }}>
              Showing {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? "s" : ""}
            </div>
          </div>

          {loading ? (
            <div style={emptyStyle}>Loading memories... 💜</div>
          ) : filteredPhotos.length === 0 ? (
            <div style={emptyStyle}>No photos match this filter yet 🌸</div>
          ) : (
            <>
              <div
                style={{
                  position: "relative",
                  padding: "1rem",
                  borderRadius: "28px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,236,255,0.96))",
                  border: "1px solid rgba(216,180,254,0.45)",
                  boxShadow: "0 15px 35px rgba(124,58,237,0.12)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: "0.8rem",
                    alignItems: "center",
                  }}
                >
                  <button type="button" onClick={goPrev} style={navButtonStyle}>‹</button>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentPhoto?.publicId}-${viewMode}`}
                      initial={{ opacity: 0, scale: 0.97, x: 12 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.97, x: -12 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1.2rem",
                        alignItems: "start",
                      }}
                    >
                      <motion.div
                        drag="x"
                        onDragEnd={(event, info) => {
                          if (info.offset.x < -80) goNext();
                          if (info.offset.x > 80) goPrev();
                        }}
                        style={{
                          background: "linear-gradient(135deg, #fff, rgba(247,236,255,0.96))",
                          borderRadius: "28px",
                          padding: "12px",
                          border: "4px solid rgba(168,85,247,0.25)",
                          boxShadow: "0 18px 40px rgba(124,58,237,0.18)",
                          cursor: "pointer",
                        }}
                        onClick={() => setFullscreenOpen(true)}
                      >
                        <div
                          style={{
                            borderRadius: "22px",
                            overflow: "hidden",
                            height: "430px",
                            background: "#f7efff",
                            position: "relative",
                          }}
                        >
                          <img
                            src={displayedImage}
                            alt={currentPhoto?.note || currentPhoto?.name || "Memory"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreenOpen(true);
                            }}
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              border: "none",
                              borderRadius: "12px",
                              padding: "0.55rem 0.75rem",
                              background: "rgba(255,255,255,0.9)",
                              color: "#7c3aed",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            Full
                          </button>
                        </div>
                      </motion.div>

                      <div
                        style={{
                          minHeight: "430px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: "1rem",
                          padding: "0.25rem 0.3rem",
                        }}
                      >
                        <div>
                          {editingHeading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              <input
                                value={editHeadingValue}
                                onChange={(e) => setEditHeadingValue(capitalizeFirst(e.target.value))}
                                placeholder="Enter heading"
                                style={inputStyle}
                              />
                              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                                <button type="button" onClick={saveHeading} disabled={savingHeading} style={smallActionStyle("#7c3aed")}>
                                  {savingHeading ? "Saving..." : "Save"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingHeading(false);
                                    setEditHeadingValue(currentPhoto?.note || "");
                                  }}
                                  style={smallActionStyle("#a855f7")}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.8rem",
                                  flexWrap: "wrap",
                                  marginBottom: "0.7rem",
                                }}
                              >
                                <h3
                                  style={{
                                    fontFamily: "'Playfair Display', serif",
                                    color: "#4a1a6b",
                                    fontSize: "1.8rem",
                                    lineHeight: 1.25,
                                    margin: 0,
                                  }}
                                >
                                  {currentPhoto?.note?.trim() ? currentPhoto.note : "A beautiful memory 💜"}
                                </h3>

                                <button
                                  type="button"
                                  onClick={() => setEditingHeading(true)}
                                  style={smallActionStyle("#ec4899")}
                                >
                                  Edit Heading
                                </button>
                              </div>

                              <p
                                style={{
                                  fontSize: "1rem",
                                  lineHeight: 1.9,
                                  color: "#6b4e88",
                                  marginBottom: "1rem",
                                }}
                              >
                                {getPoemForPhoto(currentPhoto?.publicId)}
                              </p>
                            </>
                          )}

                          <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            <button type="button" onClick={() => setViewMode("normal")} style={toggleButtonStyle(viewMode === "normal")}>
                              Normal
                            </button>

                            {currentPhoto?.aiImageUrl && (
                              <button type="button" onClick={() => setViewMode("ai")} style={toggleButtonStyle(viewMode === "ai")}>
                                AI
                              </button>
                            )}
                          </div>

                          {/* picture music block in red-box area */}
                          <div
                            style={{
                              borderRadius: "18px",
                              border: "1px solid rgba(168,85,247,0.25)",
                              background: "rgba(255,255,255,0.65)",
                              padding: "1rem",
                              minHeight: "130px",
                            }}
                          >
                            <h4
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                color: "#4a1a6b",
                                marginBottom: "0.65rem",
                                fontSize: "1.05rem",
                              }}
                            >
                              🎶 Picture Song
                            </h4>

                            {currentPicSong ? (
                              <>
                                <div style={{ color: "#6d28d9", fontWeight: 700, marginBottom: "0.5rem" }}>
                                  {currentPicSong.title}
                                </div>
                                <audio
                                  key={currentPicSong.url}
                                  controls
                                  style={{ width: "100%", marginBottom: "0.7rem" }}
                                >
                                  <source src={currentPicSong.url} />
                                </audio>

                                <button
                                  type="button"
                                  onClick={() => setCurrentPicSong(pickRandom(picSongs))}
                                  style={smallActionStyle("#7c3aed")}
                                >
                                  Random Picture Song
                                </button>
                              </>
                            ) : (
                              <div style={{ color: "#7c6b8f" }}>No picture songs added yet.</div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button type="button" onClick={() => handleDelete(currentPhoto)} style={deleteButtonStyle}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <button type="button" onClick={goNext} style={navButtonStyle}>›</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", overflowX: "auto", paddingBottom: "0.3rem" }}>
                {filteredPhotos.map((photo, index) => (
                  <motion.button
                    key={photo.publicId}
                    whileHover={{ y: -4, scale: 1.02 }}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    style={{
                      minWidth: "112px",
                      border:
                        index === activeIndex
                          ? "3px solid #7c3aed"
                          : "2px solid rgba(168,85,247,0.25)",
                      background: "#fff",
                      borderRadius: "18px",
                      padding: "6px",
                      cursor: "pointer",
                      boxShadow:
                        index === activeIndex
                          ? "0 10px 24px rgba(124,58,237,0.22)"
                          : "0 8px 18px rgba(124,58,237,0.08)",
                    }}
                  >
                    <div
                      style={{
                        width: "98px",
                        height: "98px",
                        overflow: "hidden",
                        borderRadius: "14px",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.note || "memory"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "#6b4e88",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {photo.note || "Memory"}
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>
      </AnimatedCard>

      {/* birthday music block ABOVE upload image block */}
      <AnimatedCard delay={0.2} gradient style={{ padding: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "#4a1a6b",
              marginBottom: "0.35rem",
            }}
          >
            🎵 Birthday Music
          </h2>

          <p style={{ color: "#7c6b8f", fontSize: "0.88rem" }}>
            Upload music and choose whether it belongs to birthday songs or picture songs.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.2rem",
            alignItems: "start",
          }}
        >
          <div>
            <AudioDropBox
              file={selectedMusicFile}
              onDrop={handleMusicDrop}
              onRemove={() => setSelectedMusicFile(null)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <select
              value={musicUploadType}
              onChange={(e) => setMusicUploadType(e.target.value)}
              style={inputStyle}
            >
              <option value="birthday">Birthday Song</option>
              <option value="pic">Picture Song</option>
            </select>

            <button
              type="button"
              onClick={handleUploadMusic}
              disabled={uploadingMusic}
              style={{
                border: "none",
                borderRadius: "16px",
                padding: "0.95rem 1rem",
                background: uploadingMusic
                  ? "rgba(124,58,237,0.45)"
                  : "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "#fff",
                fontWeight: 800,
                cursor: uploadingMusic ? "not-allowed" : "pointer",
                boxShadow: "0 12px 28px rgba(124,58,237,0.22)",
              }}
            >
              {uploadingMusic ? "Uploading..." : "Upload Music ✨"}
            </button>
          </div>
        </div>

        {/* show uploaded birthday songs below upload option */}
        <div style={{ marginTop: "1.4rem" }}>
          <h3 style={sectionTitleStyle}>Birthday Songs</h3>

          {birthdaySongs.length ? (
            <div
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(168,85,247,0.25)",
                background: "rgba(255,255,255,0.72)",
                padding: "1rem",
              }}
            >
              {currentBirthdaySong && (
                <>
                  <div style={{ color: "#6d28d9", fontWeight: 700, marginBottom: "0.6rem" }}>
                    {currentBirthdaySong.title}
                  </div>

                  <audio
                    key={currentBirthdaySong.url}
                    controls
                    style={{ width: "100%", marginBottom: "0.8rem" }}
                  >
                    <source src={currentBirthdaySong.url} />
                  </audio>
                </>
              )}

              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setCurrentBirthdaySong(pickRandom(birthdaySongs))}
                  style={smallActionStyle("#7c3aed")}
                >
                  Random Birthday Song
                </button>

                {birthdaySongs.slice(0, 5).map((song) => (
                  <button
                    key={song.publicId}
                    type="button"
                    onClick={() => setCurrentBirthdaySong(song)}
                    style={filterButtonStyle(currentBirthdaySong?.publicId === song.publicId)}
                  >
                    {song.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: "#7c6b8f" }}>No birthday songs uploaded yet.</div>
          )}
        </div>
      </AnimatedCard>

      {/* upload images */}
      <AnimatedCard delay={0.25} gradient style={{ padding: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "#4a1a6b",
              marginBottom: "0.35rem",
            }}
          >
            📤 Upload Memories
          </h2>

          <p style={{ color: "#7c6b8f", fontSize: "0.88rem" }}>
            Upload a normal image and optionally an AI-edited image.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.2rem",
            alignItems: "start",
          }}
        >
          {/* left upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <UploadDropBox
              label="Normal Picture"
              file={selectedPhotoFile}
              previewUrl={selectedPhotoPreview}
              onDrop={handleMainDrop}
              onRemove={() => setSelectedPhotoFile(null)}
              icon="💜"
            />

            <UploadDropBox
              label="AI Picture"
              file={selectedAiPhotoFile}
              previewUrl={selectedAiPhotoPreview}
              onDrop={handleAiDrop}
              onRemove={() => setSelectedAiPhotoFile(null)}
              icon="🤖"
            />
          </div>

          {/* right details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
            <input
              type="text"
              placeholder="Short heading / caption"
              value={note}
              onChange={(e) => setNote(capitalizeFirst(e.target.value))}
              style={inputStyle}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.8rem",
              }}
            >
              <select value={dress} onChange={(e) => setDress(e.target.value)} style={inputStyle}>
                <option value="">Select dress</option>
                {allDressOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select age range</option>
                {AGE_RANGES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "0.6rem",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Add new dress option"
                value={customDressInput}
                onChange={(e) => setCustomDressInput(capitalizeFirst(e.target.value))}
                style={inputStyle}
              />

              <button type="button" onClick={addCustomDress} style={miniButtonStyle}>
                Add
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowDressDeleteBox((prev) => !prev)}
                style={smallActionStyle("#7c3aed")}
              >
                {showDressDeleteBox ? "Hide Dress Delete" : "Delete Dress"}
              </button>
            </div>

            {showDressDeleteBox && customDressOptions.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.55rem",
                  flexWrap: "wrap",
                  padding: "0.2rem 0",
                }}
              >
                {customDressOptions.map((item) => (
                  <span key={item} style={chipStyle}>
                    {item}
                    <button
                      type="button"
                      onClick={() => removeCustomDress(item)}
                      style={chipButtonStyle}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {showDressDeleteBox && customDressOptions.length === 0 && (
              <div style={{ color: "#7c6b8f", fontSize: "0.84rem" }}>
                No custom dresses added yet.
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              style={{
                border: "none",
                borderRadius: "16px",
                padding: "0.95rem 1rem",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 12px 28px rgba(124,58,237,0.22)",
                marginTop: "0.35rem",
              }}
            >
              Upload Memory ✨
            </button>
          </div>
        </div>
      </AnimatedCard>

      {/* fullscreen */}
      <AnimatePresence>
        {fullscreenOpen && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(25, 10, 40, 0.92)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: "90vw",
                maxHeight: "88vh",
                borderRadius: "24px",
                overflow: "hidden",
                border: "3px solid rgba(216,180,254,0.35)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                background: "#fff",
              }}
            >
              <img
                src={displayedImage}
                alt={currentPhoto?.note || "Full memory"}
                style={{
                  display: "block",
                  maxWidth: "90vw",
                  maxHeight: "88vh",
                  objectFit: "contain",
                  background: "#fff",
                }}
              />

              <button
                type="button"
                onClick={() => setFullscreenOpen(false)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.55rem 0.8rem",
                  background: "rgba(255,255,255,0.9)",
                  color: "#7c3aed",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                }}
              >
                — Minimize
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const sectionTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  color: "#4a1a6b",
  marginBottom: "0.6rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.85rem 0.95rem",
  borderRadius: "14px",
  border: "1px solid rgba(168,85,247,0.3)",
  background: "rgba(255,255,255,0.92)",
  outline: "none",
  color: "#4a1a6b",
  fontSize: "0.92rem",
  boxSizing: "border-box",
};

const miniButtonStyle = {
  border: "none",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.42rem 0.75rem",
  borderRadius: "999px",
  background: "rgba(124,58,237,0.08)",
  border: "1px solid rgba(124,58,237,0.16)",
  color: "#7c3aed",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const chipButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#ec4899",
  fontWeight: 800,
  fontSize: "0.8rem",
};

const barWrapStyle = {
  display: "flex",
  gap: "0.55rem",
  flexWrap: "wrap",
};

const filterButtonStyle = (active) => ({
  border: active ? "2px solid #7c3aed" : "1px solid rgba(168,85,247,0.22)",
  background: active
    ? "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(236,72,153,0.08))"
    : "rgba(255,255,255,0.75)",
  color: active ? "#6d28d9" : "#7c6b8f",
  borderRadius: "999px",
  padding: "0.56rem 0.92rem",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.82rem",
});

const emptyStyle = {
  textAlign: "center",
  padding: "3rem 1rem",
  color: "#7c6b8f",
  fontFamily: "'Dancing Script', cursive",
  fontSize: "1.2rem",
};

const navButtonStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "#fff",
  fontSize: "1.6rem",
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(124,58,237,0.22)",
};

const toggleButtonStyle = (active) => ({
  border: active ? "2px solid #7c3aed" : "1px solid rgba(168,85,247,0.25)",
  background: active
    ? "linear-gradient(135deg, #7c3aed, #ec4899)"
    : "rgba(255,255,255,0.85)",
  color: active ? "#fff" : "#7c3aed",
  borderRadius: "999px",
  padding: "0.62rem 1rem",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "0.85rem",
});

const smallActionStyle = (color) => ({
  border: "none",
  borderRadius: "12px",
  padding: "0.65rem 0.95rem",
  background: color,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: `0 10px 20px ${color}33`,
});

const deleteButtonStyle = {
  border: "none",
  borderRadius: "14px",
  padding: "0.78rem 1.2rem",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
  boxShadow: "0 10px 20px rgba(220,38,38,0.22)",
};

const smallChipStyle = {
  padding: "0.45rem 0.8rem",
  borderRadius: "999px",
  background: "rgba(124,58,237,0.08)",
  border: "1px solid rgba(124,58,237,0.15)",
  color: "#7c3aed",
  fontSize: "0.78rem",
  fontWeight: 700,
};