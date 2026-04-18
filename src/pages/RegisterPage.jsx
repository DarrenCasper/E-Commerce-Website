import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Register failed");
      }

      setSuccessMessage("Register successful. Please sign in.");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (err) {
      console.error("Register error:", err);
      setErrorMessage(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur md:grid-cols-2">
        <div className="flex flex-col justify-between border-b border-white/10 bg-linear-to-br from-zinc-900 via-black to-zinc-950 p-8 md:border-b-0 md:border-r">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-white/50">
              VoucherIn
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Create your account and unlock better deals.
            </h1>
            <p className="max-w-md text-sm leading-6 text-white/70">
              Register to save your cart, apply vouchers by category, and enjoy a
              smoother checkout experience on VoucherIn.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium text-white">Why Register?</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>• Save products to your cart</li>
              <li>• Access exclusive voucher offers</li>
              <li>• Faster checkout and order tracking</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-8 text-black md:p-10">
          <div className="mx-auto w-full max-w-md">
            <h2 className="mb-2 text-3xl font-bold">Register</h2>
            <p className="mb-8 text-sm text-zinc-600">
              Create your VoucherIn account to start saving on your favorite products.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl bg-black py-6 text-white hover:bg-zinc-800"
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-black underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}