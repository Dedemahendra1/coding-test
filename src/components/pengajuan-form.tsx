"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createPengajuan } from "@/actions/pengajuan";
import {
  MAX_TENOR_BULAN,
  pengajuanFormSchema,
  type PengajuanFormValues,
} from "@/lib/validations";

export default function PengajuanForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PengajuanFormValues>({
    resolver: zodResolver(pengajuanFormSchema),
    defaultValues: {
      nama_nasabah: "",
      tipe_pengajuan: "" as PengajuanFormValues["tipe_pengajuan"],
      nominal: 0,
      tenor_bulan: 0,
      pendapatan_bulanan: 0,
      catatan: "",
    },
  });

  const onSubmit = (values: PengajuanFormValues) => {
    startTransition(async () => {
      const result = await createPengajuan(values);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages[0]) {
              setError(key as Parameters<typeof setError>[0], {
                message: messages[0],
              });
            }
          }
        }

        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset();
      setOpen(false);
      router.refresh();
    });
  };

  const renderFieldError = (
    error:
      | {
          message?: string;
        }
      | undefined
  ) => <FieldError errors={error ? [error] : undefined} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <span>Tambah Pengajuan</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Pengajuan</DialogTitle>
          <DialogDescription>
            Isi data pengajuan kredit nasabah baru di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="nama_nasabah">Nama Lengkap Nasabah</FieldLabel>
            <FieldContent>
              <Input
                id="nama_nasabah"
                placeholder="Contoh: Budi Santoso"
                autoComplete="off"
                aria-invalid={!!errors.nama_nasabah}
                {...register("nama_nasabah")}
              />
              {renderFieldError(errors.nama_nasabah)}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Tipe Pengajuan</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="tipe_pengajuan"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                    aria-invalid={!!errors.tipe_pengajuan}
                    >
                      <SelectValue placeholder="Pilih tipe pengajuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sepeda Motor">Sepeda Motor</SelectItem>
                      <SelectItem value="Mobil">Mobil</SelectItem>
                      <SelectItem value="Multiguna">Multiguna</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {renderFieldError(errors.tipe_pengajuan)}
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="nominal">Nominal Pengajuan (Rp)</FieldLabel>
              <FieldContent>
                <Input
                  id="nominal"
                  type="number"
                  min={0}
                  placeholder="100000000"
                  autoComplete="off"
                  aria-invalid={!!errors.nominal}
                  {...register("nominal")}
                />
                {renderFieldError(errors.nominal)}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="tenor_bulan">
                Tenor Bulan (maks. {MAX_TENOR_BULAN})
              </FieldLabel>
              <FieldContent>
                <Input
                  id="tenor_bulan"
                  type="number"
                  min={0}
                  placeholder="12"
                  autoComplete="off"
                  aria-invalid={!!errors.tenor_bulan}
                  {...register("tenor_bulan")}
                />
                {renderFieldError(errors.tenor_bulan)}
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="pendapatan_bulanan">
              Pendapatan Bulanan Nasabah (Rp)
            </FieldLabel>
            <FieldContent>
              <Input
                id="pendapatan_bulanan"
                type="number"
                min={0}
                placeholder="5000000"
                autoComplete="off"
                aria-invalid={!!errors.pendapatan_bulanan}
                {...register("pendapatan_bulanan")}
              />
              {renderFieldError(errors.pendapatan_bulanan)}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="catatan">Catatan</FieldLabel>
            <FieldContent>
              <Textarea
                id="catatan"
                placeholder="Catatan tambahan (opsional)"
                className="resize-none"
                {...register("catatan")}
              />
              {renderFieldError(errors.catatan)}
            </FieldContent>
          </Field>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Pengajuan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}