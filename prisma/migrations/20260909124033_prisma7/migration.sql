-- CreateTable
CREATE TABLE "Establishment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "website" TEXT,
    "location" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_email_key" ON "Establishment"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_cpf_key" ON "Owner"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
