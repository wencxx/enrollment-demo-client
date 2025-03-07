import { z } from "zod"

export const loginSchema = z.object({
    username: z.string({
        required_error: "Please enter a password",
    }).min(3).max(50),
    password: z.string({
        required_error: "Please enter a password",
    }).min(3).max(16),
})


export const registerSchema = z.object({
    UserName: z.string({
        required_error: "Please enter a username"
    }).min(6, "Username must be atleat 6 charactesrs").max(50, "Username must not exceed 50 characters"),
    PWord: z.string({
        required_error: "Please enter a password"
    }).min(8, "Password must be atleast 8 characters").max(50, "Password must not exceed 50 characteds").regex(/[0-9]/, "Password must have a number").regex(/[a-aZ-Z]/, 'Password must have upper and lowercase'),
    FirstName: z.string({
        required_error: "Please enter your first name"
    }).min(5),
    MiddleName: z.string({
        required_error: "Please enter your middle name"
    }).min(5),
    LastName: z.string({
        required_error: "Please enter your last name"
    }).min(5)
})