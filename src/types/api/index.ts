interface CountryInfo {
    code: string, lang: string, currency: string
}

export interface Account {
    id: number
    user: number
    type: string
    intervals: 1 | 4 | 12 | number
    sub_total: string
    discount: string
    amount_paid: string
    amount_due: string
    is_premium_active: boolean
    expires: string
    created: string
    updated: string
}

export interface AttendanceInstance {
    id: number
    church: number
    homecell: Homecell
    created_by: {
        first_name: string
        last_name: string
    }
    category?: "midweek" | "homecell" | "other" | "outreach" | "sunday"
    preacher: string;
    sermon: string;
    scriptures: string;
    headcount: number;
    adults: number;
    children: number;
    visitors: number;
    newcomers: number;
    altar_call: number;
    baptism: number;
    summary: string;
    achievements: string;
    slug: string;
    start_time: string;
    end_time: string;
    timestamp: string;
    created_at: string;
    updated_at: string;
}

export interface Attendance extends PaginationProps {
    results: AttendanceInstance[]
}

export interface AttendanceRegister {
    id?: number
    church?: number
    member?: Member
    attendance_date: Date
    created_at: Date
    updated_at: Date
}

export interface Church {
    id: number
    church_id: string
    pastor: User
    name: string
    description: string
    address: string
    city: string
    province: string
    country: string
    code?: string
    lang?: string
    currency?: string
    phone_number?: string
    email?: string
    avatar?: string | null
    banner: string | null
    avatar_fallback: string
    status: "Open" | "Closed"
    total_members: number
    created_at: string
    updated_at: string
}

export interface Asset {
    id: number | string
    item_code: string
    assembly: {
        id: string
        lang: string
        currency: string
        code: string
    }
    acquisition_date: string
    item_name: string
    description: string
    asset_type: string
    condition: string
    vendor: string
    units: number
    acquisition_cost: string
    residual: string
    asset_images: AssetImage[]
    created_at: string
    updated_at: string
}

interface AssetImage {
    id: number
    asset: number
    image: string
}

export interface ForumReply {
    id: number
    discussion: Discussion
    author: User
    description: string
    created_at: string
    updated_at: string
}

export interface Discussion {
    id: number
    author: User
    title: string
    description: string
    category: string
    image: string | null
    viewCount: number
    slug: string
    is_draft: boolean
    created_at: string
    updated_at: string
    replies: ForumReply[]
}


// export interface Document {
//     id: number
//     branch: Church;
//     title: string;
//     description: string;
//     uploaded_file: File | null;
//     slug: string;
//     category: string;
//     status: string;
//     remarks: string;
//     document_thumbnail_fallback: string;
//     created_at: string;  
//     updated_at: string;  
// }

export interface UploadedDocument {
    id: number | string
    branch: Church;
    title: string;
    description: string;
    uploaded_document: string
    slug: string;
    category: string;
    status: string;
    remarks: string;
    document_thumbnail_fallback: string;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number
    title: string
    desc: string
    date_start: string
    date_end: string
    time_start: string
    time_end: string
    mode: string
    platform: string
    venue: string
    access: string
    entrance_fee: string | number
    banner: string
    slug: string
    has_ended: boolean
    has_started: boolean
    is_private: boolean
    is_draft: boolean
    createdAt: string
    updatedAt: string
    host: number
}

export interface FixedExpenditure {
    id: number
    assembly: {
        id: string
        lang: string
        currency: string
        code: string
    }
    editor: number
    rent: number
    water: number
    electricity: number
    fuel: number
    telephone: number
    internet: number
    security: number
    insurance: number
    wages: number
    bank_charges: number
    humanitarian: number
    investment: number
    car_maintenance: number
    remarks: string
    remittance: number
    remittance_receipt: string
    remittance_moderator: {
        id: string
        first_name: string
        last_name: string
        avatar_fallback: string
    }
    is_remittance_verified: boolean
    total: number
    timestamp: string
    created_at: Date
    updated_at: Date
}

export interface Homecell {
    id: number
    church: Church
    group_name: string
    description: string
    members: Member[]
    leader: Member
    created_at: string
    updated_at: string
    is_archived: boolean
    homecell_attendance: HomecellAttendance[]
}

export interface HomecellAttendance {
    id: number | string
    church?: number | string
    homecell?: Homecell
    editor?: number | string
    coordinator?: string
    topic?: string
    venue?: string
    total_attendance?: number | string
    adults?: number | string
    kids?: number | string
    visitors?: number | string
    new_members?: number | string
    altar_call?: number | string
    testimonies: Testimonies[]
    scriptures?: string
    summary?: string
    achievements?: string
    start_time?: string
    end_time?: string
    created_at: string
}

export interface HCAInstance {
    id: number | string
    church?: number | string
    homecell?: Homecell
    editor?: number | string
    coordinator?: string
    topic?: string
    venue?: string
    total_attendance?: number | string
    adults?: number | string
    kids?: number | string
    visitors?: number | string
    new_members?: number | string
    altar_call?: number | string
    testimonies: Testimonies[]
    scriptures?: string
    summary?: string
    achievements?: string
    start_time?: string
    end_time?: string
}

export interface Image {
    id: number
    post: number
    image: string
    caption: string
}

export interface Kin {
    id: number
    member_id?: string
    avatar_fallback?: string
    church?: number | string
    prefix?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    gender?: string
    date_of_birth?: string
    baptized_at?: string
    guardian?: Member
    relation_with_guardian?: string
    membersince?: string
    membership_status?: string
    created_by?: string
    created_at?: string
    updated_at?: string
}

export interface Kindred {
    member_id?: string
    church?: number | string
    first_name?: string
    middle_name?: string
    last_name?: string
    date_of_birth?: string
    gender?: string 
    guardian?: Member 
    guardian_relationship?: string
    membersince?: string
    membership_status?: string
    editor?: number | string
    avatar_fallback?: string
    baptized_at?: string 
    created_at?: string 
    updated_at?: string 
}

export interface MinorMember {
    member_id?: string
    church?: number | string
    first_name?: string
    middle_name?: string
    last_name?: string
    date_of_birth?: string
    gender?: string
    guardian?: Member
    guardian_relationship?: string
    membersince?: string
    membership_status?: string
    editor?: number | string
    avatar_fallback?: string
    baptized_at?: string
    created_at?: string
    updated_at?: string
}

export interface Member {
    id?: number | string
    member_id?: string
    full_name: string
    avatar_fallback?: string
    church?: number | string
    prefix?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    gender?: string
    date_of_birth?: string
    baptized_at?: string
    address?: string
    occupation?: string
    position?: string
    relationship?: string
    tithes?: string
    city?: string
    country?: string
    phone_number?: string
    email?: string
    membersince?: string
    membership_status?: string
    ministry?: string
    created_by?: string
    created_at?: string
    updated_at?: string
}

export interface MemberAction {
    church?: number | string
    editor?: number | string
    prefix?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    gender?: string
    date_of_birth?: string
    relationship?: string
    occupation?: string
    address?: string
    city?: string
    country?: string
    phone_number?: string
    email?: string
    baptized_at?: string
    membersince?: string
    position?: string
    ministry?: string
    tithes?: string
}

export interface User {
    id: number
    user_id: string
    church: number | string
    churches: Church[]
    first_name: string
    last_name: string
    username: string
    email: string
    role: "President" | "Secretary General" | "Senior Pastor" | "Overseer" | "Moderator" | "Pastor" | "Secretary"
    avatar_fallback: string
    avatar: string
    is_active: boolean
    is_admin: boolean
    created_at: string
    updated_at: string
}

export interface CreateUser {
    church: number
    first_name: string
    last_name: string
    username: string
    email: string
    password: string
    re_password: string
}

export interface Expenditure {
    id: number
    church: number
    invoice_number: string
    invoice_date: string
    name: string
    description: string
    expense_type: string
    supplier: string
    quantity: number
    receipt?: string
    price: number
    total: number
    created_at: string
    updated_at: string
}

export interface Income {
    id: number
    church: CountryInfo
    donations: number
    fundraising: number
    timestamp: string
    offering: number
    thanksgiving: number
    remittance: number
    sum: number
    expenses: number
    balance: number
    statement: string
    created_at: string
    updated_at: string
}

export interface Message {
    id: number
    message_id: string
    author: string
    assembly: number
    created_by: number
    title: string
    description: string
    priority: string
    category: string
    isMarkAsRead: boolean
    slug: string
    created_at: string
    updated_at: string
}

export interface MessageData {
    id: number
    ref: string
    church: number
    author: string
    title: string
    description: string
    priority: string
    message_type: string
    contact: string
    feedback: string
    read: boolean
    created: string
    updated: string
}

export interface Payroll {
    id: number
    church: number
    euid: string 
    date: string
    name: string
    basic: string
    allowances: string
    benefits: string
    gross: string
    deductions: string
    net: string
    created: string
    updated: string
}

export interface Pledge {
    id: string
    branch: string
    member: string
    project: string
    amount: number
    payment_method: string
    receipt: File | null
    deadline: Date
    created_at: Date
    updated_at: Date
    is_fulfilled: boolean
}

interface Author {
    id: number
    first_name: string
    last_name: string
    avatar: string
    avatar_fallback: string
    church: {
        name: string
        country: string
    }
    role: string
}

export interface PostImage {
    id: number
    post: number
    image: string
    alt: string
    caption: string
}

export interface PostComment {
    id: number
    author: Author
    body: string
    updated_at: string
    created_at: string
}

export interface Post {
    id: number
    author: User
    branch: Church
    title: string
    body: string
    images: PostImage[]
    likes: Author[]
    views: number
    slug: string
    comments: PostComment[]
    is_private: boolean
    is_draft: boolean
    created_at: string
    updated_at: string
}

interface PaginationProps {
    count: number
    next?: string
    previous?: string
}

export interface PostWithPagination extends PaginationProps {
    results: Post[]
}

export interface Project {
    id: number
    church: number
    managers: string[]
    title: string
    desc: string
    cost: string
    location: string
    date_start: string
    date_end: string
    slug: string
    created: string
    updated: string
}

export interface Resource {
    id: number
    ruid: string
    title: string
    description: string
    file: string
    slug: string
    created_at: string
    updated_at: string
}

export interface Region {
    ip: string
    city: string
    region: string
    country: string
    loc: string
    org: string
    timezone: string
}

export interface Session {
    user?: User & {
        account: Account[]
    }
}

export interface Strategy {
    id: number
    branch: number
    coordinator: string
    title: string
    description: string
    slug: string
    banner: string
    banner_fallback: string
    status: "Pending" | "Approved" | "Disapproved"
    feedback: string
    created_at: string
    updated_at: string
}

export interface Tally {
    branch: string
    members: Member[]
    category: string
    timestamp: string
    created_at: string
    updated_at: string
}

export interface StrategyLegacy {
    id: number
    church: number
    coordinator: number
    strategy_id: string
    title: string
    description: string
    attachment: string
    slug: string
    color: string
    timestamp: string
    created_at: string
    updated_at: string 
}

export interface Circular {
    id: number
    church: number
    title: string
    description: string
    attachment: string
    slug: string
    timestamp: string
    created_at: string
    updated_at: string
}

export interface Remittance {
    id: number
    branch: number | string
    editor: User
    period: string
    amount_due: number
    amount_paid: number
    shortfall: number
    shortfall_payments: ShortfallPayment[]
    payment_method: string
    attachment: string | null
    has_shortfall: boolean
    timestamp: string
    created_at: string
    updated_at: string
}

export interface ShortfallPayment {
    id: number
    branch: number | string
    remittance: number | string
    amount_paid: number;
    attachment: string | null
    timestamp: string
    created_at: string
    updated_at: string
}

export interface Testimonies {
    id: number
    homecell: number
    member: string
    description: string
    created_at: string
    updated_at: string
}

export interface Tithe {
    id: string
    assembly: {
        country_code: string
        currency: string
        id: string
        language: string
    }
    member: Member 
    amount: number 
    payment_method: string 
    receipt: string 
    timestamp: string
    created_at: string
    updated_at: string
    reference_code: string
}

export interface Timetable {
    id: number
    title: string
    theme: string
    week_start: string
    week_end: string
    created_at: string
    updated_at: string
}

export interface URLParams {
    params: {
        id?: number | string
        mid?: string
        member_id?: string | number
        name?: string
        phone_number?: string | number
        slug?: string
        ticket?: string
    }
}

export interface URLParamsProps {
    params: {
        id?: number | string
        member_id?: string | number
        name?: string
        ref?: string
        slug?: string
        token?: string | number
        uid?: string | number
    }
}

type MeetingMode = 'in-person' | 'virtual'
type MeetingPlatform = 'Zoom' | 'Teams' | 'Google Meet' | 'Other'

export interface Meeting {
    id: number | string
    branch: number
    title: string
    description: string
    venue: string
    mode: MeetingMode
    platform?: MeetingPlatform
    category: string
    meeting_start_time: string
    meeting_end_time: string
    meeting_thumbnail_fallback?: string
    created_by: number | string
    created_at: string
    updated_at: string
}
