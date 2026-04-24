import { useEffect, useState } from "react";
import { getWorkers } from "../api/workers";
import type { Worker } from "../types";

export const useWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkers()
      .then(setWorkers)
      .finally(() => setLoading(false));
  }, []);

  return { workers, loading };
};
