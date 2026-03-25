import { Route, Routes } from "react-router-dom"
import { MainLayout } from "./layout/mainlayout"
import { ProductPage } from "./pages/ProductPage"
import { VoucherPage } from "./pages/VoucherPage"

function App() {
  
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<ProductPage/>}/> 
        <Route path="/voucher" element={<VoucherPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
