import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    id_category: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          image: data.image || "",
          id_category: data.id_category || "",
          stock: data.stock || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product data");
      } finally {
        setLoadingProduct(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          id_category: Number(form.id_category),
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update product");

      toast.success("Product updated");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-8 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          Loading product...
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-8 text-white">
      <Card className="border-white/10 bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Product</CardTitle>
          <CardDescription>
            Update product information for VoucherIn admin panel.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Product Details</h2>
                <p className="text-sm text-zinc-500">
                  Update the product information below.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="id_category"
                    value={form.id_category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                    disabled={loadingCategories}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option
                        key={category.id_category}
                        value={category.id_category}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Title</label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Steam Wallet 60K"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Voucher game digital"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Image URL / Path</label>
                  <Input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="/img/steamcard.png"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div>
                <h2 className="text-lg font-semibold">Pricing & Stock</h2>
                <p className="text-sm text-zinc-500">
                  Update price and inventory.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="60000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}