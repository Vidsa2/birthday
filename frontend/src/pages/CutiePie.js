import React, { useCallback, useEffect, useMemo, useState } from "react";
import CutiePieHeroSection from "../components/cutiepie/CutiePieHeroSection";
import CutiePieGalleryView from "../components/cutiepie/CutiePieGalleryView";
import CutiePieUploadSection from "../components/cutiepie/CutiePieUploadSection";
import Ludo from "../components/cutiepie/Ludo";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_DRESSES = ["Saree", "Salwar", "Jeans", "Frock"];

const AGE_RANGES = [
  { label: "Less than 10", value: "less-than-10" },
  { label: "Teen Age", value: "teen-age" },
  { label: "After 20s", value: "after-20s" },
];

const AUTO_HEADING_LIST = [
  "Mountain Kili",
  "Birthday Mayil",
  "Smile Rani",
  "Pink Kutty",
  "Cake Kili",
  "Chocolate Ponnu",
  "Cloud Rani",
  "Garden Kili",
  "Flower Kutty",
  "Sunshine Ponnu",
  "Sparkle Mayil",
  "Butterfly Rani",
  "Dream Kili",
  "Cute Poochi",
  "Happy Kuyil",
  "Balloon Kutty",
  "Star Ponnu",
  "Magic Mayil",
  "Rose Kili",
  "Angel Kutty",
  "Moonlight Rani",
  "Rainbow Ponnu",
  "Teddy Kili",
  "Sugar Mayil",
  "Confetti Kutty",
  "Fairy Ponnu",
  "Garden Rani",
  "Golden Kili",
  "Sweet Kuyil",
  "Birthday Kutty",
  "Flower Queen Ponnu",
  "Dancing Mayil",
  "Paal Mittai Kili",
  "Ice Cream Rani",
  "Cupcake Kutty",
  "Thanga Ponnu",
  "Vennila Kili",
  "Pattu Mayil",
  "Chinna Rani",
  "Jolly Kutty",
  "Mini Mayil",
  "Happy Pappa",
  "Bubble Kili",
  "Queen Ponnu",
  "Cute Kozhi",
  "Semma Kili",
  "Choco Rani",
  "Twinkle Kutty",
  "Rainbow Mayil",
  "Birthday Ratchasi",
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

export default function CutiePie() {
  const [photos, setPhotos] = useState([]);
  const [orderedPhotoIds, setOrderedPhotoIds] = useState([]);
  const [showOnlyFirstTen, setShowOnlyFirstTen] = useState(true);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [selectedAiPhotoFile, setSelectedAiPhotoFile] = useState(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState("");
  const [selectedAiPhotoPreview, setSelectedAiPhotoPreview] = useState("");

  const [description, setDescription] = useState("");
  const [dress, setDress] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

  const [editingDescription, setEditingDescription] = useState(false);
  const [editDescriptionValue, setEditDescriptionValue] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);

  const [candles, setCandles] = useState([true, true, true]);

  const [selectedMusicFile, setSelectedMusicFile] = useState(null);
  const [musicTitle, setMusicTitle] = useState("");
  const [musicUploadType, setMusicUploadType] = useState("birthday");
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [birthdaySongs, setBirthdaySongs] = useState([]);
  const [picSongs, setPicSongs] = useState([]);
  const [currentBirthdayIndex, setCurrentBirthdayIndex] = useState(0);
  const [currentPicSong, setCurrentPicSong] = useState(null);

  const currentBirthdaySong = birthdaySongs[currentBirthdayIndex] || null;

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
    const savedOrder = localStorage.getItem("birthday_photo_order");

    if (savedOrder) {
      try {
        setOrderedPhotoIds(JSON.parse(savedOrder));
      } catch (error) {
        console.error("Failed to load photo order:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "birthday_custom_dresses",
      JSON.stringify(customDressOptions)
    );
  }, [customDressOptions]);

  useEffect(() => {
    localStorage.setItem("birthday_photo_order", JSON.stringify(orderedPhotoIds));
  }, [orderedPhotoIds]);

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

  useEffect(() => {
    const ids = photos.map((photo) => photo.publicId).filter(Boolean);

    setOrderedPhotoIds((prev) => {
      const existing = prev.filter((id) => ids.includes(id));
      const missing = ids.filter((id) => !existing.includes(id));
      const next = [...existing, ...missing];

      if (JSON.stringify(next) === JSON.stringify(prev)) {
        return prev;
      }

      return next;
    });
  }, [photos]);

  const allDressOptions = useMemo(() => {
    const merged = [
      ...DEFAULT_DRESSES,
      ...customDressOptions.map((item) => capitalizeFirst(item)),
    ];

    return [...new Set(merged)];
  }, [customDressOptions]);

  const orderedPhotos = useMemo(() => {
    const photoMap = new Map(photos.map((photo) => [photo.publicId, photo]));

    const ordered = orderedPhotoIds
      .map((id) => photoMap.get(id))
      .filter(Boolean);

    const orderedSet = new Set(ordered.map((photo) => photo.publicId));

    const missing = photos.filter((photo) => !orderedSet.has(photo.publicId));

    return [...ordered, ...missing];
  }, [photos, orderedPhotoIds]);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/photos?collectionName=photos`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load photos");
      }

      setPhotos(data.photos || []);
    } catch (error) {
      console.error(error);
      setMessage("Could not load photos. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMusicByType = useCallback(async (type) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/music?type=${encodeURIComponent(type)}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load music");
      }

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
    if (currentBirthdayIndex >= birthdaySongs.length) {
      setCurrentBirthdayIndex(0);
    }
  }, [birthdaySongs, currentBirthdayIndex]);

  const filteredPhotos = useMemo(() => {
    const basePhotos = showOnlyFirstTen ? orderedPhotos.slice(0, 10) : orderedPhotos;

    return basePhotos.filter((photo) => {
      const dressOk =
        dressFilter === "all" ? true : (photo.dress || "") === dressFilter;

      const ageOk =
        ageFilter === "all" ? true : (photo.ageRange || "") === ageFilter;

      return dressOk && ageOk;
    });
  }, [orderedPhotos, showOnlyFirstTen, dressFilter, ageFilter]);

  useEffect(() => {
    if (activeIndex >= filteredPhotos.length) {
      setActiveIndex(0);
    }
  }, [filteredPhotos, activeIndex]);

  const currentPhoto = filteredPhotos[activeIndex] || null;

  useEffect(() => {
    if (currentPhoto) {
      setEditHeadingValue(currentPhoto.note || "");
      setEditDescriptionValue(currentPhoto.description || "");
      setViewMode("normal");
      setEditingHeading(false);
      setEditingDescription(false);

      if (picSongs.length) {
        setCurrentPicSong(pickRandom(picSongs));
      } else {
        setCurrentPicSong(null);
      }
    }
  }, [currentPhoto?.publicId, picSongs]);

  const displayedImage = currentPhoto
    ? viewMode === "ai" && currentPhoto.aiImageUrl
      ? currentPhoto.aiImageUrl
      : currentPhoto.imageUrl
    : "";

  const currentOrderIndex = currentPhoto
    ? orderedPhotoIds.indexOf(currentPhoto.publicId)
    : -1;

  const isCurrentPhotoInFirstTen =
    currentOrderIndex >= 0 && currentOrderIndex < 10;

  const canMoveCurrentPhotoUp =
    isCurrentPhotoInFirstTen && currentOrderIndex > 0;

  const canMoveCurrentPhotoDown =
    isCurrentPhotoInFirstTen &&
    currentOrderIndex < Math.min(9, orderedPhotoIds.length - 1);

  function goNextBirthdaySong() {
    if (!birthdaySongs.length) return;
    setCurrentBirthdayIndex((prev) => (prev + 1) % birthdaySongs.length);
  }

  function addCustomDress() {
    const cleaned = capitalizeFirst(customDressInput);
    if (!cleaned) return;

    const exists = allDressOptions.some(
      (item) => item.toLowerCase() === cleaned.toLowerCase()
    );

    if (exists) {
      setMessage("This dress already exists.");
      setCustomDressInput("");
      return;
    }

    setCustomDressOptions((prev) => [...prev, cleaned]);
    setDress(cleaned);
    setCustomDressInput("");
    setMessage(`"${cleaned}" added successfully.`);
  }

  function removeCustomDress(value) {
    if (DEFAULT_DRESSES.includes(value)) return;

    setCustomDressOptions((prev) => prev.filter((item) => item !== value));

    if (dress === value) setDress("");
    if (dressFilter === value) setDressFilter("all");
  }

  const handleMainPhotoChange = (file) => {
    setSelectedPhotoFile(file);
    setMessage("");
  };

  const handleAiPhotoChange = (file) => {
    setSelectedAiPhotoFile(file);
    setMessage("");
  };

  const handleMusicChange = (file) => {
    setSelectedMusicFile(file);
    setMessage("");
  };

  async function handleUploadPhoto() {
    if (!selectedPhotoFile) {
      setMessage("Please select the main photo first.");
      return;
    }

    const randomHeading = pickRandom(AUTO_HEADING_LIST) || "Birthday Memory";
    const finalDescription = capitalizeFirst(description);

    try {
      setUploadingPhoto(true);
      setMessage("Uploading beautiful memory... 💜");

      const formData = new FormData();
      formData.append("photo", selectedPhotoFile);

      if (selectedAiPhotoFile) {
        formData.append("aiPhoto", selectedAiPhotoFile);
      }

      formData.append("collectionName", "photos");
      formData.append("note", randomHeading);
      formData.append("description", finalDescription);
      formData.append("dress", capitalizeFirst(dress));
      formData.append("ageRange", ageRange);

      const res = await fetch(`${API_BASE}/api/photos/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      const uploadedPhoto = {
        ...data.photo,
        note: data.photo?.note || randomHeading,
        description: data.photo?.description || finalDescription,
      };

      setPhotos((prev) => [...prev, uploadedPhoto]);

      if (uploadedPhoto.publicId) {
        setOrderedPhotoIds((prev) =>
          prev.includes(uploadedPhoto.publicId)
            ? prev
            : [...prev, uploadedPhoto.publicId]
        );
      }

      setSelectedPhotoFile(null);
      setSelectedAiPhotoFile(null);
      setDescription("");
      setDress("");
      setAgeRange("");
      setMessage(`Photo uploaded successfully 🌸 Heading: ${randomHeading}`);
      setActiveIndex(0);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleUploadMusic() {
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
      formData.append(
        "title",
        capitalizeFirst(musicTitle) || selectedMusicFile.name
      );

      const res = await fetch(`${API_BASE}/api/music/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Music upload failed");
      }

      setSelectedMusicFile(null);
      setMusicTitle("");
      setMessage("Music uploaded successfully 🎶");
      await fetchAllMusic();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Music upload failed.");
    } finally {
      setUploadingMusic(false);
    }
  }

  async function handleDeleteMusic(song) {
    if (!song?.id) {
      setMessage("Song id not found.");
      return;
    }

    const ok = window.confirm("Do you want to delete this song?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/music`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: song.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Music delete failed");
      }

      setMessage("Music deleted successfully.");
      await fetchAllMusic();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Music delete failed.");
    }
  }

  async function handleDeletePhoto(photo) {
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

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setPhotos((prev) =>
        prev.filter((item) => item.publicId !== photo.publicId)
      );

      setOrderedPhotoIds((prev) =>
        prev.filter((id) => id !== photo.publicId)
      );

      setMessage("Photo deleted successfully.");
      setFullscreenOpen(false);
      setActiveIndex(0);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Delete failed.");
    }
  }

  async function saveHeading() {
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

      if (!res.ok) {
        throw new Error(data.message || "Heading update failed");
      }

      setPhotos((prev) =>
        prev.map((item) =>
          item.publicId === currentPhoto.publicId
            ? { ...item, note: finalHeading }
            : item
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
  }

  async function saveDescription() {
    if (!currentPhoto) return;

    try {
      setSavingDescription(true);

      const finalDescription = capitalizeFirst(editDescriptionValue);

      const res = await fetch(`${API_BASE}/api/photos/description`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: currentPhoto.publicId,
          description: finalDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Description update failed");
      }

      setPhotos((prev) =>
        prev.map((item) =>
          item.publicId === currentPhoto.publicId
            ? { ...item, description: finalDescription }
            : item
        )
      );

      setEditingDescription(false);
      setMessage("Description updated successfully ✨");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Description update failed.");
    } finally {
      setSavingDescription(false);
    }
  }

  function movePhotoInOrder(direction) {
    if (!currentPhoto?.publicId) return;

    setOrderedPhotoIds((prev) => {
      const index = prev.indexOf(currentPhoto.publicId);

      if (index < 0 || index >= 10) return prev;

      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= Math.min(10, prev.length)) {
        return prev;
      }

      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;

      return next;
    });
  }

  function goNextPhoto() {
    if (!filteredPhotos.length) return;
    setActiveIndex((prev) => (prev + 1) % filteredPhotos.length);
  }

  function goPrevPhoto() {
    if (!filteredPhotos.length) return;

    setActiveIndex((prev) =>
      prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
  }

  function toggleCandle(index) {
    setCandles((prev) => prev.map((item, i) => (i === index ? !item : item)));
  }

  function resetFun() {
    setCandles([true, true, true]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <CutiePieHeroSection
        photos={photos}
        candles={candles}
        toggleCandle={toggleCandle}
        resetFun={resetFun}
        currentBirthdaySong={currentBirthdaySong}
        goNextBirthdaySong={goNextBirthdaySong}
        onDeleteBirthdaySong={handleDeleteMusic}
      />
      <Ludo photos={photos} />
      <CutiePieGalleryView
        loading={loading}
        message={message}
        allDressOptions={allDressOptions}
        ageRanges={AGE_RANGES}
        dressFilter={dressFilter}
        setDressFilter={setDressFilter}
        ageFilter={ageFilter}
        setAgeFilter={setAgeFilter}
        filteredPhotos={filteredPhotos}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        currentPhoto={currentPhoto}
        displayedImage={displayedImage}
        fullscreenOpen={fullscreenOpen}
        setFullscreenOpen={setFullscreenOpen}
        viewMode={viewMode}
        setViewMode={setViewMode}
        editingHeading={editingHeading}
        setEditingHeading={setEditingHeading}
        editHeadingValue={editHeadingValue}
        setEditHeadingValue={setEditHeadingValue}
        savingHeading={savingHeading}
        saveHeading={saveHeading}
        editingDescription={editingDescription}
        setEditingDescription={setEditingDescription}
        editDescriptionValue={editDescriptionValue}
        setEditDescriptionValue={setEditDescriptionValue}
        savingDescription={savingDescription}
        saveDescription={saveDescription}
        goPrevPhoto={goPrevPhoto}
        goNextPhoto={goNextPhoto}
        handleDeletePhoto={handleDeletePhoto}
        currentPicSong={currentPicSong}
        setCurrentPicSong={setCurrentPicSong}
        picSongs={picSongs}
        handleDeleteMusic={handleDeleteMusic}
        getPoemForPhoto={getPoemForPhoto}
        capitalizeFirst={capitalizeFirst}
        showOnlyFirstTen={showOnlyFirstTen}
        setShowOnlyFirstTen={setShowOnlyFirstTen}
        movePhotoInOrder={movePhotoInOrder}
        currentOrderIndex={currentOrderIndex}
        isCurrentPhotoInFirstTen={isCurrentPhotoInFirstTen}
        canMoveCurrentPhotoUp={canMoveCurrentPhotoUp}
        canMoveCurrentPhotoDown={canMoveCurrentPhotoDown}
      />

      <CutiePieUploadSection
        message={message}
        selectedMusicFile={selectedMusicFile}
        musicTitle={musicTitle}
        setMusicTitle={setMusicTitle}
        musicUploadType={musicUploadType}
        setMusicUploadType={setMusicUploadType}
        uploadingMusic={uploadingMusic}
        handleMusicChange={handleMusicChange}
        handleUploadMusic={handleUploadMusic}
        selectedPhotoFile={selectedPhotoFile}
        selectedAiPhotoFile={selectedAiPhotoFile}
        selectedPhotoPreview={selectedPhotoPreview}
        selectedAiPhotoPreview={selectedAiPhotoPreview}
        handleMainPhotoChange={handleMainPhotoChange}
        handleAiPhotoChange={handleAiPhotoChange}
        description={description}
        setDescription={setDescription}
        dress={dress}
        setDress={setDress}
        ageRange={ageRange}
        setAgeRange={setAgeRange}
        customDressInput={customDressInput}
        setCustomDressInput={setCustomDressInput}
        allDressOptions={allDressOptions}
        addCustomDress={addCustomDress}
        removeCustomDress={removeCustomDress}
        showDressDeleteBox={showDressDeleteBox}
        setShowDressDeleteBox={setShowDressDeleteBox}
        uploadingPhoto={uploadingPhoto}
        handleUploadPhoto={handleUploadPhoto}
        capitalizeFirst={capitalizeFirst}
        defaultDresses={DEFAULT_DRESSES}
        ageRanges={AGE_RANGES}
      />
    </div>
  );
}