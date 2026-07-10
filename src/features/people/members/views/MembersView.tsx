"use client"

import * as React from "react"
import { SearchIcon, UserRoundIcon } from "lucide-react"
import { UserSwitchIcon } from "@hugeicons/core-free-icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { DataTableAction } from "@/features/reports/core/components/DataTable.types"
import {
    ResourceViewToggle,
    type ResourceViewMode,
} from "@/features/resource-directory/components/ResourceViewToggle"
import { TransferMemberDialog } from "@/features/people/transfers/components/TransferMemberDialog"
import { membersTableSchema } from "../config/table-schema"
import { useMembersDirectory } from "../hooks/use-members-directory"
import type { Member } from "../schemas/member"
import { getMembersTabs } from "../config/members.tabs"

type MemberTableRow = Record<string, unknown> & {
    id: number
    full_name: string
    avatar: string | null
    avatar_fallback: string
    gender: string
    age_label: string
    role_names: string
    assembly_label: string
    country: string
    contact: string
    membership_status: string
    member: Member
}

const tableOptions = {
    enablePinning: true,
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const first = parts[0]?.[0] ?? "M"
    const second = parts[1]?.[0] ?? ""

    return `${first}${second}`.toUpperCase()
}

function calculateAge(dateOfBirth: string) {
    const birthDate = new Date(dateOfBirth)

    if (Number.isNaN(birthDate.getTime())) {
        return "Not available"
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (
            today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate()
        )

    if (!hasBirthdayPassed) {
        age -= 1
    }

    return String(age)
}

function getRoleNames(member: Member) {
    const roles = [...member.positions, ...member.ministries]
        .map((role) => role.trim())
        .filter(Boolean)

    return roles.length ? roles.join(", ") : "Not assigned"
}

function getContact(member: Member) {
    return member.email || member.phone_number || "Not available"
}

function mapMemberRow(member: Member): MemberTableRow {
    return {
        id: member.id,
        full_name: member.full_name,
        avatar: member.avatar ?? null,
        avatar_fallback: member.avatar_fallback ?? "",
        gender: member.gender,
        age_label: calculateAge(member.date_of_birth),
        role_names: getRoleNames(member),
        assembly_label: `Assembly #${member.assembly}`,
        country: member.country,
        contact: getContact(member),
        membership_status: member.membership_status || "Unspecified",
        member,
    }
}

function MemberCard({ member }: { member: Member }) {
    const roles = getRoleNames(member)
    const status = member.membership_status || "Unspecified"
    const age = calculateAge(member.date_of_birth)

    return (
        <article
            tabIndex={0}
            className="flex min-h-64 flex-col rounded-lg border border-border bg-card p-4 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className="flex items-start gap-3">
                <Avatar className="size-12">
                    {member.avatar ? (
                        <AvatarImage src={member.avatar} alt="" />
                    ) : null}
                    <AvatarFallback className="text-sm font-semibold text-foreground">
                        {getInitials(member.full_name)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-foreground">
                        {member.full_name}
                    </h2>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                        {roles}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{status}</Badge>
                <Badge variant="outline">{member.gender}</Badge>
                <Badge variant="outline">
                    {age === "Not available" ? age : `${age} years`}
                </Badge>
            </div>

            <dl className="mt-4 grid gap-3 text-sm">
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Assembly</dt>
                    <dd className="mt-1 text-foreground">Assembly #{member.assembly}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Country</dt>
                    <dd className="mt-1 text-foreground">{member.country}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Contact</dt>
                    <dd className="mt-1 truncate text-foreground">{getContact(member)}</dd>
                </div>
            </dl>
        </article>
    )
}

function MemberCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </div>
            <div className="mt-5 space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    )
}

function MembersError({ error }: { error: unknown }) {
    const message = error instanceof Error
        ? error.message
        : "Members could not be loaded."

    return (
        <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <UserRoundIcon
                aria-hidden="true"
                className="mx-auto size-10 text-muted-foreground"
            />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
                Unable to load members
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {message}
            </p>
        </div>
    )
}

export function MembersView() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [transferMember, setTransferMember] = React.useState<Member | null>(null)
    const search = searchParams.get("search") ?? ""
    const viewParam = searchParams.get("view")
    const view: ResourceViewMode = viewParam === "cards" ? "cards" : "table"
    const tabs = getMembersTabs(searchParams)

    const membersQuery = useMembersDirectory({ search })
    const members = React.useMemo(
        () => membersQuery.data ?? [],
        [membersQuery.data]
    )
    const tableRows = React.useMemo(
        () => members.map(mapMemberRow),
        [members]
    )
    const isLoading = membersQuery.isLoading || membersQuery.isFetching
    const isInitialCardLoading = isLoading && members.length === 0

    const updateParams = React.useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (!value) {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            })
        },
        [pathname, router, searchParams]
    )

    const handleSearchChange = React.useCallback(
        (value: string) => {
            updateParams({
                search: value.trim() ? value : null,
                page: null,
            })
        },
        [updateParams]
    )

    const handleViewChange = React.useCallback(
        (nextView: ResourceViewMode) => {
            updateParams({ view: nextView })
        },
        [updateParams]
    )

    const getRowActions = React.useCallback((row: MemberTableRow): DataTableAction[] => [
        {
            label: "Transfer Member",
            icon: UserSwitchIcon,
            variant: "default",
            onClick: () => setTransferMember(row.member),
        },
    ], [])

    return (
        <View className="gap-0">
            <View.Header
                pagename="Members"
            />

            <View.TabBar items={tabs} />

            <View.Body className="gap-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full flex-col gap-2 sm:max-w-sm sm:flex-row">
                        <div className="relative flex-1">
                            <SearchIcon
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                aria-label="Search members by full name"
                                className="h-9 pl-9"
                                placeholder="Search members"
                                value={search}
                                onChange={(event) => handleSearchChange(event.target.value)}
                            />
                        </div>
                        {search ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSearchChange("")}
                            >
                                Clear
                            </Button>
                        ) : null}
                    </div>

                    <ResourceViewToggle
                        value={view}
                        onChange={handleViewChange}
                    />
                </div>

                {membersQuery.isError ? (
                    <MembersError error={membersQuery.error} />
                ) : !isLoading && members.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card px-6 py-12">
                        <EmptyState
                            type={search ? "filteredReports" : "demographics"}
                            variant="both"
                            context={{ label: "members" }}
                        />
                    </div>
                ) : view === "cards" ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {isInitialCardLoading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                <MemberCardSkeleton key={index} />
                            ))
                            : members.map((member) => (
                                <MemberCard key={member.id} member={member} />
                            ))}
                    </div>
                ) : (
                    <DataTable<MemberTableRow>
                        data={tableRows}
                        config={membersTableSchema}
                        isLoading={isLoading}
                        loadingMode="overlay"
                        options={tableOptions}
                        showToolbar={false}
                        showDefaultRowActions={false}
                        rowActions={getRowActions}
                        enableDelete={false}
                        resource="members"
                        exportFilename="members"
                    />
                )}
            </View.Body>
            <TransferMemberDialog
                key={transferMember?.id ?? "closed"}
                open={Boolean(transferMember)}
                member={transferMember}
                onOpenChange={(open) => {
                    if (!open) setTransferMember(null)
                }}
            />
        </View>
    )
}


