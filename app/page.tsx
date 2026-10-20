
"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const flowers = ["🌼", "🌷", "🌸", "🌻", "💐", "🌺", "🪻"];

const openingFlowers = [
  "🌹", "🌷", "🌸", "🌻", "🌺", "🪻",
  "💐", "🌼", "🌹", "🌷", "🪷", "🌸",
  "🌻", "🌺", "💮", "🌹", "🌼", "🪻",
  "🌷", "🌸", "🌹", "🌻", "🌺", "💐",
];

const picnicIdeas = [
  {
    icon: "🧺",
    title: "Bekal wajib",
    detail:
      "Camilan enak. Boleh rebutan, tapi jangan marah kalau aku menang.",
  },
  {
    icon: "🌷",
    title: "Dress code",
    detail:
      "Warna cerah atau motif bunga. Kalau pakai hitam juga boleh, asal tetap datang.",
  },
  {
    icon: "🎶",
    title: "Agenda utama",
    detail:
      "Ngobrol, foto-foto, rebahan di rumput, lalu bilang sebentar lagi pulang selama 2 jam.",
  },
];

const activityOptions = [
  {
    icon: "📸",
    label: "Foto-foto",
    detail: "Biar galeri HP penuh kenangan",
  },
  {
    icon: "💬",
    label: "Ngobrol",
    detail: "Cerita random sampai lupa waktu",
  },
  {
    icon: "🍓",
    label: "Makan",
    detail: "Piknik tanpa makan itu mencurigakan",
  },
  {
    icon: "🎤",
    label: "Nyanyi",
    detail: "Suara fals dilarang minder",
  },
  {
    icon: "🌲",
    label: "Jalan-jalan di hutan pinus",
    detail: "Cari spot paling estetik",
  },
  {
    icon: "🧺",
    label: "Gelar tikar dan rebahan",
    detail: "Produktif dalam hal bermalas-malasan",
  },
  {
    icon: "🎲",
    label: "Main game",
    detail: "Yang kalah harus traktir camilan",
  },
  {
    icon: "🦋",
    label: "Menikmati alam",
    detail: "Lihat pohon sambil sok puitis",
  },
  {
    icon: "💌",
    label: "Tukar cerita manis",
    detail: "Agak romantis sedikit tidak apa-apa",
  },
  {
    icon: "🌅",
    label: "Menunggu senja",
    detail: "Bonus foto siluet berdua",
  },
  {
    icon: "🎧",
    label: "Dengar musik",
    detail: "Bikin playlist khusus kita",
  },
  {
    icon: "🍃",
    label: "Cari udara segar",
    detail: "Kabur sebentar dari ramainya dunia",
  },
];

export default function Home() {
  const [showOpening, setShowOpening] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [place] = useState("Hutan Pinus");
  const [activities, setActivities] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");

  const [tease, setTease] = useState(
    "Psst… ada seseorang yang ingin ngajak kamu pergi 🌷"
  );

  const noTexts = [
    "Nggak mau 😶",
    "Yakin nih? 🥺",
    "Coba pikir lagi…",
    "Aku bawa snack loh 😭",
    "Tombol ini mulai capek",
    "Oke, aku sedih 0,7 detik 💔",
  ];

  async function openInvitation() {
    setShowOpening(false);

    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setMusicPlaying(true);
    } catch (error) {
      console.error("Musik belum dapat diputar:", error);
      setMusicPlaying(false);
    }
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setMusicPlaying(true);
      } catch (error) {
        console.error("Musik belum dapat diputar:", error);
        setMusicPlaying(false);
      }
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  }

  const sayNo = () => {
    setNoCount((n) => n + 1);

    setTease(
      [
        "Jawabanmu tercatat… di hati yang terluka.",
        "Bunga-bunganya ikut kecewa 😔",
        "Sistem mendeteksi kebanyakan gengsi.",
        "Coba pencet tombol pink. Yang itu lebih bijak.",
        "Ini bukan penolakan, ini cuma loading, kan?",
      ][noCount % 5]
    );
  };

  const toggleActivity = (activity: string) => {
    setActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity]
    );
  };

  async function submitAnswer() {
    if (activities.length === 0) {
      setNote("Pilih minimal satu kegiatan dulu yaa 🥺");
      return;
    }

    if (!supabase) {
      setNote(
        "Koneksi Supabase belum tersedia. Periksa konfigurasi environment."
      );
      return;
    }

    setSaving(true);
    setNote("");

    try {
      const { error } = await supabase
        .from("picnic_responses")
        .insert({
          guest_name: name.trim() || "Tamu misterius",
          accepted: true,
          preferred_date: date || null,
          preferred_place: place || "Hutan Pinus",
          activities: activities,
        });

      if (error) {
        console.error("Gagal menyimpan RSVP:", error);
        setNote(`Gagal menyimpan: ${error.message}`);
        return;
      }

      setSaved(true);
      setNote("Jawaban berhasil disimpan ke database! 💗");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);

      setNote(
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan. Coba lagi ya 🌷"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/romantic-piano.mp3"
        loop
        preload="auto"
      />

      {showOpening && (
        <section className="flower-opening">
          <div className="opening-glow" />

          <div className="opening-flower-garden" aria-hidden="true">
            {openingFlowers.map((flower, index) => (
              <span
                key={index}
                className={`opening-flower flower-pos-${index % 6}`}
                style={{
                  animationDelay: `${(index % 12) * 0.55}s`,
                  animationDuration: `${7 + (index % 5)}s`,
                }}
              >
                {flower}
              </span>
            ))}
          </div>

          <div className="opening-content">
            <span className="opening-eyebrow">
              ✧ A LITTLE GIFT FOR YOU ✧
            </span>

            <div className="opening-bouquet" aria-hidden="true">
              <div>🌹 🌷 🌸 🌹 🌼</div>
              <div>🌷 💐 🌺 🌸 🌹</div>
            </div>

            <h1>
              Untuk kamu,
              <br />
              <em>si pecinta bunga ♡</em>
            </h1>

            <p>
              Kalau semua bunga di dunia dikumpulkan,
              <br />
              tetap ada satu orang yang ingin aku ajak
              <br />
              menikmati keindahannya bersama.
            </p>

            <div className="opening-divider" aria-hidden="true">
              <span>❀</span> ♡ <span>❀</span>
            </div>

            <button
              className="opening-button"
              onClick={() => void openInvitation()}
            >
              Buka surat untukmu <span>💌</span>
            </button>

            <span className="opening-footer">
              dibuat khusus untuk seseorang yang istimewa 🌷
            </span>
          </div>
        </section>
      )}

      {!showOpening && (
        <button
          className="music-toggle"
          onClick={() => void toggleMusic()}
          aria-label={musicPlaying ? "Matikan musik" : "Putar musik"}
          aria-pressed={musicPlaying}
        >
          {musicPlaying ? "♫ Musik menyala ♪" : "♫ Putar musik"}
        </button>
      )}

      <main className="page-shell">
        <div className="flower-field" aria-hidden="true">
          {flowers.map((flower, index) => (
            <span
              key={index}
              className={`float-flower flower-${index}`}
            >
              {flower}
            </span>
          ))}
        </div>

        <nav className="topbar">
          <a className="brand" href="#" aria-label="Piknik Bunga">
            <span>✿</span> piknik kecil
          </a>

          <span className="top-note">
            dibuat dengan sedikit keberanian ♡
          </span>
        </nav>

        <section className="hero">
          <div className="eyebrow">
            <span className="dot" />
            UNDANGAN KHUSUS UNTUK KAMU
          </div>

          <div className="hero-flower" aria-hidden="true">
            🌷
          </div>

          <h1>
            Ada waktu untuk
            <br />
            <em>piknik bareng aku?</em>
          </h1>

          <p className="hero-copy">
            Kita pergi ke Hutan Pinus, bawa camilan, cerita hal random,
            dan pura-pura jadi tokoh utama film romantis.
          </p>

          <div className="tiny-sticker sticker-left">
            no pressure 🌼
          </div>

          <div className="tiny-sticker sticker-right">
            kecuali sedikit 👀
          </div>

          <div className="button-zone">
            <button
              className="yes-button"
              onClick={() => {
                setAccepted(true);
                setTease(
                  "YEAY! Aku tahu kamu punya selera yang bagus 💗"
                );

                setTimeout(() => {
                  document
                    .getElementById("rsvp")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              Mau dong! <span>♡</span>
            </button>

            <button className="no-button" onClick={sayNo}>
              {noTexts[Math.min(noCount, noTexts.length - 1)]}
            </button>
          </div>

          <p className="tease-line" aria-live="polite">
            {tease}
          </p>

          {noCount > 0 && (
            <div className="no-meter" aria-live="polite">
              Level penolakan: {"🌧️".repeat(Math.min(noCount, 5))}
              {"🌷".repeat(Math.max(0, 5 - noCount))}
            </div>
          )}

          <div className="scroll-cue">
            GULIR PELAN-PELAN <span>↓</span>
          </div>
        </section>

        <section className="details-section">
          <div className="section-heading">
            <span className="mini-label">
              RUNDOWN YANG SANGAT SERIUS
            </span>

            <h2>
              Rencana kita, <em>kira-kira.</em>
            </h2>

            <p>
              Jadwal fleksibel. Yang penting partner-nya jangan
              mendadak menghilang.
            </p>
          </div>

          <div className="idea-grid">
            {picnicIdeas.map((idea, index) => (
              <article className="idea-card" key={idea.title}>
                <div className="idea-icon">{idea.icon}</div>

                <span className="idea-number">
                  0{index + 1}
                </span>

                <h3>{idea.title}</h3>
                <p>{idea.detail}</p>
              </article>
            ))}
          </div>

          <div className="quote-card">
            <span className="quote-flower">❀</span>

            <p>
              “Cuaca boleh nggak jelas, tapi ajakanku{" "}
              <em>serius… lumayan serius.</em>”
            </p>

            <span className="quote-sign">
              — orang yang mau piknik sama kamu
            </span>
          </div>
        </section>

        <section className="rsvp-section" id="rsvp">
          <div className="rsvp-card">
            {!accepted ? (
              <>
                <span className="mini-label">
                  FORMULIR SEDIKIT MEMALUKAN
                </span>

                <h2>
                  Belum jawab <em>ajakan?</em>
                </h2>

                <p className="rsvp-copy">
                  Pilih “Mau dong!” di atas dulu.
                  Iya, aku sengaja bikin kamu scroll 😌
                </p>

                <button
                  className="outline-button"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                >
                  Balik ke atas ↑
                </button>
              </>
            ) : saved ? (
              <>
                <div className="success-flower">💐</div>

                <span className="mini-label">
                  UNDANGAN DITERIMA
                </span>

                <h2>
                  YAY, jadi <em>piknik!</em>
                </h2>

                <p className="rsvp-copy">
                  Siapkan senyum dan perut kosong.
                  Kita piknik di Hutan Pinus, ya!
                  Jangan lupa bawa diri sendiri,
                  itu yang paling penting. ♡
                </p>

                <div className="summary-box">
                  <p>
                    <strong>🌲 Lokasi:</strong> {place}
                  </p>

                  <p>
                    <strong>👤 Nama:</strong>{" "}
                    {name.trim() || "Tamu misterius"}
                  </p>

                  <p>
                    <strong>📅 Tanggal:</strong>{" "}
                    {date || "Belum ditentukan"}
                  </p>

                  <p>
                    <strong>💗 Kegiatan pilihan:</strong>
                  </p>

                  <div className="selected-activities">
                    {activities.map((activity) => {
                      const option = activityOptions.find(
                        (item) => item.label === activity
                      );

                      return (
                        <span
                          className="selected-chip"
                          key={activity}
                        >
                          {option?.icon} {activity}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {note && <p className="status-note">{note}</p>}

                <button
                  className="outline-button"
                  onClick={() => {
                    setAccepted(false);
                    setSaved(false);
                    setNote("");
                  }}
                >
                  Aku mau revisi jawaban 😗
                </button>
              </>
            ) : (
              <>
                <span className="mini-label">
                  OKAY, KAMU BIKIN AKU SENYUM
                </span>

                <h2>
                  Atur detail <em>pikniknya.</em>
                </h2>

                <p className="rsvp-copy">
                  Isi seadanya juga boleh.
                  Ini bukan formulir beasiswa.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submitAnswer();
                  }}
                >
                  <label>
                    Nama panggilan{" "}
                    <span>(opsional, tapi aku kepo)</span>

                    <input
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Si paling menggemaskan…"
                      maxLength={80}
                    />
                  </label>

                  <label>
                    Tanggal yang kamu mau

                    <input
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                      min={new Date()
                        .toISOString()
                        .slice(0, 10)}
                    />
                  </label>

                  <label>
                    Lokasi piknik

                    <input
                      type="text"
                      value={place}
                      readOnly
                    />
                  </label>

                  <div className="activity-picker">
                    <div className="activity-heading">
                      <label className="activity-title">
                        Kegiatan yang kamu inginkan 🌷
                      </label>

                      <span className="activity-hint">
                        Pilih kegiatan favoritmu.
                        Boleh pilih banyak, aku nggak keberatan 😚
                      </span>

                      <span className="activity-count">
                        {activities.length} kegiatan dipilih
                      </span>
                    </div>

                    <div className="activity-grid">
                      {activityOptions.map((activity) => (
                        <label
                          key={activity.label}
                          className={`activity-option ${
                            activities.includes(activity.label)
                              ? "selected"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={activities.includes(
                              activity.label
                            )}
                            onChange={() =>
                              toggleActivity(activity.label)
                            }
                          />

                          <span className="activity-icon">
                            {activity.icon}
                          </span>

                          <span className="activity-info">
                            <span className="activity-name">
                              {activity.label}
                            </span>

                            <span className="activity-detail">
                              {activity.detail}
                            </span>
                          </span>

                          <span className="activity-check">
                            {activities.includes(activity.label)
                              ? "✓"
                              : "+"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    className="yes-button submit-button"
                    disabled={saving}
                    type="submit"
                  >
                    {saving
                      ? "Sebentar ya…"
                      : "Fix, kita piknik! 💗"}
                  </button>

                  {note && (
                    <p className="status-note" role="alert">
                      {note}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          <div className="bottom-doodle" aria-hidden="true">
            🌼　🌷　🦋　🌸　🌿
          </div>
        </section>

        <footer>
          <span>dibuat pakai hati dan sedikit CSS</span>
          <span>✿ semoga kamu bilang iya ✿</span>
        </footer>
      </main>
    </>
  );
}
