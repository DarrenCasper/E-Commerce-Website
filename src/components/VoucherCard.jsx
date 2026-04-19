import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function VoucherCard({ voucher, onDelete }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm("Delete this voucher?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/vouchers/${voucher.id_voucher}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Voucher deleted");

      onDelete(voucher.id_voucher);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-white/10 bg-white/5 text-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">
          {voucher.code}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div><b>Title:</b> {voucher.title}</div>
        <div><b>Category:</b> {voucher.category}</div>
        <div><b>Period:</b> {voucher.start_date?.slice(0, 10)} - {voucher.end_date?.slice(0, 10)}</div>
        <div><b>Max:</b> Rp {Number(voucher.max_discount)?.toLocaleString("id-ID")}</div>
        <div><b>Min:</b> Rp {Number(voucher.min_purchase)?.toLocaleString("id-ID")}</div>

        {/*  ADMIN BUTTON */}
        {user?.role === "admin" && (
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full text-black hover:text-gray-700"
              onClick={() =>
                navigate(`/admin/vouchers/edit/${voucher.id_voucher}`)
              }
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              className="w-full text-red-400"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}