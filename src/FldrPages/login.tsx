import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { loginSchema } from '@/FldrSchema/userSchema'
import { LoaderCircle } from 'lucide-react'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import useAuthStore from "@/FldrStore/auth"

function Login({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const navigate = useNavigate()
    const store = useAuthStore()
    const authenticated = store.auth

    const [loggingIn, setLoggingIn] = useState<boolean>(false)
    const [err, setErr] = useState<string | null>(null)

    const handleLogin = async (values: z.infer<typeof loginSchema>) => {
        try {
            setLoggingIn(true)
            await store.login(values, navigate)
        } catch (error: unknown) {
            if(error instanceof Error){
                setErr(error.message)
                console.log(error)
            }else{
                setErr('An error occurred')
            }
        } finally {
            setLoggingIn(false)
        }
    }

    useEffect(() => {
        if (authenticated) {
            const role = store.currentUser?.groupName
            if (role === 'Admin') {
                navigate('/')
            } else if (role === 'Student') {
                navigate('/student/profile')
            } else {
                navigate('/')
            }
        }
    }, [authenticated, navigate, store.currentUser])

    if(authenticated) return null

    return (
        <div className="flex items-center justify-center h-screen w-screen p-10">
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-start">
                        <CardTitle className="text-xl">Welcome back</CardTitle>
                        <CardDescription>Enter your credentials below to login to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            {err && (
                                <div className="border flex mb-1">
                                    <span className="bg-red-500 pl-2 rounded w-full text-white">{ err }</span>
                                </div>
                            )}
                            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="username"
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
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className={`w-full ${loggingIn && 'animate-pulse'}`} disabled={loggingIn}>{loggingIn ? <LoaderCircle className='animate-spin' /> : 'Login'}</Button>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/register" className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By clicking continue, you agree to our <Dialog>
                        <DialogTrigger><a>Terms of service</a></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Terms of service</DialogTitle>
                            </DialogHeader>
                            <div className="h-[70dvh] overflow-y-scroll">
                                <p>By accessing or using our system, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not use the System.</p>
                                <br />
                                <h2>1. Eligibility</h2>
                                <p>The System is intended for use by [specify target audience, e.g., students, parents, administrators]. By using the System, you confirm that you meet the eligibility requirements set forth.</p>
                                <br />
                                <h2>2. Account Registration</h2>
                                <p>To use the System, you may be required to create an account. You agree to provide accurate and up-to-date information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                                <br />
                                <h2>3. Use of the System</h2>
                                <p>You agree to use the System solely for lawful purposes and in accordance with these Terms. You may not:</p>
                                <ul>
                                    <li>Engage in any activity that may disrupt or interfere with the System.</li>
                                    <li>Attempt to access unauthorized parts of the System.</li>
                                    <li>Use the System for fraudulent or illegal purposes.</li>
                                </ul>
                                <br />
                                <h2>4. Privacy and Data Collection</h2>
                                <p>Your use of the System is subject to our <a href="[Privacy Policy URL]">Privacy Policy</a>. By using the System, you consent to the collection and processing of your personal data as outlined in the Privacy Policy.</p>
                                <br />
                                <p>If you have any questions or concerns regarding these Terms, please contact us at <a href="mailto:[email/contact information]">cbyteprog@gmail.com</a>.</p>
                            </div>
                            <div className="flex justify-end">
                                <DialogTrigger asChild>
                                    <Button className="cursor-pointer w-fit">I agree</Button>
                                </DialogTrigger>
                            </div>
                        </DialogContent>
                    </Dialog>{" "}
                    and <a href="#">Privacy Policy</a>.
                </div>
            </div>
        </div>
    );
}

export default Login;