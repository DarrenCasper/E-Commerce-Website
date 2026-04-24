import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const [summary, setSummary] = useState(null);
  const [topVouchers, setTopVouchers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesDaily, setSalesDaily] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [
        summaryRes,
        topVouchersRes,
        topProductsRes,
        salesDailyRes,
        orderStatusRes,
        ordersRes,
      ] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard/summary", { headers }),
        fetch("http://localhost:5000/api/dashboard/top-vouchers", { headers }),
        fetch("http://localhost:5000/api/dashboard/top-products", { headers }),
        fetch("http://localhost:5000/api/dashboard/sales-by-period/daily", {
          headers,
        }),
        fetch("http://localhost:5000/api/dashboard/order-status", { headers }),
        fetch("http://localhost:5000/api/orders", { headers }),
      ]);

      setSummary(await summaryRes.json());
      setTopVouchers(await topVouchersRes.json());
      setTopProducts(await topProductsRes.json());
      setSalesDaily(await salesDailyRes.json());
      setOrderStatus(await orderStatusRes.json());
      setOrders(await ordersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  const updateOrderStatus = async (idOrder, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${idOrder}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      toast.success("Order status updated");
      fetchDashboard();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-8 text-white">
        Loading dashboard...
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-white/60">
          Monitor voucher usage, promo sales, revenue, and orders.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Users" value={summary?.total_users} />
        <SummaryCard title="Products" value={summary?.total_products} />
        <SummaryCard title="Vouchers" value={summary?.total_vouchers} />
        <SummaryCard title="Orders" value={summary?.total_orders} />
        <SummaryCard title="Items Sold" value={summary?.total_items_sold} />
        <SummaryCard
          title="Revenue"
          value={`Rp ${Number(summary?.total_revenue || 0).toLocaleString(
            "id-ID"
          )}`}
        />
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-70"
              config={{
                total_revenue: { label: "Revenue" },
              }}
            >
              <AreaChart data={salesDaily}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="sales_date"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="total_revenue"
                  strokeWidth={2}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Top Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-70"
              config={{
                total_used: { label: "Used" },
              }}
            >
              <BarChart data={topVouchers.slice(0, 5)}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="code" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total_used" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Top Products With Promo</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-70"
              config={{
                total_quantity_sold_with_voucher: { label: "Sold" },
              }}
            >
              <BarChart data={topProducts.slice(0, 5)}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="title" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total_quantity_sold_with_voucher" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-70"
              config={{
                total: { label: "Orders" },
              }}
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={orderStatus}
                  dataKey="total"
                  nameKey="status"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                    >
                      {orderStatus.map((entry, index) => {
                        let color = "#facc15"; // yellow default
                        if (entry.status === "completed") color = "#22c55e"; // green
                        else if (entry.status === "cancelled") color = "#ef4444"; // red
                        else if (entry.status === "paid") color = "#3b82f6"; // blue
                        return <Cell key={entry.status} fill={color} />;
                      })}
                    </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-4 flex flex-wrap gap-2">
              {orderStatus.map((item) => (
                <span
                  key={item.status}
                  className="rounded-full border px-3 py-1 text-xs"
                >
                  {item.status}: {item.total}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Order</th>
                  <th className="py-3">User</th>
                  <th className="py-3">Voucher</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id_order} className="border-b">
                    <td className="py-3 font-medium">#{order.id_order}</td>
                    <td className="py-3">
                      <p>{order.user_name}</p>
                      <p className="text-xs text-zinc-500">
                        {order.user_email}
                      </p>
                    </td>
                    <td className="py-3">{order.voucher_code || "-"}</td>
                    <td className="py-3">
                      {new Date(order.order_date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3">
                      Rp {Number(order.total_netto).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateOrderStatus(order.id_order, "paid")
                          }
                        >
                          Paid
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(order.id_order, "completed")
                          }
                        >
                          Success
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateOrderStatus(order.id_order, "cancelled")
                          }
                        >
                          Failed
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-zinc-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SummaryCard({ title, value }) {
  return (
    <Card className="bg-white text-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold">{value ?? 0}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }) {
  const className =
    status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
      ? "bg-red-100 text-red-700"
      : status === "paid"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {status}
    </span>
  );
}