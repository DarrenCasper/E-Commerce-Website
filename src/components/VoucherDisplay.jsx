import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VoucherCard } from "./VoucherCard";
import { useAuth } from "@/components/AuthProvider";

export default function VouchersPage() {
  const { user } = useAuth();

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/vouchers");
        const data = await res.json();
        setVouchers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch vouchers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleDeleteVoucher = (id) => {
    setVouchers((prev) => prev.filter((v) => v.id_voucher !== id));
  };

  const categories = [
    "All",
    ...new Set(vouchers.map((v) => v.category)),
  ];

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      const matchCategory =
        selectedCategory === "All" ||
        voucher.category === selectedCategory;

      const matchSearch = voucher.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [vouchers, selectedCategory, search]);

  if (loading) {
    return <div className="py-10 text-center text-white">Loading vouchers...</div>;
  }

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
              className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Available Vouchers</h1>
              <p className="text-sm text-white/60">
                Gunakan voucher yang tersedia untuk beli produk
              </p>
            </div>

            {user?.role === "admin" && (
              <Link
                to="/admin/vouchers/create"
                className="rounded-xl bg-white px-4 py-2 text-center text-black"
              >
                Create Voucher
              </Link>
            )}
          </div>

          {filteredVouchers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
              No vouchers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredVouchers.map((voucher) => (
                <VoucherCard
                  key={voucher.id_voucher}
                  voucher={voucher}
                  onDelete={handleDeleteVoucher}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}