import { Button } from "@/components/ui/button";
import { useCart } from "./cartContext";

export default function CartPage() {
  const {
    cartItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();

  return (
    <section className="mx-auto max-w-5xl px-6 py-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        {cartItems.length > 0 && (
          <Button className="text-red-400" variant="destructive" onClick={clearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
          Loading cart...
        </div>
      ) : cartItems.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
          Cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id_cart_item}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-white/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-white/70">{item.category_name}</p>
                  <p className="text-sm text-white/70">
                    Rp {Number(item.price_at_time).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:ml-auto md:items-end">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => decreaseQuantity(item)}
                    variant="outline"
                    className="h-9 w-9 border-white/20 bg-transparent p-0 text-white hover:bg-white/10"
                  >
                    -
                  </Button>

                  <span className="min-w-8 text-center text-base font-medium">
                    {item.quantity}
                  </span>

                  <Button
                    onClick={() => increaseQuantity(item)}
                    variant="outline"
                    className="h-9 w-9 border-white/20 bg-transparent p-0 text-white hover:bg-white/10"
                  >
                    +
                  </Button>
                </div>

                <p className="text-right text-sm font-medium">
                  Subtotal: Rp {Number(item.subtotal).toLocaleString("id-ID")}
                </p>

                <Button
                  onClick={() => removeFromCart(item.id_cart_item)}
                  className="rounded-xl bg-red-500 text-white hover:bg-red-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold">
                Rp {Number(totalPrice).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}