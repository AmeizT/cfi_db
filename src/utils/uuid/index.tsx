import { Menu } from "@/types"
import { nanoid } from "nanoid"

export function assignId(arr: Menu[]): Menu[] {
    return arr.map((obj) => {
        if (!obj.id) {
            return { ...obj, id: nanoid() }
        }
        return obj
    })
}

export const assignUuid = (arr: Menu[]): Menu[] => {
    return arr.map((obj) => {
        if (!obj.id) {
            return { ...obj, id: nanoid() }
        }
        return obj
    })
}
