import { useState } from "react";
import { useWorkers } from "../hooks/useWorkers";

type Props = {
  onSelect: (workerId: number) => void;
  selectedWorkerId: number | null;
};

const WorkerList = ({ onSelect, selectedWorkerId }: Props) => {
  const { workers, loading } = useWorkers();

  const [sortBy, setSortBy] = useState<
    "smart" | "rating" | "availability" | "distance"
  >("smart");

  if (loading) {
    return <div className="mt-4">Loading workers...</div>;
  }

  //  Sorting logic
  const sortedWorkers = [...workers].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    if (sortBy === "availability") {
      return b.availableSlots - a.availableSlots;
    }

    if (sortBy === "distance") {
      return a.distance - b.distance;
    }

    //  SMART MATCH (combined score)
    const scoreA = a.rating * 2 + a.availableSlots * 1.5 - a.distance * 0.5;

    const scoreB = b.rating * 2 + b.availableSlots * 1.5 - b.distance * 0.5;

    return scoreB - scoreA;
  });

  return (
    <div>
      {/* Header + Filter */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Select a Worker</h2>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as
                | "smart"
                | "rating"
                | "availability"
                | "distance",
            )
          }
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="smart">Smart Match</option>
          <option value="rating">Best Rated</option>
          <option value="availability">Most Available</option>
          <option value="distance">Nearest</option>
        </select>
      </div>

      {/* Worker Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sortedWorkers.map((worker, index) => {
          const isSelected = selectedWorkerId === worker.id;

          return (
            <button
              key={worker.id}
              onClick={() => onSelect(worker.id)}
              className={`p-5 rounded-2xl border transition-all duration-300 text-left backdrop-blur-sm
                ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500 shadow-xl scale-[1.02]"
                    : "bg-white/80 border-gray-200 hover:shadow-lg hover:-translate-y-1"
                }
              `}
            >
              {/* Name */}
              <div className="font-semibold text-lg">{worker.user.name}</div>

              {/* Rating */}
              <div
                className={`text-sm mt-1 ${
                  isSelected ? "text-blue-100" : "text-gray-500"
                }`}
              >
                ⭐ {worker.rating}
              </div>

              {/* Availability + Distance */}
              <div
                className={`text-xs mt-1 ${
                  isSelected ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {worker.availableSlots} slots • {worker.distance.toFixed(1)} km
                away
              </div>

              {/*  Optional: Best match badge */}
              {sortBy === "smart" && index === 0 && (
                <div className="text-xs mt-2 font-medium text-green-300">
                  🔥 Best Match
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkerList;
