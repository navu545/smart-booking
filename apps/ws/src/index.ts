import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT) || 3002;

const wss = new WebSocketServer({ port: PORT });

// Map: client → workerId they are subscribed to
const clients = new Map<WebSocket, number>();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    try {
      const parsed = JSON.parse(msg.toString());
      console.log("WS received:", parsed);

      // 🔹 Handle subscription
      if (parsed.type === "SUBSCRIBE") {
        clients.set(ws, parsed.workerId);
        console.log(`Client subscribed to worker ${parsed.workerId}`);
        return;
      }

      // 🔹 Handle booking event → send ONLY to relevant clients
      if (parsed.type === "SLOT_BOOKED") {
        for (const [client, workerId] of clients.entries()) {
          if (
            client.readyState === WebSocket.OPEN &&
            workerId === parsed.data.workerId
          ) {
            client.send(JSON.stringify(parsed));
          }
        }
        return;
      }

      // 🔥 NEW: Handle system reset → broadcast to ALL clients
      if (parsed.type === "SYSTEM_RESET") {
        console.log("Broadcasting SYSTEM_RESET to all clients");

        for (const client of clients.keys()) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsed));
          }
        }
        return;
      }
    } catch (err) {
      console.error("Invalid WS message:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on port 3002");
