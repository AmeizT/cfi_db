// "use client"

// import React from "react"
// import { Drawer } from "vaul"
// import { toast } from "sonner"
// import { useUser } from "@/hooks/query/use-user"
// import { User } from "@/features/auth/schemas/user"
// import { Separator } from "@/components/ui/separator"
// import { signOut } from "@/features/auth/actions/sign-out"
// import { ProfileButton } from "../components/AvatarButton"
// import { WorkspaceSwitcher } from "./components/WorkspaceSwitcher"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { IconLogout, IconPlus, IconSettings, IconSwitch3, IconUserCircle, type TablerIcon } from "@tabler/icons-react"

// interface AccountMenuProps {
//     user?: User | null | undefined
//     open: boolean
//     setOpen: (open: boolean) => void
// }

// interface AccountMenuItem {
//     name: string
//     icon: TablerIcon
//     onClick?: () => void
// }

// interface NestedDrawerProps {
//     settings: boolean
//     workspace: boolean
// }

// export function Menu({ user, setOpen }: { user?: User | null | undefined, open: NestedDrawerProps, setOpen: React.Dispatch<React.SetStateAction<NestedDrawerProps>> }){ 
//     const assemblies = user?.assemblies || []
//     const activeAssembly = assemblies?.find(assembly => assembly?.id === Number(user?.church)) 

//     const AccountMenuItems: AccountMenuItem[] = [
//         {
//             name: "Settings",
//             icon: IconSettings,
//             onClick: () => setOpen(prev => ({ ...prev, settings: !prev.settings }))
//         },
//         {
//             name: "Switch workspace",
//             icon: IconSwitch3,
//             onClick: () => setOpen(prev => ({ ...prev, workspace: !prev.workspace }))
//         },
//         {
//             name: "Create assembly",
//             icon: IconPlus,
//         },
//         {
//             name: `${user?.first_name} ${user?.last_name}`,
//             icon: IconUserCircle,
//         },
//         {
//             name: "Log out",
//             icon: IconLogout,
//             onClick: async () => {
//                 try {
//                     await signOut(String(user?.id))
//                 } catch (error) {
//                     if (error instanceof Error) {
//                         toast.error(error.message)
//                     } else {
//                         toast.error("Sign out failed")
//                     }
//                 }
//             }
//         }
//     ]
    
//     return (
//         <div className="w-full flex flex-col items-center gap-y-4">
//             <div className="mt-4 flex flex-col justify-center items-center gap-4">
//                 <Avatar className="size-28 lg:size-8 rounded-[36px] lg:rounded-xl">
//                     <AvatarImage draggable={false} src={String(activeAssembly?.avatar)} alt={activeAssembly?.name} className="object-cover" />
//                     <AvatarFallback className="text-white text-3xl font-medium rounded-3xl" style={{ backgroundColor: activeAssembly?.avatar_fallback }}>
//                         {activeAssembly?.name?.charAt(0)}
//                     </AvatarFallback>
//                 </Avatar>

//                 <div className="flex flex-col justify-between items-center gap-2">
//                     <h4 className="text-lg font-semibold">
//                         {activeAssembly?.name}
//                     </h4>

//                     <div className="px-3 py-1.5 flex justify-center items-center gap-3 bg-gray-100 dark:bg-neutral-700 rounded-lg">
//                         {user?.roles?.map((role) => (
//                             <React.Fragment key={role?.name}>
//                                 <small className="text-gray-500 dark:text-neutral-100">
//                                     {role?.name}
//                                 </small>

//                                 <Separator orientation="vertical" className="data-[orientation=vertical]:h-3 bg-gray-300 dark:bg-neutral-500 last:hidden" />
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <ul className="w-full flex flex-col gap-1">
//                 {AccountMenuItems.map((item, index) => (
//                     <React.Fragment key={item.name}>
//                         {/* {index === AccountMenuItems.length - 2 && AccountMenuItems.length > 2 && (
//                             <Separator key={`separator-before-${index}`} className="w-full bg-gray-200" />
//                         )} */}

//                         {index === AccountMenuItems.length - 2 && AccountMenuItems.length > 1 && (
//                             <Separator key={`separator-after-${index}`} className="w-full bg-gray-200 dark:bg-neutral-600" />
//                         )}

//                         <li key={item.name} className="py-2 rounded-lg hover:bg-[#ffffff12]!">
//                             <button onClick={item.onClick} className="flex items-center gap-x-2 dark:text-white text-sm font-[475]">
//                                 <item.icon strokeWidth={2.25} className="size-4" /> {item.name}
//                             </button>
//                         </li>
//                     </React.Fragment>
//                 ))}
//             </ul>         
            
//         </div>
//     )
// }

// export default function UserMenu() {
//     const { data: user, isLoading } = useUser()
//     const assemblies = user?.assemblies || []
//     const [open, setOpen] = React.useState<NestedDrawerProps>({
//         settings: false,
//         workspace: false,
//     })
//     const activeAssembly = assemblies?.find(assembly => assembly?.id === Number(user?.church)) 
    
//     return (
//         <div>
//             <div className="lg:hidden">
//                 <Drawer.Root>
//                     <Drawer.Trigger>
//                         <ProfileButton
//                             displayName={activeAssembly?.name || ""}
//                             label={activeAssembly?.country}
//                             avatarColor={activeAssembly?.avatar_fallback}
//                             avatarSrc={activeAssembly?.avatar || undefined}
//                             isLoading={isLoading}
//                         />
//                     </Drawer.Trigger>
//                     <Drawer.Portal>
//                         <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
//                         <Drawer.Content className="bg-gray-100 dark:bg-neutral-800 flex flex-col rounded-t-3xl h-full mt-24 lg:h-fit max-h-[96%] fixed bottom-0 left-0 right-0 z-50">
//                             <div className="px-6 pt-2 pb-3 rounded-t-3xl flex-1">
//                                 <div className="mx-auto w-12 h-1 flex-shrink-0 rounded-full bg-gray-300 dark:bg-neutral-600 mb-6" />
//                                 <div className="max-w-md mx-auto">
//                                     <Drawer.Title hidden />

//                                     <Menu
//                                         user={user}
//                                         open={open}
//                                         setOpen={setOpen}
//                                     />

//                                     <WorkspaceDrawer
//                                         open={open.workspace}
//                                         setOpen={(v) => setOpen(prev => ({ ...prev, workspace: v }))}
//                                     />

//                                     <SettingsDrawer
//                                         open={open.settings}
//                                         setOpen={(v) => setOpen(prev => ({ ...prev, settings: v }))}
//                                     />
//                                 </div>
//                             </div>
//                         </Drawer.Content>
//                     </Drawer.Portal>
//                 </Drawer.Root>
//             </div>
//         </div>
//     )
// }

// function WorkspaceDrawer({ open, setOpen }: AccountMenuProps){
//     return (
//         <Drawer.NestedRoot open={open} onOpenChange={setOpen}>
//             <Drawer.Trigger hidden className="rounded-md mt-4 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-600" />
//             <Drawer.Portal>
//                 <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
//                 <Drawer.Content className="flex flex-col rounded-t-3xl lg:h-[327px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0 z-[60]">
//                     <Drawer.Title hidden />
//                     <WorkspaceSwitcher />
//                 </Drawer.Content>
//             </Drawer.Portal>
//         </Drawer.NestedRoot>
//     )
// }

// function SettingsDrawer({ open, setOpen }: AccountMenuProps) {
//     return (
//         <Drawer.NestedRoot open={open} onOpenChange={setOpen}>
//             <Drawer.Trigger hidden className="rounded-md mt-4 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-600">
//                 Open Second Drawer
//             </Drawer.Trigger>
//             <Drawer.Portal>
//                 <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
//                 <Drawer.Content className="p-4 bg-gray-100 dark:bg-neutral-800 flex flex-col rounded-t-3xl lg:h-[327px] h-full mt-24 max-h-[94%] fixed bottom-0 left-0 right-0 z-[60]">
//                     <Drawer.Title hidden />
//                     <h3>Settings</h3>
//                 </Drawer.Content>
//             </Drawer.Portal>
//         </Drawer.NestedRoot>
//     )
// }
