interface Author {
    name: string
}

export interface SiteMetadata {
    authors?: Author[]
    creator?: string
    description?: string
    generator?: string
    publisher?: string
    title?: string
}

const DEFAULT_METADATA: SiteMetadata = {
    authors: [{ name: "Tawanda Zhuwao" }],
    creator: "Tawanda Zhuwao",
    description: "Cornerstone Database",
    generator: "Next.js",
    publisher: "Tawanda Zhuwao",
    title: "CFI Database",
}

/**
 * Build site metadata with optional overrides.
 * Automatically appends the base title if a custom title is provided.
 */
export function getMetaData(custom: Partial<SiteMetadata> = {}): SiteMetadata {
    const { title, ...rest } = custom

    return {
        ...DEFAULT_METADATA,
        ...rest,
        title: title ? `${title} • ${DEFAULT_METADATA.title}` : DEFAULT_METADATA.title,
    }
}