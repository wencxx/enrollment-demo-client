import { create } from 'zustand'
import { z } from 'zod'
import { loginSchema } from '@/FldrSchema/userSchema'
import axios from 'axios'
import { plsConnect } from "@/FldrClass/ClsGetConnection"

interface AuthState {
    currentUser: any | null
    token: string | null
    auth: boolean | null
    login: (credentials: z.infer<typeof loginSchema>, navigate: any) => Promise<void>
}

const useAuthStore = create<AuthState>((set) => ({
    currentUser: localStorage.getItem('token') || null,
    token: localStorage.getItem('token') || null,
    auth: !!localStorage.getItem('token'),
    login: async (credentials: z.infer<typeof loginSchema>, navigate) => {
        try {
            const res: any = await axios.get(`${plsConnect()}/API/WebAPI/tblUserAll/GetLoginAllUserInfo?strUserName=${credentials.username}&strPassword=${credentials.username}`)

            set({ currentUser: res.data })
            set({ auth: true })
            localStorage.setItem('user', JSON.stringify(res.data))
            localStorage.setItem('token', res.data.token)

            const role = res.data.groupName

            if (role === 'Admin') {
                navigate('/')
            } else {
                console.log(res)
            }
        } catch (error: unknown) {
            console.log(error)
        }
    },
    logout: async () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')

        set({ auth: false })
        set({ currentUser: null })
    }
}))

export default useAuthStore