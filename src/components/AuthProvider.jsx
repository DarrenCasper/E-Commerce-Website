import { createContext, useContext, useState} from "react"

const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user")
        return savedUser ? JSON.parse(savedUser) : null
    })

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const register = (userData) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logOut = () => {
        setUser(null)
        localStorage.removeItem("user")
    }
    return(
        <AuthContext.Provider value={
            {
                user,
                login,
                register, 
                logOut,
                isAuthenticated: !!user
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}