import { API_BASE } from "./client";

export const createBooking = async (data: {
  userId: number;
  slotId: number;
}) => {
  const res = await fetch(`${API_BASE}/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Booking failed");
  }

  return res.json();
};
