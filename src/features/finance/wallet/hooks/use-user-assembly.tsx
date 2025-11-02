import { User } from "@/features/auth/schemas/user";
import { Church } from "@/types";
import React from "react";

interface UserAssemblyProps {
    assignedAssemblies: Church[]
    user: User | null
}

export const useUserAssembly = ({ assignedAssemblies, user }: UserAssemblyProps) => {
    const assembly = React.useMemo(
        () => assignedAssemblies?.find((a) => a?.id === user?.church),
        [assignedAssemblies, user]
    )

    return {
        assembly,
        language: assembly?.lang,
        currency: assembly?.currency,
    }
  }