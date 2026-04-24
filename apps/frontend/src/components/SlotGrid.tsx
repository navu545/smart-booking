import { useEffect } from "react";
import { useSlots } from "../hooks/useSlots";
import SlotItem from "./SlotItem";
import { useWebSocket } from "../hooks/useWebSocket";

type Props = {
  workerId: number;
  userId: number;
};

const SlotGrid = ({ workerId, userId }: Props) => {
  const { slots, setSlots, loading } = useSlots(workerId);
  const wsRef = useWebSocket(workerId);

  //  Real-time updates
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "SLOT_BOOKED" && msg.data.workerId === workerId) {
        const { slotId } = msg.data;

        setSlots((prev) =>
          prev.map((slot) =>
            slot.id === slotId ? { ...slot, isBooked: true } : slot,
          ),
        );
      }

      if (msg.type === "SYSTEM_RESET") {
        //  refetch slots
        window.location.reload(); // simplest + reliable
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [wsRef, workerId, setSlots]);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="text-gray-500">Loading slots...</div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="mt-8 text-gray-500">
        No slots available for this worker.
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4">Available Slots</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {slots.map((slot) => (
          <SlotItem
            key={slot.id}
            slot={slot}
            setSlots={setSlots}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

export default SlotGrid;
