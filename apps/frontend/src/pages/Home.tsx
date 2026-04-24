import { useEffect, useState } from "react";
import WorkerList from "../components/WorkerList";
import SlotGrid from "../components/SlotGrid";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
};

const Home = () => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/users");
        const data = await res.json();

        if (!cancelled && data?.data?.length > 0) {
          setUsers(data.data);

          // default user
          setUserId(data.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Reset system
  const handleReset = async () => {
    try {
      setResetting(true);

      const res = await fetch("http://localhost:3001/admin/reset", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Reset failed");
      }

      // Reset UI state
      setSelectedWorkerId(null);

      // Re-fetch users after reseed
      const userRes = await fetch("http://localhost:3001/users");
      const userData = await userRes.json();

      if (userData?.data?.length > 0) {
        setUsers(userData.data);
        setUserId(userData.data[0].id);
      }

      toast.success("System reset successfully 🔄");
    } catch (err) {
      console.error(err);
      toast.error("Reset failed ❌");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200 p-6">
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6">
        {/* Header + Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
            Smart Booking System
          </h1>

          <div className="flex items-center gap-4">
            {/*  User Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">User:</span>
              <select
                value={userId ?? ""}
                onChange={(e) => setUserId(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={resetting}
              className={`px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                resetting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg active:scale-95"
              }`}
            >
              {resetting ? "Resetting..." : "Reset"}
            </button>
          </div>
        </div>

        {/* Workers */}
        <WorkerList
          selectedWorkerId={selectedWorkerId}
          onSelect={setSelectedWorkerId}
        />

        {/* Slots */}
        {selectedWorkerId && userId && (
          <SlotGrid
            key={`${selectedWorkerId}-${userId}`} // 🔥 ensures fresh state per user
            workerId={selectedWorkerId}
            userId={userId}
          />
        )}

        {/* UX hint */}
        {selectedWorkerId && !userId && (
          <div className="mt-6 text-gray-500">Loading user...</div>
        )}
      </div>
    </div>
  );
};

export default Home;
