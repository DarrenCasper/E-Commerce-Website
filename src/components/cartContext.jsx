import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "./AuthProvider"

const CartContext = createContext()

export function CartProvider({ children }) {
    const { token, isAuthenticated, loading: authLoading } = useAuth()

    const [cart, setCart] = useState(null)
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchCart = async () => {
        if (!token) {
            setCart(null)
            setCartItems([])
            return
        }

        try {
            setLoading(true)

            const res = await fetch("http://localhost:5000/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "failed to fetch cart")
            }

            setCart(data.cart)
            setCartItems(Array.isArray(data.items) ? data.items : [])
        }
        catch (err) {
            console.error("Fetch cart Error: ", err)
            toast.error(err.message || "Failed to fetch cart")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated) {
                fetchCart()
            }
            else {
                setCart(null)
                setCartItems([])
            }
        }
    }, [token, isAuthenticated, authLoading])

    const addToCart = async (product) => {
        if (!token) {
            toast.error("Please Sign in First!")
            return
        }
        try {
            const res = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_product: product.id_product,
                    quantity: 1
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to add to cart")
            }

            await fetchCart()
            toast.success(`${product.title} is in the cart!`)
        }
        catch (err) {
            console.error("Add to cart Error: ", err)
            toast.error(err.message || "Failed to add to cart")
        }
    }

    const increaseQuantity = async (item) => {
        if (!token) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/cart/item/${item.id_cart_item}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: item.quantity + 1,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update quantity");
            }

            await fetchCart();
        } catch (err) {
            console.error("Increase quantity error:", err);
            toast.error(err.message || "Failed to update quantity");
        }
    };

    const decreaseQuantity = async (item) => {
        if (!token) return;

        try {
            if (item.quantity <= 1) {
                await removeFromCart(item.id_cart_item);
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/cart/item/${item.id_cart_item}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: item.quantity - 1,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update quantity");
            }

            await fetchCart();
        } catch (err) {
            console.error("Decrease quantity error:", err);
            toast.error(err.message || "Failed to update quantity");
        }
    };

    const removeFromCart = async (id_cart_item) => {
        if (!token) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/cart/item/${id_cart_item}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to remove item");
            }

            await fetchCart();
            toast.success("Item removed from cart");
        } catch (err) {
            console.error("Remove from cart error:", err);
            toast.error(err.message || "Failed to remove item");
        }
    };

    const clearCart = async () => {
        if (!token) return;

        try {
            const res = await fetch("http://localhost:5000/api/cart/clear", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to clear cart");
            }

            await fetchCart();
            toast.success("Cart cleared");
        } catch (err) {
            console.error("Clear cart error:", err);
            toast.error(err.message || "Failed to clear cart");
        }
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + Number(item.subtotal), 0
    )

    return(
        <CartContext.Provider
        value={{
            cart,
            cartItems,
            totalPrice,
            loading,
            fetchCart,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}