import { create } from 'zustand'
import { z } from 'zod'
import { loginSchema } from '@/FldrSchema/userSchema'
import axios from 'axios'
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import { User } from '@/FldrTypes/user'

interface AuthState {
    currentUser: User | null
    token: string | null
    auth: boolean | null
    permissions: string[]
    loading: boolean
    login: (credentials: z.infer<typeof loginSchema>, navigate: any) => Promise<void>
    logout: () => void
    rehydrate: () => void
  }

  const useAuthStore = create<AuthState>((set) => ({
    currentUser: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')!) : null,
    token: sessionStorage.getItem('token') || null,
    auth: !!sessionStorage.getItem('token'),
    permissions: sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')!) : [],
    loading: true,
    rehydrate: () => {
        const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')!) : null
        const token = sessionStorage.getItem('token')
        const permissions = sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')!) : []
    
        set({
          currentUser: user,
          token: token,
          auth: !!token,
          permissions,
          loading: false,
        })
      },
  
    login: async (credentials, navigate) => {
      try {
        set({ loading: true })
        const res: any = await axios.get(`${plsConnect()}/API/WebAPI/tblUserAll/GetLoginAllUserInfo?strUserName=${credentials.username}&strPassword=${credentials.password}`)
  
        const user = res.data
        const token = user.token
        const groupCode = user.groupCode
  
        const permRes = await axios.get(`${plsConnect()}/api/Permission/ListPermissions?groupCode=${groupCode}`)
        // console.log("permissions para sa role:", permRes.data)
        console.log("logging in as", user.groupName)
        const permissions = permRes.data.map((p: any) => p.objectName)
  
        sessionStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('permissions', JSON.stringify(permissions))
  
        set({
          currentUser: user,
          token: token,
          auth: true,
          permissions,
          loading: false
        })
  
        const role = user.groupCode
        if (role === '01') navigate('/dashboard')
        else if (role === '02') navigate('/student/application')
      } catch (error) {
        console.error(error)
        set({ auth: false, loading: false })
      }
    },
  
    logout: () => {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('permissions')
      set({ auth: false, currentUser: null, permissions: [], loading: false })
    }
  }))

export default useAuthStore