import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
const AuthContext = createContext();
import { signUp } from '../firebase'

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return unsubscribe
    }, [])

    async function registerUser(email, password) {
        return signUp(email, password)
    }

    //whatever you pass into value can be accessed from other pages e.g const { registerUser } = useAuth()
    const value = {
        currentUser,
        registerUser
    }
    
  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
