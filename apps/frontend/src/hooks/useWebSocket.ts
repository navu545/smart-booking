import { useEffect, useRef } from "react";

export const useWebSocket = (workerId: number) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3002";

    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          workerId,
        }),
      );
    };

    return () => {
      socket.close();
    };
  }, [workerId]);

  return wsRef;
};
