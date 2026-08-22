"use client";

import * as React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/query/use-user";
import { formatCurrency } from "@/utils/currency";

import { MultiEntryForm } from "./MultiEntryForm";
import {
    BatchRequestError,
    type BatchKind,
    useBatchEntry,
    useFinancialEntryOptions,
} from "../hooks/use-batch-entry";
import {
    calculateEntryTotal,
    findDuplicateEntryIndices,
} from "../lib/manual-entry-utils";
import { FileText, Paperclip, PlusIcon, StickyNote, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateFinancialCategoryDialog } from "./CreateFinancialCategoryDialog";

type EntryRow = {
  member: string;
  category: string;
  overhead_type: string;
  name: string;
  expense_category: string;
  amount: string;
  price: string;
  quantity: string;
  payment_method: string;
  reference_code: string;
  notes: string;
  timestamp: string;
  supplier: string;
  invoice_number: string;
  file: File | null;
};

type FormValues = {
  entries: EntryRow[];
};

const PAYMENT_METHODS = ["Bank", "Cash", "Cheque", "Mobile Money", "Other"];

const EXPENSE_CATEGORIES = [
    "amenities",
    "conference",
    "decor",
    "fellowship",
    "hotel bookings",
    "humanitarian",
    "office",
    "other",
    "outreach",
    "repair",
    "travel",
    "wages",
];

function emptyRow(date: string): EntryRow {
    return {
        member: "",
        category: "",
        overhead_type: "",
        name: "",
        expense_category: "",
        amount: "",
        price: "",
        quantity: "1",
        payment_method: "Cash",
        reference_code: "",
        notes: "",
        timestamp: date,
        supplier: "",
        invoice_number: "",
        file: null,
  };
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-xs text-destructive" role="alert">
            {message}
        </p>
  ) : null;
}

interface FinancialEntriesFormProps {
  kind: BatchKind;
  period: string;
  reportId?: string | number | null;
}

export function FinancialEntriesForm({
    kind,
    period,
    reportId,
}: FinancialEntriesFormProps) {
  const user = useUser();
  const options = useFinancialEntryOptions(kind);
  const mutation = useBatchEntry(kind);
  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false);
  const [categoryTargetIndex, setCategoryTargetIndex] = React.useState(0);
  const [expandedOptional, setExpandedOptional] = React.useState<Record<string, boolean>>({});

  const defaultDate = `${period}-01`;

    const form = useForm<FormValues>({
        defaultValues: {
            entries: [emptyRow(defaultDate)],
        },
  });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "entries",
  });

    const rows = useWatch({
        control: form.control,
        name: "entries",
  });

  const currency = user.data?.assembly?.currency || "USD";
  const language = user.data?.assembly?.language || undefined;
  const total = calculateEntryTotal(kind, rows);
  const totalLabel = formatCurrency(total, { currency, language });

    const validateDuplicates = React.useCallback(
        (values: FormValues) => {
            const field =
                kind === "tithes"
                    ? "member"
                    : kind === "revenue"
                      ? "category"
                      : kind === "overhead"
                        ? "overhead_type"
              : null;

            if (!field) {
        return true;
            }

      const duplicates = findDuplicateEntryIndices(kind, values.entries);

            duplicates.forEach((index) => {
                form.setError(`entries.${index}.${field}`, {
                    message: "This selection is already used in another row.",
        });
      });

      return duplicates.length === 0;
        },
    [form, kind],
  );

    const submit = form.handleSubmit(async (values) => {
    form.clearErrors();

        if (!validateDuplicates(values)) {
      return;
        }

        const entries = values.entries.map((row) => {
            if (kind === "tithes") {
                return {
                    member:
                        row.member && row.member !== "anonymous"
                            ? Number(row.member)
                            : null,
                    amount: row.amount,
                    payment_method: row.payment_method,
                    reference_code: row.reference_code,
                    notes: row.notes,
                    timestamp: row.timestamp,
        };
            }

            if (kind === "revenue") {
                return {
                    category: Number(row.category),
                    amount: row.amount,
                    notes: row.notes,
                    timestamp: row.timestamp,
        };
            }

            if (kind === "overhead") {
                return {
                    overhead_type: Number(row.overhead_type),
                    amount: row.amount,
                    notes: row.notes,
                    timestamp: row.timestamp,
        };
            }

            return {
                name: row.name,
                category: row.expense_category,
                quantity: Number(row.quantity),
                price: row.price,
                invoice_date: row.timestamp,
                invoice_number: row.invoice_number,
                supplier: row.supplier,
                description: row.notes,
      };
    });

    const body = new FormData();

    body.set("period", period);

        if (reportId) {
      body.set("report", String(reportId));
        }

    body.set("entries", JSON.stringify(entries));

        values.entries.forEach((row, index) => {
            if (!row.file) {
        return;
            }

      const fileField = kind === "revenue" ? "statement" : "receipt";
      body.set(`entries.${index}.${fileField}`, row.file);
    });

        try {
      const result = await mutation.mutateAsync(body);

            toast.success(
        `${result.count ?? values.entries.length} entries saved successfully.`,
      );

      replace([emptyRow(defaultDate)]);
            form.reset({
                entries: [emptyRow(defaultDate)],
      });
        } catch (error) {
            if (error instanceof BatchRequestError) {
        let firstErrorPath: `entries.${number}.${keyof EntryRow}` | null = null;

                Object.entries(error.body.errors?.entries ?? {}).forEach(
                    ([index, fieldErrors]) => {
            Object.entries(fieldErrors).forEach(([field, messages]) => {
                                const key =
                                    field === "non_field_errors"
                                        ? kind === "expenses"
                                            ? "name"
                                            : "amount"
                                        : field === "invoice_date"
                                          ? "timestamp"
                                          : field === "description"
                                            ? "notes"
                      : field === "receipt" || field === "statement"
                                              ? "file"
                        : kind === "expenses" && field === "category"
                                                ? "expense_category"
                          : field;

                                const path =
                `entries.${Number(index)}.${key as keyof EntryRow}` as const;

                                form.setError(path, {
                                    message: Array.isArray(messages)
                                        ? messages.join(" ")
                                        : messages,
              });

              firstErrorPath ??= path;
            });
          },
        );

                if (firstErrorPath) {
          form.setFocus(firstErrorPath);
                }

        toast.error(error.message);
            } else {
        toast.error("Could not save entries. Your values have been preserved.");
            }
        }
  });

    const cancel = () => {
        if (
            form.formState.isDirty &&
            !window.confirm("Discard the entries you have not saved?")
        ) {
      return;
        }

    replace([emptyRow(defaultDate)]);
        form.reset({
            entries: [emptyRow(defaultDate)],
    });
  };

    const optionLabel = (option: Record<string, unknown>) =>
    String(option.full_name ?? option.name ?? option.id);

    return (
        <form onSubmit={submit} className="space-y-4">
            {options.isError ? (
                <p className="text-sm text-destructive">
                    Unable to load available selections.
                </p>
            ) : null}

            <MultiEntryForm
                rows={fields}
                onAddRow={() => append(emptyRow(defaultDate))}
                onRemoveRow={remove}
                onCancel={cancel}
                totalLabel={totalLabel}
                isPending={mutation.isPending}
                renderSummary={(_, index) => {
                  const row = rows?.[index];
                  const optionId = kind === "tithes"
                    ? row?.member
                    : kind === "revenue"
                      ? row?.category
                      : row?.overhead_type;
                  const selectedOption = options.data?.find(
                    (option) => String(option.id) === String(optionId),
                  );
                  const subject = kind === "expenses"
                    ? row?.name || "Untitled item"
                    : selectedOption
                      ? optionLabel(selectedOption)
                      : kind === "tithes" && (!optionId || optionId === "anonymous")
                        ? "Anonymous"
                        : "Selection pending";
                  const amount = kind === "expenses"
                    ? Number(row?.price || 0) * Number(row?.quantity || 1)
                    : Number(row?.amount || 0);

                  return (
                    <div className="grid gap-2 pb-1 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-5">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {row?.timestamp || "Date pending"}
                          {kind === "tithes" ? ` · ${row?.payment_method || "Payment method pending"}` : ""}
                        </p>
                      </div>
                      {row?.file ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Paperclip className="size-3.5" /> Attachment
                        </span>
                      ) : null}
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(amount, { currency, language })}
                      </span>
                    </div>
                  );
                }}
                renderRow={(_, index) => {
          const errors = form.formState.errors.entries?.[index];
          const selectedFile = rows?.[index]?.file;
          const notesValue = rows?.[index]?.notes;
          const fileInputId = `financial-entry-file-${index}`;
          const fileDisclosureKey = `${index}-file`;
          const notesDisclosureKey = `${index}-notes`;

                    return (
            <div
              className={cn(
                "grid grid-cols-1 gap-3 sm:grid-cols-2",
                kind !== "expenses" && "lg:grid-cols-3",
              )}
            >
                            {kind === "tithes" ? (
                                <div className="grid gap-1.5">
                                    <Label>Member</Label>

                  <NativeSelect {...form.register(`entries.${index}.member`)}>
                                        <NativeSelectOption value="anonymous">
                                            Anonymous
                                        </NativeSelectOption>

                                        {options.data?.map((option) => (
                                            <NativeSelectOption
                                                key={String(option.id)}
                                                value={String(option.id)}
                                            >
                                                {optionLabel(option)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>

                  <FieldError message={errors?.member?.message} />
                                </div>
                            ) : null}

                            {kind === "revenue" ? (
                                <div className="grid gap-1.5">
                                    <Label>Revenue category</Label>

                                    <NativeSelect
                    {...form.register(`entries.${index}.category`, {
                                                required: "Choose a category.",
                    })}
                                    >
                                        <NativeSelectOption value="">
                                            Select category
                                        </NativeSelectOption>

                                        {options.data?.map((option) => (
                                            <NativeSelectOption
                                                key={String(option.id)}
                                                value={String(option.id)}
                                            >
                                                {optionLabel(option)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>

                  <FieldError message={errors?.category?.message} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-fit px-1 text-primary"
                    onClick={() => {
                      setCategoryTargetIndex(index);
                      setCategoryDialogOpen(true);
                    }}
                  >
                    <PlusIcon className="size-4" /> Add custom category
                  </Button>
                                </div>
                            ) : null}

                            {kind === "overhead" ? (
                                <div className="grid gap-1.5">
                                    <Label>Overhead type</Label>

                                    <NativeSelect
                    {...form.register(`entries.${index}.overhead_type`, {
                      required: "Choose an overhead type.",
                    })}
                                    >
                                        <NativeSelectOption value="">
                                            Select type
                                        </NativeSelectOption>

                                        {options.data?.map((option) => (
                                            <NativeSelectOption
                                                key={String(option.id)}
                                                value={String(option.id)}
                                            >
                                                {optionLabel(option)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>

                  <FieldError message={errors?.overhead_type?.message} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-fit px-1 text-primary"
                    onClick={() => {
                      setCategoryTargetIndex(index);
                      setCategoryDialogOpen(true);
                    }}
                  >
                    <PlusIcon className="size-4" /> Add custom overhead type
                  </Button>
                                </div>
                            ) : null}

                            {kind === "expenses" ? (
                                <>
                  <div className="grid gap-1.5 sm:col-span-2">
                                        <Label>Item</Label>

                                        <Input
                      {...form.register(`entries.${index}.name`, {
                        required: "Enter an item name.",
                      })}
                                        />

                    <FieldError message={errors?.name?.message} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Category</Label>

                                        <NativeSelect
                      {...form.register(`entries.${index}.expense_category`, {
                        required: "Choose a category.",
                      })}
                                        >
                                            <NativeSelectOption value="">
                                                Select category
                                            </NativeSelectOption>

                                            {EXPENSE_CATEGORIES.map((value) => (
                        <NativeSelectOption key={value} value={value}>
                                                    {value.replaceAll("_", " ")}
                                                </NativeSelectOption>
                                            ))}
                                        </NativeSelect>

                    <FieldError message={errors?.expense_category?.message} />
                                    </div>
                                </>
                            ) : null}

                            <div className="grid gap-1.5">
                <Label>{kind === "expenses" ? "Unit price" : "Amount"}</Label>

                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    inputMode="decimal"
                                    {...form.register(
                                        `entries.${index}.${
                      kind === "expenses" ? "price" : "amount"
                                        }`,
                                        {
                      required: "Enter an amount greater than zero.",
                                            validate: (value) =>
                                                Number(value) > 0 ||
                                                "Enter an amount greater than zero.",
                    },
                                    )}
                                />

                                <FieldError
                                    message={
                                        kind === "expenses"
                                            ? errors?.price?.message
                                            : errors?.amount?.message
                                    }
                                />
                            </div>

                            {kind === "expenses" ? (
                                <div className="grid gap-1.5">
                                    <Label>Quantity</Label>

                                    <Input
                                        type="number"
                                        min="1"
                                        step="1"
                    {...form.register(`entries.${index}.quantity`, {
                                                required: true,
                                                min: {
                                                    value: 1,
                        message: "Quantity must be at least one.",
                                                },
                    })}
                                    />

                  <FieldError message={errors?.quantity?.message} />
                                </div>
                            ) : null}

                            {kind === "tithes" ? (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label>Payment method</Label>

                                        <NativeSelect
                      {...form.register(`entries.${index}.payment_method`)}
                                        >
                                            {PAYMENT_METHODS.map((value) => (
                        <NativeSelectOption key={value} value={value}>
                                                    {value}
                                                </NativeSelectOption>
                                            ))}
                                        </NativeSelect>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Reference</Label>

                                        <Input
                      {...form.register(`entries.${index}.reference_code`)}
                                        />
                                    </div>
                                </>
                            ) : null}

                            <div className="grid gap-1.5">
                                <Label>Transaction date</Label>

                                <Input
                                    type="date"
                                    min={`${period}-01`}
                                    max={`${period}-31`}
                  {...form.register(`entries.${index}.timestamp`, {
                                            required: "Choose a date.",
                  })}
                                />

                <FieldError message={errors?.timestamp?.message} />
                            </div>

                            {kind === "expenses" ? (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label>Supplier</Label>

                    <Input {...form.register(`entries.${index}.supplier`)} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Invoice number</Label>

                                        <Input
                      {...form.register(`entries.${index}.invoice_number`)}
                                        />
                                    </div>
                                </>
                            ) : null}

                            {kind !== "overhead" && (selectedFile || expandedOptional[fileDisclosureKey]) ? (
    <div className="col-span-full grid gap-1.5">
        <Label htmlFor={fileInputId}>
            {kind === "revenue"
                ? "Bank statement"
                : kind === "expenses"
                  ? "Receipt"
                  : "Receipt (optional)"}
        </Label>

        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-dashed",
                "transition-colors duration-200",
                selectedFile
                    ? "border-primary/40 bg-primary/5"
                        : "border-border bg-surface-foreground/60 hover:border-primary/70 hover:bg-surface/80",
            )}
        >
            <input
                key={selectedFile?.name ?? "empty"}
                id={fileInputId}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;

                    if (file && file.size > 10 * 1024 * 1024) {
                          toast.error(
                            "The selected file must be smaller than 10 MB.",
                          );
                          event.currentTarget.value = "";
                          return;
                    }

                        form.setValue(`entries.${index}.file`, file, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                }}
            />

            {selectedFile ? (
                <div className="flex min-h-24 items-center gap-3 p-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <FileText className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {selectedFile.name}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 rounded-full"
                        aria-label="Remove selected file"
                        onClick={() =>
                            form.setValue(`entries.${index}.file`, null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                            })
                        }
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ) : (
                <Label
                    htmlFor={fileInputId}
                    className="flex min-h-32 relative cursor-pointer flex-col items-center justify-center gap-2 p-5 text-center"
                >
                    <div className="grid size-11 place-items-center rounded-xl shadow-elevation-sm bg-background">
                        <UploadCloud className="size-5 text-muted-foreground" />
                    </div>

                    <div className="">
                        <p className="text-sm font-medium">
                            Choose a file to upload
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            PDF, PNG, JPG or WebP · Maximum 10 MB
                        </p>
                    </div>
                </Label>
            )}
        </div>

        <FieldError message={errors?.file?.message} />
    </div>
) : kind !== "overhead" ? (
  <Button
    type="button"
    variant="outline"
    className="col-span-full w-fit"
    aria-expanded={false}
    onClick={() => setExpandedOptional((current) => ({ ...current, [fileDisclosureKey]: true }))}
  >
    <Paperclip className="size-4" />
    {kind === "revenue" ? "Add bank statement" : kind === "expenses" ? "Add receipt" : "Add attachment"}
  </Button>
) : null}

                            {notesValue || expandedOptional[notesDisclosureKey] ? (
                            <div className="col-span-full grid gap-1.5">
                                <Label>Notes</Label>

                <Textarea {...form.register(`entries.${index}.notes`)} />

                <FieldError message={errors?.notes?.message} />
                            </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                className="col-span-full w-fit"
                                aria-expanded={false}
                                onClick={() => setExpandedOptional((current) => ({ ...current, [notesDisclosureKey]: true }))}
                              >
                                <StickyNote className="size-4" /> Add notes
                              </Button>
                            )}
                        </div>
          );
                }}
            />
            {(kind === "revenue" || kind === "overhead") && user.data?.church ? (
              <CreateFinancialCategoryDialog
                open={categoryDialogOpen}
                onOpenChange={setCategoryDialogOpen}
                kind={kind}
                assemblyId={String(user.data.church)}
                onSelect={(category) => {
                  const field = kind === "revenue" ? "category" : "overhead_type";
                  form.setValue(`entries.${categoryTargetIndex}.${field}`, String(category.id), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            ) : null}
        </form>
  );
}
