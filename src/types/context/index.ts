import { Church, Message, Session, Region, Timetable } from "../api"

export interface ReduxState {
    weeks: {
        timetables?: Timetable[]
    }
    messages: {
        count?: number
        next?: null
        previous?: null
        results?: Message[]
    }
    church: {
        churches?: Church[]
        messages: {
            data?: {
                results?: Message[]
            }
            count?: number
            next?: null
            previous?: null
        }
    }
    auth: {
        authenticated: boolean
        session: Session
    }
    region: {
        region: Region
    }
}


export interface ReduxContextProps {
    weeks: {
        timetables?: Timetable[]
    }
    messages: {
        count?: number
        next?: null
        previous?: null
        results?: Message[]
    }
    church: {
        churches?: Church[]
        messages: {
            data?: {
                results?: Message[]
            }
            count?: number
            next?: null
            previous?: null
        }
    }
    auth: {
        authenticated: boolean
        session: Session
    }
    region: {
        region: Region
    }
}
