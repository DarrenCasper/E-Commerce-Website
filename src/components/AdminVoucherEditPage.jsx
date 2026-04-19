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

export default function AdminVoucherEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    code: "",
    title: "",
    category: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase: "",
    max_discount: "",
    quota: "",
    used: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const [loadingVoucher, setLoadingVoucher] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/vouchers/${id}`);
        const data = await res.json();

        setForm({
          code: data.code || "",
          title: data.title || "",
          category: data.category || "",
          description: data.description || "",
          discount_type: data.discount_type || "percentage",
          discount_value: data.discount_value ?? "",
          min_purchase: data.min_purchase ?? "",
          max_discount: data.max_discount ?? "",
          quota: data.quota ?? "",
          used: data.used ?? "",
          start_date: data.start_date ? data.start_date.slice(0, 16) : "",
          end_date: data.end_date ? data.end_date.slice(0, 16) : "",
          status: data.status || "active",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load voucher data");
      } finally {
        setLoadingVoucher(false);
      }
    };

    fetchVoucher();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const formatDateTimeForMySQL = (value) => {
    if (!value) return null;
    return value.replace("T", " ") + ":00";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        discount_value: Number(form.discount_value),
        min_purchase: Number(form.min_purchase),
        max_discount: Number(form.max_discount),
        quota: Number(form.quota),
        used: Number(form.used),
        start_date: formatDateTimeForMySQL(form.start_date),
        end_date: formatDateTimeForMySQL(form.end_date),
      };

      const res = await fetch(`http://localhost:5000/api/vouchers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update voucher");
      }

      toast.success("Voucher updated");
      navigate("/voucher");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingVoucher) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-8 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          Loading voucher...
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-8 text-white">
      <Card className="border-white/10 bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Voucher</CardTitle>
          <CardDescription>
            Update voucher information for VoucherIn promotions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Voucher Details</h2>
                <p className="text-sm text-zinc-500">
                  Update the main voucher information below.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code</label>
                  <Input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="GAME10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Gaming 10% Off"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Gaming"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Type</label>
                  <select
                    name="discount_type"
                    value={form.discount_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="percentage">percentage</option>
                    <option value="fixed">fixed</option>
                    <option value="shipping">shipping</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the voucher benefit"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div>
                <h2 className="text-lg font-semibold">Discount Settings</h2>
                <p className="text-sm text-zinc-500">
                  Configure discount amount and purchase requirements.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Value</label>
                  <Input
                    type="number"
                    name="discount_value"
                    value={form.discount_value}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Purchase</label>
                  <Input
                    type="number"
                    name="min_purchase"
                    value={form.min_purchase}
                    onChange={handleChange}
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Discount</label>
                  <Input
                    type="number"
                    name="max_discount"
                    value={form.max_discount}
                    onChange={handleChange}
                    placeholder="20000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quota</label>
                  <Input
                    type="number"
                    name="quota"
                    value={form.quota}
                    onChange={handleChange}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div>
                <h2 className="text-lg font-semibold">Usage & Schedule</h2>
                <p className="text-sm text-zinc-500">
                  Update usage count, active period, and status.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Used</label>
                  <Input
                    type="number"
                    name="used"
                    value={form.used}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="datetime-local"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="datetime-local"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
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
                {submitting ? "Saving..." : "Update Voucher"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}