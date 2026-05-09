import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function filterButtonStyle(active) {
  return {
    borderRadius: "999px",
    border: `2px solid ${active ? "#7c3aed" : "rgba(168,85,247,0.2)"}`,
    background: active ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.75)",
    color: active ? "#7c3aed" : "#7c6b8f",
    padding: "0.7rem 1.2rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const sectionTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  color: "#4a1a6b",
  fontSize: "1.25rem",
  marginBottom: "0.7rem",
};

const barWrapStyle = {
  display: "flex",
  gap: "0.7rem",
  flexWrap: "wrap",
  marginBottom: "1rem",
};

const emptyStyle = {
  textAlign: "center",
  color: "#7c6b8f",
  padding: "2rem",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(216,180,254,0.45)",
};

const navButtonStyle = {
  border: "none",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "#fff",
  fontSize: "2rem",
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(124,58,237,0.2)",
};

function smallActionStyle(color) {
  return {
    border: "none",
    borderRadius: "14px",
    padding: "0.7rem 1rem",
    background: color,
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  };
}

function toggleButtonStyle(active) {
  return {
    border: "none",
    borderRadius: "999px",
    padding: "0.85rem 1.2rem",
    background: active
      ? "linear-gradient(135deg, #7c3aed, #ec4899)"
      : "rgba(255,255,255,0.75)",
    color: active ? "#fff" : "#6d28d9",
    fontWeight: 800,
    cursor: "pointer",
    borderColor: "rgba(168,85,247,0.3)",
  };
}

const deleteButtonStyle = {
  border: "none",
  borderRadius: "16px",
  padding: "0.95rem 1.35rem",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

function cleanSongTitle(song) {
  const title = song?.title || "Picture song is ready";
  return String(title)
    .replace(/\.(mp3|wav|m4a|ogg|aac|flac)$/i, "")
    .trim();
}

export default function CutiePieGalleryView({
  loading,
  message,
  allDressOptions,
  ageRanges,
  dressFilter,
  setDressFilter,
  ageFilter,
  setAgeFilter,
  filteredPhotos,
  activeIndex,
  currentPhoto,
  displayedImage,
  fullscreenOpen,
  setFullscreenOpen,
  viewMode,
  setViewMode,
  editingDescription,
  setEditingDescription,
  editDescriptionValue,
  setEditDescriptionValue,
  savingDescription,
  saveDescription,
  goPrevPhoto,
  goNextPhoto,
  handleDeletePhoto,
  currentPicSong,
  picSongs,
  handleDeleteMusic,
  getPoemForPhoto,
  showOnlyFirstTen,
  setShowOnlyFirstTen,
  movePhotoInOrder,
  currentOrderIndex,
  isCurrentPhotoInFirstTen,
  canMoveCurrentPhotoUp,
  canMoveCurrentPhotoDown,
}) {
  const audioRef = useRef(null);
  const [galleryStarted, setGalleryStarted] = useState(false);
  const [openingGallery, setOpeningGallery] = useState(false);

  function openGalleryWithAnimation() {
    if (openingGallery) return;

    setOpeningGallery(true);

    setTimeout(() => {
      setOpeningGallery(false);
      setGalleryStarted(true);
    }, 5000);
  }

  useEffect(() => {
    if (!galleryStarted || !currentPicSong?.url || !audioRef.current) return;

    const timer = setTimeout(() => {
      audioRef.current
        .play()
        .catch(() => {
          // Browser may block autoplay until user interacts.
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [galleryStarted, currentPhoto?.publicId, currentPicSong?.url]);

  function handleNextPhoto() {
    goNextPhoto();
  }

  function handlePrevPhoto() {
    goPrevPhoto();
  }

  if (!galleryStarted) {
    return (
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "26px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,235,255,0.94))",
          border: "1px solid rgba(216,180,254,0.45)",
          boxShadow: "0 16px 35px rgba(124,58,237,0.12)",
          minHeight: "420px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "12%",
            left: "10%",
            fontSize: "2rem",
          }}
        >
          🎈
        </motion.div>

        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "18%",
            right: "13%",
            fontSize: "2rem",
          }}
        >
          💜
        </motion.div>

        <motion.div
          animate={{ y: [0, -16, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "15%",
            left: "17%",
            fontSize: "2rem",
          }}
        >
          ✨
        </motion.div>

        <div
          style={{
            maxWidth: "640px",
            width: "100%",
            textAlign: "center",
            padding: "2rem",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.78)",
            border: "1px solid rgba(216,180,254,0.45)",
            boxShadow: "0 18px 45px rgba(124,58,237,0.15)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {!openingGallery ? (
            <>
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontSize: "4rem", marginBottom: "1rem" }}
              >
                🎁
              </motion.div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.7rem",
                }}
              >
                View Birthday Gallery
              </h2>

              <p
                style={{
                  color: "#7c6b8f",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  marginBottom: "1.4rem",
                }}
              >
                Open the surprise gallery with beautiful memories, sweet photos,
                kavithai, and music 💜
              </p>

              <button
                type="button"
                onClick={openGalleryWithAnimation}
                style={{
                  border: "none",
                  borderRadius: "18px",
                  padding: "1rem 1.5rem",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 14px 28px rgba(124,58,237,0.25)",
                  fontSize: "1rem",
                }}
              >
                Open Gallery ✨
              </button>
            </>
          ) : (
            <>
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: "4.5rem", marginBottom: "1rem" }}
              >
                🎁
              </motion.div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                  color: "#4a1a6b",
                  marginBottom: "0.7rem",
                }}
              >
                Opening the beautiful memories...
              </h2>

              <p
                style={{
                  color: "#7c6b8f",
                  fontSize: "1rem",
                  marginBottom: "1.2rem",
                }}
              >
                Wait 5 seconds for the surprise page 💜
              </p>

              <div
                style={{
                  width: "100%",
                  height: "12px",
                  borderRadius: "999px",
                  background: "rgba(168,85,247,0.15)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  style={{
                    height: "100%",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
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
            marginBottom: "1rem",
          }}
        >
          {message}
        </motion.div>
      )}

      <div>
        <h3 style={sectionTitleStyle}>Dress Filter</h3>
        <div style={barWrapStyle}>
          <button
            type="button"
            onClick={() => setDressFilter("all")}
            style={filterButtonStyle(dressFilter === "all")}
          >
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
          <button
            type="button"
            onClick={() => setAgeFilter("all")}
            style={filterButtonStyle(ageFilter === "all")}
          >
            All
          </button>

          {ageRanges.map((item) => (
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

      <div style={{ marginBottom: "1rem" }}>
        <h3 style={sectionTitleStyle}>Gallery Mode</h3>
        <div style={barWrapStyle}>
          <button
            type="button"
            onClick={() => setShowOnlyFirstTen(true)}
            style={filterButtonStyle(showOnlyFirstTen)}
          >
            First 10 Pictures
          </button>

          <button
            type="button"
            onClick={() => setShowOnlyFirstTen(false)}
            style={filterButtonStyle(!showOnlyFirstTen)}
          >
            Show All
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h2
          style={{
            ...sectionTitleStyle,
            fontSize: "1.35rem",
            marginBottom: 0,
          }}
        >
          🌸 Beautiful Viewing Gallery
        </h2>

        <div style={{ color: "#7c6b8f", fontWeight: 700 }}>
          Showing {filteredPhotos.length} photo
          {filteredPhotos.length !== 1 ? "s" : ""}
        </div>
      </div>

      {currentPhoto && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.9rem",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(216,180,254,0.45)",
            display: "flex",
            justifyContent: "space-between",
            gap: "0.8rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#6b4e88", fontWeight: 800 }}>
            First 10 order:
            {isCurrentPhotoInFirstTen
              ? ` Position ${currentOrderIndex + 1}`
              : " This photo is outside first 10"}
          </div>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => movePhotoInOrder(-1)}
              disabled={!canMoveCurrentPhotoUp}
              style={{
                ...smallActionStyle(
                  canMoveCurrentPhotoUp ? "#7c3aed" : "rgba(124,58,237,0.35)"
                ),
                cursor: canMoveCurrentPhotoUp ? "pointer" : "not-allowed",
              }}
            >
              Move Earlier
            </button>

            <button
              type="button"
              onClick={() => movePhotoInOrder(1)}
              disabled={!canMoveCurrentPhotoDown}
              style={{
                ...smallActionStyle(
                  canMoveCurrentPhotoDown ? "#a855f7" : "rgba(124,58,237,0.35)"
                ),
                cursor: canMoveCurrentPhotoDown ? "pointer" : "not-allowed",
              }}
            >
              Move Later
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={emptyStyle}>Loading memories... 💜</div>
      ) : filteredPhotos.length === 0 ? (
        <div style={emptyStyle}>No photos match this filter yet 🌸</div>
      ) : (
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
            <button type="button" onClick={handlePrevPhoto} style={navButtonStyle}>
              ‹
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto?.publicId}
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
                    if (info.offset.x < -80) handleNextPhoto();
                    if (info.offset.x > 80) handlePrevPhoto();
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, #fff, rgba(247,236,255,0.96))",
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
                      onClick={(event) => {
                        event.stopPropagation();
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
                        {currentPhoto?.note?.trim()
                          ? currentPhoto.note
                          : "A beautiful memory 💜"}
                      </h3>
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

                    <div
                      style={{
                        display: "flex",
                        gap: "0.7rem",
                        flexWrap: "wrap",
                        marginBottom: "1rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setViewMode("normal")}
                        style={toggleButtonStyle(viewMode === "normal")}
                      >
                        Normal
                      </button>

                      {currentPhoto?.aiImageUrl && (
                        <button
                          type="button"
                          onClick={() => setViewMode("ai")}
                          style={toggleButtonStyle(viewMode === "ai")}
                        >
                          AI
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        borderRadius: "18px",
                        border: "1px solid rgba(168,85,247,0.22)",
                        background: "rgba(255,255,255,0.68)",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "0.8rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                          marginBottom: "0.65rem",
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            color: "#4a1a6b",
                            fontSize: "1.05rem",
                            margin: 0,
                          }}
                        >
                          💌 Description
                        </h4>

                        {!editingDescription && (
                          <button
                            type="button"
                            onClick={() => setEditingDescription(true)}
                            style={smallActionStyle("#ec4899")}
                          >
                            Edit Description
                          </button>
                        )}
                      </div>

                      {editingDescription ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.7rem",
                          }}
                        >
                          <textarea
                            value={editDescriptionValue}
                            onChange={(event) =>
                              setEditDescriptionValue(event.target.value)
                            }
                            rows={3}
                            placeholder="Write description"
                            style={{
                              width: "100%",
                              borderRadius: "14px",
                              border: "1px solid rgba(168,85,247,0.25)",
                              padding: "0.85rem 1rem",
                              outline: "none",
                              background: "rgba(255,255,255,0.85)",
                              color: "#4a1a6b",
                              fontSize: "0.95rem",
                              resize: "vertical",
                              lineHeight: 1.5,
                            }}
                          />

                          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={saveDescription}
                              disabled={savingDescription}
                              style={smallActionStyle("#7c3aed")}
                            >
                              {savingDescription ? "Saving..." : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingDescription(false);
                                setEditDescriptionValue(
                                  currentPhoto?.description || ""
                                );
                              }}
                              style={smallActionStyle("#a855f7")}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "#6b4e88",
                            lineHeight: 1.75,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {currentPhoto?.description?.trim()
                            ? currentPhoto.description
                            : "No description added yet 💜"}
                        </p>
                      )}
                    </div>

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
                          <div
                            style={{
                              color: "#6d28d9",
                              fontWeight: 700,
                              marginBottom: "0.5rem",
                            }}
                          >
                            {cleanSongTitle(currentPicSong)}
                          </div>

                          <audio
                            ref={audioRef}
                            key={currentPicSong.url}
                            controls
                            autoPlay
                            style={{ width: "100%", marginBottom: "0.7rem" }}
                          >
                            <source src={currentPicSong.url} />
                          </audio>

                          <button
                            type="button"
                            onClick={() => handleDeleteMusic(currentPicSong)}
                            style={smallActionStyle("#ef4444")}
                          >
                            Delete Song
                          </button>
                        </>
                      ) : (
                        <div style={{ color: "#7c6b8f" }}>
                          No picture songs added yet.
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(currentPhoto)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button type="button" onClick={handleNextPhoto} style={navButtonStyle}>
              ›
            </button>
          </div>
        </div>
      )}

      {fullscreenOpen && currentPhoto && (
        <div
          onClick={() => setFullscreenOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 10, 25, 0.85)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(95vw, 900px)",
              maxHeight: "90vh",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              background: "#fff",
            }}
          >
            <img
              src={displayedImage}
              alt={currentPhoto.note || "Memory"}
              style={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                display: "block",
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
                padding: "0.65rem 0.85rem",
                background: "rgba(255,255,255,0.92)",
                color: "#7c3aed",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Minimize
            </button>
          </div>
        </div>
      )}
    </div>
  );
}