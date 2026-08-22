// Translation info
export type Translation = {
    id: string;
    name: string;
    short_name: string;
    license_url: string;
}

// Verse of the Day / Scripture response
export type Votd = {
    date: string; // ISO format: YYYY-MM-DD
    text: string;
    reference: string;

    book_id: string; // e.g. "PSA"
    chapter: number;
    start_verse: number;
    end_verse: number;

    translation: Translation
}