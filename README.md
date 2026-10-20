# Piknik Bunga 🌷

Landing page ajakan piknik yang playful, responsif, dan sedikit menyebalkan:
- Tombol “Nggak mau” punya teks yang berubah-ubah.
- Tombol “Mau dong!” membuka form RSVP.
- Form menyimpan nama panggilan, tanggal, dan lokasi pilihan ke Supabase.
- Tetap bisa dicoba sebagai demo tanpa konfigurasi Supabase.

## Jalankan lokal

1. Install Node.js versi LTS.
2. Ekstrak project, buka terminal pada folder project, lalu jalankan:

   ```bash
   npm install
   npm run dev
   ```

3. Buka `http://localhost:3000`.

## Aktifkan Supabase

1. Buat project di [Supabase](https://supabase.com/).
2. Buka **SQL Editor**, jalankan isi `supabase/schema.sql`.
3. Dari Project Settings → API, salin Project URL dan anon/publishable key.
4. Salin `.env.example` menjadi `.env.local`, lalu isi:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
   ```

5. Restart `npm run dev`.

**Keamanan:** jangan pernah menaruh `service_role` key di variabel `NEXT_PUBLIC_*` atau di frontend. Template ini hanya mengizinkan insert RSVP anonim melalui RLS. Jika ingin mengelola/membaca RSVP, buat dashboard admin terpisah dengan autentikasi.

## Deploy ke Vercel

1. Push project ke GitHub.
2. Di [Vercel](https://vercel.com/), pilih **Add New → Project**, lalu import repository.
3. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Project Settings → Environment Variables.
4. Deploy. Setelah mengubah environment variables, lakukan redeploy.

Vercel akan mendeteksi Next.js secara otomatis.
