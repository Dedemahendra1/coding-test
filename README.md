
## Tech Stack

- Next.js 14+ (App Router) + TypeScript
- Supabase (PostgreSQL) — via `@supabase/supabase-js`
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod

## Setup Database (Supabase)

1. Buat project baru di https://supabase.com
2. Jalankan SQL berikut di SQL Editor Supabase untuk membuat tabel:

```sql
create table pengajuan (
  id uuid primary key default gen_random_uuid(),
  nama_nasabah text not null,
  tipe_pengajuan text not null check (tipe_pengajuan in ('Sepeda Motor', 'Mobil', 'Multiguna')),
  nominal numeric not null,
  tenor_bulan integer not null,
  pendapatan_bulanan numeric not null,
  catatan text,
  tagihan_per_bulan numeric not null,
  status text not null default 'Menunggu' check (status in ('Menunggu', 'Disetujui', 'Ditolak')),
  created_at timestamptz not null default now()
);
```

3. Ambil Project URL dan publishable key dari **Settings > API** di dashboard Supabase.

## Cara Menjalankan Project

### Prasyarat

- **Node.js 18.17+** sudah terinstal (disarankan LTS terbaru)
- Akun & project di https://supabase.com (untuk menyimpan data pengajuan)

### Langkah Menjalankan (Development)

1. Clone repository ini:

   ```bash
   git clone <url-repository> && cd coding-test
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Siapkan environment variables. Copy template ke `.env.local`:

   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env.local

   # macOS / Linux
   cp .env.example .env.local
   ```

4. Isi `.env.local` dengan kredensial Supabase milikmu (diambil dari dashboard Supabase > **Project Settings > API**):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```

   > Penting: jika kamu belum menjalankan SQL setup tabel `pengajuan` (lihat bagian **Setup Database (Supabase)**), lakukan terlebih dahulu agar aplikasi tidak error saat load.

5. Jalankan development server:

   ```bash
   npm run dev
   ```

6. Buka http://localhost:3000 di browser.

### Memverifikasi Kode (opsional)

```bash
npm run lint      # cek linting
npm run build     # build production
```

### Menjalankan Production Build

```bash
npm run build
npm start
```

### Troubleshooting

- **Error "Missing Supabase environment variables"** → pastikan file `.env.local` sudah dibuat dan berisi `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Setelah mengubah `.env.local`** → restart development server (`npm run dev`) karena variable `NEXT_PUBLIC_*` dibaca saat server / build dimulai.
- **Tabel kosong atau query error** → pastikan tabel `pengajuan` sudah dibuat di SQL Editor Supabase sesuai SQL pada bagian **Setup Database (Supabase)**.


## Fitur

1. **Form Tambah Pengajuan** — Dialog dengan field: nama nasabah, tipe pengajuan (select), nominal (format Rupiah), tenor bulan, pendapatan bulanan, dan catatan (opsional). Validasi Zod: semua field wajib kecuali catatan; nominal maks. Rp 200.000.000; tenor maks. 24 bulan; pendapatan bulanan min. Rp 1.000.000 ("Nasabah belum dapat mengajukan pinjaman"); cek batas maks. 3 pengajuan per nasabah sebelum insert. Tagihan per bulan dihitung otomatis (`nominal / tenor_bulan`), disimpan dengan status default `Menunggu`. Toast sukses (sonner) setelah input.
2. **Tabel Pengajuan** — Kolom nama, tipe, nominal, tenor, tagihan/bulan, tanggal pengajuan (format Indonesia), status (badge kuning = Menunggu, hijau = Disetujui, merah = Ditolak), dan aksi (Setujui, Tolak, Detail). Data diurutkan berdasarkan `created_at` terbaru. Tombol Setujui/Tolak nonaktif jika status bukan `Menunggu`.
3. **Detail Pengajuan** — Dialog berisi seluruh data pengajuan plus breakdown kalkulasi tagihan (nominal, tenor, tagihan/bulan) dan catatan bila ada.
4. **Konfirmasi Approve/Reject** — AlertDialog konfirmasi sebelum update status di Supabase; setelah konfirmasi status diperbarui dan tabel di-refresh.

