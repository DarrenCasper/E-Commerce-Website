import { createContext, useContext, useState, useEffect} from "react"

const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")

        if(savedToken && savedUser){
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }

        setLoading(false)
    }, [])

    const login = (data) => {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setToken(data.token)
        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        setUser(null)
        setToken(null)
    }


    return(
        <AuthContext.Provider value={
            {
                user,
                token,
                isAuthenticated: !!token,
                login,
                logout,
                loading,
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}