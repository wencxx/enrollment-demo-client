import { z } from "zod"

export const loginSchema = z.object({
    username: z.string({
        required_error: "Please select a enter a password",
    }).min(6).max(50),
    password: z.string({
        required_error: "Please select a enter a password",
    }).min(8).max(16),
})