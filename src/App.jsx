import { Route, Routes } from "react-router-dom"
import { MainLayout } from "./layout/mainlayout"
import { ProductPage } from "./pages/ProductPage"

function App() {
  
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<ProductPage/>} /> 
      </Route>
    </Routes>
  )
}

export default App
