import { Button } from "@/components/ui/button"
import { useCart } from "./cartContext"

export default function CartPage(){
    const {cartItems, addToCart, removeFromCart, decreaseQuantity} = useCart()

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity,0)


    return(
    <section className="mx-auto max-w-5xl px-6 py-8 text-white">
        <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>

        {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
                Cart is empty.
            </div>
        ) : (
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div key={item.id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 overflow-hidden rounded-xl bg-white/10">
                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover object-center"></img>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold">{item.title}</h2>
                                    <p className="text-sm text-white/70">{item.category}</p>
                                    <p className="text-sm text-white/70">Rp {item.price.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 md:items-end md:ml-auto">
                                <div className="flex items-center gap-2">
                                    <Button onClick={() => decreaseQuantity(item.id)}
                                        variant="outline"
                                        className="h-9 w-9 border-white/20 bg-transparent p-0 text-white hover:bg-white/10">-</Button>

                                    <span className="min-w-8 text-center text-base font-medium">
                                        {item.quantity}
                                    </span>

                                    <Button onClick={() => addToCart(item)}
                                        variant="outline"
                                        className="h-9 w-9 border-white/20 bg-transparent p-0 text-white hover:bg-white/10">+</Button>
                                </div>

                                <p className="text-sm font-medium">
                                    Subtotal: Rp{" "}
                                    {(item.price * item.quantity).toLocaleString("id-ID")}
                                </p>

                                <Button onClick={() => removeFromCart(item.id)}
                                    className="rounded-xl bg-red-500 text-white hover:bg-red-600">
                                        Remove
                                    </Button>
                            </div>
                    </div>
                ))}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-xl font-bold">
                            Rp {totalPrice.toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>
            </div>
        )}
    </section>
)
}

