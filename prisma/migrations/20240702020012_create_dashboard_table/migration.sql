-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "achievedSales" INTEGER NOT NULL DEFAULT 3000,
    "achievedSalesToday" INTEGER NOT NULL DEFAULT 100,
    "achievedCustomers" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);
