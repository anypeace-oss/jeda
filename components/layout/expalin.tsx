export default function Expalin() {
  const COLOR_OPTIONS = [
    { name: "Brick Red", value: "oklch(0.5425 0.1342 23.73)" },
    { name: "Deep Indigo", value: "oklch(0.3635 0.0554 277.8)" },
    { name: "Teal", value: "oklch(0.5406 0.067 196.69)" },
    { name: "Steel Blue", value: "oklch(0.4703 0.0888 247.87)" },
    { name: "Bronze", value: "oklch(0.6209 0.095 90.75)" },
    { name: "Royal Purple", value: "oklch(0.3961 0.1167 303.38)" },
    { name: "Muted Magenta", value: "oklch(0.5297 0.1356 343.24)" },
    { name: "Forest Green", value: "oklch(0.5275 0.0713 151.27)" },
    { name: "Slate Gray", value: "oklch(0.2953 0.0196 278.09)" },
    { name: "Black", value: "oklch(0.0000 0.0000 0.0000)" },
  ];

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-12 leading-relaxed text-foreground/80 font-light  text-justify  ">
      {/* Apa itu Jeda? */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-2 ">
          <span
            className="text-primary-foreground  pl-2 rounded-md "
            style={{
              background: COLOR_OPTIONS[0].value,
            }}
          >
            Apa itu Jeda?
          </span>
        </h2>
        <p>
          Jeda adalah aplikasi <em>Pomodoro Timer</em> yang ringan dan
          sepenuhnya gratis 🎉. Tujuannya sederhana: bantu kamu fokus
          menyelesaikan tugas, belajar, atau coding tanpa terdistraksi. Nggak
          perlu daftar paket premium – semua fitur bisa kamu pakai begitu saja.
        </p>
      </section>

      {/* Apa itu Pomodoro Technique? */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-2">
          <span
            className="text-primary-foreground pl-2 rounded-md"
            style={{
              background: COLOR_OPTIONS[1].value,
            }}
          >
            Apa itu Teknik Pomodoro?
          </span>
        </h2>
        <p>
          Teknik Pomodoro adalah metode manajemen waktu yang memakai interval
          kerja 25&nbsp;menit (disebut “pomodoro”) yang diikuti istirahat
          singkat. Setelah empat pomodoro, kamu ambil istirahat panjang. Pola
          sederhana ini terbukti ampuh buat menjaga fokus dan mencegah
          kelelahan.
        </p>
      </section>

      {/* Cara pakai Pomodoro Timer */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-2">
          <span
            className="text-primary-foreground pl-2 rounded-md"
            style={{
              background: COLOR_OPTIONS[2].value,
            }}
          >
            Gimana Cara Pakai Jeda?
          </span>
        </h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Pilih mode – Pomodoro, Short Break, atau Long Break.</li>
          <li>
            Tekan{" "}
            <span
              className="font-medium text-primary-foreground  px-1 py-0.5 rounded-md"
              style={{
                color: COLOR_OPTIONS[0].value,
              }}
            >
              START
            </span>{" "}
            atau cukup pencet{" "}
            <span
              className="font-medium text-primary-foreground  px-1 py-0.5 rounded-md"
              style={{
                color: COLOR_OPTIONS[5].value,
              }}
            >
              Space
            </span>
            .
          </li>
          <li>Fokus kerja sampai timer habis, lalu nikmati jeda istirahat.</li>
          <li>
            Ulangi siklusnya. Setelah 4 pomodoro, Jeda otomatis menyarankan
            long&nbsp;break.
          </li>
          <li>
            Cek statistik & streak harianmu di menu Report atau cukup pencet{" "}
            <span
              className="font-medium text-primary-foreground  px-1 py-0.5 rounded-md"
              style={{
                color: COLOR_OPTIONS[2].value,
              }}
            >
              R
            </span>
          </li>
        </ol>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-2">
          <span
            className="text-primary-foreground pl-2 rounded-md"
            style={{
              background: COLOR_OPTIONS[3].value,
            }}
          >
            Fitur Utama
          </span>
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span>Timer Fleksibel</span> – Atur durasi pomodoro & jeda sesuai
            selera di menu Settings, atau cukup pencet{" "}
            <span
              className="font-medium text-primary-foreground  px-1 py-0.5 rounded-md"
              style={{
                color: COLOR_OPTIONS[2].value,
              }}
            >
              S
            </span>
          </li>
          <li>
            <span>Shortcut Keyboard</span> – Kontrol semuanya tanpa mouse, lihat
            daftar dengan tombol{" "}
            <span
              className="font-medium text-primary-foreground  px-1 py-0.5 rounded-md"
              style={{
                color: COLOR_OPTIONS[2].value,
              }}
            >
              K
            </span>
            .
          </li>
          <li>
            <span>Statistik & Ranking</span> – Lacak jam fokusmu, streak harian,
            dan bandingkan dengan pengguna lain.
          </li>
          <li>
            <span>Suara & Backsound</span> – Pilih alarm, backsound, dan volume
            biar makin semangat.
          </li>
          <li>
            <span>Sinkronisasi Awan</span> – Login opsional supaya data
            tersimpan di mana pun kamu buka Jeda.
          </li>
          <li>
            <span>100% Gratis</span> – Nggak ada iklan dan nggak paywall.
          </li>
        </ul>
      </section>
    </div>
  );
}
