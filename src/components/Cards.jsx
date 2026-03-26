import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "./cartContext";
import { toast } from "sonner"

export function ProductCard({ product }) {
  const { addToCart} = useCart()

  return (
    <Card className="overflow-hidden rounded-2xl border border-white/10 bg-white text-black shadow-md transition-transform duration-200 hover:-translate-y-1">
      <div className="h-52 w-full overflow-hidden bg-zinc-200">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <CardHeader className="pb-2 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {product.category}
        </p>
        <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-zinc-600">{product.description}</p>
        <p className="mt-3 text-lg font-semibold text-zinc-900">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
      </CardContent>

      <CardFooter>
        <Button className="w-full rounded-xl"
                onClick={() => {
                  addToCart(product)
                  toast.success(`${product.title} is in the cart!`)}}>Buy Product</Button>
      </CardFooter>
    </Card>
  );
}