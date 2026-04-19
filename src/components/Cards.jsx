import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "./cartContext";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ProductCard({ product, onDelete }) {
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${product.id_product}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Product deleted");

      // update UI
      onDelete(product.id_product);
    } catch (err) {
      toast.error(err.message);
    }
  };

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
          {product.category_name} {/*  dari backend */}
        </p>
        <CardTitle className="line-clamp-2 text-lg">
          {product.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-zinc-600">{product.description}</p>
        <p className="mt-3 text-lg font-semibold text-zinc-900">
          Rp {Number(product.price).toLocaleString("id-ID")}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {/* USER BUTTON */}
        <Button
          className="w-full rounded-xl"
          onClick={() => {
            addToCart(product);
          }}
        >
          Buy Product
        </Button>

        {/* ADMIN BUTTON */}
        {user?.role === "admin" && (
          <div className="flex flex-col w-full gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                navigate(`/admin/products/edit/${product.id_product}`)
              }
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              className="w-full text-red-700"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}