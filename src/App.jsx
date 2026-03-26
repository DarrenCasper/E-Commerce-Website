import { Route, Routes } from "react-router-dom"
import { MainLayout } from "./layout/mainlayout"
import { ProductPage } from "./pages/ProductPage"
import { VoucherPage } from "./pages/VoucherPage"
import { CartsPage } from "./pages/CartPage"

function App() {
  
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<ProductPage/>}/> 
        <Route path="/voucher" element={<VoucherPage/>}/>
        <Route path="/cart" element={<CartsPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
