import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

export const MainLayout = () => {
  const { user, logOut, isAuthenticated } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white font-semibold"
      : "text-white/80 hover:text-blue-50 transition-colors";

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur">
        <div className="text-lg font-bold">VoucherIn</div>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/voucher" className={linkClass}>
            Vouchers
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>
            Checkout
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-white/80">
                Hi, {user.name}
              </span>
              <button
                onClick={logOut}
                className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-lg border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-white px-3 py-1 text-sm text-black"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};