"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { quickCreateActions } from "@/config/workspace-navigation";
import { NavIcon } from "@/layouts/dashboard/AppNavIcon";

export function QuickCreate({
  trigger,
  onAction,
}: {
  trigger?: React.ReactElement;
  onAction?: () => void;
} = {}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  function openAction(href: string) {
    setOpen(false);
    onAction?.();
    router.push(href);
  }

  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Quick Create"
      className="size-10 text-[var(--shell-chrome-foreground)] hover:bg-[var(--shell-chrome-hover)] hover:text-[var(--shell-chrome-foreground)]"
    >
      <Plus className="size-5" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Quick Create</TooltipContent>
        </Tooltip>
      )}

      <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle>Quick Create</DialogTitle>
          <DialogDescription>
            Go directly to the feature that owns the record.
          </DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput placeholder="Find an action..." className="h-12" />
          <CommandList className="max-h-[min(26rem,65dvh)] p-2">
            <CommandEmpty>No matching action found.</CommandEmpty>
            <CommandGroup>
              {quickCreateActions.map((action) => {
                return (
                  <CommandItem
                    key={action.key}
                    value={`${action.label} ${action.description}`}
                    disabled={action.disabled}
                    onSelect={() => openAction(action.href)}
                    className="h-auto min-h-12 cursor-pointer items-start py-2.5"
                  >
                    <NavIcon
                      icon={action.icon}
                      className="mt-0.5 size-5"
                      aria-hidden="true"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-medium">{action.label}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                    {action.disabled ? (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Coming soon
                      </span>
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
