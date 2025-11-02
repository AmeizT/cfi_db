export function shortGender(gender: string) {
    const LowercasedGender = gender.toLowerCase()

    if (LowercasedGender.startsWith("m")) {
        return "M"
    } else if (LowercasedGender.startsWith("f")) {
        return "F"
    } else {
        return
    }
}