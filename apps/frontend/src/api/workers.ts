import { API_BASE } from "./client";
import type { Worker } from "../types";

export const getWorkers = async (): Promise<Worker[]> => {
  const res = await fetch(`${API_BASE}/workers`);
  const data = await res.json();
  return data.data; // important
};
