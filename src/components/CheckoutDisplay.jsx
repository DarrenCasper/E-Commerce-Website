import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button"
import { useCart } from "./cartContext";
import { vouchers } from "@/data/voucher";

export default function CheckoutPageDisplay() {
    const {cartItems} = useCart()

    const [voucherCode, setVoucherCode] = useState("")
    const [appliedVoucher, setAppliedVoucher] = useState(null)
    const [message, setMessage] = useState("")

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)
    }, [cartItems])

    const matchedItems = useMemo(() => {
        if(!appliedVoucher) return []

        return cartItems.filter((item) => {
            return(
                appliedVoucher.category === "General" || item.category === appliedVoucher.category
            )
        })
    }, [cartItems, appliedVoucher])

    const matchedSubtotal = useMemo(() => {
        return matchedItems.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)
    }, [matchedItems])

    const discount = useMemo(() => {
        if(!appliedVoucher) return 0
        if(matchedItems.length === 0) return 0

        if(matchedSubtotal < appliedVoucher.minPurchase) return 0

        let calculatedDiscount = 0

        if(appliedVoucher.discountType === "percentage"){
            calculatedDiscount = matchedSubtotal * (appliedVoucher.discountValue / 100)
        }
        else if(appliedVoucher.discountType === "fixed"){
            calculatedDiscount = appliedVoucher.discountValue
        }
        else if(appliedVoucher.discountType === "shipping"){
            calculatedDiscount = appliedVoucher.discountValue
        }

        if(appliedVoucher.maxDiscount){
            calculatedDiscount = Math.min(calculatedDiscount, appliedVoucher.maxDiscount)
        }

        return Math.min(calculatedDiscount, matchedSubtotal)
    }, [appliedVoucher, matchedItems, matchedSubtotal])

    const finalTotal = subtotal - discount

    const handleApplyVoucher = () => {
        const foundVoucher  = vouchers.find((v) => v.code.toLowerCase() === voucherCode.toLowerCase())

        if(!foundVoucher){
            setAppliedVoucher(null)
            setMessage("Voucher not Found")
            return
        }
        if(foundVoucher.status !== "active"){
            setAppliedVoucher(null)
            setMessage("Voucher is not active")
            return
        }

        const today = new Date()
        const startDate = new Date(foundVoucher.startDate)
        const endDate = new Date(foundVoucher.endDate)

        if(today < startDate || today > endDate){
            setAppliedVoucher(null)
            setMessage("Voucher is not valid at this time")
            return
        }
        if(foundVoucher.used >= foundVoucher.quota){
            setAppliedVoucher(null)
            setMessage("Voucher quota has been fully used")
            return
        }

        const categoryMatchedItems = cartItems.filter((item) => {
            return(
                foundVoucher.category === "General" || item.category === foundVoucher.category
            )
        })
        if(categoryMatchedItems.length === 0){
            setAppliedVoucher(null)
            setMessage("No items in cart match voucher category")
            return
        }

        const categorySubtotal = categoryMatchedItems.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)

        if(categorySubtotal < foundVoucher.minPurchase){
            setAppliedVoucher(null)
            setMessage(`Minimum purchase for this voucher is ${foundVoucher.minPurchase}`)
            return
        }
        setAppliedVoucher(foundVoucher)
        setMessage(`Voucher ${foundVoucher.code} applied successfully!`)
    }

    return(
        <section className="mx-auto max-w-5xl px-6 py-8 text-white">
            <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

            {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
                    Your cart is empty.
                </div>
            ):
            (
                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">{item.title}</h2>
                                            <p className="text-sm text-white/70">{item.category}</p>
                                            <p className="text-sm text-white/70">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">
                                            Rp{(item.price * item.quantity).toLocaleString("id-ID")}
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
                                placeholder="Enter voucher code"
                                className="w-full rounded-xl border border-white/10 bg-black px-4 py-2 text-white outline-none">     
                            </input>
                            <Button className="w-full rounded-xl" onClick={handleApplyVoucher}>Apply Voucher</Button>
                            {message && (<p className="text-sm text-white/70">{message}</p>)}

                            {appliedVoucher && (
                                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm">
                                    <p className="font-medium">{appliedVoucher.code}</p>
                                    <p>Category: {appliedVoucher.category}</p>
                                    <p>
                                        Discount: {appliedVoucher.discountValue}
                                        {appliedVoucher.discountType === "percentage" ? "%" : ""}
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
                                <span className="font-medium">Rp{subtotal.toLocaleString("id-ID")}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Discount</span>
                                <span className="font-medium text-green-500">- Rp{discount.toLocaleString("id-ID")}</span>
                            </div>

                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>Rp {finalTotal.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                        <Button className="mt-6 w-full rounded-xl">
                            Place Order
                        </Button>
                    </div>
                </div>
            )}
        </section>
    )
}