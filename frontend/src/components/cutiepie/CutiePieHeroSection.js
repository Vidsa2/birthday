import React from "react";
import CutiePieGalleryFunPanel from "./CutiePieGalleryFunPanel";
import CutiePieSpinWheelPanel from "./CutiePieSpinWheelPanel";

export default function CutiePieHeroSection({
  photos = [],
  candles,
  toggleCandle,
  resetFun,
  currentBirthdaySong,
  goNextBirthdaySong,
  onDeleteBirthdaySong,
}) {
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
      <div className="cutie-hero-grid">
        <CutiePieGalleryFunPanel
          photos={photos}
          candles={candles}
          toggleCandle={toggleCandle}
          resetFun={resetFun}
          currentBirthdaySong={currentBirthdaySong}
          goNextBirthdaySong={goNextBirthdaySong}
          onDeleteBirthdaySong={onDeleteBirthdaySong}
        />

        <CutiePieSpinWheelPanel />
      </div>
    </div>
  );
}