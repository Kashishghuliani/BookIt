// pages/checkout.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";
import { Experience, Slot, Booking } from "../types";

const CheckoutSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  qty: z.number().min(1, "Minimum quantity is 1"),
  promoCode: z.string().optional(),
});

type FormValues = z.infer<typeof CheckoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { slotId, expId } = router.query;
  const [slot, setSlot] = useState<Slot | null>(null);
  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoResult, setPromoResult] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: { qty: 1 },
  });

  const qty = watch("qty") || 1;

  // ✅ Load Experience + Slot
  useEffect(() => {
    if (!expId || !slotId) return;
    setLoading(true);

    api
      .get(`/api/experiences/${expId}`)
      .then((res) => {
        const body = res.data;
        const experience = body.experience || body;
        setExp(experience);
        const foundSlot =
          (body.slots || experience.slots || []).find(
            (x: any) => x._id === slotId
          ) || null;
        setSlot(foundSlot);
      })
      .catch(() => setError("Failed to load checkout data"))
      .finally(() => setLoading(false));
  }, [expId, slotId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
        <div className="animate-pulse text-gray-700 text-lg font-medium">
          Loading checkout details...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );

  if (!slot || !exp)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 font-medium">
          Missing slot or experience details.
        </p>
      </div>
    );

  const perPerson = exp.price + (slot.priceDelta ?? 0);
  const total = (promoResult?.newAmount ?? perPerson) * qty;

  // ✅ Promo apply
  const applyPromo = async (code: string) => {
    try {
      const res = await api.post("/api/promo/validate", {
        code,
        amount: perPerson,
      });
      setPromoResult(res.data);
    } catch {
      setPromoResult({ valid: false, message: "Invalid promo code" });
    }
  };

  // ✅ Booking handler
  const onSubmit = async (vals: FormValues) => {
    setBookingLoading(true);
    try {
      const payload: Booking = {
        slotId: slot._id,
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        qty: vals.qty,
        promoCode: vals.promoCode,
      };
      const res = await api.post("/api/bookings", payload);

      if (res.data.success) {
        router.push(`/result?bookingId=${res.data.booking._id}`);
      } else {
        alert(res.data.message || "Booking failed. Please try again.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Booking error");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-12 px-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
<div className="bg-blue-700 text-white p-6 text-center">
  <h1 className="text-3xl font-bold tracking-wide">
    Confirm Your Booking
  </h1>
  <p className="text-sm opacity-90 mt-1">
    Secure your spot for an unforgettable experience
  </p>
</div>

        {/* Experience Summary */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <img
              src={exp.images?.[0] || "/placeholder.jpg"}
              alt={exp.title}
              className="w-24 h-24 rounded-lg object-cover shadow-md"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {exp.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Slot:</strong>{" "}
                {new Date(slot.date).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1 font-medium text-gray-700">
                Per Person: ₹{perPerson.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter your email address"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              {...register("phone")}
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              {...register("qty", { valueAsNumber: true })}
              min={1}
              className="w-32 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.qty && (
              <p className="text-red-500 text-sm mt-1">{errors.qty.message}</p>
            )}
          </div>

          {/* Promo Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                {...register("promoCode")}
                placeholder="Enter promo code"
                className="flex-1 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
  type="button"
  onClick={() =>
    applyPromo(
      (document.querySelector(
        'input[name="promoCode"]'
      ) as HTMLInputElement)?.value
    )
  }
  className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
>
  Apply
</button>
            </div>
            {promoResult && (
              <p
                className={`text-sm mt-2 ${
                  promoResult.valid ? "text-green-600" : "text-red-500"
                }`}
              >
                {promoResult.valid
                  ? `Discount applied! New per-person price: ₹${promoResult.newAmount}`
                  : promoResult.message}
              </p>
            )}
          </div>

          {/* Total */}
          <div className="pt-4 border-t flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-800">
              Total: ₹{total.toFixed(0)}
            </p>
            <button
  type="submit"
  disabled={bookingLoading}
  className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
>
  {bookingLoading ? "Processing..." : "Confirm Booking"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
}
