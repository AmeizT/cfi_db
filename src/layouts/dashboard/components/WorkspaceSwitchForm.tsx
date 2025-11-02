import React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Church } from "@/types"
import { useUser } from "@/hooks/query/use-user"
import { changeWorkspace } from "@/layouts/actions/change-workspace"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { FormState } from "@/types/form-state"

interface WorkspaceButtonProps {
    workspace: Church;
    setSelectedWorkspace: React.Dispatch<React.SetStateAction<string>>
  }

const initialState: FormState = {
    success: false,
    status: -1,
    message: ""
}

export function WorkspaceSwitchForm({ workspace, setSelectedWorkspace }: WorkspaceButtonProps){
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const [formState, formAction] = React.useActionState(changeWorkspace, initialState)

    React.useEffect(() => {
        if (formState?.success) {
            toast("Workspace changed")
            queryClient.invalidateQueries({ queryKey: ["user"] })
        } else if (formState?.status !== -1 && !formState?.success) {
            toast("Failed to change your workspace")
        }
    }, [formState, queryClient])

    async function changeWorkspaceAction(formData: FormData) {
        formData.append("user", user?.id as unknown as string)
        await formAction(formData)
    }

    const updateWorkspace = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setSelectedWorkspace(event.target.value)
        event.currentTarget.form?.requestSubmit()
    }

    return (
        <form action={changeWorkspaceAction} className="w-full">
            <label htmlFor={workspace?.name} className="flex items-center text-sm gap-x-2 capitalize">
                <input
                    id={workspace?.name}
                    type="radio"
                    name="church"
                    placeholder="Church"
                    value={workspace?.id}
                    onChange={updateWorkspace}
                    className="hidden"
                />

                <Avatar className="w-7 h-7">
                    <AvatarImage src={workspace?.avatar as unknown as string} />
                    <AvatarFallback aria-label="avatar-fallback" className="uppercase text-sm font-medium text-white" style={{ backgroundImage: `linear-gradient(to bottom, ${workspace?.avatar_fallback}, ${workspace?.avatar_fallback})` }}>
                        {workspace?.name?.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>

                {workspace?.name}
            </label>
        </form>
    )
}