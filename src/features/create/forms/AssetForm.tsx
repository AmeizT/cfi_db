"use client"
import { Field, FormShell, Section } from "./FormShell"
import { assetTypes, conditions } from "./contracts"

export function AssetForm() {
    return <FormShell entity="assets" title="Asset">
        <Section title="Asset information">
            <Field name="item_name" label="Item name" required />
            <Field name="acquisition_date" label="Acquisition date" type="date" required />
            <Field name="asset_type" label="Asset type" choices={assetTypes} required />
            <Field name="condition" label="Condition" choices={conditions} required />
            <Field name="units" label="Units" type="number" required />
            <Field name="item_code" label="Item code" />
            <Field name="description" label="Description" type="textarea" maxLength={2000} />
            <Field name="vendor" label="Vendor" />
        </Section>
        <Section title="Valuation and images">
            <Field name="acquisition_cost" label="Acquisition cost" help="Defaults to 0.00. Up to two decimal places." />
            <Field name="residual" label="Residual value" help="Defaults to 0.00. Up to two decimal places." />
            <Field name="asset_images" label="Images" type="file" multiple help="Up to 10 JPEG, PNG, or WebP images. 500 KB each, 750 KB total." />
        </Section>
    </FormShell>
}
