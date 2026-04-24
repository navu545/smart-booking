import { useEffect, useState } from "react";
import type { Slot } from "../types";

export const useSlots = (workerId: number) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workerId) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3001/workers/slots?workerId=${workerId}`,
        );

        const data = await res.json();

        console.log("Fetched slots:", data); // 🔍 debug

        setSlots(data.data || []);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [workerId]); // 🔥 THIS IS THE KEY FIX

  return { slots, setSlots, loading };
};
