import { useState } from "react";
import type { Slot } from "../types";
import { createBooking } from "../api/bookings";
import toast from "react-hot-toast";

type Props = {
  slot: Slot;
  setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
  userId: number;
};

const SlotItem = ({ slot, setSlots, userId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    //  Guard conditions
    if (slot.isBooked || loading) return;

    if (!userId) {
      toast.error("User not loaded yet");
      return;
    }

    setLoading(true);

    setSlots((prev) =>
      prev.map((s) =>
        s.id === slot.id
          ? {
              ...s,
              isBooked: true,
              booking: { userId },
            }
          : s,
      ),
    );

    try {
      await createBooking({
        userId, //  dynamic user
        slotId: slot.id,
      });

      toast.success("Slot booked successfully 🎉");
    } catch (err) {
      console.error("Booking failed:", err);

      //  Rollback
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id ? { ...s, isBooked: false, booking: null } : s,
        ),
      );

      toast.error("Slot already booked ❌");
    } finally {
      setLoading(false);
    }
  };

  const time = new Date(slot.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={handleBooking}
      disabled={slot.isBooked || loading}
      className={`p-4 rounded-2xl border text-center transition-all duration-200 shadow-sm
        ${
            slot.isBooked
              ? slot.booking?.userId === userId
                ? "bg-blue-100 text-blue-600 border-blue-200"
                : "bg-gray-100 text-gray-400 border-gray-200"
                : "bg-white hover:shadow-md hover:-translate-y-0.5 active:scale-95 border-gray-200"
           }
        `}
    >
      <div className="text-lg font-semibold">{time}</div>

      <div className="text-sm mt-1">
        {loading
          ? "Booking..."
          : slot.isBooked
            ? slot.booking?.userId === userId
              ? "Booked by you"
              : "Booked"
            : "Available"}
      </div>
    </button>
  );
};

export default SlotItem;
