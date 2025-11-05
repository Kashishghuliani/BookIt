// pages/result.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from "next/link";

export default function ResultPage() {
  const router = useRouter();
  const { bookingId } = router.query;
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    // Optionally, you can fetch full booking details from the backend later
    // api.get(`/api/bookings/${bookingId}`).then(res => setBooking(res.data.booking));

    setBooking({ _id: bookingId });
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">Processing your booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 px-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for booking with <span className="font-semibold text-blue-600">BookIt</span> 🎉
        </p>

        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
          <p className="text-gray-800 font-medium">Booking Details</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">Booking ID:</span> {booking?._id}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            A confirmation email has been sent with all the details.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
