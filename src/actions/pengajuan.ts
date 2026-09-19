"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { calculateTagihanPerBulan } from "@/lib/calculations";
import {
  MAX_PENGAJUAN_PER_NASABAH,
  pengajuanFormSchema,
} from "@/lib/validations";
import type {
  Pengajuan,
  PengajuanActionState,
  StatusPengajuan,
} from "@/types/pengajuan";

function mapZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (!key) continue;

    if (!fieldErrors[key]) {
      fieldErrors[key] = [];
    }

    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
}

function PengajuanFromRow(row: Record<string, unknown>): Pengajuan {
  return {
    id: String(row.id),
    nama_nasabah: String(row.nama_nasabah),
    tipe_pengajuan: String(row.tipe_pengajuan) as Pengajuan["tipe_pengajuan"],
    nominal: Number(row.nominal),
    tenor_bulan: Number(row.tenor_bulan),
    pendapatan_bulanan: Number(row.pendapatan_bulanan),
    catatan: row.catatan ? String(row.catatan) : null,
    tagihan_per_bulan: Number(row.tagihan_per_bulan),
    status: String(row.status) as StatusPengajuan,
    created_at: String(row.created_at),
  };
}

export async function listPengajuan(): Promise<Pengajuan[]> {
  const { data, error } = await getSupabaseClient()
    .from("pengajuan")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    PengajuanFromRow(row as Record<string, unknown>)
  );
}

export async function createPengajuan(
  input: unknown
): Promise<PengajuanActionState> {
  const parsed = pengajuanFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali isian Anda.",
      fieldErrors: mapZodErrors(parsed.error),
    };
  }

  const values = parsed.data;

  const { count, error: countError } = await getSupabaseClient()
    .from("pengajuan")
    .select("id", { count: "exact", head: true })
    .eq("nama_nasabah", values.nama_nasabah);

  if (countError) {
    return { success: false, message: countError.message };
  }

  if (Number(count ?? 0) >= MAX_PENGAJUAN_PER_NASABAH) {
    return {
      success: false,
      message: `Nasabah "${values.nama_nasabah}" sudah memiliki ${count} pengajuan. Maksimal ${MAX_PENGAJUAN_PER_NASABAH} pengajuan per nasabah.`,
    };
  }

  const tagihanPerBulan = calculateTagihanPerBulan(
    values.nominal,
    values.tenor_bulan
  );

  const { error } = await getSupabaseClient().from("pengajuan").insert({
    nama_nasabah: values.nama_nasabah,
    tipe_pengajuan: values.tipe_pengajuan,
    nominal: values.nominal,
    tenor_bulan: values.tenor_bulan,
    pendapatan_bulanan: values.pendapatan_bulanan,
    catatan: values.catatan || null,
    tagihan_per_bulan: tagihanPerBulan,
    status: "Menunggu",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Pengajuan berhasil ditambahkan." };
}

export async function updatePengajuanStatus(
  id: string,
  status: StatusPengajuan
): Promise<PengajuanActionState> {
  if (status !== "Disetujui" && status !== "Ditolak") {
    return { success: false, message: "Status yang dipilih tidak valid." };
  }

  const { error } = await getSupabaseClient()
    .from("pengajuan")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return {
    success: true,
    message:
      status === "Disetujui"
        ? "Pengajuan berhasil disetujui."
        : "Pengajuan berhasil ditolak.",
  };
}

export async function deletePengajuan(
  id: string
): Promise<PengajuanActionState> {
  const { error } = await getSupabaseClient()
    .from("pengajuan")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Pengajuan berhasil dihapus." };
}