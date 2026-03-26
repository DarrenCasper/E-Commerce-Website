import { createContext, useContext, useState} from "react"

const CartContext = createContext()

export function CartProvider({children}) {
    const [cartItems, setCartItems] = useState([])

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id)

            if(existingItem){
                return prev.map((item) => 
                item.id === product.id ? {...item, quantity: item.quantity + 1}
                : item)
            }

            return [...prev, {...product, quantity: 1}]
        })
    } 

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId))
    }

    const decreaseQuantity = (productId) => {
        setCartItems((prev) => {
            return prev.map((item) => {
                if(item.id === productId){
                    return { ...item, quantity: item.quantity - 1}
                }
                return item
            })
            .filter((item) => item.quantity > 0)
        })
    }

    return(
        <CartContext.Provider value={{cartItems, addToCart, removeFromCart, decreaseQuantity}}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    return useContext(CartContext)
}