"use client"

import { Field, FormShell } from "@/features/create/forms/FormShell"
import { assetTypes, conditions } from "@/features/create/forms/contracts"

export function AssetQuickAdd({ onCancel, onCreated }: { onCancel: () => void; onCreated: (id: string) => void }) {
    return <FormShell entity="assets" title="Asset" inline={{ onCancel, onCreated, presentation: "row", fullFormHref: "/assets/new" }}>
        <Field name="item_name" label="Asset name" required placeholder="—" />
        <Field name="asset_type" label="Type" choices={assetTypes} required />
        <Field name="acquisition_date" label="Acquired" type="date" required />
        <Field name="condition" label="Condition" choices={conditions} required />
        <Field name="units" label="Units" type="number" required placeholder="—" />
        <Field name="acquisition_cost" label="Value (optional)" placeholder="—" />
    </FormShell>
}
