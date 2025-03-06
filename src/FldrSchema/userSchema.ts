import { z } from "zod"

export const loginSchema = z.object({
    username: z.string({
        required_error: "Please select a enter a password",
    }).min(3).max(50),
    password: z.string({
        required_error: "Please select a enter a password",
    }).min(3).max(16),
})

