import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

export function SignInPage() {
    const navigate = useNavigate()
    const {login} = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        const dummyUser = {
            name: email.split("@")[0],
            email,
        }
        login(dummyUser)
        navigate("/")
    }

    return(
        <section className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
                <h1 className="mb-6 text-3xl font-bold">Sign In</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input  
                        type="email"
                        placeholder="enter your email"
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type="password"
                        placeholder="enter your password"
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />

                    <Button type="submit" className="w-full rounded-xl">Sign In</Button>
                </form>

                <p className="mt-4 text-sm text-white/70">
                    Don&apos;t have an accout? {" "}
                    <Link to="/register" className="underline">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    )
}