"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { formatRupiah, formatTanggalIndonesia } from "@/lib/format";

import type { Pengajuan } from "@/types/pengajuan";

type PengajuanDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pengajuan: Pengajuan | null;
};

const statusBadgeClass: Record<
  Pengajuan["status"],
  { className: string; label: string }
> = {
  Menunggu: {
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Menunggu",
  },
  Disetujui: {
    className: "bg-green-100 text-green-800 border-green-200",
    label: "Disetujui",
  },
  Ditolak: {
    className: "bg-red-100 text-red-800 border-red-200",
    label: "Ditolak",
  },
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export default function PengajuanDetailDialog({
  open,
  onOpenChange,
  pengajuan,
}: PengajuanDetailDialogProps) {
  if (!pengajuan) return null;

  const badge = statusBadgeClass[pengajuan.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Pengajuan</DialogTitle>
          <DialogDescription>
            Informasi lengkap pengajuan kredit nasabah.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <dl className="flex flex-col gap-3">
            <DetailRow label="Nama Nasabah" value={pengajuan.nama_nasabah} />
            <DetailRow label="Tipe Pengajuan" value={pengajuan.tipe_pengajuan} />
            <DetailRow
              label="Nominal Pengajuan"
              value={formatRupiah(pengajuan.nominal)}
            />
            <DetailRow label="Tenor" value={`${pengajuan.tenor_bulan} bulan`} />
            <DetailRow
              label="Pendapatan Bulanan"
              value={formatRupiah(pengajuan.pendapatan_bulanan)}
            />
            <DetailRow
              label="Tanggal Pengajuan"
              value={formatTanggalIndonesia(pengajuan.created_at)}
            />
          </dl>

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-3 text-sm font-medium">Kalkulasi Tagihan</p>
            <dl className="flex flex-col gap-2">
              <DetailRow label="Nominal" value={formatRupiah(pengajuan.nominal)} />
              <DetailRow
                label="Tenor"
                value={`${pengajuan.tenor_bulan} bulan`}
              />
              <DetailRow
                label="Tagihan per Bulan"
                value={formatRupiah(pengajuan.tagihan_per_bulan)}
              />
            </dl>
          </div>

          {pengajuan.catatan && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Catatan</span>
              <p className="text-sm">{pengajuan.catatan}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className={badge.className}>{badge.label}</Badge>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Tutup</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}