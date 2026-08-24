import { notFound } from "next/navigation"
import { getModulePageConfig } from "@/features/modules/config/module-registry"
import { ModulePageView } from "@/features/modules/views/ModulePageView"

type Props = {
    params: Promise<{ section: string; page: string; subpage?: string[] }>
}

export default async function ApplicationModulePage({ params }: Props) {
    const { section, page, subpage } = await params
    const route = { section, page, subpage: subpage?.[0] }

    if (subpage && subpage.length > 1) notFound()
    if (!getModulePageConfig(route)) notFound()

    return <ModulePageView {...route} />
}
