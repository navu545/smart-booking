import { useEffect, useRef } from "react";

export const useWebSocket = (workerId: number) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3002");
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
