"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontalIcon, EyeIcon } from "lucide-react";

import PengajuanForm from "@/components/pengajuan-form";
import PengajuanDetailDialog from "@/components/pengajuan-detail-dialog";
import ConfirmActionDialog from "@/components/confirm-action-dialog";

import { formatRupiah, formatTanggalIndonesia } from "@/lib/format";

import type { Pengajuan, StatusPengajuan } from "@/types/pengajuan";
import type { ConfirmAction } from "@/components/confirm-action-dialog";

type PengajuanTableProps = {
  pengajuan: Pengajuan[];
};

type ConfirmDialogState = {
  open: boolean;
  pengajuan: Pengajuan | null;
  action: ConfirmAction;
};

const statusBadgeClass: Record<
  StatusPengajuan,
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

export default function PengajuanTable({ pengajuan }: PengajuanTableProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<Pengajuan | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    pengajuan: null,
    action: "approve",
  });

  const openDetail = (item: Pengajuan) => {
    setSelectedPengajuan(item);
    setDetailOpen(true);
  };

  const handleAction = (item: Pengajuan, action: ConfirmAction) => {
    setConfirmDialog({ open: true, pengajuan: item, action });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pengajuan Kredit
          </h1>
          <p className="text-sm text-muted-foreground">
            Daftar pengajuan kredit nasabah PT Capella Multidana.
          </p>
        </div>
        <PengajuanForm />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 px-4">Nama Nasabah</TableHead>
              <TableHead className="h-12 px-4">Tipe Pengajuan</TableHead>
              <TableHead className="h-12 px-4 text-right">Nominal</TableHead>
              <TableHead className="h-12 px-4 text-center">Tenor</TableHead>
              <TableHead className="h-12 px-4 text-right">Tagihan/Bulan</TableHead>
              <TableHead className="h-12 px-4">Tanggal Pengajuan</TableHead>
              <TableHead className="h-12 px-4 text-center">Status</TableHead>
              <TableHead className="h-12 px-4 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pengajuan.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-40 px-4 text-center text-muted-foreground"
                >
                  Belum ada pengajuan. Klik &quot;Tambah Pengajuan&quot; untuk
                  menginput data baru.
                </TableCell>
              </TableRow>
            ) : (
              pengajuan.map((item) => {
                const badge = statusBadgeClass[item.status];
                const isPending = item.status === "Menunggu";

                return (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-60 truncate px-4 py-3 font-medium">
                      {item.nama_nasabah}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.tipe_pengajuan}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {formatRupiah(item.nominal)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {item.tenor_bulan} bln
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {formatRupiah(item.tagihan_per_bulan)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {formatTanggalIndonesia(item.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Badge className={badge.className}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label="Aksi"
                              >
                                <MoreHorizontalIcon className="size-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => openDetail(item)}>
                              <EyeIcon />
                              Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={!isPending}
                              onClick={() => handleAction(item, "approve")}
                            >
                              Setujui
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!isPending}
                              onClick={() => handleAction(item, "reject")}
                            >
                              Tolak
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleAction(item, "delete")}
                            >
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <PengajuanDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        pengajuan={selectedPengajuan}
      />

      <ConfirmActionDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
        pengajuan={confirmDialog.pengajuan}
        action={confirmDialog.action}
      />
    </div>
  );
}