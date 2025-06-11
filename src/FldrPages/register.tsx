import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { registerSchema } from '@/FldrSchema/userSchema'
import { LoaderCircle } from 'lucide-react'
import axios from 'axios'
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { plsConnect } from "@/FldrClass/ClsGetConnection"
import { useState } from "react"

function Login({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            userName: "",
            firstName: "",
            middleName: "",
            lastName: "",
            pWord: "",
        },
    })
    
    const [registering, setRegistering] = useState<boolean>(false)

    const handleRegister = async (values: z.infer<typeof registerSchema>) => {
        try {
            setRegistering(true)

            const { firstName, middleName, lastName, ...data } = values

            const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')
            
            const res = await axios.post(`${plsConnect()}/API/WebAPI/UserController/AddUser`, { ...data, fullName })
            
            console.log(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRegistering(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen p-10">
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="min-w-md">
                    <CardHeader className="text-start">
                        <CardTitle className="text-xl">Register Students</CardTitle>
                        <CardDescription>Enter required info below to register</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-8 md:grid grid-cols-2 gap-x-4">
                                <FormField
                                    control={form.control}
                                    name="userName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Firstname</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Firstname" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="middleName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>MiddleName</FormLabel>
                                            <FormControl>
                                                <Input placeholder="MiddleName" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lastname</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Lastname" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pWord"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className={`w-full col-span-2 ${registering && 'animate-pulse'}`} disabled={registering}>{registering ? <LoaderCircle className='animate-spin' /> : 'Register'}</Button>
                                <div className="text-center text-sm md:col-span-2">
                                    already have an account?{" "}
                                    <Link to="/login" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Login;