export const TIPE_PENGAJUAN = ["Sepeda Motor", "Mobil", "Multiguna"] as const;

export const STATUS_PENGAJUAN = ["Menunggu", "Disetujui", "Ditolak"] as const;

export type TipePengajuan = (typeof TIPE_PENGAJUAN)[number];

export type StatusPengajuan = (typeof STATUS_PENGAJUAN)[number];

export type Pengajuan = {
  id: string;
  nama_nasabah: string;
  tipe_pengajuan: TipePengajuan;
  nominal: number;
  tenor_bulan: number;
  pendapatan_bulanan: number;
  catatan: string | null;
  tagihan_per_bulan: number;
  status: StatusPengajuan;
  created_at: string;
};

export type PengajuanActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};