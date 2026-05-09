import React, { useRef } from "react";

function inputStyle() {
  return {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid rgba(168,85,247,0.25)",
    padding: "0.95rem 1rem",
    outline: "none",
    background: "rgba(255,255,255,0.85)",
    color: "#4a1a6b",
    fontSize: "0.95rem",
  };
}

function sectionTitleStyle() {
  return {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.3rem",
    color: "#4a1a6b",
    marginBottom: "0.35rem",
  };
}

function smallChipStyle() {
  return {
    borderRadius: "999px",
    padding: "0.45rem 0.8rem",
    border: "1px solid rgba(168,85,247,0.25)",
    background: "rgba(255,255,255,0.72)",
    color: "#7c3aed",
    fontWeight: 700,
    fontSize: "0.85rem",
  };
}

function UploadCard({ title, file, preview, onPick, onRemove, icon = "📷" }) {
  const ref = useRef(null);

  return (
    <div
      onClick={() => ref.current?.click()}
      style={{
        border: "2px dashed rgba(168,85,247,0.35)",
        borderRadius: "22px",
        padding: "1.2rem",
        minHeight: "210px",
        background: "rgba(255,255,255,0.9)",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
        }}
      />

      {preview ? (
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
              src={preview}
              alt={title}
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
            {title}
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span style={smallChipStyle()}>Click to change</span>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
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
          <div style={{ fontSize: "2.1rem", marginBottom: "0.45rem" }}>
            {icon}
          </div>
          <div
            style={{
              color: "#7c3aed",
              fontWeight: 800,
              marginBottom: "0.3rem",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#6b4e88",
              fontSize: "0.86rem",
              marginBottom: "0.2rem",
            }}
          >
            Drag & drop or click to choose a photo
          </div>
          <div style={{ color: "#7c6b8f", fontSize: "0.76rem" }}>
            JPG, PNG, GIF, WEBP
          </div>
        </>
      )}
    </div>
  );
}

function AudioCard({ file, onPick, onRemove }) {
  const ref = useRef(null);

  return (
    <div
      onClick={() => ref.current?.click()}
      style={{
        border: "2px dashed rgba(168,85,247,0.35)",
        borderRadius: "18px",
        padding: "1rem",
        minHeight: "150px",
        background: "rgba(255,255,255,0.9)",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <input
        ref={ref}
        type="file"
        accept="audio/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
        }}
      />

      <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>🎵</div>
      <div
        style={{
          color: "#7c3aed",
          fontWeight: 800,
          marginBottom: "0.3rem",
        }}
      >
        Upload Music
      </div>

      {file ? (
        <>
          <div
            style={{
              color: "#6b4e88",
              fontSize: "0.88rem",
              marginBottom: "0.8rem",
              wordBreak: "break-word",
            }}
          >
            {file.name}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span style={smallChipStyle()}>Click to change</span>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
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
          <div
            style={{
              color: "#6b4e88",
              fontSize: "0.86rem",
              marginBottom: "0.2rem",
            }}
          >
            Drag & drop or click to choose music
          </div>
          <div style={{ color: "#7c6b8f", fontSize: "0.76rem" }}>
            MP3, WAV, M4A, OGG
          </div>
        </>
      )}
    </div>
  );
}

export default function CutiePieUploadSection({
  message,
  selectedMusicFile,
  musicTitle,
  setMusicTitle,
  musicUploadType,
  setMusicUploadType,
  uploadingMusic,
  handleMusicChange,
  handleUploadMusic,
  selectedPhotoFile,
  selectedAiPhotoFile,
  selectedPhotoPreview,
  selectedAiPhotoPreview,
  handleMainPhotoChange,
  handleAiPhotoChange,
  description,
  setDescription,
  dress,
  setDress,
  ageRange,
  setAgeRange,
  customDressInput,
  setCustomDressInput,
  allDressOptions,
  addCustomDress,
  removeCustomDress,
  showDressDeleteBox,
  setShowDressDeleteBox,
  uploadingPhoto,
  handleUploadPhoto,
  capitalizeFirst,
  defaultDresses,
  ageRanges,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={sectionTitleStyle()}>🎵 Upload Music</h2>
          <p style={{ color: "#7c6b8f", fontSize: "0.88rem" }}>
            Upload music and choose whether it belongs to birthday songs or
            picture songs.
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
            <input
              type="text"
              placeholder="Music name"
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              style={{ ...inputStyle(), marginBottom: "0.8rem" }}
            />

            <AudioCard
              file={selectedMusicFile}
              onPick={handleMusicChange}
              onRemove={() => handleMusicChange(null)}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            <select
              value={musicUploadType}
              onChange={(e) => setMusicUploadType(e.target.value)}
              style={inputStyle()}
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
      </div>

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
          <div
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
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <h2 style={sectionTitleStyle()}>📤 Upload Memories</h2>
          <p style={{ color: "#7c6b8f", fontSize: "0.88rem" }}>
            Upload a normal image and optionally an AI-edited image. The heading
            will be selected automatically.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <UploadCard
            title="Normal Picture"
            file={selectedPhotoFile}
            preview={selectedPhotoPreview}
            onPick={handleMainPhotoChange}
            onRemove={() => handleMainPhotoChange(null)}
            icon="💜"
          />

          <UploadCard
            title="AI Picture"
            file={selectedAiPhotoFile}
            preview={selectedAiPhotoPreview}
            onPick={handleAiPhotoChange}
            onRemove={() => handleAiPhotoChange(null)}
            icon="📷"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
            <textarea
              placeholder="Write description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{
                ...inputStyle(),
                resize: "vertical",
                minHeight: "70px",
                maxHeight: "120px",
                lineHeight: 1.5,
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0.8rem",
              }}
            >
              <select
                value={dress}
                onChange={(e) => setDress(e.target.value)}
                style={inputStyle()}
              >
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
                style={inputStyle()}
              >
                <option value="">Select age range</option>
                {ageRanges.map((item) => (
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
                onChange={(e) => setCustomDressInput(e.target.value)}
                style={inputStyle()}
              />

              <button
                type="button"
                onClick={addCustomDress}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "0.95rem 1rem",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowDressDeleteBox((prev) => !prev)}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "0.75rem 1rem",
                  background: "rgba(124,58,237,0.12)",
                  color: "#7c3aed",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {showDressDeleteBox ? "Hide Dress Delete" : "Delete Dress"}
              </button>

              {showDressDeleteBox && (
                <div
                  style={{
                    marginTop: "0.8rem",
                    display: "flex",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  {allDressOptions
                    .filter((item) => !defaultDresses.includes(item))
                    .map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => removeCustomDress(item)}
                        style={{
                          border: "1px solid rgba(236,72,153,0.2)",
                          borderRadius: "999px",
                          padding: "0.55rem 0.8rem",
                          background: "rgba(255,255,255,0.85)",
                          color: "#ec4899",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {item} ✕
                      </button>
                    ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleUploadPhoto}
              disabled={uploadingPhoto}
              style={{
                border: "none",
                borderRadius: "16px",
                padding: "1rem 1.1rem",
                background: uploadingPhoto
                  ? "rgba(124,58,237,0.45)"
                  : "linear-gradient(135deg, #7c3aed, #ec4899)",
                color: "#fff",
                fontWeight: 900,
                cursor: uploadingPhoto ? "not-allowed" : "pointer",
                boxShadow: "0 12px 28px rgba(124,58,237,0.22)",
              }}
            >
              {uploadingPhoto ? "Uploading..." : "Upload Memory ✨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
