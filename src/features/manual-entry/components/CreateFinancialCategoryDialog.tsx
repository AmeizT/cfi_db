"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  CheckIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  type FinancialCategoryKind,
  type FinancialCategoryOption,
  useCreateFinancialOption,
  useFinancialCategorySuggestions,
  useFinancialEntryOptions,
} from "../hooks/use-batch-entry";
import { normalizeFinancialCategoryName } from "../lib/financial-category-utils";

export { normalizeFinancialCategoryName } from "../lib/financial-category-utils";

export type CreateFinancialCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: FinancialCategoryKind;
  assemblyId: string;
  onSelect: (category: FinancialCategoryOption) => void;
};

function SuggestionSkeletons() {
  return (
    <div className="grid gap-2" aria-label="Searching similar categories">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-xl border border-border p-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function SuggestionRow({
  option,
  highlighted,
  onSelect,
}: {
  option: FinancialCategoryOption;
  highlighted: boolean;
  onSelect: () => void;
}) {
  const reportingName = option.standard_category?.name || option.reporting_group;
  return (
    <div
      role="option"
      aria-selected={highlighted}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors",
        highlighted && "border-primary bg-primary/10 ring-2 ring-primary/20",
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <CheckIcon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{option.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {reportingName ? <span>Reports under {reportingName}</span> : null}
          {typeof option.usage_count === "number" ? (
            <Badge variant="outline">
              Used {option.usage_count} {option.usage_count === 1 ? "time" : "times"}
            </Badge>
          ) : null}
        </div>
      </div>
      <Button type="button" size="sm" variant="outline" onClick={onSelect}>
        Use this
      </Button>
    </div>
  );
}

export function CreateFinancialCategoryDialog({
  open,
  onOpenChange,
  kind,
  assemblyId,
  onSelect,
}: CreateFinancialCategoryDialogProps) {
  const [name, setName] = React.useState("");
  const [debouncedName, setDebouncedName] = React.useState("");
  const [createMode, setCreateMode] = React.useState(false);
  const [mappingChoice, setMappingChoice] = React.useState("");
  const [mappingConfirmed, setMappingConfirmed] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const suggestions = useFinancialCategorySuggestions(kind, debouncedName);
  const options = useFinancialEntryOptions(kind);
  const createOption = useCreateFinancialOption(kind);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedName(name.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [name]);

  React.useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setName("");
      setDebouncedName("");
      setCreateMode(false);
      setMappingChoice("");
      setMappingConfirmed(false);
      setHighlightedIndex(0);
    });
  }, [open]);

  const assemblyMatches = suggestions.data?.assembly_matches ?? [];
  const standardMatches = suggestions.data?.standard_matches ?? [];
  const allMatches = [...assemblyMatches, ...standardMatches];
  const normalizedName = normalizeFinancialCategoryName(name);
  const exactMatch = allMatches.find(
    (option) =>
      (option.normalized_name || normalizeFinancialCategoryName(option.name)) ===
      normalizedName,
  );
  const standardOptions = React.useMemo(() => {
    const combined = [
      ...(suggestions.data?.standard_matches ?? []),
      ...(options.data ?? []).filter(
        (option) => option.is_custom === false || option.is_standard || option.is_global,
      ),
    ];
    return Array.from(
      new Map(combined.map((option) => [String(option.id), option])).values(),
    );
  }, [options.data, suggestions.data?.standard_matches]);
  const isSearching =
    name.trim().length >= 2 &&
    (name.trim() !== debouncedName || suggestions.isFetching);
  const hasSearched = debouncedName.length >= 2 && !suggestions.isFetching;
  const noMatches =
    hasSearched && !suggestions.isError && allMatches.length === 0;
  const canCreate = Boolean(
    normalizedName &&
      hasSearched &&
      !suggestions.isError &&
      createMode &&
      !exactMatch &&
      mappingChoice &&
      mappingConfirmed &&
      !createOption.isPending,
  );
  const title = kind === "revenue"
    ? "Add custom income category"
    : "Add custom operating cost type";
  const fieldLabel = kind === "revenue"
    ? "Income category name"
    : "Operating cost type name";

  function choose(option: FinancialCategoryOption) {
    onSelect(option);
    toast.success(`${option.name} selected`);
    onOpenChange(false);
  }

  function beginCreate() {
    if (exactMatch) return;
    setCreateMode(true);
    setMappingChoice(standardMatches[0] ? String(standardMatches[0].id) : "");
    setMappingConfirmed(false);
  }

  async function createCategory() {
    if (!canCreate) return;
    try {
      const created = await createOption.mutateAsync({
        name: name.trim(),
        standard_category_id:
          mappingChoice === "__review__" ? null : mappingChoice,
        needs_review: mappingChoice === "__review__",
      });
      onSelect(created);
      toast.success(
        kind === "revenue"
          ? "Income category added"
          : "Operating cost type added",
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the category.");
    }
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && allMatches.length) {
      event.preventDefault();
      setHighlightedIndex((current) => (current + 1) % allMatches.length);
    }
    if (event.key === "ArrowUp" && allMatches.length) {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current === 0 ? allMatches.length - 1 : current - 1,
      );
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (allMatches[highlightedIndex] && !createMode) {
        choose(allMatches[highlightedIndex]);
      } else if (canCreate) {
        void createCategory();
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90dvh,48rem)] w-[calc(100%-1rem)] max-w-xl gap-0 overflow-hidden p-0 sm:w-full sm:max-w-xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader className="border-b border-border px-5 py-5 pr-12 sm:px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Start typing and we’ll check for similar categories first.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90dvh-12rem)]">
          <div className="grid gap-5 px-5 py-5 sm:px-6">
            <div className="grid gap-2">
              <Label htmlFor={`financial-category-name-${kind}`}>{fieldLabel}</Label>
              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  ref={inputRef}
                  id={`financial-category-name-${kind}`}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setCreateMode(false);
                    setMappingConfirmed(false);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="pl-9 focus-visible:ring-primary/20"
                  autoComplete="off"
                />
              </div>
              {name.trim().length === 1 ? (
                <p className="text-xs text-muted-foreground">
                  Enter at least 2 characters to search.
                </p>
              ) : null}
            </div>

            {isSearching ? <SuggestionSkeletons /> : null}

            {suggestions.isError ? (
              <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Suggestions could not be loaded</p>
                  <p className="mt-1 text-xs">{suggestions.error.message}</p>
                </div>
              </div>
            ) : null}

            {assemblyMatches.length ? (
              <section aria-labelledby="assembly-category-matches">
                <h3 id="assembly-category-matches" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Already used by {suggestions.data?.assembly_name || `assembly ${assemblyId}`}
                </h3>
                <div className="mt-2 grid gap-2" role="listbox" aria-label="Assembly category matches">
                  {assemblyMatches.map((option, index) => (
                    <SuggestionRow
                      key={`assembly-${option.id}`}
                      option={option}
                      highlighted={highlightedIndex === index}
                      onSelect={() => choose(option)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {standardMatches.length ? (
              <section aria-labelledby="standard-category-matches">
                <h3 id="standard-category-matches" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Suggested categories
                </h3>
                <div className="mt-2 grid gap-2" role="listbox" aria-label="Standard category matches">
                  {standardMatches.map((option, index) => (
                    <SuggestionRow
                      key={`standard-${option.id}`}
                      option={option}
                      highlighted={highlightedIndex === assemblyMatches.length + index}
                      onSelect={() => choose(option)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {noMatches ? (
              <Empty className="gap-2 border border-border bg-muted p-4 md:p-4">
                <EmptyHeader className="gap-1">
                  <EmptyMedia variant="icon">
                    <SearchIcon aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyDescription>
                    No similar categories were found. You can create this as a custom category.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {exactMatch ? (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
                <p className="font-semibold">This category already exists.</p>
                <p className="mt-1 text-muted-foreground">
                  Use “{exactMatch.name}” above instead of creating a duplicate.
                </p>
              </div>
            ) : null}

            {hasSearched && !suggestions.isError && !exactMatch ? (
              <section className="rounded-xl border border-border p-4">
                {!createMode ? (
                  <Button type="button" variant="outline" className="w-full justify-start" onClick={beginCreate}>
                    <PlusIcon className="size-4 text-primary" aria-hidden="true" />
                    Create “{name.trim()}” as a custom category
                  </Button>
                ) : (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`financial-category-mapping-${kind}`}>Report this under</Label>
                      <NativeSelect
                        id={`financial-category-mapping-${kind}`}
                        className="min-w-full"
                        value={mappingChoice}
                        onChange={(event) => {
                          setMappingChoice(event.target.value);
                          setMappingConfirmed(false);
                        }}
                      >
                        <NativeSelectOption value="">Select standard reporting category</NativeSelectOption>
                        {standardOptions.map((option) => (
                          <NativeSelectOption key={String(option.id)} value={String(option.id)}>
                            {option.name}{option.reporting_group ? ` — ${option.reporting_group}` : ""}
                          </NativeSelectOption>
                        ))}
                        <NativeSelectOption value="__review__">Other / Not yet classified</NativeSelectOption>
                      </NativeSelect>
                    </div>
                    {mappingChoice ? (
                      <label className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm">
                        <Checkbox
                          checked={mappingConfirmed}
                          onCheckedChange={(checked) => setMappingConfirmed(checked === true)}
                        />
                        <span>
                          {mappingChoice === "__review__"
                            ? "Save without a mapping and mark this category for administrative review."
                            : "I confirm this standard reporting category."}
                        </span>
                      </label>
                    ) : null}
                  </div>
                )}
              </section>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border bg-background px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createOption.isPending}>
            Cancel
          </Button>
          {createMode ? (
            <Button type="button" onClick={() => void createCategory()} disabled={!canCreate}>
              {createOption.isPending ? "Adding…" : kind === "revenue" ? "Add income category" : "Add operating cost type"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
