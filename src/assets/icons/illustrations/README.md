# Empty-state illustrations

Reusable React SVG components wrapped with the shared `Svg` component.

## Install

Copy this folder to a location such as:

```text
components/ui/empty-state-illustrations/
```

Import components through the barrel file:

```tsx
import { EmptyMailboxIllustration } from "@/components/ui/empty-state-illustrations"

<EmptyMailboxIllustration
    aria-label="No messages"
    className="h-auto w-56"
/>
```

The original unDraw accent `#6c63ff` is mapped to:

```css
var(--color-user-theme-500, #6c63ff)
```

This keeps the illustrations theme-aware while retaining the original purple as a fallback. Width, height, `viewBox`, `className`, accessibility attributes, and other SVG props can be overridden through component props.

## Components

- `AircraftIllustration` — `undraw_aircraft_usu4 (1).svg`
- `CloudsIllustration` — `undraw_clouds_bmtk (2).svg`
- `ConnectedWorldIllustration` — `undraw_connected-world_anke.svg`
- `CreditCardIllustration` — `undraw_credit-card_t6qm (2).svg`
- `EmptyMailboxIllustration` — `undraw_empty-mailbox_ef0e.svg`
- `FilesUploadingIllustration` — `undraw_files-uploading_qf8u (3).svg`
- `HappyBirthdayIllustration` — `undraw_happy-birthday_lmk0 (2).svg`
- `ImagesIllustration` — `undraw_images_v4j9.svg`
- `OpenBookIllustration` — `undraw_open-book_pet1.svg`
- `StarsIllustration` — `undraw_stars_5pgw.svg`
- `SearchingEverywhereIllustration` — `undraw_searching-everywhere_tffi.svg`
- `QuietStreetIllustration` — `undraw_quiet-street_v45k (1).svg`
- `PlantsIllustration` — `undraw_plants_md5c.svg`
- `PhotoIllustration` — `undraw_photo_895y.svg`
- `PageEatenIllustration` — `undraw_page-eaten_b2rt.svg`
- `OuterSpaceIllustration` — `undraw_outer-space_qey5.svg`
- `OpenedIllustration` — `undraw_opened_47gd (1).svg`
- `TextFilesIllustration` — `undraw_text-files_tqjw.svg`
- `ToTheStarsIllustration` — `undraw_to-the-stars_tz9v.svg`
- `UnderConstructionIllustration` — `undraw_under-construction_hdrn.svg`
