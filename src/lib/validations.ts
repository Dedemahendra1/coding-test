import { z } from "zod";

export const MAX_NOMINAL = 200_000_000;
export const MAX_TENOR_BULAN = 24;
export const MIN_PENDAPATAN_BULANAN = 1_000_000;
export const MAX_PENGAJUAN_PER_NASABAH = 3;

export const pengajuanFormSchema = z.object({
  nama_nasabah: z
    .string()
    .min(1, "Nama nasabah wajib di isi")
    .trim(),
  tipe_pengajuan: z.enum(["Sepeda Motor", "Mobil", "Multiguna"], {
    required_error: "Tipe pengajuan wajib dipilih",
    invalid_type_error: "Tipe pengajuan wajib dipilih",
  }),
  nominal: z.coerce
    .number({ invalid_type_error: "Nominal pengajuan wajib diisi" })
    .positive("Nominal pengajuan wajib diisi")
    .max(MAX_NOMINAL, `Nominal pengajuan maksimal Rp ${MAX_NOMINAL.toLocaleString("id-ID")}`),
  tenor_bulan: z.coerce
    .number({ invalid_type_error: "Tenor bulan wajib diisi" })
    .int("Tenor harus berupa angka bulat")
    .positive("Tenor bulan wajib diisi")
    .max(MAX_TENOR_BULAN, `Tenor maksimal ${MAX_TENOR_BULAN} bulan`),
  pendapatan_bulanan: z.coerce
    .number({ invalid_type_error: "Pendapatan bulanan wajib diisi" })
    .positive("Pendapatan bulanan wajib diisi")
    .refine(
      (value) => value >= MIN_PENDAPATAN_BULANAN,
      "Nasabah belum dapat mengajukan pinjaman"
    ),
  catatan: z.string().trim().optional(),
});

export type PengajuanFormValues = z.infer<typeof pengajuanFormSchema>;