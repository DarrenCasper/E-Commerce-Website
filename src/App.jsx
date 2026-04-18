import { Route, Routes } from "react-router-dom"
import { MainLayout } from "./layout/mainlayout"
import { ProductPage } from "./pages/ProductPage"
import { VoucherPage } from "./pages/VoucherPage"
import { CartsPage } from "./pages/CartPage"
import { CheckoutPage } from "./pages/CheckoutPage"
import { SignInPage } from "./pages/SignInPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { RegisterPage } from "./pages/RegisterPage"
import { AdminRoute } from "./Route/AdminRoute"
import { AdminProductCreatePage } from "./components/AdminProductCreatePage"
import { AdminVoucherCreatePage } from "./components/AdminVouchersCreatePage"

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} /> 

      <Route element={<MainLayout />}>
        <Route path="/" element={<ProductPage />} />
        <Route path="/voucher" element={<VoucherPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartsPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/*Admin only*/}
        <Route
          path="/admin/products/create"
          element={
            <AdminRoute>
              <AdminProductCreatePage/>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vouchers/create"
          element={
            <AdminRoute>
              <AdminVoucherCreatePage/>
            </AdminRoute>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;
