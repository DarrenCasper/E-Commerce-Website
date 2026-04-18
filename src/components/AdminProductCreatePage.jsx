import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

const productSchema = z.object({
  id_category: z.string().min(1, "Category is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export function AdminProductCreatePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id_category: "",
      title: "",
      description: "",
      image: "",
      price: "",
      stock: 0,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        toast("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_category: Number(values.id_category),
          title: values.title,
          description: values.description || null,
          image: values.image || null,
          price: values.price,
          stock: values.stock,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      toast("Product created successfully");
      navigate("/");
    } catch (error) {
      toast(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-8 text-white">
      <Card className="border-white/10 bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl">Create Product</CardTitle>
          <CardDescription>
            Add a new product for VoucherIn admin panel.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Product Details</h2>
                <p className="text-sm text-zinc-500">
                  Fill in the product information below.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    {...register("id_category")}
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
                  {errors.id_category && (
                    <p className="text-sm text-red-500">
                      {errors.id_category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Title</label>
                  <Input
                    placeholder="Steam Wallet 60K"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Voucher game digital"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Image URL / Path</label>
                  <Input
                    placeholder="/img/steamcard.png"
                    {...register("image")}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div>
                <h2 className="text-lg font-semibold">Pricing & Stock</h2>
                <p className="text-sm text-zinc-500">
                  Configure price and inventory.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input type="number" placeholder="60000" {...register("price")} />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input type="number" placeholder="20" {...register("stock")} />
                  {errors.stock && (
                    <p className="text-sm text-red-500">
                      {errors.stock.message}
                    </p>
                  )}
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
                {submitting ? "Saving..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}