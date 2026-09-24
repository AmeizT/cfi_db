"use client";

import { useUser } from "@/hooks/query/use-user";
import { usesRegionalShell } from "@/features/regional-shell/scope";
import * as React from "react";
import { Plus } from "lucide-react";
import { NewLauncherMenu } from "@/features/create/launcher/NewLauncher";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function QuickCreate({ trigger, onAction }: {
  trigger?: React.ReactElement;
  onAction?: () => void;
} = {}) {
  const { data: user } = useUser();
  if (usesRegionalShell(user)) return null;
  if (trigger) return <NewLauncherMenu onAction={onAction}>{trigger}</NewLauncherMenu>;

  return (
    <Tooltip>
      <NewLauncherMenu onAction={onAction}>
        <TooltipTrigger asChild>
          <Button type="button" variant="ghost" size="icon"
            aria-label="New"
            className="size-10 text-(--shell-chrome-foreground) hover:bg-(--shell-chrome-hover) hover:text-(--shell-chrome-foreground)">
            <Plus className="size-5" />
          </Button>
        </TooltipTrigger>
      </NewLauncherMenu>
      <TooltipContent>New</TooltipContent>
    </Tooltip>
  );
}
