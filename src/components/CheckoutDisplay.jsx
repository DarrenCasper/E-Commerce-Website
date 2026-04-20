import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cartContext";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export default function CheckoutPageDisplay() {
    const { cartItems, totalPrice, fetchCart } = useCart();
    const { token } = useAuth();

    const [vouchers, setVouchers] = useState([]);
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/vouchers");
                const data = await res.json();
                setVouchers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load vouchers");
            } finally {
                setLoadingVouchers(false);
            }
        };

        fetchVouchers();
    }, []);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);
    }, [cartItems]);

    const matchedItems = useMemo(() => {
        if (!appliedVoucher) return [];

        return cartItems.filter((item) => {
            return (
                appliedVoucher.category === "General" ||
                item.category_name === appliedVoucher.category
            );
        });
    }, [cartItems, appliedVoucher]);

    const matchedSubtotal = useMemo(() => {
        return matchedItems.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);
    }, [matchedItems]);

    const discount = useMemo(() => {
        if (!appliedVoucher) return 0;
        if (matchedItems.length === 0) return 0;
        if (matchedSubtotal < Number(appliedVoucher.min_purchase)) return 0;

        let calculatedDiscount = 0;

        if (appliedVoucher.discount_type === "percentage") {
            calculatedDiscount =
                matchedSubtotal * (Number(appliedVoucher.discount_value) / 100);
        } else if (appliedVoucher.discount_type === "fixed") {
            calculatedDiscount = Number(appliedVoucher.discount_value);
        } else if (appliedVoucher.discount_type === "shipping") {
            calculatedDiscount = Number(appliedVoucher.discount_value);
        }

        if (appliedVoucher.max_discount) {
            calculatedDiscount = Math.min(
                calculatedDiscount,
                Number(appliedVoucher.max_discount)
            );
        }

        return Math.min(calculatedDiscount, matchedSubtotal);
    }, [appliedVoucher, matchedItems, matchedSubtotal]);

    const finalTotal = subtotal - discount;

    const handleApplyVoucher = () => {
        const foundVoucher = vouchers.find(
            (v) => v.code.toLowerCase() === voucherCode.trim().toLowerCase()
        );

        if (!foundVoucher) {
            setAppliedVoucher(null);
            setMessage("Voucher not found");
            return;
        }

        if (foundVoucher.status !== "active") {
            setAppliedVoucher(null);
            setMessage("Voucher is not active");
            return;
        }

        const today = new Date();
        const startDate = new Date(foundVoucher.start_date);
        const endDate = new Date(foundVoucher.end_date);

        if (today < startDate || today > endDate) {
            setAppliedVoucher(null);
            setMessage("Voucher is not valid at this time");
            return;
        }

        if (Number(foundVoucher.used) >= Number(foundVoucher.quota)) {
            setAppliedVoucher(null);
            setMessage("Voucher quota has been fully used");
            return;
        }

        const categoryMatchedItems = cartItems.filter((item) => {
            return (
                foundVoucher.category === "General" ||
                item.category_name === foundVoucher.category
            );
        });

        if (categoryMatchedItems.length === 0) {
            setAppliedVoucher(null);
            setMessage("No items in cart match voucher category");
            return;
        }

        const categorySubtotal = categoryMatchedItems.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);

        if (categorySubtotal < Number(foundVoucher.min_purchase)) {
            setAppliedVoucher(null);
            setMessage(
                `Minimum purchase for this voucher is Rp ${Number(
                    foundVoucher.min_purchase
                ).toLocaleString("id-ID")}`
            );
            return;
        }

        setAppliedVoucher(foundVoucher);
        setMessage(`Voucher ${foundVoucher.code} applied successfully!`);
    };

    const handlePlaceOrder = async () => {
        try {
            setSubmitting(true);

            const res = await fetch("http://localhost:5000/api/orders/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_voucher: appliedVoucher ? appliedVoucher.id_voucher : null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Checkout failed");
            }

            toast.success("Order placed successfully");
            setAppliedVoucher(null);
            setVoucherCode("");
            setMessage("");
            await fetchCart();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="mx-auto max-w-5xl px-6 py-8 text-white">
            <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

            {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
                    Your cart is empty.
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id_cart_item}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.title}</h2>
                                        <p className="text-sm text-white/70">
                                            {item.category_name}
                                        </p>
                                        <p className="text-sm text-white/70">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-medium">
                                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-5">
                        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                        <div className="mb-4 space-y-3">
                            <input
                                type="text"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                placeholder={
                                    loadingVouchers ? "Loading vouchers..." : "Enter voucher code"
                                }
                                className="w-full rounded-xl border border-white/10 bg-black px-4 py-2 text-white outline-none"
                                disabled={loadingVouchers}
                            />

                            <Button
                                className="w-full rounded-xl"
                                onClick={handleApplyVoucher}
                                disabled={loadingVouchers}
                            >
                                Apply Voucher
                            </Button>

                            {message && <p className="text-sm text-white/70">{message}</p>}

                            {appliedVoucher && (
                                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm">
                                    <p className="font-medium">{appliedVoucher.code}</p>
                                    <p>Category: {appliedVoucher.category}</p>
                                    <p>
                                        Discount: {appliedVoucher.discount_value}
                                        {appliedVoucher.discount_type === "percentage" ? "%" : ""}
                                    </p>
                                    <p>
                                        Applies to subtotal: Rp{" "}
                                        {matchedSubtotal.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 border-t border-white/10 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Subtotal</span>
                                <span className="font-medium">
                                    Rp {subtotal.toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Discount</span>
                                <span className="font-medium text-green-500">
                                    - Rp {discount.toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>Rp {finalTotal.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        <Button
                            className="mt-6 w-full rounded-xl"
                            onClick={handlePlaceOrder}
                            disabled={submitting}
                        >
                            {submitting ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
}