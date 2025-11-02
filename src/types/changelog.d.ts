declare interface Author {
    id: number
    first_name: string
    last_name: string
    role: string
}

export declare interface Changelog {
    id: number
    author: Author
    title: string
    description: string
    category: string
    image: string
    views: number,
    slug: string
    is_draft: boolean
    created_at: Date,
    updated_at: Date
}