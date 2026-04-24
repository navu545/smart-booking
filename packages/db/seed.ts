import { prisma } from "./index.js";

export const seedDatabase = async () => {
  console.log("🌱 SEED STARTED");

  // 👤 Customers (🔥 MULTIPLE USERS)
  const user1 = await prisma.user.create({
    data: {
      name: "John",
      email: "john@example.com",
      role: "CUSTOMER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      role: "CUSTOMER",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      role: "CUSTOMER",
    },
  });

  // 👷 Worker 1
  const workerUser1 = await prisma.user.create({
    data: {
      name: "Worker 1",
      email: "worker1@example.com",
      role: "WORKER",
    },
  });

  const worker1 = await prisma.worker.create({
    data: {
      userId: workerUser1.id,
      rating: 4.5,
      lat: 30.7333,
      lng: 76.7794,
    },
  });

  // 👷 Worker 2
  const workerUser2 = await prisma.user.create({
    data: {
      name: "Worker 2",
      email: "worker2@example.com",
      role: "WORKER",
    },
  });

  const worker2 = await prisma.worker.create({
    data: {
      userId: workerUser2.id,
      rating: 4.2,
      lat: 30.7355,
      lng: 76.785,
    },
  });

  // 👷 Worker 3
  const workerUser3 = await prisma.user.create({
    data: {
      name: "Worker 3",
      email: "worker3@example.com",
      role: "WORKER",
    },
  });

  const worker3 = await prisma.worker.create({
    data: {
      userId: workerUser3.id,
      rating: 4.8,
      lat: 30.74,
      lng: 76.79,
    },
  });

  // ⏱️ Slots

  // Worker 1
  for (let i = 0; i < 4; i++) {
    await prisma.slot.create({
      data: {
        workerId: worker1.id,
        date: new Date(Date.now() + i * 3600000),
      },
    });
  }

  // Worker 2
  for (let i = 0; i < 3; i++) {
    await prisma.slot.create({
      data: {
        workerId: worker2.id,
        date: new Date(Date.now() + i * 7200000),
      },
    });
  }

  // Worker 3
  for (let i = 0; i < 5; i++) {
    await prisma.slot.create({
      data: {
        workerId: worker3.id,
        date: new Date(Date.now() + i * 5400000),
      },
    });
  }

  console.log("🌱 SEED FINISHED");
};
