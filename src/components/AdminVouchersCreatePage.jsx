import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

const voucherSchema = z.object({
  code: z.string().min(2, "Code is required"),
  title: z.string().min(2, "Title is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed", "shipping"]),
  discount_value: z.coerce.number().positive(),
  min_purchase: z.coerce.number().min(0),
  max_discount: z.coerce.number().min(0),
  quota: z.coerce.number().int().min(1),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  status: z.enum(["active", "inactive"]),
});

export function AdminVoucherCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: "",
      title: "",
      category: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_purchase: 0,
      max_discount: 0,
      quota: 1,
      start_date: "",
      end_date: "",
      status: "active",
    },
  });

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          used: 0,
          start_date: values.start_date.replace("T", " ") + ":00",
          end_date: values.end_date.replace("T", " ") + ":00",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create voucher");
      }

      toast("Voucher created successfully");
      navigate("/voucher");
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
          <CardTitle className="text-2xl">Create Voucher</CardTitle>
          <CardDescription>
            Add a new voucher for VoucherIn promotions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input {...register("code")} placeholder="GAME10" />
                {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...register("title")} placeholder="Gaming 10% Off" />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input {...register("category")} placeholder="Gaming" />
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Type</label>
                <select
                  {...register("discount_type")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="percentage">percentage</option>
                  <option value="fixed">fixed</option>
                  <option value="shipping">shipping</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Value</label>
                <Input type="number" {...register("discount_value")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Purchase</label>
                <Input type="number" {...register("min_purchase")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Discount</label>
                <Input type="number" {...register("max_discount")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quota</label>
                <Input type="number" {...register("quota")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="datetime-local" {...register("start_date")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="datetime-local" {...register("end_date")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea {...register("description")} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Create Voucher"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}