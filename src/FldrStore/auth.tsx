import { create } from 'zustand'
import { z } from 'zod'
import { loginSchema } from '@/FldrSchema/userSchema'
import axios from 'axios'
import { plsConnect } from "@/FldrClass/ClsGetConnection"
import { User } from '@/FldrTypes/user'
import type { NavigateFunction } from "react-router-dom";

interface AuthState {
    currentUser: User | null
    token: string | null
    auth: boolean | null
    permissions: string[]
    loading: boolean
    login: (credentials: z.infer<typeof loginSchema>, navigate: NavigateFunction) => Promise<void>
    logout: () => void
    rehydrate: () => void
  }

type Permission = {
    objectName: string
}

  const useAuthStore = create<AuthState>((set) => ({
    currentUser: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token') || null,
    auth: !!localStorage.getItem('token'),
    permissions: localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions')!) : [],
    loading: true,
    rehydrate: () => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
        const token = localStorage.getItem('token')
        const permissions = localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions')!) : []
    
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
        const res = await axios.get(`${plsConnect()}/API/WebAPI/tblUserAll/GetLoginAllUserInfo?strUserName=${credentials.username}&strPassword=${credentials.password}`)
  
        const user = res.data
        const token = user.token
        const groupCode = user.groupCode
  
        const permRes = await axios.get(`${plsConnect()}/api/Permission/ListPermissions?groupCode=${groupCode}`)
        console.log("logging in as", user.groupName)
        const permissions = permRes.data.map((p: Permission) => p.objectName)
  
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('permissions', JSON.stringify(permissions))
  
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
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
      set({ auth: false, currentUser: null, permissions: [], loading: false })
    }
  }))

export default useAuthStore