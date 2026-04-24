import WebSocket from "ws";

let ws: WebSocket | null = null;

const WS_URL = process.env.WS_URL || "ws://localhost:3002";

export const connectWS = () => {
  ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("Connected to WS server");
  });

  ws.on("error", (err) => {
    console.error("WS error:", err.message);
  });
};

export const sendWSMessage = (data: any) => {
  console.log("Sending WS message:", data);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};
