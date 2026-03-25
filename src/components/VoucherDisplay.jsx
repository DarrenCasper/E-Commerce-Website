import { vouchers } from "@/data/voucher";
import { VoucherCard } from "./VoucherCard";
import { useState, useMemo } from "react";


export default function VouchersPage() {
 const [selectedCategory, setSelectedCategory] = useState("All")
 const [search, setSearch] = useState("")

 const categories = ["All", ...new Set(vouchers.map((p) => p.category))]

 const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
        const matchCategory =
        selectedCategory === "All" || voucher.category === selectedCategory

        const matchSearch = voucher.title
        .toLowerCase()
        .includes(search.toLowerCase())

        return matchCategory && matchSearch
    })
 },[selectedCategory, search])

  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Filter</h2>

            <div className="space-y-2">
                <label className="text-sm text-white/70">Category</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-3 py-2">
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
            </div>
        </aside>

        <div>
            <div className="mb-6 flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Currently Owned Vouchers</h1>
                    <p className="text-sm text-white/60">
                        Gunakan Voucher yang anda miliki untuk beli produk
                    </p>
                </div>
            </div>

            {filteredVouchers.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
                    No Vouchers found.
                </div>)
                : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredVouchers.map((voucher) => (
                            <VoucherCard key={voucher.id} voucher={voucher} />
                        ))}
                    </div>
                )
            }
        </div>
      </div>
      
    </section>
  );
}
