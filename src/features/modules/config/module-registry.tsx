import { MembersView } from "@/features/people/members/views/MembersView"
import { ChildrenDirectoryView } from "@/features/people/children/views/ChildrenDirectoryView"
import { FormerMembersView } from "@/features/people/former-members/views/FormerMembersView"
import type { ModulePageConfig, ModuleRegistry, ModuleRoute } from "../types"

function MembersDirectoryContent() {
    return <MembersView embedded />
}

function AdultsDirectoryContent() {
    return <MembersView embedded group="adults" />
}

function ChildrenDirectoryContent() {
    return <ChildrenDirectoryView />
}

function FormerMembersContent() {
    return <FormerMembersView embedded />
}

const directoryTabs = [
    { key: "all", label: "All", href: "/members/directory" },
    { key: "adults", label: "Adults", href: "/members/directory/adults" },
    { key: "children", label: "Children", href: "/members/directory/children" },
    { key: "former", label: "Former", href: "/members/directory/former" },
] as const

const memberDirectory = (title: string): ModulePageConfig => ({
    title,
    tabs: directoryTabs,
    content: MembersDirectoryContent,
})

export const MODULE_REGISTRY = {
    members: {
        directory: {
            defaultSubpage: "all",
            pages: {
                all: memberDirectory("Directory"),
                adults: { ...memberDirectory("Directory"), content: AdultsDirectoryContent },
                children: { ...memberDirectory("Directory"), content: ChildrenDirectoryContent },
                former: { ...memberDirectory("Directory"), content: FormerMembersContent },
            },
        },
    },
} satisfies ModuleRegistry

export function getModulePageConfig({ section, page, subpage }: ModuleRoute): ModulePageConfig | undefined {
    const registry: ModuleRegistry = MODULE_REGISTRY
    const sectionConfig = registry[section]
    const pageConfig = sectionConfig?.[page]
    const key = subpage ?? pageConfig?.defaultSubpage

    return key ? pageConfig?.pages[key] : undefined
}

export function isModuleRoute(route: ModuleRoute) {
    return Boolean(getModulePageConfig(route))
}
