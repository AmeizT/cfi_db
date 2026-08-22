# CFI SVG Icons — Complete Deduplicated Collection

This is the deduplicated combined collection from all three uploads.

## Contents

- 57 React/TypeScript icon components
- `Base.tsx` shared SVG wrapper
- `index.ts` barrel exports
- `IconGallery.tsx` preview grid
- `SOURCE_MANIFEST.md` source-to-component mapping

## Usage

```tsx
import { RocketIcon } from "@/components/icons/cfi"

export function Example() {
    return (
        <RocketIcon
            className="size-5 fill-current text-primary"
            aria-hidden="true"
        />
    )
}
```

Props passed to an icon override the wrapper defaults because `{...props}` is applied last.

## Duplicate handling

- `balance-scale (1).svg` omitted because it is identical to `balance-scale.svg`.
- `bell (1).svg` omitted because it is identical to `bell.svg`.
- `purse (1).svg` omitted because it is identical to `purse.svg`.

## Suggested navigation use

| CFI Workspace area | Suggested icon |
|---|---|
| Finance | `PurseIcon` |
| Members | `PersonCurlyHairIcon` |
| Spaces | `PlacardIcon` |
| Performance | `RocketIcon` or `RosetteIcon` |
| Report Activity | `PrinterIcon`, `PenIcon`, or `PaperclipIcon` |
| Ministry | `PersonBowingIcon` |
| Leadership | `RosetteIcon` |
| Growth | `PottedPlantIcon`, `PeaPodIcon`, or `RocketIcon` |
| Compliance | `SafetyVestIcon` or `RescueWorkersHelmetIcon` |
| Risk | `PoliceCarLightIcon`, `RingBuoyIcon`, or `SafetyVestIcon` |
