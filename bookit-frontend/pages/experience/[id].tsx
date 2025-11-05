// pages/experience/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Experience, Slot } from "../../types";
import Link from "next/link";

export default function ExperienceDetail() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/experiences/${id}`)
      .then((res) => {
        const body = res.data;
        if (body.experience) {
          setExperience(body.experience);
          setSlots(body.slots || []);
        } else {
          const exp = body;
          setExperience(exp);
          setSlots((exp.slots as Slot[]) || []);
        }
      })
      .catch(() => setError("Failed to load experience"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 animate-pulse bg-gray-50">
        Loading experience...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-medium bg-gray-50">
        {error}
      </div>
    );

  if (!experience)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 bg-gray-50">
        Experience not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left: Image */}
        <div className="relative">
          {experience.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={experience.images[0]}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              No Image Available
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {experience.title}
            </h1>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {experience.description}
            </p>

            <div className="mt-4 text-lg font-semibold text-gray-800">
              Base Price: ₹{experience.price.toFixed(0)}
            </div>

            {/* Slots Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800">
                Available Slots
              </h3>

              {slots.length === 0 && (
                <div className="text-gray-500 text-sm mt-3">
                  No slots available at the moment.
                </div>
              )}

              <div className="mt-4 space-y-3">
                {slots.map((s) => {
                  const isSoldOut = s.booked >= s.capacity;
                  const date = new Date(s.date).toLocaleString();

                  return (
                    <div
                      key={s._id}
                      className={`p-4 border rounded-xl flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition ${
                        isSoldOut ? "opacity-60" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-800">{date}</div>
                        <div className="text-sm text-gray-600">
                          Capacity: {s.capacity} · Booked: {s.booked}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-700">
                          Extra: ₹{(s.priceDelta ?? 0).toFixed(0)}
                        </div>
                        <button
                          disabled={isSoldOut}
                          onClick={() => setSelectedSlot(s._id)}
                          className={`px-4 py-1.5 rounded-lg font-medium transition ${
                            isSoldOut
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : selectedSlot === s._id
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isSoldOut
                            ? "Sold Out"
                            : selectedSlot === s._id
                            ? "Selected"
                            : "Select"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          {selectedSlot && (
            <div className="mt-8 text-center border-t pt-6">
              <Link
                href={{
                  pathname: "/checkout",
                  query: { slotId: selectedSlot, expId: experience._id },
                }}
                className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
