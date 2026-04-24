export type User = {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "WORKER";
};

export type Worker = {
  id: number;
  userId: number;
  rating: number;
  user: User;
  availableSlots: number;
  distance: number; 
};

export type Slot = {
  id: number;
  workerId: number;
  date: string;
  isBooked: boolean;
  booking?: {
    userId: number;
  } | null;
};
