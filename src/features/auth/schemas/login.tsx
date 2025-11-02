import { z } from "zod"

export const EmailSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Workspace ID is required." })
        .email({ message: "Invalid email address" })
        .refine((val) => val.endsWith("@cfi.church"), {
            message: "Please enter a valid CFI Workspace ID",
        }),
})