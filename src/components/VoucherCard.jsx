import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VoucherCard({ voucher }) {
  return (
    <Card className="w-full rounded-2xl border border-white/10 bg-white/5 text-white shadow-sm card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">{voucher.code}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Title:</span> {voucher.title}
        </div>

        <div>
          <span className="font-semibold">Category:</span> {voucher.category}
        </div>

        <div>
          <span className="font-semibold">Period:</span> {voucher.startDate} - {voucher.endDate}
        </div>

        <div>
          <span className="font-semibold">Max Discount: Rp {voucher.maxDiscount.toLocaleString("id-ID")}</span>
        </div>

        <div>
          <span className="font-semibold">Min Purchase: Rp {voucher.minPurchase.toLocaleString("id-ID")}</span>
        </div>
      </CardContent>
    </Card>
  );
}