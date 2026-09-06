"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function QuickCreate({ trigger, onAction }: {
  trigger?: React.ReactElement;
  onAction?: () => void;
} = {}) {
  const router = useRouter();
  function openCreate() {
    onAction?.();
    router.push("/create");
  }

  if (trigger) {
    return React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
      onClick: openCreate,
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon"
          aria-label="Quick Create" onClick={openCreate}
          className="size-10 text-[var(--shell-chrome-foreground)] hover:bg-[var(--shell-chrome-hover)] hover:text-[var(--shell-chrome-foreground)]">
          <Plus className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Quick Create</TooltipContent>
    </Tooltip>
  );
}
