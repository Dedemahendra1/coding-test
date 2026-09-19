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