import { API_BASE } from "./client";
import type { Slot } from "../types";

export const getSlots = async (workerId: number): Promise<Slot[]> => {
  const res = await fetch(`${API_BASE}/workers/slots?workerId=${workerId}`);
  const data = await res.json();
  return data.data;
};
