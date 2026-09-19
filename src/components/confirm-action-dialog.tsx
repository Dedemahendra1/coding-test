"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deletePengajuan, updatePengajuanStatus } from "@/actions/pengajuan";

import type { Pengajuan, StatusPengajuan } from "@/types/pengajuan";

export type ConfirmAction = "approve" | "reject" | "delete";

type ConfirmActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pengajuan: Pengajuan | null;
  action: ConfirmAction;
};

export default function ConfirmActionDialog({
  open,
  onOpenChange,
  pengajuan,
  action,
}: ConfirmActionDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isDelete = action === "delete";
  const targetStatus: StatusPengajuan | null =
    action === "approve" ? "Disetujui" : action === "reject" ? "Ditolak" : null;

  const handleConfirm = () => {
    if (!pengajuan) return;

    startTransition(async () => {
      const result = isDelete
        ? await deletePengajuan(pengajuan.id)
        : await updatePengajuanStatus(pengajuan.id, targetStatus!);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              isDelete
                ? "bg-red-100 text-red-600"
                : action === "approve"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
            }
          >
            {isDelete ? (
              <Trash2Icon aria-hidden="true" />
            ) : action === "approve" ? (
              <CheckIcon aria-hidden="true" />
            ) : (
              <XIcon aria-hidden="true" />
            )}
          </AlertDialogMedia>
          <AlertDialogTitle>
            {isDelete
              ? "Hapus Pengajuan"
              : action === "approve"
                ? "Setujui Pengajuan"
                : "Tolak Pengajuan"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDelete
              ? "Apakah Anda yakin ingin menghapus pengajuan atas nama "
              : `Apakah Anda yakin ingin ${
                  action === "approve" ? "menyetujui" : "menolak"
                } pengajuan atas nama `}
            <span className="font-medium text-foreground">
              {pengajuan?.nama_nasabah ?? "-"}
            </span>
            {"?"} Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={
              action === "approve"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }
          >
            {isPending
              ? isDelete
                ? "Menghapus..."
                : "Menyimpan..."
              : isDelete
                ? "Ya, Hapus"
                : action === "approve"
                  ? "Ya, Setujui"
                  : "Ya, Tolak"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}